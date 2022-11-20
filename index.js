const { remote } = require('webdriverio');

const capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Pixel_8_API_32',
    'appium:appPackage': 'com.android.settings',
    'appium:appActivity': '.Settings',
};

const wdOpts = {
    host: process.env.APPIUM_HOST || 'localhost',
    port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
    logLevel: 'info',
    capabilities,
};

describe('User', function () {
    this.timeout(60 * 1000);

    let driver;
    
    before(async () => {
        driver = await remote(wdOpts);
    });

    it('should be able to skip the welcome screen', async () => {
        // assertions here
        const batteryItem = await driver.$('//*[@text="Battery"]');
        await batteryItem.click();
    });


    it.skip('should be able to choose jukebox on home screen', async () => {
        // assertions here
    });


    it.skip('should be able to navigate to jukebox screen', async () => {
        // assertions here
    });

    after(async () => {
        driver = await remote(wdOpts);
    });
});