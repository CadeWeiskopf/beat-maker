import React, { useState, useEffect } from "react";

const BeatPad: React.FC = () => {
  const BPM = 70;

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  const startAudioContext = () => {
    const context = new AudioContext();
    setAudioContext(context);
    setIsStarted(true);
  };

  useEffect(() => {
    const syncWorker = new Worker("worker.js");

    const scheduleBeat = (beatType: string, time: number) => {
      if (time) {
        syncWorker.postMessage({ beatType, time });
      }
    };

    if (isStarted) {
      const beatInterval = 60000 / BPM;
      const interval = setInterval(() => {
        const time = audioContext?.currentTime || 0;
        scheduleBeat("kick", time);
        scheduleBeat("snare", time);
      }, beatInterval);

      return () => {
        clearInterval(interval);
        audioContext?.close();
      };
    }
  }, [isStarted, audioContext]);

  return (
    <div>
      {!isStarted && <button onClick={startAudioContext}>Start</button>}
    </div>
  );
};

export default BeatPad;
