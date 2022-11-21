const jukeboxListSelector = "//androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup";
const jukeboxElementSelector = 'new UiSelector().resourceId("com.touchtunes.android:id/item_venue_subtitle")'
const jukeboxNameSelector = 'new UiSelector().resourceId("com.touchtunes.android:id/item_venue_name")'

const chooseActiveJukeBox = async (driver) => {
    // Get full list of nearby jukeboxes, loop through them to find active and click it.
    let jukeboxName;

    const jukeboxList = await driver.$$(jukeboxListSelector);
    await jukeboxList[0].waitForDisplayed({ timeout: 60000 });

    for await (const jukebox of jukeboxList) {
        const jukeboxElement = await jukebox.$(`android=${jukeboxElementSelector}`)
        const text = await jukeboxElement.getText()
        if (!text.includes('offline')) {
            const jukeboxNameElement = await jukebox.$(`android=${jukeboxNameSelector}`)
            jukeboxName = await jukeboxNameElement.getText()
            console.log("\n\nName: clicked: " + jukeboxName + "\n\n")
            jukeboxElement.click();
            break;
        }
    }

    return jukeboxName;
}

module.exports = { chooseActiveJukeBox };