import { useRef, useState } from "react";
import { Upload, FileText, Trash2 } from "lucide-react";
import { ACCEPTED_TYPES, MAX_SIZE_MB } from "../lib/constants.js";

export default function FileDrop({ files, setFiles, pushToast }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFiles = (list) => {
    const accepted = [];
    for (const f of Array.from(list)) {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        pushToast({ type: "error", title: `${f.name} rejected`, body: "Only PDF, PNG or JPEG files are accepted." });
        continue;
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        pushToast({ type: "error", title: `${f.name} too large`, body: `Max file size is ${MAX_SIZE_MB}MB.` });
        continue;
      }
      const isImage = f.type.startsWith("image/");
      accepted.push({
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(1) + "MB",
        url: isImage ? URL.createObjectURL(f) : undefined,
      });
    }
    if (accepted.length) {
      setFiles((prev) => [...prev, ...accepted]);
      pushToast({ type: "success", title: `${accepted.length} file(s) validated`, body: "Format and size checks passed." });
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current.click()}
        className={`rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition ${
          dragOver ? "border-bearing-600 bg-bearing-100" : "border-ink-900/15 bg-navy-50/50 hover:border-bearing-400"
        }`}
      >
        <input ref={inputRef} type="file" multiple className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFiles(e.target.files)} />
        <div className="w-12 h-12 rounded-xl bg-white shadow-card flex items-center justify-center mx-auto text-bearing-600"><Upload className="w-5 h-5" /></div>
        <p className="font-semibold text-navy-900 text-sm mt-3">Drag &amp; drop files here, or click to browse</p>
        <p className="text-xs text-ink-500 mt-1">PDF, PNG, JPEG · Max {MAX_SIZE_MB}MB per file</p>
      </div>
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-ink-900/8">
              {f.url ? (
                <img src={f.url} alt="" className="w-8 h-8 rounded-md object-cover shrink-0" />
              ) : (
                <FileText className="w-4 h-4 text-bearing-600 shrink-0" />
              )}
              <p className="text-sm text-navy-900 flex-1 truncate">{f.name}</p>
              <span className="text-xs text-ink-500">{f.size}</span>
              <button onClick={(e) => { e.stopPropagation(); setFiles(files.filter((_, j) => j !== i)); }} className="text-ink-300 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
