const dealwithBigNumber = (val1, val2) => BigInt(val1) * BigInt(val2) + "";
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	const {val1, val2} = request;
	sendResponse({res: dealwithBigNumber(val1, val2)});
});
