chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	// 可写成switch形式 监听所有
	if (sender === "") {
		// do something
	}
	if (request.from === "cc") {
		// from 不是固定词，可使用其他自定义词汇
		// do something
	}
	console.log(request.number);
	sendResponse({number: request.number});

	// 修改dom
	document.querySelector("#s-usersetting-top").innerText = request.number;

	// 发送信息
	chrome.runtime.sendMessage({number: request.number + 1}, (response) => {
		console.log(
			`content script -> background infos have been received. number: ${response.number}`
		);
	});
});

chrome.runtime.sendMessage({number: 1}, (response) => {
	console.log(
		`content script -> background infos have been received. number: ${response.number}`
	);
});
