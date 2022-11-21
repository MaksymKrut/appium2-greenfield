const swipeVertical = async (driver, yStart, yFinish) => {
    // Swipe page vertically
    await driver.touchPerform([
        {
            action: "press",
            options: {
                x: 100,
                y: yStart
            }
        },
        { action: "wait", options: { mseconds: 0 } },
        {
            action: "moveTo",
            options: {
                x: 100,
                y: yFinish
            }
        },
        { action: "release" }
    ]);
}

const handleLoginPopup = async (driver, action) => { 
    // Login popup interaction, if any
    try {
        const agreeButtonSelector = `//\\*[@text='${action}]`;
        const agreeButton = await driver.$(agreeButtonSelector);
        await agreeButton.waitForDisplayed({ timeout: 10000 });
        await agreeButton.click();
    } catch (error) {
        console.log("\n\nThere was no login popup!\n\n")
    }
}

module.exports = { swipeVertical, handleLoginPopup };