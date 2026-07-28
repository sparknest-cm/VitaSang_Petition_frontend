import './DonorAvatars.css';

export default function DonorAvatars({ totalSignatures }) {
  // Formater le nombre de signatures (ex: 4218 -> +4.2k)
  const formatSignatures = (num) => {
    if (num >= 1000) {
      return `+${(num / 1000).toFixed(1)}k`;
    }
    return `+${num}`;
  };

  return (
    <div className="donor-avatars-container">
      <div className="avatar-bubble" style={{ backgroundColor: '#F8923C', color: '#FFFFFF' }}>IM</div>
      <div className="avatar-bubble" style={{ backgroundColor: '#8A5CF6', color: '#FFFFFF' }}>AN</div>
      <div className="avatar-bubble" title={`${totalSignatures} signatures totales`}>
        {formatSignatures(totalSignatures)}
      </div>
    </div>
  );
}
