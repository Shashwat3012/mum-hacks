const BACKEND_URL = "http://localhost:8000/webhook"; // change if needed

chrome.runtime.onInstalled.addListener(() => {
  console.log("Miss.Information installed");

  // Create context menu
  chrome.contextMenus.create({
    id: "check-selection",
    title: "🔍 Check selection with Miss. Information",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "check-selection") {
    try {
      // Get selected text via scripting
      const [{ result: selected }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString(),
      });

      if (!selected || !selected.trim()) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon128.png",
          title: "Miss. Information",
          message: "No text selected.",
        });
        return;
      }

      // Call backend (POST using query param as used in popup)
      const url = `${BACKEND_URL}?message=${encodeURIComponent(selected)}`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const text = await resp.text();

      // Save history
      const item = { ts: Date.now(), text: selected, raw: text };
      chrome.storage.local.get({ history: [] }, (res) => {
        const history = res.history || [];
        history.unshift(item);
        if (history.length > 200) history.pop();
        chrome.storage.local.set({ history });
      });

      // Notify user
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "Miss. Information — Result",
        message: text || "No response",
      });
    } catch (err) {
      console.error("Context menu error:", err);
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "Miss. Information — Error",
        message: err.message || String(err),
      });
    }
  }
});
