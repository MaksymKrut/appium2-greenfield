const agreeButtonSelector = "//android.widget.TextView[@text='Ok, Cool']";
const jukeboxPageNameSelector = 'new UiSelector().resourceId("com.touchtunes.android:id/ttab_title_text")'

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



module.exports = { acceptJukeBoxWelcomePopup, getJukeBoxName };