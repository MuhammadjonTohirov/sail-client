"use client";
import Dropdown from '@/components/ui/Dropdown';
import MultiDropdown from '@/components/ui/MultiDropdown';

export type Attr = {
  id: number;
  key: string;
  label: string;
  type: string;
  unit?: string;
  options?: string[];
  is_required?: boolean;
  min_number?: number;
  max_number?: number;
};

export default function AttributesForm({
  attrs,
  values,
  onChange,
  locale = 'ru',
}: {
  attrs: Attr[];
  values: Record<string, any>;
  onChange: (key: string, val: any) => void;
  locale?: 'ru' | 'uz';
}) {
  const req = (flag?: boolean) => (flag ? ' *' : '');
  const tYes = locale === 'uz' ? 'Ha' : 'Да';

  return (
    <div className="space-y-3">
      {attrs.map((a) => (
        <div key={a.id} className="field">
          <label>
            {a.label}{req(a.is_required)}{a.unit ? ` (${a.unit})` : ''}
          </label>
          {a.type === 'select' && (
            <Dropdown
              value={values[a.key] || ''}
              onChange={(v) => onChange(a.key, v)}
              options={[{ value: '', label: '--' }, ...(a.options || []).map(o => ({ value: String(o), label: String(o) }))]}
            />
          )}
          {a.type === 'multiselect' && (
            <MultiDropdown
              value={values[a.key] || []}
              onChange={(v) => onChange(a.key, v)}
              options={(a.options || []).map(o => ({ value: String(o), label: String(o) }))}
            />
          )}
          {(a.type === 'number' || a.type === 'range') && (
            <input
              type="number"
              value={values[a.key] ?? ''}
              min={a.min_number ?? undefined}
              max={a.max_number ?? undefined}
              onChange={(e) => onChange(a.key, e.target.value)}
              placeholder={[a.min_number, a.max_number].some(v => v !== undefined) ? `${a.min_number ?? ''}..${a.max_number ?? ''}` : (a.unit || undefined)}
            />
          )}
          {a.type === 'boolean' && (
            <label><input type="checkbox" checked={!!values[a.key]} onChange={(e) => onChange(a.key, e.target.checked)} /> {tYes}</label>
          )}
          {a.type === 'text' && (
            <input value={values[a.key] ?? ''} onChange={(e) => onChange(a.key, e.target.value)} />
          )}
        </div>
      ))}
    </div>
  );
}
