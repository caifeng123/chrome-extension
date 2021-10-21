// 用作发送请求
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	fetch(
		"https://www.google.com.hk/async/bgasy?ei=OGFxYeTmN9qDoATjjau4DQ&yv=3&async=_fmt:jspb",
		{
			headers: {
				accept: "*/*",
				"accept-language": "zh-CN,zh;q=0.9,eu;q=0.8",
				"sec-ch-ua":
					'"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"macOS"',
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"x-client-data":
					"CI62yQEIprbJAQjEtskBCKmdygEIk4zLAQjr8ssBCO/yywEInvnLAQjchMwBCOeEzAEItYXMAQjYhcwBCP+FzAEIgIbMAQ==",
			},
			referrer: "https://www.google.com.hk/",
			referrerPolicy: "origin",
			body: null,
			method: "GET",
			mode: "cors",
			credentials: "include",
		}
	)
		.then((res) => res.text())
		.then((res) => {
			// 告知content-script用户回复数据
			chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {res});
			});
		});
});
