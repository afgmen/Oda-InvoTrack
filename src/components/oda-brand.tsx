import Link from "next/link";

type OdaBrandProps = {
  href?: string;
  compact?: boolean;
  className?: string;
};

function BrandMark() {
  return (
    <span
      aria-hidden="true"
      className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-primary text-primary-foreground oda-action-shadow"
    >
      <svg
        className="size-6"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.5 4.5h6.75L18 8.25V18a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18V6a1.5 1.5 0 0 1 1.5-1.5Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M14.25 4.5v3.75H18M9 13l1.75 1.75L15 10.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    </span>
  );
}

function BrandContent({ compact = false }: Pick<OdaBrandProps, "compact">) {
  return (
    <>
      <BrandMark />
      <span className={compact ? "sr-only" : "text-[17px] font-semibold"}>
        Oda InvoTrack
      </span>
    </>
  );
}

export function OdaBrand({
  href,
  compact = false,
  className = "",
}: OdaBrandProps) {
  const classes = `inline-flex items-center gap-3 text-heading ${className}`;

  if (href) {
    return (
      <Link className={classes} href={href}>
        <BrandContent compact={compact} />
      </Link>
    );
  }

  return (
    <div className={classes}>
      <BrandContent compact={compact} />
    </div>
  );
}
