/**
 * Utility Meta Pixel client 100% Anonyme & Conforme RGPD pour VitaSang.
 * URL du site : https://vitasangpetition.vercel.app
 */

export const initMetaPixel = (pixelId) => {
  if (!pixelId || window.fbq) return;

  /* eslint-disable */
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
};

/**
 * Envoie un événement Meta Pixel 100% anonyme
 * 
 * Événements supportés :
 * - 'ViewContent' : En savoir plus / Consultation de la pétition
 * - 'Lead' : Signature de la pétition
 * - 'CompleteRegistration' : Modification / Inscription communauté
 * - 'Share' : Partage du lien
 */
export const trackMetaPixelEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    // Ne transmettre AUCUNE PII (Pas de nom, tel, mail)
    const paramsAnonymes = {
      content_name: params.content_name || 'Petition VitaSang',
      content_category: 'Mobilisation Citoyenne',
      ...(params.page && { page: params.page })
    };
    window.fbq('track', eventName, paramsAnonymes);
    console.log(`[META PIXEL 📊] Événement anonyme '${eventName}' envoyé.`);
  }
};
