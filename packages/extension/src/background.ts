// Background service worker for Qastra extension

console.log('Qastra background service worker loaded');

// Open side panel when icon is clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Qastra extension installed');
    // Initialize default settings
    chrome.storage.local.set({
      network: 'TESTNET',
      initialized: false,
    });
  }
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log('Message received:', request);
  
  // Handle different message types
  switch (request.type) {
    case 'GET_WALLET_STATE':
      chrome.storage.local.get(['wallet', 'network'], (result) => {
        sendResponse(result);
      });
      return true; // Indicates async response

    case 'SAVE_WALLET_STATE':
      chrome.storage.local.set({ wallet: request.wallet }, () => {
        sendResponse({ success: true });
      });
      return true;

    default:
      sendResponse({ error: 'Unknown message type' });
  }
});
