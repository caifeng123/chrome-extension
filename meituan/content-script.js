chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // service-worker - 请求成功提示
    if(request.target === 'detail') {
        if(request.fail){
            alert('经纬度填写有误！！')
        }else{
            const audio = document.createElement('audio');
            audio.src = "https://w3school.com.cn/i/horse.ogg";
            audio.play();
        }
    }
    sendResponse({});
});

// 启动告知service执行
chrome.runtime.sendMessage({target: 'init'});
