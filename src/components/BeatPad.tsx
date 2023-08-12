import React, { useState, useEffect } from "react";
import { bpSyncWorkerScript } from "./beatpad-sync-worker-script";

const BeatPad: React.FC = () => {
  const BPM = 120;

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  const createSyncWorker = () => {
    return new SharedWorker(
      URL.createObjectURL(
        new Blob([bpSyncWorkerScript], { type: "application/javascript" })
      )
    );
  };

  const syncWorker = createSyncWorker();

  const startAudioContext = () => {
    const context = new AudioContext();
    setAudioContext(context);
    setIsStarted(true);
  };

  useEffect(() => {
    syncWorker.port.start();

    const scheduleBeat = (beatType: string, time: number) => {
      if (time) {
        syncWorker.port.postMessage({ beatType, time });
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
        syncWorker.port.close();
        audioContext?.close();
      };
    }
  }, [isStarted, audioContext, syncWorker.port]);

  return (
    <div>
      {!isStarted && <button onClick={startAudioContext}>Start</button>}
    </div>
  );
};

export default BeatPad;
