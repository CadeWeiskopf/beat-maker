export const bpSyncWorkerScript = `
  let nextBeatTime = 0;

  onconnect = function (e) {
    const port = e.ports[0];
    port.onmessage = function (event) {
      if (event.data === 'get-sync-time') {
        port.postMessage(nextBeatTime);
        return;
      }
    };
  };
`;
