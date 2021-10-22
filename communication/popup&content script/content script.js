chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request)
    $('body').css('background',request.color)
});
