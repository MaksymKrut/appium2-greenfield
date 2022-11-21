# Appium 2 Test Automation Framework for TouchTunes

## Tools used:

Appium version 2.0. We are near the entrance of year of 2023 and considering building stable future-proof application and taking into consideration that Appium < 2 versions are not longer supported from January 2022 with this message "Appium core team does not maintain Appium 1.x anymore since the 1st of January 2022. All recent versions of officially supported platform drivers are not compatible to Appium 1.x anymore, and require Appium 2 to run." from https://github.com/appium/appium.

WebDriverIO. Well maintained and documented test automation framework on NodeJS. https://webdriver.io/

UiAutomator2. Main operational Android driver to use WebDriverIO NodeJS library.

Mocha and Chai. Mocha for test structure setup, BDD layer [Mocha](https://mochajs.org/). Chai as versatile assertion library [Chai](https://github.com/chaijs/chai).

## Installation

1. Open terminal window, clone the project to your machine with "`git clone {PROJECT_URL}`"

2. Navigate to project folder and run "`npm i`" in root of this project to install needed dependencies.

3. Install Appium 2.0 with next command: "`npm i -g appium@next`"

4. Install UiAutomator2 with next command: "`appium driver install uiautomator2`"

5. Install JAVA JDK. Setup JAVA_HOME, ANDROID_HOME or ANDROID_SDK_ROOT environment variable from step 1 and 2 in this tutorial https://www.swtestacademy.com/how-to-install-appium-on-mac/

6. Put apk file inside assets/apk folder and rename it to testApk.apk

7. Android emulator setup. Start Android emulator. Suggest to start it as standalone app with command line without opening Android Studio for quick further it's settings access. Next steps to do it. a) Execute "`emulator -list-avds`" to list all available emulators and copy desired name, b) Execute "`${ANDROID_HOME}/emulator/emulator -avd {NAME}`" to start it. Emulator started. Open new terminal and execute "`adb devices`". Copy exact emulator name and paste it into Appium desired capabilities settings as "appium:deviceName". Open emulator settings: Emulator window -> ... dots settings menu -> Location -> Search in map search field for "Walmart Supercentre, Baseline Rd, Ottawa" -> choose it as you current location with "SET LOCATION" button.

## Start tests

Start Appium server with command "`appium`" in one terminal window. Assure you have emulator up and running.

Open other terminal window, navigate to project root and start tests with "`npm test index.js`"

## Test writing tools:

https://github.com/appium/appium-inspector/releases

## Test cases:

1. When users first opens the application, there is an onboarding flow that they can do. You can either test the flow or simply skip it.

2. You can use any jukebox that you want. Please provide GPS coordinates so that we can use the same location.

3. Choose any jukebox location. Open “Hot at {jukebox name}” menu on the home page, than open “Hot Artists” menu.

4. Verify that the artists displayed on this page are aligned with the artists displayed at “HOT AT <jukebox name>” vertical list of the home page.

## Appium 2.0 documentation:

https://appium.github.io/appium/docs/en/2.0

https://appium.github.io/appium/docs/en/2.0/guides/caps/

https://github.com/appium/appium-uiautomator2-driver#capabilities 

Problem: Not all jukeboxes are active. Solution: Loop through available and get first active.
Problem: Random Welcome and Login popups. Solution: Added helper catcher for those popups.