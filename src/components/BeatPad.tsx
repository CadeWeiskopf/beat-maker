import React, { useState, useEffect } from "react";

const BeatPad: React.FC = () => {
  const BPM = 120;

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  const startAudioContext = () => {
    const context = new AudioContext();
    setAudioContext(context);
    setIsStarted(true);
  };

  useEffect(() => {
    if (isStarted) {
      const syncWorker = new Worker("worker.js");
      const beatInterval = 60000 / BPM;
      let nextBeatTime = audioContext?.currentTime || 0;

      const scheduleBeat = (beatType: string) => {
        syncWorker.postMessage({ beatType });
      };

      let offset = 0;
      const scheduleNextBeat = () => {
        nextBeatTime += beatInterval / 1000;
        scheduleBeat("kick");
        // TODO: remove this, actually build a sequence
        if (offset++ % 2 !== 0) {
          scheduleBeat("snare");
        }
      };

      const interval = setInterval(scheduleNextBeat, beatInterval);

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
