const { remote } = require('webdriverio');
const expect = require('chai').expect;
const assert = require('chai').assert;
const rootDir = require('path').resolve('./');

// PageObject files
const welcomeScreen = require('./pages/WelcomeScreen')
const homeScreen = require('./pages/HomeScreen')
const jukeBoxScreen = require('./pages/JukeBoxScreen')

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

describe('User', function () {
    this.timeout(120 * 1000);

    let driver;
    let jukeboxName;
    let jukeboxHotArtists = [];

    before(async () => {
        driver = await remote(wdOpts);
        driver.setGeoLocation({ latitude: "45.36", longitude: "-75.74", altitude: "100" });
    });

    it('should be able to skip the welcome screen', async () => {
        await welcomeScreen.clickSkipButton(driver);
        await driver.pause(10 * 1000)
    });

    it('should be able to choose jukebox on home screen', async () => {
        jukeboxName = await homeScreen.chooseActiveJukeBox(driver)
        await driver.pause(10 * 1000)
    });

    it('should be able to navigate to jukebox screen', async () => {
        await jukeBoxScreen.acceptJukeBoxWelcomePopup(driver)
        const jukeboxPageName = await jukeBoxScreen.getJukeBoxName(driver)
        console.log("\n\nName: jukeboxPageName: " + jukeboxPageName + "\n\n")
        console.log("\n\nName: jukeboxName: " + jukeboxName + "\n\n")
        expect(jukeboxPageName).to.equal(jukeboxName)

        // Swipe page half page up
        console.log("\n\nSwiping now!\n\n")
        await driver.touchPerform([
            {
                action: "press",
                options: {
                    x: 100,
                    y: 900
                }
            },
            { action: "wait", options: { mseconds: 0 } },
            {
                action: "moveTo",
                options: {
                    x: 100,
                    y: 100
                }
            },
            { action: "release" }
        ]);

        // Login popup interaction, if any
        try {
            const agreeButtonSelector = "//*[@text='Cancel]";
            const agreeButton = await driver.$(agreeButtonSelector);
            await agreeButton.waitForDisplayed({ timeout: 10000 });
            await agreeButton.click();
        } catch (error) {
            console.log("\n\nThere was no login popup!\n\n")
        }

        // Get current "HOT AT" list on jukebox screen
        const jukeboxHotListSelector = 'new UiSelector().className("androidx.recyclerview.widget.RecyclerView").resourceId("com.touchtunes.android:id/rv_home_widget_recyclerview")';
        const jukeboxHotList = await driver.$$(`android=${jukeboxHotListSelector}`);
        await jukeboxHotList[0].waitForDisplayed({ timeout: 60000 });
        console.log("\n\njukeboxHotList amount: " + jukeboxHotList.length + "\n\n")

        for await (const jukeboxHotArtist of jukeboxHotList) {
            const jukeboxArtistSelector = "//android.widget.LinearLayout/android.widget.TextView";
            const jukeboxArtist = await jukeboxHotArtist.$(jukeboxArtistSelector);
            const artist = await jukeboxArtist.getText()
            jukeboxHotArtists.push(artist)
        }

        console.log("\n\njukeboxHotList artists: " + jukeboxHotArtists + "\n\n")

        await driver.pause(5 * 1000)

        // Login popup interaction, if any
        try {
            const agreeButtonSelector = "//*[@text='Cancel]";
            const agreeButton = await driver.$(agreeButtonSelector);
            await agreeButton.waitForDisplayed({ timeout: 10000 });
            await agreeButton.click();
        } catch (error) {
            console.log("\n\nThere was no login popup!\n\n")
        }


        // Navigate to HOT AT and HOT ARTISTS
        const jukeboxHotAtSelector = 'new UiSelector().className("android.widget.TextView").resourceId("com.touchtunes.android:id/tv_home_row_title")';
        const jukeboxHotAtElement = await driver.$(`android=${jukeboxHotAtSelector}`)
        await jukeboxHotAtElement.waitForDisplayed({ timeout: 60000 });
        await jukeboxHotAtElement.click()
        await driver.pause(5 * 1000)

        // Login popup interaction, if any
        try {
            const agreeButtonSelector = "//*[@text='Cancel]";
            const agreeButton = await driver.$(agreeButtonSelector);
            await agreeButton.waitForDisplayed({ timeout: 10000 });
            await agreeButton.click();
        } catch (error) {
            console.log("\n\nThere was no login popup!\n\n")
        }

        const jukeboxHotArtistsSelector = 'new UiSelector().className("android.widget.TextView").resourceId("com.touchtunes.android:id/ctv_item_row_title")';
        const jukeboxHotArtistsElement = await driver.$(`android=${jukeboxHotArtistsSelector}`)
        await jukeboxHotArtistsElement.waitForDisplayed({ timeout: 60000 });
        await jukeboxHotArtistsElement.click()
        await driver.pause(5 * 1000)

        // Now on Hot Artists page get all artists and compare them with saved in jukeboxHotArtists
        const jukeboxHotArtistListSelector = 'new UiSelector().className("android.widget.ListView").resourceId("com.touchtunes.android:id/lv_browse_music_artists")';
        const jukeboxHotArtistList = await driver.$$(`android=${jukeboxHotArtistListSelector}`);
        await jukeboxHotArtistList[0].waitForDisplayed({ timeout: 60000 });
        console.log("\n\njukeboxHotArtistList amount: " + jukeboxHotArtistList.length + "\n\n")

        let jukeboxHotArtistsFromPage;

        for await (const jukeboxHotArtist of jukeboxHotArtistList) {
            const jukeboxArtistSelector = "//android.widget.LinearLayout/android.widget.TextView";
            const jukeboxArtist = await jukeboxHotArtist.$(jukeboxArtistSelector);
            const artist = await jukeboxArtist.getText()
            jukeboxHotArtistsFromPage.push(artist)
        }

        // As existing jukeboxHotArtists is shorter then jukeboxHotArtistsFromPage we will be looping through it
        for await (const jukeboxHotArtist of jukeboxHotArtists) {
            assert.isTrue(jukeboxHotArtistsFromPage.includes(jukeboxHotArtist), `Artist: ${jukeboxHotArtist} is in the list!`);
        }
    });

    after(async () => {
        await driver.deleteSession();
    });
});