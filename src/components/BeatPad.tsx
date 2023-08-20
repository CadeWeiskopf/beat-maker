import React, { useState, useEffect, useRef } from "react";

const BeatPad: React.FC = () => {
  const BPM = 120;
  const beatsBetween = 4;
  const totalBeats = 8;

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  let beatStep = 0;
  let snareSound;
  const [kickSequence, setKickSequence] = useState([
    true,
    false,
    false,
    false,
    false,
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

  const kickAudioRef = useRef<HTMLAudioElement>(null);

  const startAudioContext = async () => {
    const context = new AudioContext();
    setAudioContext(context);
    kickAudioRef.current?.play();
    setIsStarted(true);
  };

  useEffect(() => {
    if (isStarted) {
      if (!audioContext) {
        throw Error("Missing audiocontext");
      }

      const syncWorker = new Worker("worker.js");
      const beatInterval = 60000 / BPM / beatsBetween;
      let nextBeatTime = audioContext.currentTime;

      const scheduleBeat = (beatType: string) => {
        syncWorker.postMessage({ beatType });
      };

      let offset = 0;
      const scheduleNextBeat = () => {
        if (nextBeatTime <= audioContext.currentTime) {
          nextBeatTime = audioContext.currentTime;
        }

        while (nextBeatTime < audioContext.currentTime + beatInterval / 1000) {
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
          nextBeatTime += beatInterval / 1000;
        }
      };

      const interval = setInterval(scheduleNextBeat, beatInterval);

      return () => {
        console.info("cleanup");
        clearInterval(interval);
      };
    }
  }, [isStarted, audioContext, kickSequence, snareSequence]);

  useEffect(() => {
    return () => {
      audioContext?.close();
    };
  }, []);

  return (
    <div className="beatpad-parent">
      <div className="beatsteps-input-wrapper">
        <audio
          src="kick.mp3"
          ref={kickAudioRef}
        />
        {
          /* Kicks */
          kickSequence.map((isKickBeat, index) => {
            return (
              <div
                key={`kick-input-${index}`}
                className="beatstep-div"
              >
                <input
                  className="beatstep-input"
                  type={"checkbox"}
                  defaultChecked={isKickBeat}
                  onInput={(event: React.FormEvent<HTMLInputElement>) => {
                    setKickSequence(
                      kickSequence.map((e, i) =>
                        index === i ? Boolean(event.currentTarget.value) : e
                      )
                    );
                    // startAudioContext();
                  }}
                />
              </div>
            );
          })
        }
      </div>
      <div className="beatsteps-input-wrapper">
        {
          /* snares */
          snareSequence.map((isSnareBeat, index) => {
            return (
              <div
                key={`snare-input-${index}`}
                className="beatstep-div"
              >
                <input
                  className="beatstep-input"
                  type={"checkbox"}
                  defaultChecked={isSnareBeat}
                  onInput={(event: React.FormEvent<HTMLInputElement>) => {
                    setSnareSequence(
                      snareSequence.map((e, i) =>
                        index === i ? Boolean(event.currentTarget.value) : e
                      )
                    );
                    // startAudioContext();
                  }}
                />
              </div>
            );
          })
        }
      </div>
      {!isStarted && <button onClick={startAudioContext}>Start</button>}
    </div>
  );
};

export default BeatPad;
