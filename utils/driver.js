const { remote } = require('webdriverio');
const rootDir = require('path').resolve('./');

const capabilities = {
    platformName: 'Android',
    'appium:autoGrantPermissions': true,
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'emulator-5554',
    'appium:app': rootDir + '/assets/apk/testApk.apk'
};

const wdOpts = {
    host: process.env.APPIUM_HOST || 'localhost',
    port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
    logLevel: 'info',
    capabilities,
};

const driverSetup = async () => {
    return await remote(wdOpts);
}

module.exports = { driverSetup };