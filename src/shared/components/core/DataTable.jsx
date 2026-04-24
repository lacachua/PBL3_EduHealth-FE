import React from 'react';

const DataTable = ({
  columns,
  rows,
  getRowKey,
  dense = false,
  headCellPaddingClassName,
  bodyCellPaddingClassName,
  containerClassName,
  tableClassName,
  headClassName,
  bodyClassName,
  rowClassName,
  onRowClick,
}) => {
  const headCellPaddingClass = headCellPaddingClassName || (dense ? 'px-4 py-3' : 'px-4 py-3');
  const bodyCellPaddingClass = bodyCellPaddingClassName || (dense ? 'px-4 py-3' : 'px-4 py-3.5');

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
    <div className={containerClassName || 'overflow-x-auto rounded-2xl border border-outline-variant bg-surface [scrollbar-width:thin]'}>
      <table className={tableClassName || 'min-w-full text-left text-sm'}>
        <thead className={headClassName || 'app-table-head text-[11px] uppercase tracking-[0.08em]'}>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`${headCellPaddingClass} ${column.headerClassName || ''}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={bodyClassName || 'divide-y divide-outline-variant'}>
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
              className={`${rowClassName || 'group app-interactive cursor-pointer hover:bg-surface-container-low'} ${onRowClick ? 'cursor-pointer' : ''}`}
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
