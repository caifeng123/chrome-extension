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
		tempRequest,
	};
	allData[_resourceType]
		? allData[_resourceType].push(tempVal)
		: (allData[_resourceType] = [tempVal]);
};

chrome.devtools.network.onRequestFinished.addListener(function (request) {
	handleData(request);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	chrome.devtools.inspectedWindow.eval(
		`console.log(${JSON.stringify(allData)})`
	);
	if (message.source === "refreash") {
		chrome.runtime.sendMessage({
			source: "devtools",
			data: allData,
		});
	}
});
