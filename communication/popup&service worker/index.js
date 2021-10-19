// 无用
// const background = chrome.extension.getBackgroundPage();
// console.log(background);
document.querySelector("#button").addEventListener("click", () => {
	const val1 = document.querySelector("#input1").value || "0";
	const val2 = document.querySelector("#input2").value || "0";
	chrome.runtime.sendMessage({val1, val2}, (response) => {
		document.querySelector("#ans").innerHTML = response.res;
	});
});
