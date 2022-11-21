const skipSelector = "//android.widget.TextView[@text='Skip']";

const clickSkipButton = async (driver) => { 
    const skipLink = await driver.$(skipSelector);
    await skipLink.waitForDisplayed({ timeout: 60000 });
    await skipLink.click();
}

module.exports = { clickSkipButton };