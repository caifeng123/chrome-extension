// 获取当前tab标签
const getCurrentTab = async () => {
	let queryOptions = {active: true, currentWindow: true};
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
};

$("#background").paigusu({color: "#1926dc"}, async (event, obj) => {
	$("#info").innerHTML = "修改中";
	$("#show").css("background", "#" + obj.hex);
	const tab = await getCurrentTab();
	await chrome.tabs.sendMessage(tab.id, {color: "#" + obj.hex});
	$("#info").innerHTML = "修改成功";
});
