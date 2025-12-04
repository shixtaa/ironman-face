import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getRegisterStatic: () => {
    return ipcRenderer.invoke('get-register-static')
  },
  testFaceDetect: (data) => {
    return ipcRenderer.invoke('test-face-detect', data)
  },
  registerFace: (data) => {
    return ipcRenderer.invoke('register-face', data)
  },
  getTestList: (data) => {
    return ipcRenderer.invoke('get-test-list', data)
  },
  get30DaysData: () => {
    return ipcRenderer.invoke('get-30-days-data')
  },
  getCallStatic: (data) => {
    return ipcRenderer.invoke('get-call-static', data)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
