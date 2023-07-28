// In App.tsx
import BeatPad from "./components/BeatPad";

const App: React.FC = () => {
  // const handleTempoChange = (newTempo: number) => {
  //   setTempo(newTempo);
  // };

  return (
    <div className="App">
      <header>h</header>
      <main>
        <BeatPad />
      </main>
      <footer>f</footer>
    </div>
  );
};

export default App;
