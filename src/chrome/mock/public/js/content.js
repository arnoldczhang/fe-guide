const script = document.createElement('script');
script.src = chrome.runtime.getURL('js/script.js');
script.onload = function() {
  this.remove();
  chrome.storage.local.get(null, (data) => {
    const { table } = data;
    if (Array.isArray(table)) {
      window.postMessage({ data: { type: 'init-data', data: table } }, '*');
    }
  });
};
(document.head || document.documentElement).appendChild(script);

chrome.runtime.onMessage.addListener((data) => {
  window.postMessage({ data }, '*');
});
