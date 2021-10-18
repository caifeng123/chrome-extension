## chrome 插件开发

> Extensions are software programs, built on web technologies (such as HTML, CSS, and JavaScript) that enable users to customize the Chrome browsing experience.
>
> 扩展程序是基于 Web 技术（例如 HTML、CSS 和 JavaScript）构建的软件程序，可让用户自定义 Chrome 浏览体验。



以上是对chrome extension的官方介绍，个人开发下来理解就是：

> 插件是能通过『当前选项卡』『插件弹出页』『全局js脚本』『devtools信息』等合作通信去实现特定功能的后台程序。

### 0、前言

- chrome插件当未去了解如何开发时，听起来是个很高大上的东西，毕竟FeHelper既好用又强大(看源码后发现居然是几年前一位离职百度大哥写的着实鸡冻了一下)。
- 当看文档学习时，发现官网文档写的着实有些难懂（主要是技术和英文水平菜），在此记录下开发时的磕磕绊绊和开发笔记~
- 需要注意的是，在2021年9月23日 发布下图时间线全力推manifest V3 ，与时俱进的前端人肯定要学就学最新的！（V2将不支持）

![Diagram of MV2 support timeline](https://raw.githubusercontent.com/caifeng123/pictures/master/zXdU3hdkj1K0Ks6tAfB4.png)

- 全文将由以下几部分组成
  - 插件基本组成结构与介绍
  - 基本组成间的通信方式
  - **跨域**请求解决【终于能在后端面前挺直腰板】
  - 实战！写一个爬虫插件
  - 遇到的各种坑 ಥ_ಥ

### 1、插件基本组成结构与介绍

![显示内容脚本和父扩展之间的通信路径](https://raw.githubusercontent.com/caifeng123/pictures/master/466ftDp0EXB4E1XeaGh0.png)

#### `manifest.json`

> Every extension requires a manifest, though most extensions will not do much with just the manifest.
>
> 每个扩展都需要一个manifest，尽管大多数扩展只使用清单不会做太多事情。

类似`package.json`的存在！

官网中给出[所有配置项](https://developer.chrome.com/docs/extensions/mv3/manifest/) 不会一一讲解，以下将对常见的部分配置项进行讲解。


```json
  {
  // Required - 通俗易懂
  "manifest_version": 3,
  "name": "My Extension",
  "version": "versionString",

   // 『重点』action配置项主要用于点击图标弹出框，对于弹出框接受的是html文件
  "action": {
     "default_title": "Click to view a popup",
   	 "default_popup": "popup.html"
   }
    
  // 通俗易懂
  "default_locale": "en",
  "description": "A plain text description",
  "icons": {...},
  "author": ...,

  // 『重点』下面将出现的background.js 配置service work
  "background": {
    // Required
    "service_worker": "service-worker.js",
  },

	// 『重点』下面将出现content_script.js 应用于所有页面上下文的js
  "content_scripts": [
     {
       "matches": ["https://*.nytimes.com/*"],
       "css": ["my-styles.css"],
       "js": ["content-script.js"]
     }
   ],

	// 使用/添加devtools中的功能
  "devtools_page": "devtools.html",


	/**
		* 三个permission
		* host_permissions - 允许使用扩展的域名
		* permissions - 包含已知字符串列表中的项目 【只需一次弹框要求允许】
		* optional_permissions - 与常规类似permissions，但由扩展的用户在运行时授予，而不是提前授予【安全】
		* 列出常见选项
		* {
		*		activeTab: 当扩展卡选项被改变需要重新获取新的权限
		*		tabs: 操作选项卡api（改变位置等）
		*		downloads: 访问chrome.downloads API 的权限 便于下载但还是会受到跨域影响
		*		history: history api权限
		*		storage: 访问localstorage/sessionStorage权限
		* }
		*/
  "host_permissions": ["http://*/*", "https://*/*"],
  "permissions": ["tabs"],
  "optional_permissions": ["downloads"],

	// 内部弹出可选页面 - 见fehelper操作页
  "options_page": "options.html",
  "options_ui": {
    "chrome_style": true,
    "page": "options.html"
  },
}
```



#### `service_worker(background.js)`

> The **background script** is the extension's event handler; it contains listeners for browser events that are important to the extension. It lies dormant until an event is fired then performs the instructed logic. An effective background script is only loaded when it is needed and unloaded when it goes idle.
>
> **background script**是扩展的事件处理程序; 它包含对扩展很重要的浏览器事件的侦听器。它处于休眠状态，直到触发事件，然后执行指示的逻辑。有效的后台脚本仅在需要时加载，并在空闲时卸载。



在V2版本是配置`background.html `和 `background.js`，不再过多赘述，在v3版本中，将所有脚本移动到`service worker`中

要关注两点：

- 不使用时终止，需要时重新启动（类似于事件页面）。
- 无权访问 DOM。（service worker独立于页面）

```js
chrome.runtime.onMessage.addListener((message, callback) => {
  const tabId = getForegroundTabId();
  if (message.data === "setAlarm") {
    chrome.alarms.create({delayInMinutes: 5})
  } else if (message.data === "runLogic") {
    chrome.scripting.executeScript({file: 'logic.js', tabId});
  } else if (message.data === "changeColor") {
    chrome.scripting.executeScript(
        {func: () => document.body.style.backgroundColor="orange", tabId});
  };
});
```



#### `content_script`

> Extensions that read or write to web pages utilize a **content_script**. The content script contains JavaScript that executes in the contexts of a page that has been loaded into the browser. Content scripts read and modify the DOM of web pages the browser visits.
>
> Content scripts can communicate with their parent extension by exchanging [messages](https://developer.chrome.com/docs/extensions/mv3/messaging/) and storing values using the [storage](https://developer.chrome.com/docs/extensions/reference/storage/) API.
>
> 读取或写入网页的扩展程序使用 **content_script**。内容脚本包含在已加载到浏览器的页面上下文中执行的 JavaScript。内容脚本读取和修改浏览器访问的网页的 DOM。
>
> `content_script`可以通过使用storage/message API来与扩展其他部分进行通信。

**注入方式**

- 对于`manifest.json`来说
  - 1、可以配置静态声明去注入
  - 2、可以通过编程方式注入 需要获取`activeTab`权限

```json
// manifest.json
{
 "name": "My extension",
 ...
 "content_scripts": [
   {
     // 满足matches匹配的域名
     "matches": ["https://*.nytimes.com/*"],
     // 注入css
     "css": ["my-styles.css"],
     // 注入js
     "js": ["content-script.js"],
     "run_at": "document_idle" | "document_start" | "document_end"
   }
 ],
  "permissions": [
    "activeTab"
  ],
}
```

- 对于获取了权限的`content_script`通过代码执行注入

```js
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content-script.js']
  });
});
```



#### `popup.js`

运行于弹窗的js脚本



#### `Option`

> Just as extensions allow users to customize the Chrome browser, the [options page](https://developer.chrome.com/docs/extensions/mv3/options/) enables customization of the extension. Options can be used to enable features and allow users to choose what functionality is relevant to their needs.
>
> 正如扩展程序允许用户自定义 Chrome 浏览器一样，[选项页面](https://developer.chrome.com/docs/extensions/mv3/options/)支持扩展程序的自定义。选项可用于启用功能并允许用户选择与其需求相关的功能。

![Embedded options](https://raw.githubusercontent.com/caifeng123/pictures/master/AW1YkMTrWYUNmtTaRM0q.png)

- 可配置式，开关功能，让用户自行选择想使用的功能

### 2、基本组成间的通信方式

![组件间关系图](https://raw.githubusercontent.com/caifeng123/pictures/master/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(2).png)

|                | 运行环境                                           | 数量   |    可操作dom     | 可跨域 |
| -------------- | -------------------------------------------------- | ------ | :--------------: | :----: |
| content script | 匹配的页面（通过对匹配页面的注入不同的 `js\css` ） | [0, n] |        ✓         |   ×    |
| service worker | 运行与浏览器背后                                   | [0, 1] |        ×         |   ✓    |
| popup          | 运行于 弹出框页面                                  | [0, 1] | 仅操作popup的dom |   ×    |
|                |                                                    |        |                  |        |

#### content script与service worker/popup的通信

和 `content script` 有关的通信 

- 使用 `chrome.runtime.sendMessage` 发送信息
- 使用 官网的~~`chrome.runtime.onMessage.addListener `~~ 方法会出现问题，使用 `chrome.tabs.sendMessage`接收监听信息 

下面来看demo 【content script&service worker】 - 将会出现常见问题，拉到最下侧

```js
// [content script].js
// 监听接收信息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	// 可写成switch形式 监听所有
	if (sender === "") {
		// do something
	}
	if (request.from === "cc") {
		// from 不是固定词，可使用其他自定义词汇
		// do something
	}
  // 发送回传
	sendResponse({number: request.number});

	// 修改dom
	document.querySelector("#s-usersetting-top").innerText = request.number;

	// 重发信息
	chrome.runtime.sendMessage({number: request.number + 1}, (response) => {
		console.log(
			`content script -> background infos have been received. number: ${response.number}`
		);
	});
});

// [service worker].js
// 监听消息接收
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	// 不能使用这种方式 使用下面tabs的方式，详见最下面常见问题
  // chrome.runtime.sendMessage({number: request.number + 1}, (response) => {
	// 	console.log(
	// 		`background -> content script infos have been received. number: ${response.number}`
	// 	);
	// });

	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id,{number: request.number + 1},(response) => {
				console.log(
					`background -> content script infos have been received. number: ${response.number}`
				);
		});
	});
  // 消息回传
	sendResponse({number: request.number});
});

```



#### popup与background的通信



#### popup与content script的通信

#### 



开发『可下载文件预览』插件

1、获取所有页面中可下载文件

2、按文件类型显示文件不同图标与信息

3、点击按钮下载







react开发插件

1、替换manifest内容 为chrome格式

2、public中index.html中的css与js只能通过src引入方式 不能写成inline形式

3、正常打包

4、加载插件



### 、常见问题

通信问题最为多！官网也很不清楚，全靠翻找git issues

1、最常见通信api`chrome.runtime.onMessage.addListener` & `chrome.runtime.sendMessage`

> 往往在选择通信时 会最省事的使用这俩 一发一收，使用不当还是会出bug，最关键是报错信息并不能帮到你

```js
// 1.js 用来发送，后者回调函数，
chrome.runtime.sendMessage({from: "content script.js"}, (response) => {
	console.log("content script -> background infos have been sended2");
});
```

```js
// 2.js 用来接收
chrome.runtime.onMessege.addListener(function(request, sender, sendResponse) {
  // 可写成switch形式 监听所有
	if(sender === ''){
  	// do something
  }
  if(request.from === 'cc'){ // from 不是固定词，可使用其他自定义词汇
  	// do something
  }
})
```

>  此时1的devtools会报错，

- 1.发现因为接收函数缺少书写 sendResponse

- 2.对于 content script 可能有多个，service_worker 只有一个，所以service_worker需要告知是对应哪个tab下的content script

  - 使用tab去发送信息

  ```js
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
   		chrome.tabs.sendMessage(tabs[0].id, {from: "background.js"}, response => {
   				console.log("background -> content script infos have been sended");
    	}
  )});
  ```

  

![image-20211018110326570](https://raw.githubusercontent.com/caifeng123/pictures/master/image-20211018110326570.png)

