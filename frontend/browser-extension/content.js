// content.js

// Return the currently selected text
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "GET_SELECTION") {
        const selection = window.getSelection().toString().trim();
        sendResponse({ text: selection });
    }

    if (msg.type === "GET_LOCATION") {
        if (!navigator.geolocation) return sendResponse({ error: "Geolocation not supported" });

        navigator.geolocation.getCurrentPosition(
            pos => sendResponse({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                accuracy: pos.coords.accuracy
            }),
            err => sendResponse({ error: err.message })
        );
        return true; // Keep channel open for async
    }
});
