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
  const headCellPaddingClass = dense ? 'px-3 py-2' : 'px-4 py-2.5';
  const bodyCellPaddingClass = dense ? 'px-3 py-2.5' : 'px-4 py-3.5';

  const shouldIgnoreRowClick = (event) => {
    if (event.defaultPrevented) {
      return true;
    }

    const interactiveTarget = event.target.closest(
      'a,button,input,select,textarea,[role="button"],[role="menuitem"],[data-row-click-stop="true"]'
    );

    if (!interactiveTarget) {
      return false;
    }

    return interactiveTarget !== event.currentTarget;
  };

  return (
    <div className={containerClassName || 'overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]'}>
      <table className={tableClassName || 'min-w-full divide-y divide-outline-variant text-sm'}>
        <thead className={headClassName || 'bg-[var(--table-header-bg)] text-left text-on-surface-variant'}>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`${headCellPaddingClass} text-xs font-semibold uppercase tracking-[0.02em] ${column.headerClassName || ''}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={bodyClassName || 'divide-y divide-outline-variant bg-surface'}>
          {rows.map((row, index) => (
            <tr
              key={getRowKey ? getRowKey(row) : row.id || index}
              onClick={onRowClick ? (event) => {
                if (shouldIgnoreRowClick(event)) {
                  return;
                }

                onRowClick(row, index);
              } : undefined}
              onKeyDown={onRowClick ? (event) => {
                if (event.target !== event.currentTarget) {
                  return;
                }

                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onRowClick(row, index);
                }
              } : undefined}
              role={onRowClick ? 'button' : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              className={`${rowClassName || 'transition-colors duration-150 hover:bg-[var(--table-row-hover-bg)] focus-within:bg-[var(--table-row-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20'} ${onRowClick ? 'cursor-pointer' : ''}`}
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
