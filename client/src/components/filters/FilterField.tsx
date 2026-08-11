import { FilterFieldSchema, FieldOption } from '../../types';

interface FilterFieldProps {
  field: FilterFieldSchema;
  value: string | string[];
  onChange: (key: string, value: string | string[]) => void;
  parentValue?: string; // for dependent dropdowns (e.g. brand → model)
}

function getOptions(field: FilterFieldSchema, parentValue?: string): FieldOption[] {
  if (field.dependsOn && field.dependentOptions) {
    if (!parentValue) return [];
    return field.dependentOptions[parentValue] ?? [];
  }
  return field.options ?? [];
}

export default function FilterField({ field, value, onChange, parentValue }: FilterFieldProps) {
  const scalar = Array.isArray(value) ? value[0] ?? '' : value ?? '';
  const multi = Array.isArray(value) ? value : value ? [value] : [];
  const options = getOptions(field, parentValue);

  const toggleMulti = (v: string) => {
    const next = multi.includes(v) ? multi.filter((x) => x !== v) : [...multi, v];
    onChange(field.key, next);
  };

  // ── Dropdown ──────────────────────────────────────────────────────────────
  if (field.type === 'dropdown') {
    const disabled = field.dependsOn && options.length === 0;
    return (
      <div>
        <label className="block text-xs font-semibold text-olx-text mb-1">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={scalar}
          disabled={!!disabled}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="w-full border border-olx-border rounded px-3 py-2 text-sm focus:outline-none focus:border-olx-teal disabled:opacity-50 disabled:cursor-not-allowed bg-white"
        >
          <option value="">
            {disabled ? `Select ${field.dependsOn} first` : (field.placeholder ?? `Select ${field.label}`)}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  }

  // ── Radio ─────────────────────────────────────────────────────────────────
  if (field.type === 'radio') {
    return (
      <div>
        <label className="block text-xs font-semibold text-olx-text mb-2">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(field.key, scalar === o.value ? '' : o.value)}
              className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                scalar === o.value
                  ? 'bg-olx-teal text-white border-olx-teal'
                  : 'border-olx-border text-olx-text hover:border-olx-teal hover:text-olx-teal'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Multi-Select ──────────────────────────────────────────────────────────
  if (field.type === 'multi-select') {
    return (
      <div>
        <label className="block text-xs font-semibold text-olx-text mb-2">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => toggleMulti(o.value)}
              className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                multi.includes(o.value)
                  ? 'bg-olx-teal text-white border-olx-teal'
                  : 'border-olx-border text-olx-text hover:border-olx-teal hover:text-olx-teal'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Range (min / max) ─────────────────────────────────────────────────────
  if (field.type === 'range') {
    // value encoded as "min,max"
    const [minStr, maxStr] = scalar.split(',');
    const handleChange = (side: 'min' | 'max', v: string) => {
      const next = side === 'min' ? `${v},${maxStr ?? ''}` : `${minStr ?? ''},${v}`;
      onChange(field.key, next.replace(/^,/, '').replace(/,$/, '') === '' ? '' : next);
    };
    return (
      <div>
        <label className="block text-xs font-semibold text-olx-text mb-2">
          {field.label}{field.unit ? ` (${field.unit})` : ''} {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minStr ?? ''}
            min={field.validation?.min}
            max={field.validation?.max}
            onChange={(e) => handleChange('min', e.target.value)}
            className="w-full border border-olx-border rounded px-3 py-1.5 text-sm focus:outline-none focus:border-olx-teal"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxStr ?? ''}
            min={field.validation?.min}
            max={field.validation?.max}
            onChange={(e) => handleChange('max', e.target.value)}
            className="w-full border border-olx-border rounded px-3 py-1.5 text-sm focus:outline-none focus:border-olx-teal"
          />
        </div>
      </div>
    );
  }

  // ── Text / Number ─────────────────────────────────────────────────────────
  return (
    <div>
      <label className="block text-xs font-semibold text-olx-text mb-1">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={field.type === 'number' ? 'number' : 'text'}
        value={scalar}
        placeholder={field.placeholder ?? field.label}
        onChange={(e) => onChange(field.key, e.target.value)}
        className="w-full border border-olx-border rounded px-3 py-2 text-sm focus:outline-none focus:border-olx-teal"
      />
    </div>
  );
}
