function Icon({ children, size = 22, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props) {
  return (
    <Icon {...props}>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v10h5v-6h4v6h5V10" />
    </Icon>
  );
}

export function BookIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </Icon>
  );
}

export function BookOpenIcon(props) {
  return (
    <Icon {...props}>
      <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z" />
      <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" />
    </Icon>
  );
}

export function PresentationIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="18" height="13" rx="2" />
      <path d="M12 16v3" />
      <path d="M8 21l4-2 4 2" />
      <path d="M7 7.5h5" />
      <path d="M7 10.5h8" />
    </Icon>
  );
}

export function UsersIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5a3.5 3.5 0 0 1 0 7" />
      <path d="M17.5 14.6a6.5 6.5 0 0 1 4 5.4" />
    </Icon>
  );
}

export function HeadphonesIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <rect x="3" y="14" width="4.5" height="7" rx="2" />
      <rect x="16.5" y="14" width="4.5" height="7" rx="2" />
    </Icon>
  );
}

export function HandIcon(props) {
  return (
    <Icon {...props}>
      <path d="M18 11V6a2 2 0 0 0-4 0v5" />
      <path d="M14 10V4a2 2 0 0 0-4 0v2" />
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M18 8a2 2 0 0 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </Icon>
  );
}

export function ChevronRightIcon(props) {
  return (
    <Icon {...props}>
      <path d="m9 6 6 6-6 6" />
    </Icon>
  );
}

export function CheckIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 12.5 9.5 18 20 6.5" />
    </Icon>
  );
}
