//const params = {current: 1, pageSize: 20};

//const url = `https://upos-sz-mirrorkodoo1.bilivideo.com/upgcxcode/35/60/59186035/59186035-1-30033.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1633753649&gen=playurlv2&os=kodoo1bv&oi=3031039367&trid=e679fbc24b1f440ea71817f687683775u&platform=pc&upsig=dbffb0946150522e9df58af42e8a50dc&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,platform&mid=0&bvc=vod&nettype=0&orderid=0,3&agrr=1&logo=80000000`;

// fetch(
// 	"https://mock.mengxuegu.com/mock/614af0471d03800abd3ef506/example/getheat?" +
// 		new URLSearchParams(params)
// )

// console.log(111);
// // const url = "https://xy60x168x106x126xy.mcdn.bilivideo.cn:4483/upgcxcode/35/60/59186035/59186035_da2-1-30280.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1633751594&gen=playurlv2&os=mcdn&oi=3031039367&trid=0001b624e4c2bdd745689593a59f4a3f42bbu&platform=pc&upsig=7e51df89d9789f53c81f062c67a3b40a&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,platform&mcdnid=11000026&mid=0&bvc=vod&nettype=0&orderid=0,3&agrr=0&logo=A0000400"
const url =
	"https://upos-sz-mirrorkodoo1.bilivideo.com/upgcxcode/56/60/59186056/59186056_nb2-1-30080.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1633773105&gen=playurlv2&os=kodoo1bv&oi=3031039367&trid=699c8ab79f874400a4939df0c96fa258u&platform=pc&upsig=992485ac8a833c4704cd57ecd2f5f720&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,platform&mid=62522208&bvc=vod&nettype=0&orderid=0,3&agrr=1&logo=80000000";
fetch(url).then((res) =>
	res.blob().then((blob) => {
		var a = document.createElement("a");
		var url = window.URL.createObjectURL(blob);
		var filename = "myfile.mp4";
		a.href = url;
		a.download = filename;
		a.click();
		window.URL.revokeObjectURL(url);
	})
);
chrome.runtime.onMessage.addListener((e) => console.log(e));
// 请求//https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/56/60/59186056/59186056-1-30077.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1633773105&gen=playurlv2&os=coso1bv&oi=3031039367&trid=699c8ab79f874400a4939df0c96fa258u&platform=pc&upsig=d00c88c6d541a4ae95b9600a49cba73f&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,platform&mid=62522208&bvc=vod&nettype=0&orderid=0,3&agrr=1&logo=80000000
// 改头//https://upos-sz-mirrorkodoo1.bilivideo.com/upgcxcode/56/60/59186056/59186056-1-30077.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1633773105&gen=playurlv2&os=coso1bv&oi=3031039367&trid=699c8ab79f874400a4939df0c96fa258u&platform=pc&upsig=d00c88c6d541a4ae95b9600a49cba73f&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,platform&mid=62522208&bvc=vod&nettype=0&orderid=0,3&agrr=1&logo=80000000
// 类似//https://upos-sz-mirrorcoso1.bilivideo.com/upgcxcode/56/60/59186056/59186056-1-30077.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1633773105&gen=playurlv2&os=coso1bv&oi=3031039367&trid=699c8ab79f874400a4939df0c96fa258u&platform=pc&upsig=d00c88c6d541a4ae95b9600a49cba73f&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,platform&mid=62522208&bvc=vod&nettype=0&orderid=0,3&agrr=1&logo=80000000
// https://upos-sz-mirrorcoso1.bilivideo.com/upgcxcode/56/60/59186056/59186056-1-30077.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1633773105&gen=playurlv2&os=coso1bv&oi=3031039367&trid=699c8ab79f874400a4939df0c96fa258u&platform=pc&upsig=d00c88c6d541a4ae95b9600a49cba73f&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,platform&mid=62522208&bvc=vod&nettype=0&orderid=0,3&agrr=1&logo=80000000

// 可得//https://upos-sz-mirrorkodoo1.bilivideo.com/upgcxcode/56/60/59186056/59186056_nb2-1-30080.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1633773105&gen=playurlv2&os=kodoo1bv&oi=3031039367&trid=699c8ab79f874400a4939df0c96fa258u&platform=pc&upsig=992485ac8a833c4704cd57ecd2f5f720&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,platform&mid=62522208&bvc=vod&nettype=0&orderid=0,3&agrr=1&logo=80000000
