"use client";

const inputCls = "w-full border border-[#D0CCC8] bg-white text-[#1A1A1A] text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#B8956A] focus:ring-2 focus:ring-[#B8956A]/20 transition-all placeholder-[#C0BBB5]";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  hint?: string;
}

export function TextField({ label, value, onChange, multiline = false, rows = 3, placeholder, hint }: TextFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#333] mb-1.5">{label}</label>
      {hint && <p className="text-xs text-[#888] mb-1.5">{hint}</p>}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={`${inputCls} resize-y`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputCls}
        />
      )}
    </div>
  );
}

interface StringListFieldProps {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  hint?: string;
}

export function StringListField({ label, values, onChange, placeholder, hint }: StringListFieldProps) {
  function update(i: number, v: string) {
    const next = [...values];
    next[i] = v;
    onChange(next);
  }
  function remove(i: number) {
    onChange(values.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...values, ""]);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[#333] mb-1.5">{label}</label>
      {hint && <p className="text-xs text-[#888] mb-1.5">{hint}</p>}
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={v}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-[#999] hover:text-red-500 px-2 text-sm transition-colors flex-shrink-0"
              title="削除"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="text-xs text-[#B8956A] hover:text-[#8A6540] font-medium transition-colors py-1 flex items-center gap-1"
        >
          ＋ 追加する
        </button>
      </div>
    </div>
  );
}
