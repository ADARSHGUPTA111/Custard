/**
 * Notarizes the app for macOS
 * Guide: https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
 */
require('dotenv').config();
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;  
  if (electronPlatformName !== 'darwin') {
    return;
  }

  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD) {
    console.warn(
      'Should be notarizing, but environment variables APPLE_ID or APPLE_ID_PASSWORD are missing!',
    );
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  console.log('-------- GOING TO NOTARIZE NOW ---------')

  return await notarize({
    appBundleId: 'com.invidelabs.custard',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    ascProvider: process.env.APPLE_TEAM_SHORT_NAME
  });
};