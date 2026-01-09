import { useEffect, useRef, useState } from "react";
import microphoneOn from "../../assets/microphone-on.svg";
import microphoneOff from "../../assets/microphone-off.svg";
import "./task-input.css";

const TaskInput = ({ setTasks }) => {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];

        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setText((prev) =>
          prev
            ? prev + " " + finalTranscript.trim()
            : finalTranscript.trim().charAt(0).toUpperCase() +
              finalTranscript.slice(1)
        );
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    recognitionRef.current?.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const handleKeyDown = (setTasks) => (event) => {
    if (event.key === "Enter") {
      const newTask = {
        id: crypto.randomUUID(),
        status: "pending",
        task: text,
      };

      setTasks((prevTasks) => {
        const newList = [...prevTasks, newTask];
        localStorage.setItem("tasks", JSON.stringify(newList));
        return newList;
      });

      setText("");
    }
  };

  return (
    <div className="task-input--wrapper">
      <div className="task-input--border">
        <textarea
          value={text}
          className="task-input"
          placeholder="Add new task..."
          onKeyDown={handleKeyDown(setTasks)}
          onChange={(e) => setText(e.target.value)}
          type="text"
        />
      </div>
      <span
        className="microphone"
        onClick={listening ? stopListening : startListening}
      >
        {listening ? (
          <img src={microphoneOn} alt="Stop Listening" />
        ) : (
          <img src={microphoneOff} alt="Start Listening" />
        )}
      </span>
    </div>
  );
};

export default TaskInput;
