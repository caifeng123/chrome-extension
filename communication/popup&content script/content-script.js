// 接收popup数据并修改dom
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	// document.querySelector("body").style.setProperty("background", request.color);
	$("body").css("background", request.color);
	sendResponse({name: 1});
});

/**
 * 本想传递当前页面的bom和dom给我的popup去操作
 * 但发现底层信息传递是通过JSON.stringify传递数据的，因此无法使用引用
 */
// chrome.runtime.sendMessage({ window });	// 报错 循环引用【JSON.stringify是window上的方法】
// chrome.runtime.sendMessage({window: document.querySelector("body")});	// dom通过JSON.stringify => {}
