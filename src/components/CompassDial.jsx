export default function CompassDial({ className = "", style }) {
  return (
    <svg viewBox="0 0 400 400" className={className} style={style} fill="none">
      <circle cx="200" cy="200" r="188" stroke="currentColor" strokeWidth="1" />
      <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" />
      {Array.from({ length: 72 }).map((_, i) => {
        const a = (i * 5 * Math.PI) / 180;
        const big = i % 6 === 0;
        const r1 = 188, r2 = big ? 172 : 180;
        const x1 = 200 + r1 * Math.sin(a), y1 = 200 - r1 * Math.cos(a);
        const x2 = 200 + r2 * Math.sin(a), y2 = 200 - r2 * Math.cos(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={big ? 1.4 : 0.7} />;
      })}
      <path d="M200 90 L228 200 L200 310 L172 200 Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}
