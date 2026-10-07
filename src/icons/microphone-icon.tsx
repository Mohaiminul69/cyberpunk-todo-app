interface Props {
  muted?: boolean;
}

const MicrophoneIcon = ({ muted = false }: Props) => {
  const glowId = muted ? "mic-off-glow" : "mic-on-glow";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="size-full"
    >
      <defs>
        <filter id={glowId}>
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="currentColor" />
        </filter>
      </defs>
      <rect x="9" y="2" width="6" height="12" rx="3" filter={`url(#${glowId})`} />
      <path
        d={muted ? "M5 11v1c0 3.9 3.1 7 7 7" : "M5 11v1c0 3.9 3.1 7 7 7s7-3.1 7-7v-1"}
        strokeLinecap="round"
      />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
      {muted && <line x1="4" y1="4" x2="20" y2="20" strokeLinecap="round" />}
    </svg>
  );
};

export default MicrophoneIcon;
