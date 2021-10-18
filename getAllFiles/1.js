// chrome.runtime.onMessage.addEventListener("message", (event) => {
// 	if (event.data && event.data.source === "popup.js") {
// 		// handle the event
// 		alert(event.data.text);
// 	}
// });
// setTimeout(() => {
// 	window.postMessage();
// }, 5000);
// chrome.devtools.inspectedWindow.eval(`console.log(${window})`);
// alert(JSON.stringify());
// chrome.runtime.sendMessage({
// 	source: "1.js",
// 	text: "from 1.js to popup.js",
// });
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	alert(JSON.stringify({message, sender, sendResponse}));
});
