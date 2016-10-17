# Demo 使用说明

## 运行方式

iOS：用 `xcode` 打开 ios 目录中工程，直接运行即可。

* Trick1：`RCTDevMenu.m` 中注释了快捷键的功能，可以在本地使用时自己开启。
* Trick2：`QRCTDevManager.m` 中设置了核心js包走的是压缩包，而不是本地的，开发的时候可以改一下方便调试基础组件。

## Example的格式

example格式分为两种：

* 不带subtitle，一个页面只有一个example的（TabBar）
* 带subtitle的，有多个的（Slider、ProgressView）

第一种和第二种的配置区别是：examples数组里只有一个元素，且不带subtitle

```
Example:

// 第一种
{
    title: 'xxx', // pageDemo
    scroll: false, // 默认false，容器是否需要滚动
    examples: [{
        render: () => {
            return <Something/>
        },
    }]
}

// 第二种
{
    title: 'xxx', // pageDemo
    scroll: true, // 默认false，容器是否需要滚动
    examples: [{
        subtitle: 'xxx-1', // 每块example的title
        render: () => {
            return <Something/>
        },
    }, {
        subtitle: 'xxx-2', // 每块example的title
        render: () => {
            return <Something/>
        },
    }]
}

```
