
const FilterBar = ({ children, className = '' }) => (
  <div className={`flex flex-col gap-2.5 md:flex-row md:flex-wrap md:items-center ${className}`}>{children}</div>
);

export default FilterBar;
