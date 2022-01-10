chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);

    // 可写成switch形式 监听所有
    // if (sender === "") {
    // do something
    // }
    if (request.from === "cc") {
        // from 不是固定词，可使用其他自定义词汇
        // do something
        console.log("haha");
    }
    // chrome.runtime.sendMessage({number: request.number + 1}, (response) => {
    //     console.log(
    //         `background -> content script infos have been received. number: ${response.number}`
    //     );
    // });

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {number: request.number + 1},
            function (response) {
                console.log(
                    `background -> content script infos have been received. number: ${response.number}`
                );
            }
        );
    });
    sendResponse({number: request.number});
});
