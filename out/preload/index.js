"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const preload = require("@electron-toolkit/preload");
const electron = require("electron");
const api = {
  addDroptimizer(url) {
    return electron.ipcRenderer.invoke("add-droptimizer", url);
  },
  addCharacter(character) {
    return electron.ipcRenderer.invoke("add-character", character);
  }
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
exports.api = api;
