chrome.runtime.onMessage.addListener(({url, mineType}) => {
	fetch(url).then((res) =>
		res.blob().then((blob) => {
			var a = document.createElement("a");
			var url = window.URL.createObjectURL(blob);
			var filename = new Date().valueOf() + "." + mineType;
			a.href = url;
			a.download = filename;
			a.click();
			window.URL.revokeObjectURL(url);
		})
	);
});
