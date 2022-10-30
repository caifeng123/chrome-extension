const getStr = (obj) =>
    Object.keys(obj)
        .reduce((all, temp) => {
            return `${all}${temp}=${obj[temp]}&`;
        }, "")
        .slice(0, -1);

const getData = (phone) =>
    fetch(
        "https://service.sh.189.cn/service/recharge/queryinfo.do?0.7052432750495374",
        {
            method: "POST",
            body: getStr({
                account: phone,
                paytype: "02",
            }),
            headers: {
                accept: "application/json, text/javascript, */*; q=0.01",
                "accept-language": "zh-CN,zh;q=0.9,eu;q=0.8",
                "content-type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua":
                    '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"macOS"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
            },
            referrer: "https://service.sh.189.cn/service/pay/charge",
            referrerPolicy: "strict-origin-when-cross-origin",
            mode: "cors",
            credentials: "include",
        }
    )
        .then((res) => res.json())
        .then((res) => res.RESULT);

const getOutput = async (numbers) => {
    const list = [];

    for (let i = 0; i < numbers.length; i += 4) {
        list.push(numbers.slice(i, i + 4));
    }

    return await list.reduce(
        async (all, temp, ind) => {
            let [phone, name, balance] = await all;
            const tempArr = await Promise.allSettled(temp.map(getData));
            console.log(tempArr);
            tempArr.forEach(({value}, index) => {
                phone += `${numbers[ind * 4 + index]}\n`;
                name += `${value.custName}\n`;
                balance += `${value.balance}\n`;
            });
            return [phone, name, balance];
        },
        ["", "", ""]
    );
};

// 接收popup
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    const output = await getOutput(request.numbers);
    chrome.runtime.sendMessage({output});
});
