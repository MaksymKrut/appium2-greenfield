const { remote } = require('webdriverio');
const rootDir = require('path').resolve('./');

const capabilities = {
    platformName: 'Android',
    'appium:autoGrantPermissions': true,
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Pixel_8_API_32',
    'appium:app': rootDir + '/assets/apk/testApk.apk',
    'appium:printPageSourceOnFindFailure': true,
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
        driver.setGeoLocation({ latitude: "45.36", longitude: "-75.74", altitude: "100" });
    });

    it('should be able to skip the welcome screen', async () => {
        const skipSelector = "//android.widget.TextView[@text='Skip']"; 
        const skipLink = await driver.$(skipSelector);
        await skipLink.waitForDisplayed({ timeout: 30000 });
        await skipLink.click();
        await driver.pause(10 * 1000)
    });

    it('should be able to choose jukebox on home screen', async () => {
        // Get full list of nearby jukeboxes, loop through them to find active and click it.
        const jukeboxListSelector = "//androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup";
        const jukeboxList = await driver.$$(jukeboxListSelector);
        await jukeboxList[0].waitForDisplayed({ timeout: 30000 });

        for await (const jukebox of jukeboxList) {
            const jukeboxElementSelector = 'new UiSelector().resourceId("com.touchtunes.android:id/item_venue_subtitle")'
            const jukeboxElement = await jukebox.$(`android=${jukeboxElementSelector}`)
            const text = await jukeboxElement.getText()
            if (!text.includes('offline')) {
                jukeboxElement.click();
                break;
            }
        }

        await driver.pause(10 * 1000)
    });

    it.skip('should be able to navigate to jukebox screen', async () => {
        // assertions here
    });

    after(async () => {
        await driver.deleteSession();
    });
});