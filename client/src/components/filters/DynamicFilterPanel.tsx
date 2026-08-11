import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { fetchFilterSchemaHandler } from '../../store/slices/filterSchemasSlice';
import { AdAttributes, FilterFieldSchema } from '../../types';
import FilterField from './FilterField';

interface DynamicFilterPanelProps {
  categorySlug: string;
  values: AdAttributes;
  onChange: (key: string, value: string | string[]) => void;
  onClear: () => void;
}

export default function DynamicFilterPanel({
  categorySlug,
  values,
  onChange,
  onClear,
}: DynamicFilterPanelProps) {
  const dispatch = useDispatch<AppDispatch>();
  const schema = useSelector((s: RootState) => s.filterSchemas.schemas[categorySlug]);
  const loading = useSelector((s: RootState) => s.filterSchemas.loading[categorySlug]);

  useEffect(() => {
    if (categorySlug && !schema) {
      dispatch(fetchFilterSchemaHandler(categorySlug));
    }
  }, [categorySlug, schema, dispatch]);

  if (!categorySlug) return null;

  if (loading) {
    return (
      <div className="bg-white border border-olx-border rounded p-4 space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="flex gap-1.5">
              {[1, 2, 3].map((j) => <div key={j} className="h-6 bg-gray-200 rounded-full w-14" />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!schema) return null;

  const sortedFilters: FilterFieldSchema[] = [...schema.filters].sort(
    (a, b) => a.priority - b.priority,
  );

  const activeCount = Object.values(values).filter(
    (v) => v && (Array.isArray(v) ? v.length > 0 : v !== ''),
  ).length;

  return (
    <div className="bg-white border border-olx-border rounded p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-olx-text text-sm">{schema.categoryName}</h3>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-red-500 hover:underline"
          >
            <X size={10} /> Clear ({activeCount})
          </button>
        )}
      </div>

      {sortedFilters.map((field) => {
        // Resolve parent value for dependent dropdowns
        const parentValue = field.dependsOn
          ? (values[field.dependsOn] as string) ?? undefined
          : undefined;

        return (
          <FilterField
            key={field.key}
            field={field}
            value={values[field.key] ?? ''}
            onChange={onChange}
            parentValue={parentValue}
          />
        );
      })}
    </div>
  );
}
