
chrome.contextMenus.create({
    id: "read",
    title: "不会读了吧，爷来教你怎么读",
    contexts: ['all']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {}
        );
    });
})

