import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading,
  emptyMessage = 'No records found',
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="table-container card" style={{ padding: 0 }}>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton" style={{ height: 32, width: '100%' }} />
          <div className="skeleton" style={{ height: 48, width: '100%' }} />
          <div className="skeleton" style={{ height: 48, width: '100%' }} />
          <div className="skeleton" style={{ height: 48, width: '100%' }} />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="table-container card" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="table-container card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ textAlign: col.align || 'left' }}
                className={col.className}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick && onRowClick(item)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{ textAlign: col.align || 'left' }}
                  className={col.className}
                >
                  {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
