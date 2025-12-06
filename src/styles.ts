// Auto-inject CSS styles for react-tailwind-calendar
const styles = `
/* Custom CSS for react-tailwind-calendar */

/* Disabled hour styling - shows diagonal stripes for non-working hours */
.calendar-disabled-hour {
  background: repeating-linear-gradient(
      -60deg,
      hsl(var(--stroke-soft-200, 220 13% 91%)) 0 1px,
      transparent 1px 8px
    ) -4px 50% / 200% 120px;
}
`;

// Inject styles if not already injected
if (typeof document !== 'undefined') {
  const styleId = 'react-tailwind-calendar-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = styles;
    document.head.appendChild(style);
  }
}

