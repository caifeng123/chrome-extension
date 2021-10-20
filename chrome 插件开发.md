## chrome 插件开发

> Extensions are software programs, built on web technologies (such as HTML, CSS, and JavaScript) that enable users to customize the Chrome browsing experience.
>
> 扩展程序是基于 Web 技术（例如 HTML、CSS 和 JavaScript）构建的软件程序，可让用户自定义 Chrome 浏览体验。



以上是对chrome extension的官方介绍，个人开发下来理解就是：

> 插件是能通过『当前选项卡』『插件弹出页』『全局js脚本』『devtools信息』等合作通信去实现特定功能的后台程序。

### 零、前言

- chrome插件当未去了解如何开发时，听起来是个很高大上的东西，毕竟FeHelper既好用又强大(看源码后发现居然是几年前一位离职百度大哥写的着实鸡冻了一下)。
- 当看文档学习时，发现官网文档写的着实有些难懂但还是啃下来一点（主要是技术菜），在此记录下开发时的磕磕绊绊和开发笔记~
- 需要注意的是，在2021年9月23日 发布下图时间线全力推manifest V3 ，与时俱进的前端人肯定要学就学最新的！（V2将不支持）

![img](https://raw.githubusercontent.com/caifeng123/pictures/master/zXdU3hdkj1K0Ks6tAfB4-20211019144637044.png)

- 全文将由以下几部分组成
  - 插件基本组成结构与介绍
  - 基本组成间的通信方式
  - **跨域**请求解决【终于能在后端面前挺直腰板】
  - 实战！写一个爬虫插件
  - 遇到的各种坑 ಥ_ಥ

### 一、插件基本组成结构与介绍

![显示内容脚本和父扩展之间的通信路径](https://raw.githubusercontent.com/caifeng123/pictures/master/466ftDp0EXB4E1XeaGh0.png)

#### 1、`manifest.json`

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



#### 2、`service_worker(background.js)`

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



#### 3、`content_script`

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



#### 4、`popup`

运行于弹窗的html显示 & js脚本

![image-20211019151457292](https://raw.githubusercontent.com/caifeng123/pictures/master/image-20211019151457292.png)

#### 5、`Option`

> Just as extensions allow users to customize the Chrome browser, the [options page](https://developer.chrome.com/docs/extensions/mv3/options/) enables customization of the extension. Options can be used to enable features and allow users to choose what functionality is relevant to their needs.
>
> 正如扩展程序允许用户自定义 Chrome 浏览器一样，[选项页面](https://developer.chrome.com/docs/extensions/mv3/options/)支持扩展程序的自定义。选项可用于启用功能并允许用户选择与其需求相关的功能。

![Embedded options](https://raw.githubusercontent.com/caifeng123/pictures/master/AW1YkMTrWYUNmtTaRM0q.png)

- 可配置式，开关功能，让用户自行选择想使用的功能



#### 6、`DevTools`

>A DevTools extension is structured like any other extension: it can have a background page, content scripts, and other items. In addition, each DevTools extension has a DevTools page, which has access to the DevTools APIs.
>
>DevTools 扩展的结构与任何其他扩展一样：它可以有一个背景页面、内容脚本和其他项目。此外，每个 DevTools 扩展都有一个 DevTools 页面，可以访问 DevTools API。

![Architecture diagram showing DevTools page communicating with the        inspected window and the background page. The background page is shown        communicating with the content scripts and accessing extension APIs.        The DevTools page has access to the DevTools APIs, for example, creating panels.](https://raw.githubusercontent.com/caifeng123/pictures/master/kcLMpTY6qtez03TVSqt4.png)

每次打开 DevTools 窗口时，都会创建一个扩展的 DevTools 页面实例。DevTools 页面在 DevTools 窗口的整个生命周期内都存在。DevTools 页面可以访问 DevTools API 和一组有限的扩展 API。



① *能嵌入我们自定义的页面（html/表达式）到devtools中的 elements & sources两个面板中*

![image-20211020151945359](https://raw.githubusercontent.com/caifeng123/pictures/master/image-20211020151945359.png)

![image-20211020153003240](https://raw.githubusercontent.com/caifeng123/pictures/master/image-20211020153003240.png)

- 依靠的是 `chrome.devtools.panels` 下的`sources.createSidebarPane / elements.createSidebarPane`。能分别在 sources和elements标签页下新建siderbar

- 有两种方式嵌入siderbar内容 

  - `sidebar.setPage("element.html");`

  - `sidebar.setExpression("(() => {return {a:1}})()", '显示a的属性');`

  - 需要注意的是 两者只会生效一个

    |               | 入参                                      | 注意点                                           |
    | ------------- | ----------------------------------------- | ------------------------------------------------ |
    | setExpression | string -> 会将表达式以js方式嵌入          | 需要将方法写成字符串形式，window对象指向当前页面 |
    | setPage       | string -> url专门写一个html给siderbar显示 | window对象指向特定html，无法获取页面window与dom  |

    

```js
// [devtools].js
chrome.devtools.panels.elements.createSidebarPane(
	"element pannel",
	(sidebar) => {
		sidebar.setExpression("(() => {return {a:1}})()");
	}
);

chrome.devtools.panels.sources.createSidebarPane(
	"sources pannel",
	(sidebar) => {
		sidebar.setPage("sources.html");
	}
);
```



点击查看 [源码库](https://github.com/caifeng123/chrome-extension) devtoolsPanel demo ~~~



### 二、基本组成间的通信方式

![组件间关系图](https://raw.githubusercontent.com/caifeng123/pictures/master/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(2).png)

| JS种类          | 可访问的API                                    | DOM访问情况      |    JS访问情况    | 直接跨域 |
| --------------- | ---------------------------------------------- | ---------------- | :--------------: | :------: |
| injected script | 和普通JS无任何差别，不能访问任何扩展API        | 可以访问         |     可以访问     |  不可以  |
| content script  | 只能访问 extension、runtime等部分API           | 可以访问         |      不可以      |  不可以  |
| popup js        | 可访问绝大部分API，除了devtools系列            | 不可直接访问     |      不可以      |   可以   |
| background js   | 可访问绝大部分API，除了devtools系列            | 不可直接访问     |      不可以      |   可以   |
| devtools js     | 只能访问 devtools、extension、runtime等部分API | 可以访问devtools | 可以访问devtools |  不可以  |

#### 1、content script与service worker/popup的通信

和 `content script` 有关的通信 

- 使用 `chrome.runtime.sendMessage` 发送信息
- 使用 官网的~~`chrome.runtime.onMessage.addListener `~~ 方法会出现问题，使用 `chrome.tabs.sendMessage`接收监听信息 

下面来看demo 【content script&service worker】 - 将会出现常见问题，拉到最下侧

```js
// -----[content script].js-----
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

// -----[service worker].js-----
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



#### 2、popup与service worker的通信

> 当只有一对一关系时，可使用万能的`chrome.runtime.sendMessage` & `chrome.runtime.sendMessage`

```js
// -----[popup].js-----
document.querySelector("#button").addEventListener("click", () => {
	const val1 = document.querySelector("#input1").value || "0";
	const val2 = document.querySelector("#input2").value || "0";
	chrome.runtime.sendMessage({val1, val2}, (response) => {
		document.querySelector("#ans").innerHTML = response.res;
	});
});

// -----[service worker].js-----
const dealwithBigNumber = (val1, val2) => BigInt(val1) * BigInt(val2) + "";
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	const {val1, val2} = request;
	sendResponse({res: dealwithBigNumber(val1, val2)});
});

```

tips: 在v2版本中能通过 `chrome.extension.getBackgroundPage()` 获取到background.html的`window`对象，但在v3版本改用`service worker`后将不再适用。

#### 3、popup与content script的通信

> 本demo中引用了jquery，想看怎么操作的请看 [源码](https://github.com/caifeng123/chrome-extension) ~~

```js
// -----[content script].js-----
// 接收popup数据并修改dom
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	// document.querySelector("body").style.setProperty("background", request.color);
	$("body").css("background", request.color);
	sendResponse({name: 1});
});


// -----[popup].js-----
// 获取当前tab标签
const getCurrentTab = async () => {
	let queryOptions = {active: true, currentWindow: true};
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
};

$("#background").paigusu({color: "#1926dc"}, async (event, obj) => {
	$("#info").innerHTML = "修改中";
	$("#show").css("background", "#" + obj.hex);
	const tab = await getCurrentTab();
	await chrome.tabs.sendMessage(tab.id, {color: "#" + obj.hex});
	$("#info").innerHTML = "修改成功";
});

```

#### 4、devtools与content script通讯

> 同1 content script与service worker/popup的通信

​	1对多通信 使用chrome.tabs去找对应页面

#### 5、devtools与popup通讯

> 同2  content script与service worker/popup的通信

​	1对1通信 使用chrome.runtime 一把嗦

### 三、开发『小爬』插件

> 页面爬虫的几个功能展示

1、获取所有页面中可下载文件

2、按文件类型显示文件不同图标与信息

3、点击按钮下载

![image-20211020145945029](https://raw.githubusercontent.com/caifeng123/pictures/master/image-20211020145945029.png)

> 由于b站很坑爹，换了格式，下载后的需要修改后缀名为.mp4即可

![image-20211020150018081](https://raw.githubusercontent.com/caifeng123/pictures/master/image-20211020150018081.png)

![image-20211020150032157](https://raw.githubusercontent.com/caifeng123/pictures/master/image-20211020150032157.png)



#### 1、开发工具

> 作为框架砖王【天天在框架上搬砖】，那肯定要先适用我们的react框架啦~
>
> 注意：
>
> - 由于react是单页面应用，最后生成的页面也只有一个 - index.html。但在上面已经提到过多次，会有很多其他的html（e.g. devtools.html、popup.html等）
>
>   因此，单个html不再满足我们的需求
>
>   - 可以通过多个项目 去生成打包好后，重命名+组合在一个文件夹下
>   - 但对于一些html开发量实际很小 无需使用框架，在本项目中，我们将最需要展示的popup作为主体使用react开发，其他直接存在public文件夹中，因为不会被编译修改

![image-20211020153128918](https://raw.githubusercontent.com/caifeng123/pictures/master/image-20211020153128918.png)

- 对于react开发插件

1、替换manifest内容 为chrome格式

```json
{
	"name": "小爬",
	"description": "小爬不是爬",
	"version": "1.0",
	"manifest_version": 3,
	"action": {
		"default_popup": "index.html"
	},
	"permissions": ["scripting"],
	"devtools_page": "devtools.html",
	"host_permissions": ["http://*/*", "https://*/*"],
	"content_scripts": [
		{
			"matches": ["<all_urls>"],
			"js": ["content-script.js"]
		}
	]
}
```

2、public中index.html中的css与js只能通过src引入方式 不能写成inline形式

![image-20211020154825527](https://raw.githubusercontent.com/caifeng123/pictures/master/image-20211020154825527.png)

> 特地去了解了一下,为什么谷歌想内容安全策略（CSP）为什么不希望使用内联方式书写js
>
> 简单来说CSP 的主要功能有两个：
>
> - 阻止不可信的数据被提升为可信的数据（比如页面被插入了一张来自第三方的图片）
> - 阻止不可信的数据被提升为可信的程序（比如页面被插入了来自第三方的 script）
>
> 因此，若是通过引用形式引入script即 src方式 `<script src="popup.js"></script>` 表示信任popup.js，运行其对应的js
>
> 但对于一些`<script>alert(1)</script>` 最简单的xss攻击就出现了，用户可以自由修改script并且被运行，十分不安全。

*解决方式：修改打包方式*

```json
	"scripts": {
		"start": "react-scripts start",
		"build": "INLINE_RUNTIME_CHUNK=false  react-scripts build",
		"test": "react-scripts test",
		"eject": "react-scripts eject"
	},
```



#### 2、代码分析

- 首当其冲，需要获取页面的网络请求

  通过 `chrome.devtools.network.onRequestFinished` 获取所有请求的数据，并处理

- 对处理好的数据需要交给 popup.html显示

  需要用到 devtools和 popup 的通信

- popup接收到对应的下载操作后，将请求地址发送给 content script

  因为当前页面重复发送相同请求，依旧是白名单，不会出现跨域，直接在`content script`再次发送下载请求即可

#### 3、代码

请看 [源码库](https://github.com/caifeng123/chrome-extension) 的 pageSources demo ~~~



### 四、开发浏览器『yarn』插件

#### 1、功能

可以通过 yarn 函数，直接安装网络上的包，在控制台调试，当页面关闭即销毁，不会对内存增大负担

```js
//e.g. 当我要下载lodash 做demo时

yarn("lodash.js");
_.isEmpty({}); // true
```

![image-20211020142425941](https://raw.githubusercontent.com/caifeng123/pictures/master/image-20211020142425941.png)



#### 2、开发原因

由于lodash库一直无法线上测试【毕竟方法太多，具体用法记也记不住，文档得配上实操！】就想编写一个插件能够在控制台调试lodash中的各种方法



#### 3、代码分析

- 起初设想：

  ​	因为打开的是console控制台，想要通过devtools进行安装调试，但当要向window对象挂载yarn函数时，发现怎么也挂不上，之后才发现，对于devtools.js中的window实际上挂载到devtools.html的window上了，并不是我们实际界面中的window。

- 中期设想：

  ​	由于要和当前页面交互，立马想到应当使用`content script` => 这个对应单个选项卡，既能访问当前页面又能直接console打印。因此只需将操作迁移到`content script`即可。

  ​	然鹅~~还是不行，原来学艺不精`content script`仅能共用dom结点，但无法共用window对象

- 最终解决：

  ​	通过查询最终找到解决方法http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script，利用注入脚本的形式，将挂载函数脚本直接以script形式注入到页面中即可。

#### 4、代码

请看 [源码库](https://github.com/caifeng123/chrome-extension) 的 yarn demo ~~~



### 五、常见问题

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



2、jquery的使用

> 对于原生开发，jquery无疑是最好用的工具

![preview](https://raw.githubusercontent.com/caifeng123/pictures/master/v2-d6281f9eae238597d7c3eef15171d4fa_r.jpg)

当通过jquery注入页面中时需要注意的是

- 对于popup需要在 popup.html中引入js
- 对于content script.js 需要在manifest.json上引入 上面有提到过





