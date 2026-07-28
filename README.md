# VITA SANG — Phase 1 : Pétition citoyenne

## 1. Définition du problème

Au Cameroun, l'accès rapide à des poches de sang compatibles reste un vrai
problème de santé publique : les hôpitaux et les familles se retrouvent
souvent à chercher un donneur dans l'urgence, sans réseau organisé pour les     
mettre en relation.

**VITA SANG** vise à terme à devenir cette plateforme de mise en relation
entre donneurs et receveurs. Mais lancer directement cet outil serait risqué :
sans communauté existante, la plateforme serait vide au premier jour.

**La Phase 1 ne résout donc pas encore ce problème directement.** Son objectif
est plus modeste et plus stratégique : mesurer et construire l'adhésion
citoyenne à la cause, à travers une pétition en ligne, avant d'investir dans
la plateforme complète. Chaque signature devient une preuve d'intérêt, un
contact qualifié (groupe sanguin, disponibilité) et, potentiellement, un
ambassadeur qui recrute d'autres signataires autour de lui.

Deux problèmes techniques concrets découlent de cet objectif, et sont le
sujet de ce document :

1. **Comment savoir qui a fait signer qui ?** (le parrainage)
2. **Comment savoir par quel réseau social une signature est arrivée ?**
   (la source d'acquisition)

Ces deux informations sont ce qui transforme une simple pétition en un outil
de croissance mesurable.

---

## 2. Vue d'ensemble de l'architecture

```
Visiteur (TikTok / WhatsApp / Facebook / lien direct)
        │
        ▼
  Landing page (frontend)
        │  lit les paramètres d'URL (?ref=... &utm_source=...)
        ▼
  Formulaire de signature
        │  insertion en base
        ▼
  Base de données PostgreSQL (Supabase)
   ├─ table signataires
   ├─ table partages
   └─ vues de statistiques (dashboard admin)
        │
        ▼
  Page de confirmation → génère un lien personnel → nouveau cycle
```

Le frontend ne fait presque aucun calcul : toute la logique de cohérence
(unicité, génération de code, verrouillage du parrain) vit dans la base de
données, pour qu'elle reste vraie même si le frontend évolue ou si plusieurs
interfaces (site web, futur app mobile) y insèrent des données un jour.

---

## 3. Génération du lien de parrainage

### Pourquoi un lien plutôt qu'un simple compteur ?

On pourrait imaginer demander à chaque signataire "qui vous a invité ?" —
mais ça repose sur la mémoire du visiteur et génère des réponses fausses ou
manquantes. La bonne pratique est d'**encoder l'information dans l'URL
elle-même**, pour qu'elle voyage automatiquement avec le lien partagé, sans
action de la part du nouveau visiteur.

### Comment le code est généré

Chaque signataire reçoit, au moment de sa propre signature, un
`code_parrainage` unique généré côté base de données (format `VS-A3F9K`) :

- Généré automatiquement par un déclencheur SQL (`trigger`) à l'insertion,
  jamais côté client — un code généré côté frontend pourrait être manipulé ou
  entrer en collision sans qu'on le détecte.
- Le déclencheur vérifie que le code n'existe pas déjà avant de le valider ;
  s'il existe (collision aléatoire, très rare), il en régénère un autre.

### Comment le lien fonctionne dans le parcours

1. Après sa signature, le citoyen voit son lien personnel :
   `vitasang.org/petition?ref=VS-A3F9K`
2. Il le partage à son entourage (bouton WhatsApp, Facebook, copie du lien…).
3. Un nouveau visiteur clique dessus. Le frontend lit le paramètre `ref` dans
   l'URL et le conserve (variable de session ou champ caché du formulaire)
   pendant toute sa navigation.
4. Quand ce visiteur signe à son tour, le champ `parrain_id` de sa ligne est
   rempli avec l'identifiant du signataire correspondant à ce code.

### Pourquoi c'est fiable

- Le lien de parrainage **ne dépend d'aucune donnée du navigateur** (pas de
  cookie tiers, pas de fingerprinting) : c'est un simple paramètre d'URL,
  donc ça fonctionne même dans les navigateurs intégrés de WhatsApp ou
  Instagram, réputés pour bloquer beaucoup de mécanismes de tracking
  classiques.
