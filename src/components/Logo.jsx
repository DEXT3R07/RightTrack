export default function Logo({ variant = "dark", size = "md", mark = false }) {
  const h = size === "sm" ? "h-5" : size === "lg" ? "h-8" : "h-6";
  const src = mark
    ? variant === "light" ? "/icon-white.png" : "/icon-navy.png"
    : variant === "light" ? "/logo-white.png" : "/logo-navy.png";
  return <img src={src} alt="RightTrack" className={`${h} w-auto select-none`} draggable={false} />;
}
