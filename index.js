const { remote } = require('webdriverio');
const expect = require('chai').expect;
const rootDir = require('path').resolve('./');

const capabilities = {
    platformName: 'Android',
    'appium:autoGrantPermissions': true,
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'emulator-5554',
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
    let jukeboxName;
    let jukeboxHotArtists = [];

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
                const jukeboxNameSelector = 'new UiSelector().resourceId("com.touchtunes.android:id/item_venue_name")'
                const jukeboxNameElement = await jukebox.$(`android=${jukeboxNameSelector}`)
                jukeboxName = await jukeboxNameElement.getText()
                console.log("\n\nName: clicked: " + jukeboxName + "\n\n")
                jukeboxElement.click();
                break;
            }
        }

        await driver.pause(10 * 1000)
    });

    it('should be able to navigate to jukebox screen', async () => {
        // Welcome popup interaction, if any
        try {
            const agreeButtonSelector = "//android.widget.TextView[@text='Ok, Cool']";
            const agreeButton = await driver.$(agreeButtonSelector);
            await agreeButton.waitForDisplayed({ timeout: 5000 });
            await agreeButton.click();
        } catch (error) {
            console.log("\n\nThere was not welcome to jukebox popup!\n\n")
        }
        // Get jukebox page name and assert its as expected
        const jukeboxPageNameSelector = 'new UiSelector().resourceId("com.touchtunes.android:id/ttab_title_text")'
        const jukeboxPageNameElement = await driver.$(`android=${jukeboxPageNameSelector}`)
        await jukeboxPageNameElement.waitForDisplayed({ timeout: 30000 });
        const jukeboxPageName = await jukeboxPageNameElement.getText()
        console.log("\n\nName: jukeboxPageName: " + jukeboxPageName + "\n\n")
        console.log("\n\nName: jukeboxName: " + jukeboxName + "\n\n")
        expect(jukeboxPageName).to.equal(jukeboxName)

        // Get current "HOT AT" list on jukebox screen
        const jukeboxHotListSelector = 'new UiSelector().className("androidx.recyclerview.widget.RecyclerView").resourceId("com.touchtunes.android:id/rv_home_widget_recyclerview")';
        const jukeboxHotList = await driver.$$(`android=${jukeboxHotListSelector}`);
        await jukeboxHotList[0].waitForDisplayed({ timeout: 30000 });
        console.log("\n\njukeboxHotList amount: " + jukeboxHotList.length + "\n\n")

        for await (const jukeboxHotArtist of jukeboxHotList) {
            const jukeboxArtistSelector = "//android.widget.LinearLayout/android.widget.TextView";
            const jukeboxArtist = await jukeboxHotArtist.$(jukeboxArtistSelector);
            const artist = await jukeboxArtist.getText()
            jukeboxHotArtists.push(artist)
        }

        console.log("\n\njukeboxHotList artists: " + jukeboxHotArtists + "\n\n")

        // Navigate to HOT AT and HOT ARTISTS

        await driver.pause(5 * 1000)
    });

    after(async () => {
        await driver.deleteSession();
    });
});