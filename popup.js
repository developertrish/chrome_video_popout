const openButton = document.getElementById('open');
const status = document.getElementById('status');

function isYouTubeVideo(url) {
  return typeof url === 'string' && /^https:\/\/www\.youtube\.com\/watch/.test(url);
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

openButton.addEventListener('click', async () => {
  openButton.disabled = true;
  try {
    const tab = await getActiveTab();
    if (!isYouTubeVideo(tab?.url)) {
      status.textContent = 'Open a YouTube video first, then try again.';
      status.className = 'error';
      return;
    }

    await chrome.tabs.sendMessage(tab.id, { type: 'open-pop-out' });
    status.textContent = 'Pop-out opened.';
  } catch {
    status.textContent = 'Open a YouTube video and refresh the tab once.';
    status.className = 'error';
  } finally {
    openButton.disabled = false;
  }
});
