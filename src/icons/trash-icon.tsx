const TrashIcon = ({ size = 17 }: { size?: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      strokeLinecap="square"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14H5V6" />
      <path d="M8 6V3h8v3" />
    </svg>
  );
};

export default TrashIcon;
