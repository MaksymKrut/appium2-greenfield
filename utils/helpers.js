const acceptJukeBoxWelcomePopup = async (driver, yStart, yFinish) => {
    // Welcome popup interaction, if any
    try {
        const agreeButton = await driver.$(agreeButtonSelector);
        await agreeButton.waitForDisplayed({ timeout: 10000 });
        await agreeButton.click();
    } catch (error) {
        console.log("\n\nThere was not welcome to jukebox popup!\n\n")
    }
}

module.exports = { swipeUp };