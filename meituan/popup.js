// 获取dom结点对象执行操作
const checkbox = document.querySelector("#checkbox");
const audio = document.querySelector("#audio");
const longitude = document.querySelector("#longitude");
const latitude = document.querySelector("#latitude");
const btn = document.querySelector("#submit");

// 第一次显示时通过content-script的localstorage获取开启选中情况和地理位置
(async () => {
    chrome.storage.sync.get(['checked', 'longitude', 'latitude'], response => {
        checkbox.checked = response.checked ?? false;
        longitude.value = response.longitude ?? '';
        latitude.value = response.latitude ?? '';
    });
})();

// 告知popup信息
async function change () {
    const info = {checked: checkbox.checked, longitude: longitude.value, latitude: latitude.value, target: "change"};
    chrome.storage.sync.set(info);
}

// 点击按钮提交经纬度函数
btn.onclick = change;
// 原生checkbox执行监听
checkbox.addEventListener("change", change);
