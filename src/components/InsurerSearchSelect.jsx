import { useEffect, useRef, useState } from "react";
import { Building2, ChevronDown } from "lucide-react";

export default function InsurerSearchSelect({ options, value, onChange, placeholder = "Search for your insurer…" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const containerRef = useRef(null);

  useEffect(() => { setQuery(value || ""); }, [value]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (org) => {
    onChange(org);
    setQuery(org);
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none" />
      <input
        className="input pl-9 pr-9"
        value={query}
        onChange={(e) => { setQuery(e.target.value); onChange(""); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
      />
      <ChevronDown className={`w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none transition-transform ${open ? "rotate-180" : ""}`} />

      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border border-ink-900/12 bg-white shadow-pop">
          {filtered.length === 0 && (
            <p className="px-3 py-2.5 text-sm text-ink-400">
              {options.length === 0 ? "No insurers are registered yet." : "No match — check the spelling."}
            </p>
          )}
          {filtered.map((org) => (
            <button
              key={org}
              type="button"
              onClick={() => handleSelect(org)}
              className={`w-full text-left px-3 py-2.5 text-sm hover:bg-navy-50/60 ${org === value ? "bg-bearing-100/60 text-navy-900 font-semibold" : "text-ink-700"}`}
            >
              {org}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}