/**
 * chrome.devtools.panels 下的sources.createSidebarPane / elements.createSidebarPane
 * 能分别在 sources和elements标签页下新建siderbar
 * 有两种方式嵌入siderbar内容
 * sidebar.setPage("element.html");
 * sidebar.setExpression("(() => {return {a:1}})()");
 * 需要注意的是 两者只会生效一个
 */

function showInnerText() {
	return {info: $0?.innerText, __proto__: null};
}

function showAllTiming() {
	return {time: performance.timing};
}

// 添加elements上的siderbar
chrome.devtools.panels.elements.createSidebarPane(
	"element pannel",
	(sidebar) => {
		sidebar.setExpression(`(${showInnerText.toString()})()`, "选中内容");
		chrome.devtools.panels.elements.onSelectionChanged.addListener(() =>
			sidebar.setExpression(`(${showInnerText.toString()})()`, "选中内容")
		);
	}
);

// 添加panels上的siderbar
chrome.devtools.panels.sources.createSidebarPane("source pannel", (sidebar) => {
	sidebar.setExpression(`(${showAllTiming.toString()})()`, "运行时间集合");
});

// 以html形式 添加elements上的siderbar
chrome.devtools.panels.elements.createSidebarPane(
	"element html pannel",
	(sidebar) => {
		sidebar.setPage("element.html");
	}
);
