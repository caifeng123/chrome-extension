async function getCurrentTab() {
	let queryOptions = {active: true, currentWindow: true};
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}
chrome.runtime.sendMessage({
	source: "1.js",
	text: "from 1.js to popup.js",
});

const handleClick = async () => {
	const tab = await getCurrentTab();
	chrome.tabs.sendMessage(tab.id, {1: 2});
};
document.querySelector("button").onclick = handleClick;
