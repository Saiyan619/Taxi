import { useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SpeechToTxtProps = {
  value: string;
  onChange: (value: string) => void;
};

const SpeechToTxt = ({ value, onChange }: SpeechToTxtProps) => {
  const {
    listening,
    transcript,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();
  const startingValue = useRef(value);

  useEffect(() => {
    if (!listening || !transcript) return;

    const spokenText = transcript.trim();
    const separator =
      startingValue.current && !startingValue.current.endsWith(" ") ? " " : "";
    onChange(`${startingValue.current}${separator}${spokenText}`);
  }, [listening, onChange, transcript]);

  useEffect(() => {
    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return (
      <p className="text-xs text-muted-foreground">
        Voice input is not supported in this browser.
      </p>
    );
  }

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      return;
    }

    startingValue.current = value;
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant={listening ? "default" : "outline"}
            size="icon"
            className="size-9 rounded-full"
            onClick={toggleListening}
            aria-label={listening ? "Stop listening" : "Start voice input"}
          />
        }
      >
        {listening ? (
          <MicOff className="size-4" />
        ) : (
          <Mic className="size-4" />
        )}
        <span className="sr-only">
          {listening ? "Stop listening" : "Start voice input"}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {listening ? "Stop listening" : "Type with your voice"}
      </TooltipContent>
    </Tooltip>
  );
};

export default SpeechToTxt;