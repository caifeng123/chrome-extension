const allData = {};

const handleData = (tempRequest) => {
	const {_resourceType, response, request} = tempRequest;
	const {url} = request;
	const {content} = response;
	const [type, mineType] = content.mimeType.split("/"); // image/gif
	const tempVal = {
		type,
		url,
		mineType,
	};
	allData[_resourceType]
		? allData[_resourceType].push(tempVal)
		: (allData[_resourceType] = [tempVal]);
};

chrome.devtools.network.onRequestFinished.addListener(function (request) {
	handleData(request);
	chrome.devtools.inspectedWindow.eval(
		`console.log(${JSON.stringify(allData)})`
	);
});

// window.addEventListener("message", (event) => {
// 	chrome.devtools.inspectedWindow.eval(
// 		`console.log(${JSON.stringify(event.data.text)})`
// 	);
// 	if (event.data && event.data.source === "1.js") {
// 		// handle the event
// 		alert(event.data.text); // hello from web page
// 		chrome.devtools.inspectedWindow.eval(
// 			`console.log(${JSON.stringify(event.data.text)})`
// 		);
// 	}
// });

setTimeout(() => {
	chrome.runtime.sendMessage(
		{
			source: "popup.js",
			text: "from popup to 1.js",
		},
		() =>
			chrome.devtools.inspectedWindow.eval(
				`console.log(${JSON.stringify(1111)})`
			)
	);
}, 5000);
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	chrome.devtools.inspectedWindow.eval(
		`console.log(${{message, sender, sendResponse}})`
	);
});
