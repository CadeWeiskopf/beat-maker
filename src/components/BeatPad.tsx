import React, { useState, useEffect } from "react";

const BeatPad: React.FC = () => {
  const BPM = 120;
  const beatsBetween = 4;
  const totalBeats = 8;

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  let beatStep = 0;
  const [kickSequence, setKickSequence] = useState([
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
  ]);
  const [snareSequence, setSnareSequence] = useState([
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
  ]);

  const startAudioContext = () => {
    const context = new AudioContext();
    setAudioContext(context);
    setIsStarted(true);
  };

  useEffect(() => {
    if (isStarted) {
      const syncWorker = new Worker("worker.js");
      const beatInterval = 60000 / BPM / beatsBetween;
      let nextBeatTime = audioContext?.currentTime || 0;

      const scheduleBeat = (beatType: string) => {
        syncWorker.postMessage({ beatType });
      };

      let offset = 0;
      const scheduleNextBeat = () => {
        nextBeatTime += beatInterval / 1000;
        if (kickSequence[beatStep]) {
          scheduleBeat("kick");
        }
        if (snareSequence[beatStep]) {
          scheduleBeat("snare");
        }
        beatStep++;
        if (beatStep >= totalBeats) {
          beatStep = 0;
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
