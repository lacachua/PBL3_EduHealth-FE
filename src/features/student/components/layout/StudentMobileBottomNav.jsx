import React from 'react';
import { NavLink } from 'react-router-dom';
import { studentNavigationItems } from '../../config/studentNavigation';

const StudentMobileBottomNav = () => {
  return (
    <nav className="student-mobile-nav-shadow fixed bottom-0 left-0 right-0 z-30 border-t border-outline-variant bg-surface/90 px-5 py-2 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between gap-1">
        {studentNavigationItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            end={item.to === '/student/overview'}
            className={({ isActive }) =>
              `student-focus-ring student-interactive flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1.5 py-1.5 text-[10px] font-semibold ${
                isActive ? 'bg-primary-soft text-primary' : 'text-on-surface-variant'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default StudentMobileBottomNav;
