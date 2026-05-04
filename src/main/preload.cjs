const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("codexUsage", {
  getSnapshot: () => ipcRenderer.invoke("usage:snapshot")
});

