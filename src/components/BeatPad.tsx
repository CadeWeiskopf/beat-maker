import React, { useCallback, useEffect, useState } from "react";

const NUM_STEPS = 8;

const BeatPad: React.FC = () => {
  const [sequence, setSequence] = useState<boolean[]>(
    new Array(NUM_STEPS).fill(false)
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
    setTempoBeat((prevBeat) => (prevBeat + 1) % NUM_STEPS);
    console.log(sequence);
  }, [sequence]);

  useEffect(() => {
    const tempoInterval = (60 / tempo) * 1000;
    const tempoTimer = setInterval(playSequence, tempoInterval);
    return () => clearInterval(tempoTimer);
  }, [tempo, sequence, playSequence]);

  return (
    <div className="beat-pad">
      {sequence.map((isBeat, step) => (
        <button
          key={step}
          className={`beat-pad-step ${isBeat ? "active" : ""} ${
            currentBeat === step ? "active-beat" : ""
          } ${tempoBeat === step ? "active-tempo-beat" : ""}`}
          onClick={() => toggleStep(step)}
        />
      ))}
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
