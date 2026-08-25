export function CastleHeroBanner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <rect width="320" height="200" fill="#1d4d77"/>
      <defs><linearGradient id="sky-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2f6ea0"/><stop offset="100%" stopColor="#13314f"/></linearGradient></defs>
      <rect width="320" height="200" fill="url(#sky-gradient)"/>
      <g fill="#ffffff" opacity="0.85">
        <rect x="20" y="30" width="36" height="10"/><rect x="14" y="36" width="48" height="8"/>
        <rect x="230" y="20" width="40" height="10"/><rect x="222" y="26" width="56" height="8"/>
      </g>
      <g fill="#3c6f8f">
        <polygon points="0,140 50,90 100,140"/><polygon points="80,140 150,80 220,140"/><polygon points="190,140 250,100 320,140"/>
      </g>
      <g fill="#e8f3fa">
        <polygon points="50,90 60,105 40,105"/><polygon points="150,80 162,98 138,98"/><polygon points="250,100 260,113 240,113"/>
      </g>
      <g fill="#1f5c3f">
        {[10,40,70,250,280,300].map((x,i)=>(
          <g key={i}><rect x={x} y={150-(i%2)*6} width="14" height="14"/><rect x={x+5} y={164-(i%2)*6} width="4" height="8" fill="#5a3c22"/></g>
        ))}
      </g>
      <g fill="#9aa7b5">
        <rect x="120" y="110" width="80" height="60"/><rect x="110" y="130" width="14" height="40"/>
        <rect x="196" y="130" width="14" height="40"/><rect x="150" y="90" width="20" height="80"/>
        <polygon points="110,130 124,110 117,130" fill="#b5432f"/><polygon points="196,130 203,110 210,130" fill="#b5432f"/>
        <polygon points="150,90 160,70 170,90" fill="#b5432f"/>
      </g>
      <rect x="159" y="62" width="2" height="10" fill="#3a2c14"/>
      <polygon points="161,63 175,67 161,71" fill="#e8b84b"/>
      <path d="M0,170 C60,150 100,180 160,165 C220,150 270,180 320,165 L320,200 L0,200 Z" fill="#1f5c3f"/>
    </svg>
  );
}
