import React from 'react';

const DataTable = ({
  columns,
  rows,
  getRowKey,
  dense = false,
  containerClassName,
  tableClassName,
  headClassName,
  bodyClassName,
  rowClassName,
  onRowClick,
}) => {
  const headCellPaddingClass = dense ? 'px-3 py-2' : 'px-4 py-3';
  const bodyCellPaddingClass = dense ? 'px-3 py-2' : 'px-4 py-3';

  return (
    <div className={containerClassName || 'overflow-x-auto rounded-xl border border-outline-variant'}>
      <table className={tableClassName || 'min-w-full divide-y divide-outline-variant text-sm'}>
        <thead className={headClassName || 'bg-surface-container-low text-left text-on-surface-variant'}>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`${headCellPaddingClass} text-xs font-semibold uppercase tracking-[0.02em] ${column.headerClassName || ''}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={bodyClassName || 'divide-y divide-outline-variant bg-surface-container-lowest'}>
          {rows.map((row, index) => (
            <tr
              key={getRowKey ? getRowKey(row) : row.id || index}
              onClick={onRowClick ? () => onRowClick(row, index) : undefined}
              onKeyDown={onRowClick ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onRowClick(row, index);
                }
              } : undefined}
              role={onRowClick ? 'button' : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              className={`${rowClassName || 'transition-colors duration-150 hover:bg-surface-container-low focus-within:bg-surface-container-low'} ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((column) => (
                <td key={column.key} className={`align-top ${bodyCellPaddingClass} ${column.cellClassName || ''}`}>
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
