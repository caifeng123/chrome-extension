// 获取dom结点对象执行操作
const submit = document.querySelector("#submit");
const rownumbers = document.querySelector("#rownumbers");
const phoneArea = document.querySelector("#phone");
const nameArea = document.querySelector("#name");
const balanceArea = document.querySelector("#balance");

// 发送service-worker
submit.onclick = () => {
    chrome.runtime.sendMessage({numbers: rownumbers.value.split("\n")});
};

// 接收service-worker
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    const [phone, name, balance] = request.output;
    phoneArea.value = phone;
    nameArea.value = name;
    balanceArea.value = balance;
});
