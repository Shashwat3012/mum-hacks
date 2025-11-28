const BACKEND_URL = "http://localhost:8000/webhook";

// UI Elements
let chatBox, resultMeta, checkBtn, copyBtn, clearBtn, historyBtn, themeBtn, expandBtn, historyDrawer;
let lastResponseText = "";

// -------------------------
// Wait for DOM to load
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
	chatBox = document.getElementById("chat");
	resultMeta = document.getElementById("resultMeta");
	checkBtn = document.getElementById("checkBtn");
	copyBtn = document.getElementById("copyBtn");
	clearBtn = document.getElementById("clearBtn");
	historyBtn = document.getElementById("historyBtn");
	themeBtn = document.getElementById("themeBtn");
	expandBtn = document.getElementById("expandBtn");
	historyDrawer = document.getElementById("historyDrawer");

	attachEventListeners();
	loadUISettings();
	loadHistory();
});

// -------------------------
// Attach button events
// -------------------------
function attachEventListeners() {
	checkBtn.addEventListener("click", async () => {
		const selected = await getSelectedText();
		if (!selected) return addBubble("❌ No text selected!", "bot");

		addBubble(selected, "you");
		addBubble("⏳ Analyzing...", "bot", true);

		try {
			const location = await getLocationFromTab();
			const response = await fetch(BACKEND_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					text: selected,
					platform: "extension",
					userId: await getUserId(),
					location: location.error ? null : location,
				}),
			});

			let raw = await response.text();
			let finalResult;

			try {
				const parsed = JSON.parse(raw);
				finalResult = parsed.result || raw;
			} catch {
				finalResult = raw;
			}

			lastResponseText = finalResult;
			if (chatBox.lastChild && chatBox.lastChild.classList.contains("bot")) chatBox.lastChild.remove();

			addBubble(`🧠 Miss. Information:\n${finalResult}`, "bot");
			saveHistory(selected, finalResult);

		} catch (err) {
			addBubble("❌ Error: " + err.message, "bot");
		}
	});

	copyBtn.addEventListener("click", async () => {
		if (!lastResponseText) return toast("Nothing to copy");
		await navigator.clipboard.writeText(lastResponseText);
		toast("Copied ✔️");
	});

	clearBtn.addEventListener("click", () => {
		chatBox.innerHTML = "";
		resultMeta.innerText = "";
	});

	historyBtn.addEventListener("click", () => historyDrawer.classList.toggle("open"));

	themeBtn.addEventListener("click", () => {
		document.body.classList.toggle("dark");
		chrome.storage.local.set({ theme: document.body.classList.contains("dark") ? "dark" : "light" });
	});

	expandBtn.addEventListener("click", () => {
		document.body.classList.toggle("expanded");
		chrome.storage.local.set({ expanded: document.body.classList.contains("expanded") });
	});
}

// -------------------------
// Get selected text from active tab
// -------------------------
async function getSelectedText() {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	return new Promise(resolve => {
		chrome.tabs.sendMessage(tab.id, { type: "GET_SELECTION" }, (res) => {
			resolve(res?.text || "");
		});
	});
}

// -------------------------
// Get geolocation from active tab
// -------------------------
async function getLocationFromTab() {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	return new Promise(resolve => {
		chrome.tabs.sendMessage(tab.id, { type: "GET_LOCATION" }, (res) => {
			resolve(res || { error: "No location" });
		});
	});
}

// -------------------------
// Persistent user ID
// -------------------------
async function getUserId() {
	return new Promise(resolve => {
		chrome.storage.local.get(["userId"], (data) => {
			if (data.userId) return resolve(data.userId);
			const newId = "ext-" + Math.random().toString(36).substring(2, 12);
			chrome.storage.local.set({ userId: newId });
			resolve(newId);
		});
	});
}

// -------------------------
// Chat bubble
// -------------------------
function addBubble(text, type, isLoading = false) {
	const bubble = document.createElement("div");
	bubble.className = `bubble ${type}`;
	bubble.innerHTML = isLoading ? `<span class="loader"></span> ${text}` : text;
	chatBox.appendChild(bubble);
	chatBox.scrollTop = chatBox.scrollHeight;
}

// -------------------------
// History
// -------------------------
function saveHistory(query, result) {
	chrome.storage.local.get(["history"], ({ history = [] }) => {
		history.unshift({ query, result, time: new Date().toLocaleString() });
		chrome.storage.local.set({ history });
		loadHistory();
	});
}

function loadHistory() {
	chrome.storage.local.get(["history"], ({ history = [] }) => {
		historyDrawer.innerHTML = history.length
			? history.map(item => `<div class="historyItem"><strong>${item.query}</strong><small>${item.time}</small><p>${item.result}</p></div>`).join("")
			: "<p style='opacity:0.7;'>No history yet.</p>";
	});
}

// -------------------------
// UI Settings
// -------------------------
function loadUISettings() {
	chrome.storage.local.get(["theme", "expanded"], ({ theme, expanded }) => {
		if (theme === "dark") document.body.classList.add("dark");
		if (expanded) document.body.classList.add("expanded");
	});
}

// -------------------------
// Toast
// -------------------------
function toast(msg) {
	const t = document.createElement("div");
	t.textContent = msg;
	t.style.cssText = `
        position: fixed; bottom: 10px; left: 50%; transform: translateX(-50%);
        background: rgba(0,0,0,0.7); color: white; padding: 8px 12px;
        border-radius: 6px; font-size: 12px;
    `;
	document.body.appendChild(t);
	setTimeout(() => t.remove(), 1800);
}

console.log("Miss. Information — Popup Loaded.");
