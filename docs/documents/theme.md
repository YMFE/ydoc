# 主题
YDoc 提供了简单易用强大的自定义主题功能。

## 安装

1.假设要安装 demo 主题，请执行以下命令：
```bash
npm install --save-dev ydoc-theme-demo
```
或者
```bash
ydoc theme ydoc-theme-demo
```

2.然后在 ydoc.json 配置：

```json
{
  "theme": "demo"
}
```

## 自定义主题

### 新建主题

1.在根目录下创建 theme 文件夹，然后创建对应的 theme 文件夹，比如 ydoc-theme-demo, 在文件夹下写对应的主题

2.然后在 ydoc.json 配置：

```json
{
  "theme": "demo"
}
```

### 基于已有主题定制

1.在项目根目录下执行以下命令：
```bash
ydoc theme ydoc-theme-demo -c
```
或者
```bash
ydoc theme ydoc-theme-demo --copy
```
命令执行完成后，项目根目录下会生成一个theme文件夹，文件夹中有一个ydoc-theme-demo的文件，ydoc-theme-demo文件中是主题的内容，修改该文件即可定制主题

2.然后在 ydoc.json 配置：

```json
{
  "theme": "demo"
}
```

## 主题列表

- [ydoc-theme-demo](https://www.npmjs.com/package/ydoc-theme-demo)
- [ydoc-theme-dark](https://www.npmjs.com/package/ydoc-theme-dark)