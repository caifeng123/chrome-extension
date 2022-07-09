const headers = new Headers();
headers.append("Host", "mall.meituan.com");
headers.append(
    "User-Agent",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat"
);
headers.append("content-type", "application/json");
headers.append(
    "mp-mtgsig",
    '{"a1":"1.0","a2":1649906343797,"a3":"1649906150388OCGEWKQ2da990bd5a94323009231c9daca9db893404","a4":"8699f76935b93dfc1e6c84cbe9f5a4f0a71e1506cd25239f","a5":"J+rYuCLHUlrfb+RM+paLC7rOK2gsQOvPDMWp/lA5lKGMIY/Y0xOpY+nEjpgqfU1w7irE1DHupGBL8Y9FSYnTEMcY8+gD+ARcYeR9fMuKXJoa04AoILZbEqw7R2q+I5spv+iOKCKAssV6a0PQki1aCbiNRCPSVO9M/yk+09UkE/pEbBBxBEQszTAj/vm5kqF/PNZcbg9QZ5RTgBcuiJr9zSGFy1Fo87kqbFPouTRquW4+Ow/nf2ZGjduL9OkapDRe8CG=","a6":"w1.0x/EmToheucLoq9OauudFBjTkvN+7rzVV2rsUI0JhkIsyBAkIG1OxmPYITm5Pge7xuPE9k1FPMg3YwNJTWNT/utfEri+M8cFi/UzsJmhU+OninCZXXD+1HmDfbhzo9KIwfpFidrLpcLlVckguXe+Nb29Lt/5t18lir9rzJk3wd0/N8QrPMr3+r/kMYd3wUnELRTns2qEZsuTkCqGv4F0Cdp6QHrEMjLfDT2wrY//dfTMien2BU/HgR3PukU1y9PvTYSlT1zEqOfuKYCQHl30vsw+BD92uf9C/ajMiokCgnrBGcG+Gfzea2vyNiPIyYrCnZIGIuQ6LPOy3HyJn6xTNY2199DSSrPrV5De1SxXYYLUOvgxPEjqboSal9qyI/gEOxDPgBPNZ8tYrhh0pAhXDevjtiu7F75igqarU2ghfV98AJyzgxL1G0gPfj3Xaa13VjtmRbmZIyWtaEeRHv8MnlA3kmd8nWETjdzDNtbg304I=","a7":"wx92916b3adca84096"}'
);
headers.append("openId", "oV_5G48PiG1bZnU1sVg5LODB0iLI");
headers.append(
    "openIdCipher",
    "AwQAAABJAgAAAAEAAAAyAAAAPLgC95WH3MyqngAoyM/hf1hEoKrGdo0pJ5DI44e1wGF9AT3PH7Wes03actC2n/GVnwfURonD78PewMUppAAAADiTbwWu3kc10hyPrBclxAl+Pk9d8v2sbH0v1BqcctplkdwkVcB+NMjSamWR5C5UQH1JXMFOkTd50Q=="
);
headers.append("req_of_maicai", "1");
headers.append(
    "t",
    "bbbqr0hYW7FEaxAzT6BmhdRZbvwAAAAAVhEAACStUfTBDV3dlgbpUKMyHgYl11yHrBOOnOboK9iIS7lCnxviWtDRq0vpCeEjzToc-A"
);
headers.append("traceids", "8faee271");
headers.append(
    "Referer",
    "https://servicewechat.com/wx92916b3adca84096/227/page-frame.html"
);

const body = JSON.stringify({
    fromPoiId: 0,
    allowZeroPay: true,
    poiId: 10000169,
    cityId: 1,
    couponIds: [-1],
    addressId: null,
    actionSelect: 0,
    fromSource: 0,
    isUseCard: false,
    shippingType: -1,
    selfLiftingMobile: "",
    longitude: 121.4737,
    latitude: 31.23037,
});

const requestOptions = {
    method: "POST",
    headers,
    body,
    redirect: "follow",
};

// ============== 控制器类 ================
class IntervalControl {
    constructor(obj = {}){
        this.checked = obj.checked ?? false;
        this.longitude = obj.longitude ?? '121.440876';
        this.latitude = obj.latitude ?? '31.260326';
    }

    // 告知当前显示页content-script触发提示
    sendFailMsg = fail => {
        console.log(fail)
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {fail, target: "detail"});
        });
    };

    setVal = obj => {
        this.checked = obj.checked ?? this.checked;
        this.longitude = obj.longitude ?? this.longitude;
        this.latitude = obj.latitude ?? this.latitude;
    }

    // 对外暴露修改值，并启动/停止最新轮询
    onChange = obj => {
        this.checked = obj.checked ?? this.checked;
        this.longitude = obj.longitude ?? this.longitude;
        this.latitude = obj.latitude ?? this.latitude;

        this.checked ? this.start() : this.stop();
   }
    
    // 启动轮询
    start = () => {
        this.stop();
        this.interval = setInterval(() => {
            fetch(
                `https://mall.meituan.com/api/c/mallorder/preview?uuid=1802611ebe4c8-aa763b48f0d7b-0-4a920-1802611ebe4c8&xuuid=1802611ebe4c8-aa763b48f0d7b-0-4a920-1802611ebe4c8&__reqTraceID=450af8e2-2e93-3bf5-6588-ebdad574a2c8&platform=android&utm_medium=wxapp&brand=xiaoxiangmaicai&tenantId=1&homepageLng=${this.longitude}&homepageLat=${this.latitude}&utm_term=5.32.6&isBlankPage=1&poi=10000169&stockPois=10000169&ci=1&bizId=2&openId=oV_5G48PiG1bZnU1sVg5LODB0iLI&sysName=Windows&sysVerion=10&app_tag=union&uci=1&userid=2482771362`,
                requestOptions
            )
                .then((response) => response.json())
                .then((result) => {
                    console.log("res", result);
                    if (!result.error) {
                        // 告知当前显示页content-script经纬度是否填写有误
                        if(result.reason === "Unmatch_reqSig"){
                            this.sendFailMsg(true);
                            this.stop();
                        }else{
                            this.sendFailMsg(false);
                        }
                    }
                })
                .catch((error) => console.log("error", error));
        }, 15000);
    };

    // 停止轮询
    stop = () => {
        clearInterval(this.interval);
        this.interval = null;
    };
}

// service-worker就一个 仅仅只会生成一个控制器
const intervalControl = new IntervalControl();
chrome.storage.sync.get(['checked', 'longitude', 'latitude'], intervalControl.setVal);

// 监听storage变化
chrome.storage.onChanged.addListener((changes, area) => {
    console.log(111);
    let temp = {};
    for(let item in changes) {
        temp[item] = changes[item].newValue
    }
    intervalControl.onChange(temp);
});

// 监听信息接受
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // service-worker - 请求成功提示
    if(request.target === 'init') {
        intervalControl.checked && !intervalControl.interval && intervalControl.start();
    }
    sendResponse({});
});