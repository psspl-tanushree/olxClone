import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchFilterSchemaHandler } from '../../store/slices/filterSchemasSlice';
import { AdAttributes, FilterFieldSchema } from '../../types';
import FilterField from '../filters/FilterField';

interface DynamicAdFormProps {
  categorySlug: string;
  values: AdAttributes;
  onChange: (key: string, value: string | string[]) => void;
}

export default function DynamicAdForm({ categorySlug, values, onChange }: DynamicAdFormProps) {
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
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/4" />
            <div className="h-9 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!schema || schema.filters.length === 0) return null;

  const fields: FilterFieldSchema[] = [...schema.filters].sort(
    (a, b) => a.priority - b.priority,
  );

  return (
    <div className="space-y-4">
      <p className="text-xs text-olx-muted font-medium uppercase tracking-wider">
        {schema.categoryName} Details
      </p>
      {fields.map((field) => {
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
