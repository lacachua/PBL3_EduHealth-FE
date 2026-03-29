import React from 'react';

const DataTable = ({ columns, rows, getRowKey }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant">
      <table className="min-w-full divide-y divide-outline-variant text-sm">
        <thead className="bg-surface-container-low text-left text-on-surface-variant">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`px-4 py-3 text-xs font-semibold uppercase tracking-[0.02em] ${column.headerClassName || ''}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
          {rows.map((row, index) => (
            <tr key={getRowKey ? getRowKey(row) : row.id || index} className="transition hover:bg-surface-container-low">
              {columns.map((column) => (
                <td key={column.key} className={`px-4 py-3 ${column.cellClassName || ''}`}>
                  {column.render ? column.render(row, index) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
