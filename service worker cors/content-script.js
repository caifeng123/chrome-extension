// 用作触发service worker请求
chrome.runtime.sendMessage({number: 1});

// 用作接收请求回复
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(request);
});
