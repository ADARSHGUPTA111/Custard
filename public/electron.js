const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const userAgent = require("./userAgent");
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

// app.userAgentFallback = app.userAgentFallback.replace(
//   "Electron/" + process.versions.electron,
//   ""
// );

//to fix google sign-up and whatsapp updated version
app.userAgentFallback = userAgent();
// report.onExtendedProcessMetrics(app, { samplingInterval: 1000 })
// .subscribe(report => console.log(report));

//Force Single window
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })

    // Create myWindow, load the rest of the app, etc...
    // app.whenReady().then(() => {})
}

function createWindow() {
  mainWindow = new BrowserWindow(
    { 
      minWidth: 900,
      minHeight: 680,
      webPreferences: { 
        nodeIntegration: false,
        webviewTag: true,
        nativeWindowOpen: true
      }
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => {
    mainWindow = null;
    globalShortcut.unregisterAll();
  });
  require('./mainmenu');
}

// app.on("ready", createWindow);
// when app is ready register a global shortcut
// that calls createWindow function
app.on('ready', () => {
  createWindow();
  globalShortcut.register('CommandOrControl+Shift+C', createWindow);
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow) {
      mainWindow.show();
  } else {
      mainWindow = createMainWindow();
  }
});
