# 文档体系

## 目录结构

软件手册是一部完整的书，建议采用下面的目录结构。

- **简介**（Introduction）： [必备] [文件] 提供对产品和文档本身的总体的、扼要的说明
- **快速上手**（Getting Started）：[可选] [文件] 如何最快速地使用产品
- **入门篇**（Basics）： [必备] [目录] 又称”使用篇“，提供初级的使用教程
  - **环境准备**（Prerequisite）：[必备] [文件] 软件使用需要满足的前置条件
  - **安装**（Installation）：[可选] [文件] 软件的安装方法
  - **设置**（Configuration）：[必备] [文件] 软件的设置
- **进阶篇**（Advanced)：[可选] [目录] 又称”开发篇“，提供中高级的开发教程
- **API**（Reference）：[可选] [目录|文件] 软件 API 的逐一介绍
- **FAQ**：[可选] [文件] 常见问题解答
- **附录**（Appendix）：[可选] [目录] 不属于教程本身、但对阅读教程有帮助的内容
  - **Glossary**：[可选] [文件] 名词解释
  - **Recipes**：[可选] [文件] 最佳实践
  - **Troubleshooting**：[可选] [文件] 故障处理
  - **ChangeLog**：[可选] [文件] 版本说明
  - **Feedback**：[可选] [文件] 反馈方式

下面是两个真实范例，可参考。

- [Redux 手册](http://redux.js.org)
- [Atom 手册](http://flight-manual.atom.io)

## 文件名

文档的文件名不得含有空格。

文件名必须使用半角字符，不得使用全角字符。这也意味着，中文不能用于文件名。

```
错误： 名词解释.md

正确： glossary.md
```

文件名建议只使用小写字母，不使用大写字母。

```
错误：TroubleShooting.md

正确：troubleshooting.md 
```

为了醒目，某些说明文件的文件名，可以使用大写字母，比如`README`、`LICENSE`。

文件名包含多个单词时，单词之间建议使用半角的连词线（`-`）分隔。

```
不佳：advanced_usage.md

正确：advanced-usage.md
```

## 排版技巧

#### 空格的使用

所有的中文字和半形的英文、数字、符号、链接之间应该插入一段间隙，这是因为挤在一起的中西文混排导致西文难以阅读，最简单的插入间隙的技巧就是使用空格，推荐使用 YDoc 插件 [ydoc-plugin-pangu](https://www.npmjs.com/package/ydoc-plugin-pangu)

查看下面的示例，会发现加入空格的段落，英文、数字、符号、链接更易读：

不加入空格的段落:YDoc是一个文档站构建工具,累计的Star数量已超过200个,官网链接为[YDoc官网](https://hellosean1025.github.io/ydoc/)欢迎大家使用

加入空格的段落: YDoc 是一个文档站构建工具, 累计的 Star 数量已超过 200 个,官网链接为 [YDoc官网](https://hellosean1025.github.io/ydoc/) 欢迎大家使用
