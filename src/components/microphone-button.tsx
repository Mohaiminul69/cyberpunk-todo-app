import MicrophoneIcon from "../icons/microphone-icon";
import { isSpeechSupported, useSpeechToText } from "../hooks/use-speech-to-text";

interface Props {
  onTranscript: (transcript: string) => void;
}

const MicrophoneButton = ({ onTranscript }: Props) => {
  const { listening, startListening, stopListening } =
    useSpeechToText(onTranscript);

  if (!isSpeechSupported) return null;

  return (
    <button
      type="button"
      // Keep focus in the textarea so its onBlur doesn't close edit mode
      onMouseDown={(e) => e.preventDefault()}
      onClick={listening ? stopListening : startListening}
      title={listening ? "Stop Listening" : "Start Listening"}
      className={`absolute top-0 right-0 size-5 cursor-pointer transition-colors ${
        listening ? "text-(--col)" : "text-hud-muted-2 hover:text-(--col)"
      }`}
    >
      <MicrophoneIcon muted={!listening} />
    </button>
  );
};

export default MicrophoneButton;
