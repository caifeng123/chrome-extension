// 实际操作安装函数
function addYarn(src, cb) {
	const scrpit = document.createElement("script");
	scrpit.src = src;
	scrpit.onload = cb;
	document.querySelector("body").append(scrpit);
}

// 挂载安装 1、 查询 2、处理回调
window.yarn = function (str) {
	fetch(`https://api.cdnjs.com/libraries/${str}`)
		.then((res) => res.json())
		.then((res) => {
			if (res.error) {
				console.log(`${str}此包不存在 是不是打错了`);
				return;
			}
			console.time("耗时");
			console.log("加载中.... please wait a moment");
			addYarn(res.latest, () => {
				console.log(`加载完成✅ ${str}@${res.version}`);
				console.timeEnd("耗时");
			});
		});
};
