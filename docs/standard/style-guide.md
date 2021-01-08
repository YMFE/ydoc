# 设计规范

## YDoc 项目设计规范

YDoc 的设计稿经过设计师的几度推敲重做，诞生了现在你看到的默认主题 🤓，YDoc 有如下设计理念：

- 💃 青春：使用大胆、活泼的配色方案，体现 [YMFE 团队](https://ymfe.org/) 的产品文化
- 🤗 科学：以科学的态度对待视觉设计、功能设计，让设计有迹可循
- 🤔 简洁：以 `无形` 代替 `有形`，从 UI 到开发体验，不断去除冗余的设计，使用户专注于写作与阅读

以下是 YDoc 设计过程中总结的一些规则，这些可以帮助你构建优美的文档页面：

### 图片

- 禁止使用未经压缩处理的图片
- 使用图片的原始高宽比，禁止手动调整高宽比
- 在高清屏幕请使用2倍/3倍图，防止图像模糊

### 排版

- 文档正文使用 16px 字号，但默认字号为 14px，这是为了增强正文部分的阅读体验 
- 请限制每行文字的宽度(行宽)，以一行 __40-60__ 字为宜：
  - 行宽过短，用户需要频繁移动视线，影响阅读连贯性
  - 行宽过长，容易视觉疲劳，用户很难专注于一行文本阅读，从大段文字中找到下一行变得更困难
> 行宽的设计参考 [Readability: the Optimal Line Length](https://baymard.com/blog/line-length-readability)

<span style="color: #ff4f5f;">YDoc 正文排版经历过精心设计，不建议用户修改正文排版</span>

### 项目规范文件

YDoc 继承自 [Youth Design](https://ued.qunar.com/youth-design/)。

现在将 YDoc 的LOGO、色彩、排版等规范提供给大家，希望能给大家在自定义样式或定制主题的时候提供一些帮助：

<div class="filebox">
  <div class="item" onclick="window.open('https://github.com/YMFE/ydoc/releases/download/v4.0.0/ydoc-design-sketch.zip')">
    <!-- <img src="" alt="" /> -->
    <h4 class="title">YDoc 项目设计规范</h4>
    <p>YDoc 规范 sketch 文件</p>
  </div>
  <div class="item" onclick="window.open('https://github.com/YMFE/ydoc/releases/download/v4.0.0/ydoc-logo.zip')">
    <!-- <img src="" alt="" /> -->
    <h4 class="title">YDoc LOGO</h4>
    <p>Logo sketch 文件</p>
  </div>
</div>