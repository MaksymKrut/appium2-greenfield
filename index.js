const expect = require('chai').expect;
const assert = require('chai').assert;
const helpers = require('./utils/helpers')
const driverUtil = require('./utils/driver')

// PageObject files
const welcomeScreen = require('./pages/WelcomeScreen')
const homeScreen = require('./pages/HomeScreen')
const jukeBoxScreen = require('./pages/JukeBoxScreen')

// TODO Refactor all implicit waits with explicit curtain element waits
describe('User', function () {
    this.timeout(120 * 1000);

    let driver;
    let jukeboxName;
    let jukeboxHotArtists = [];
    let jukeboxHotArtistsFromPage = [];

    before(async () => {
        driver = await driverUtil.driverSetup()
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

        helpers.swipeVertical(driver, 900, 100)

        helpers.handleLoginPopup(driver, "Cancel")

        // Get current "HOT AT" list on jukebox screen

        jukeboxHotArtists = await jukeBoxScreen.getHotAtHorizontalList(driver)
        console.log("\n\njukeboxHotList artists: " + jukeboxHotArtists + "\n\n")

        await driver.pause(5 * 1000)

        helpers.handleLoginPopup(driver, "Cancel")

        jukeboxHotArtistsFromPage = await jukeBoxScreen.getHotAtVerticalList(driver)
        console.log("\n\njukeboxHotArtistsFromPage artists: " + jukeboxHotArtistsFromPage + "\n\n")

        await driver.pause(5 * 1000)

        // As existing jukeboxHotArtists is shorter then jukeboxHotArtistsFromPage we will be looping through it
        for await (const jukeboxHotArtist of jukeboxHotArtists) {
            assert.isTrue(jukeboxHotArtistsFromPage.includes(jukeboxHotArtist), `Artist: ${jukeboxHotArtist} is in the list!`);
        }
    });

    after(async () => {
        await driver.deleteSession();
    });
});