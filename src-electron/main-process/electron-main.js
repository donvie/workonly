import { app, BrowserWindow, nativeTheme, Menu, Tray } from 'electron'
const path = require('path')

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 350,
    height: 600,
    useContentSize: true,
    frame: false,
    minWidth: 240,
    minHeight: 500,
    titleBarStyle: 'hidden',
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })


  let tray = null
  app.whenReady().then(() => {
    tray = new Tray(path.join('','public/icons/favicon-16x16.png'))
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Light Mode / Dark Mode',
        click: function (item) {
          mainWindow.webContents.send('darkMode')
        }
      },
      {
        label: 'Quit Workonly',
        click: function () {
          app.quit()
        }
      },
      {
        label: 'Logout',
        click: function () {
          mainWindow.webContents.send('logOut')
        }
      }
    ])

    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
  })
  



  mainWindow.setBackgroundColor('#f5f5f5') 

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

