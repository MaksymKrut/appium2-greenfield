const helpers = require('../utils/helpers')

const agreeButtonSelector = "//android.widget.TextView[@text='Ok, Cool']";
const jukeboxPageNameSelector = 'new UiSelector().resourceId("com.touchtunes.android:id/ttab_title_text")'
const jukeboxHotListSelector = 'new UiSelector().className("androidx.recyclerview.widget.RecyclerView").resourceId("com.touchtunes.android:id/rv_home_widget_recyclerview")';
const jukeboxArtistSelector = "//android.widget.LinearLayout/android.widget.TextView";

// Hot List selectors
const jukeboxHotAtSelector = 'new UiSelector().className("android.widget.TextView").resourceId("com.touchtunes.android:id/tv_home_row_title")';
const jukeboxHotArtistsSelector = 'new UiSelector().className("android.widget.TextView").resourceId("com.touchtunes.android:id/ctv_item_row_title")';
const jukeboxHotArtistListSelector = 'new UiSelector().className("android.widget.ListView").resourceId("com.touchtunes.android:id/lv_browse_music_artists")';

const acceptJukeBoxWelcomePopup = async (driver) => {
    // Welcome popup interaction, if any
    try {
        const agreeButton = await driver.$(agreeButtonSelector);
        await agreeButton.waitForDisplayed({ timeout: 10000 });
        await agreeButton.click();
    } catch (error) {
        console.log("\n\nThere was not welcome to jukebox popup!\n\n")
    }
}

const getJukeBoxName = async (driver) => {
    // Get jukebox page name and assert its as expected
    const jukeboxPageNameElement = await driver.$(`android=${jukeboxPageNameSelector}`)
    await jukeboxPageNameElement.waitForDisplayed({ timeout: 60000 });
    return await jukeboxPageNameElement.getText()
}

const getHotAtHorizontalList = async (driver) => {
    let jukeboxHotArtists = [];
    const jukeboxHotList = await driver.$$(`android=${jukeboxHotListSelector}`);
    await jukeboxHotList[0].waitForDisplayed({ timeout: 60000 });
    console.log("\n\njukeboxHotList amount: " + jukeboxHotList.length + "\n\n")

    for await (const jukeboxHotArtist of jukeboxHotList) {
        const jukeboxArtist = await jukeboxHotArtist.$(jukeboxArtistSelector);
        const artist = await jukeboxArtist.getText()
        jukeboxHotArtists.push(artist)
    }
    return jukeboxHotArtists;
}

const getHotAtVerticalList = async (driver) => {
    
    // Navigate to HOT AT and HOT ARTISTS
    const jukeboxHotAtElement = await driver.$(`android=${jukeboxHotAtSelector}`)
    await jukeboxHotAtElement.waitForDisplayed({ timeout: 60000 });
    await jukeboxHotAtElement.click()
    await driver.pause(5 * 1000)

    helpers.handleLoginPopup(driver, "Cancel")

    const jukeboxHotArtistsElement = await driver.$(`android=${jukeboxHotArtistsSelector}`)
    await jukeboxHotArtistsElement.waitForDisplayed({ timeout: 60000 });
    await jukeboxHotArtistsElement.click()
    await driver.pause(5 * 1000)

    // Now on Hot Artists page get all artists and compare them with saved in jukeboxHotArtists
    const jukeboxHotArtistList = await driver.$$(`android=${jukeboxHotArtistListSelector}`);
    await jukeboxHotArtistList[0].waitForDisplayed({ timeout: 60000 });
    console.log("\n\njukeboxHotArtistList amount: " + jukeboxHotArtistList.length + "\n\n")

    let jukeboxHotArtistsFromPage;

    for await (const jukeboxHotArtist of jukeboxHotArtistList) {
        const jukeboxArtist = await jukeboxHotArtist.$(jukeboxArtistSelector);
        const artist = await jukeboxArtist.getText()
        jukeboxHotArtistsFromPage.push(artist)
    }

    return jukeboxHotArtistsFromPage;
}

module.exports = { acceptJukeBoxWelcomePopup, getJukeBoxName, getHotAtHorizontalList, getHotAtVerticalList };