const CheckIcon = ({
  size = 12,
  strokeWidth = 3.5,
}: {
  size?: number;
  strokeWidth?: number;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      strokeLinecap="square"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
};

export default CheckIcon;
