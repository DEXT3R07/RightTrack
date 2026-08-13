export function DonutChart({ data, size = 160 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = size / 2 - 18, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} className="-rotate-90 shrink-0">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#eef0f6" strokeWidth="20" fill="none" />
        {data.map((d, i) => {
          const frac = d.value / total;
          const dash = frac * c;
          const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} stroke={d.color} strokeWidth="20" fill="none" strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-offset} strokeLinecap="butt" />;
          offset += dash;
          return el;
        })}
        <circle cx={size / 2} cy={size / 2} r={r - 24} fill="white" />
      </svg>
      <div className="space-y-2.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2.5 text-sm">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }}></span>
            <span className="text-ink-700">{d.label}</span>
            <span className="font-semibold text-navy-900 num">{d.value}</span>
            <span className="text-ink-300 text-xs">({total ? Math.round((d.value / total) * 100) : 0}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SparkTrend({ points, width = 480, height = 140 }) {
  const max = Math.max(...points.map((p) => Math.max(p.onTime, p.atRisk, p.breached))) * 1.2;
  const stepX = width / (points.length - 1);
  const line = (key, color) => {
    const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${height - (p[key] / max) * height}`).join(" ");
    return <path d={d} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
  };
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
      {[0, 0.25, 0.5, 0.75, 1].map((f) => <line key={f} x1="0" x2={width} y1={height * f} y2={height * f} stroke="#eef0f6" strokeWidth="1" />)}
      {line("onTime", "#16a34a")}
      {line("atRisk", "#d97706")}
      {line("breached", "#dc2626")}
    </svg>
  );
}
