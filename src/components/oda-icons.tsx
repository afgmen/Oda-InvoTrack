import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const iconDefaults = {
  "aria-hidden": true,
  fill: "none",
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
} as const;

export function DashboardIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <path
        d="M4.5 13.5h6v6h-6v-6Zm9-9h6v9h-6v-9Zm0 12h6v3h-6v-3Zm-9-12h6v6h-6v-6Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <path
        d="M12 3.75 19 6.5v4.8c0 4.25-2.9 7.68-7 8.95-4.1-1.27-7-4.7-7-8.95V6.5l7-2.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="m8.75 12 2.05 2.05 4.45-4.45"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <circle
        cx="12"
        cy="12"
        r="8.25"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M12 7.75v4.6l3.2 1.9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function QrCodeIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <path
        d="M4.5 4.5h5v5h-5v-5Zm10 0h5v5h-5v-5Zm-10 10h5v5h-5v-5Zm10 0h2v2h-2v-2Zm3 0h2v5h-2m-3 0h2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <path
        d="M5 12h13m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <path
        d="m5.5 12 4 4 9-9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  );
}
