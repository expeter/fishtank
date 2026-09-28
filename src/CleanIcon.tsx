/** A sponge with soap bubbles distinguishes cleaning from painting/decorating. */
export default function CleanIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 12c4-3 14-3 18 0v8c-4 2-14 2-18 0Z" fill="#e8be62" />
      <path d="M3 16c5 2 13 2 18 0" stroke="#937142" />
      <circle cx="7" cy="6" r="3" fill="#d6eeee" />
      <circle cx="16" cy="4" r="2" fill="#d6eeee" />
      <path d="m8 13 .1 0m6 0 .1 0m3 5 .1 0" />
    </svg>
  );
}
