# YouTube Pop Out Player

A Manifest V3 Chrome extension that recreates Opera's YouTube video pop-out behavior with native Picture-in-Picture.

## Features

- Adds a pop-out control directly to the YouTube player.
- Opens the live video in a movable, resizable window outside the browser page.
- Uses Chrome's native hover controls for play, pause, seek, and volume.
- Lets Chrome manage the PiP window's border radius and visibility states.
- Provides a toolbar popup fallback for the active YouTube tab.
- Handles YouTube's single-page navigation by waiting for the player controls to appear.

## Install for development

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select the `chrome-youtube-popout` folder.
5. Open a YouTube video and click the pop-out icon in the player controls.

## Limitations

The native PiP window is controlled by Chrome, so its exact border radius and control placement follow the installed Chrome version. A custom in-page fallback is used only when native PiP is unavailable.