- Une fois enregistré, le `parrain_id` est **verrouillé** par un second
  déclencheur : impossible de le modifier après coup, ce qui garantit que
  l'historique de parrainage reste exact même si quelqu'un modifie sa fiche
  plus tard.
- Le nombre de "filleuls" d'un signataire est simplement :

  ```sql
  select count(*) from signataires where parrain_id = <id_du_signataire>;
  ```

  Pas de recalcul complexe, pas de table intermédiaire à maintenir.

---

## 4. Identification de la source d'acquisition

### Le piège à éviter : deviner la source après coup

La méthode naïve consisterait à lire l'en-tête HTTP `Referer` envoyé par le
navigateur pour savoir d'où vient le clic. **Cette méthode ne marche pas de
façon fiable ici** : l'application WhatsApp, en particulier, n'envoie
quasiment jamais ce referrer, et les navigateurs intégrés des réseaux sociaux
le masquent ou le déforment très souvent. En se basant dessus, une grande
partie du trafic WhatsApp — pourtant le canal principal attendu — serait
classée à tort comme "direct" ou "inconnu".

### La méthode retenue : taguer à la source, jamais deviner après

Au lieu de deviner, on **fixe la source au moment où le lien est généré**,
pas au moment où il est cliqué :

- Chaque bouton de partage sur la page de confirmation génère un lien
  différent selon la plateforme choisie :

  ```
  vitasang.org/petition?ref=VS-A3F9K&utm_source=whatsapp
  vitasang.org/petition?ref=VS-A3F9K&utm_source=facebook
  vitasang.org/petition?ref=VS-A3F9K&utm_source=x
  vitasang.org/petition?ref=VS-A3F9K&utm_source=linkedin
  vitasang.org/petition?ref=VS-A3F9K&utm_source=lien_copie
  ```

- Comme c'est notre propre code qui construit ce lien au clic du bouton (et
  non une déduction après coup), la source est **certaine**, pas estimée.
- Les tout premiers posts de lancement (avant même qu'un citoyen ne partage
  quoi que ce soit) suivent le même principe, via Google Tag Manager ou un
  simple générateur d'UTM : `utm_source=tiktok&utm_medium=social`.

### Ce que ça permet de distinguer

Le `parrain_id` (qui a recruté) et le `canal_acquisition` / `utm_source`
(par quel réseau) sont deux informations **indépendantes** stockées côte à
côte sur chaque signature :

| Signataire | parrain_id | canal_acquisition |
|---|---|---|
| Visiteur A | VS-A3F9K | whatsapp |
| Visiteur B | VS-A3F9K | facebook |

Ici, A et B viennent tous les deux du même parrain, mais via des canaux
différents — ce qui donne au dashboard une vraie granularité : on peut
répondre à la fois à "qui recrute le plus ?" et à "quel réseau convertit le
mieux ?".

---

## 5. Résumé des garanties d'intégrité côté base

| Règle | Mécanisme |
|---|---|
| Un code de parrainage unique et non manipulable | Génération + vérification par trigger SQL, jamais côté client |
| Impossible d'être son propre parrain | Contrainte `CHECK` |
| Le parrain ne change jamais après signature | Trigger de verrouillage sur `UPDATE` |
| Une seule signature par personne | Contrainte `UNIQUE` sur le téléphone |
| Cohérence groupe sanguin / connaissance du groupe | Contrainte `CHECK` croisée |
| Source toujours certaine, jamais devinée | UTM injectés au clic, pas de dépendance au `Referer` HTTP |
| Accès admin sécurisé | Authentification Supabase Auth (mots de passe jamais stockés dans nos tables).