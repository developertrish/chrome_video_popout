(() => {
  const BUTTON_ID = 'youtube-popout-button';
  const OVERLAY_ID = 'youtube-popout-overlay';
  const PLAYER_SELECTORS = [
    '.html5-video-player .ytp-right-controls',
    '.html5-video-player .ytp-chrome-controls .ytp-right-controls'
  ];
  let popOutState = null;

  function getVideo() {
    return document.querySelector('.html5-main-video, video');
  }

  function getControls() {
    return PLAYER_SELECTORS.map((selector) => document.querySelector(selector)).find(Boolean);
  }

  function restoreVideo() {
    const overlay = document.getElementById(OVERLAY_ID);
    const video = overlay?.querySelector('video');
    if (!overlay || !video || !popOutState) return;

    if (popOutState.placeholder.isConnected) {
      popOutState.placeholder.replaceWith(video);
      video.controls = false;
    }
    popOutState = null;
    overlay.remove();
  }

  async function openFallbackVideo(video) {
    if (document.getElementById(OVERLAY_ID)) return;
    if (!video || !video.parentElement) return;

    const placeholder = document.createComment('youtube-popout-placeholder');
    video.replaceWith(placeholder);
    popOutState = { placeholder };
    video.controls = true;

    const overlay = document.createElement('section');
    overlay.id = OVERLAY_ID;
    overlay.setAttribute('aria-label', 'YouTube pop-out video');
    overlay.innerHTML = '<div class="youtube-popout-bar"><span>Video pop out</span><button type="button" aria-label="Return video to YouTube" title="Return video to YouTube">×</button></div>';
    overlay.querySelector('button').addEventListener('click', restoreVideo);
    overlay.appendChild(video);
    document.body.appendChild(overlay);
  }

  async function popOutVideo() {
    const video = getVideo();
    if (!video) return;

    if (document.pictureInPictureElement === video) {
      await document.exitPictureInPicture();
      return;
    }

    if (typeof video.requestPictureInPicture === 'function' && !video.disablePictureInPicture) {
      try {
        video.disablePictureInPicture = false;
        await video.requestPictureInPicture();
        return;
      } catch (error) {
        console.warn('[YouTube Pop Out] native picture-in-picture unavailable', error);
      }
    }

    await openFallbackVideo(video);
  }

  function showButton() {
    if (document.getElementById(BUTTON_ID)) return;
    const controls = getControls();
    if (!controls) return;

    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.className = 'ytp-button youtube-popout-button';
    button.type = 'button';
    button.title = 'Pop out video';
    button.setAttribute('aria-label', 'Pop out video');
    button.innerHTML = '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M7 7h9v3h-6v6H7V7Zm13 0h9v9h-3v-6h-6V7ZM7 20h3v6h6v3H7v-9Zm19 0h3v9h-9v-3h6v-6Z"/><path d="M12 12h12v12H12z"/></svg>';

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      popOutVideo().catch(() => {});
    });

    controls.prepend(button);
  }

  function watchForPlayer() {
    showButton();
    new MutationObserver(showButton).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === 'read-current-time') {
      sendResponse({ currentTime: getVideo()?.currentTime || 0 });
    }
    if (message?.type === 'open-pop-out') popOutVideo().catch(() => {});
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchForPlayer, { once: true });
  } else {
    watchForPlayer();
  }
})();
