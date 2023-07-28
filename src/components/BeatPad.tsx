import React, { useCallback, useEffect, useState } from "react";

const NUM_STEPS = 8;
const METRONOME_NUMBER = 2;
const BEATS_PER_TICK = 4;

const BeatPad: React.FC = () => {
  const [sequence, setSequence] = useState<boolean[]>(
    new Array(NUM_STEPS).fill(false)
  );
  const [metronome, setMetronome] = useState<boolean[]>(
    new Array(METRONOME_NUMBER).fill(false)
  );
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [tempoBeat, setTempoBeat] = useState<number>(0);

  const toggleStep = (step: number) => {
    console.log("toggle", step, sequence[step]);
    sequence[step] = !sequence[step];
    setSequence(sequence.map((s) => s));
  };

  const [tempo, setTempo] = useState<number>(120);

  const handleTempoChange = (newTempo: number) => {
    setTempo(newTempo);
  };

  const playSequence = useCallback(() => {
    setTempoBeat((prevBeat) => (prevBeat + 1) % METRONOME_NUMBER);
    console.log(sequence);
  }, [sequence]);

  const playBeats = useCallback(() => {
    setCurrentBeat((prevBeat) => (prevBeat + 1) % NUM_STEPS);
    console.log(sequence);
  }, [sequence]);

  useEffect(() => {
    const tempoInterval = (60 / tempo) * 1000;
    const beatsInterval = (60 / tempo) * (1 / BEATS_PER_TICK) * 1000;
    const tempoTimer = setInterval(playSequence, tempoInterval);
    const beatsTimer = setInterval(playBeats, beatsInterval);
    return () => {
      clearInterval(tempoTimer);
      clearInterval(beatsTimer);
    };
  }, [tempo, sequence, playSequence, playBeats]);

  return (
    <div className="beat-pad">
      <div style={{ display: "flex" }}>
        {metronome.map((isMetronome, step) => {
          return (
            <div key={step}>
              <button
                disabled
                className={`beat-pad-step ${
                  step === tempoBeat ? "active-tempo-beat" : ""
                }`}
              />
              {new Array(BEATS_PER_TICK - 1).fill(null).map((e, i) => {
                return (
                  <button
                    key={i}
                    disabled
                    className={`beat-pad-step`}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div>
        {sequence.map((isBeat, step) => {
          return (
            <button
              key={step}
              className={`beat-pad-step ${isBeat ? "active" : ""} ${
                currentBeat === step ? "active-tempo-beat" : ""
              }`}
              onClick={() => toggleStep(step)}
            />
          );
        })}
      </div>
      <input
        type="number"
        disabled
        onInput={(event: React.FormEvent<HTMLInputElement>) => {
          handleTempoChange(event.currentTarget.valueAsNumber);
        }}
      />
    </div>
  );
};

export default BeatPad;
