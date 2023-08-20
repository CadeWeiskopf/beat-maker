onmessage = function (e) {
  switch (e.data.beatType) {
    case "kick":
      console.log("Playing kick sound at", performance.now());
      break;
    case "snare":
      console.log("Playing snare sound at", performance.now());
      break;
    default:
      console.log("No beatType at", this.performance.now);
  }
};
