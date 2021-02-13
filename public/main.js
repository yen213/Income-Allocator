const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

// Create the window for the app
const createWindow = () => {
  mainWindow = new BrowserWindow({ width: 900, height: 680 });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  mainWindow.on("closed", () => (mainWindow = null));
};

// When app is ready, create the window
app.on("ready", createWindow);

// Quit the application when it no longer has any open windows
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Create a new browser window only if when the application has no visible
// windows after being activated
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
