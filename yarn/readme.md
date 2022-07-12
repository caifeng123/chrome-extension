# 插件使用指南

## 目的

可以通过 yarn 函数，直接安装网络上的包，在控制台调试，当页面关闭即销毁，不会对内存增大负担

```js
//e.g. 当我要下载lodash 做demo时
yarn。("lodash.js");
_.isEmpty({}); // true
```

![](https://raw.githubusercontent.com/caifeng123/pictures/master/2022-07-12-11-02-37-image.png)

## 编码过程

#### 原因：

由于lodash库一直无法线上测试【毕竟方法太多，具体用法记也记不住，文档得配上实操！】就想编写一个插件能够在控制台调试lodash中的各种方法

#### 编码：

使用类易于存储状态，可以更好扩展对包的管理。可以自行扩展编写查询安装卸载操作！

![](https://raw.githubusercontent.com/caifeng123/pictures/master/2022-07-12-10-59-22-image.png)

可使用私有变量，对外暴露更少的信息，给用户以干净简洁感。
