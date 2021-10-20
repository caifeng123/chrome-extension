# 插件使用指南

## 目的

可以通过 yarn 函数，直接安装网络上的包，在控制台调试，当页面关闭即销毁，不会对内存增大负担

```js
//e.g. 当我要下载lodash 做demo时
yarn("lodash.js");
_.isEmpty({}); // true
```

![image-20211020142425941](https://raw.githubusercontent.com/caifeng123/pictures/master/image-20211020142425941.png)

## 编码过程【遇到的坑】

#### 原因：

由于lodash库一直无法线上测试【毕竟方法太多，具体用法记也记不住，文档得配上实操！】就想编写一个插件能够在控制台调试lodash中的各种方法

#### 编码：

- 起初设想：

  ​	因为打开的是console控制台，想要通过devtools进行安装调试，但当要向window对象挂载yarn函数时，发现怎么也挂不上，之后才发现，对于devtools.js中的window实际上挂载到devtools.html的window上了，并不是我们实际界面中的window。

- 中期设想：

  ​	由于要和当前页面交互，立马想到应当使用`content script` => 这个对应单个选项卡，既能访问当前页面又能直接console打印。因此只需将操作迁移到`content script`即可。

  ​	然鹅~~还是不行，原来学艺不精`content script`仅能共用dom结点，但无法共用window对象

- 最终解决：

  ​	通过查询最终找到解决方法http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script，利用注入脚本的形式，将挂载函数脚本直接以script形式注入到页面中即可。



