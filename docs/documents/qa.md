# 常见问题

### 替换 favicon

替换 favicon, 建议使用 [Favicon Generator](https://realfavicongenerator.net/) 生成你想要的 favicon

在 docs 目录下，新建 _components 文件夹，创建 Icon.jsx 文件，复制以下源码，可将系统默认的 favicon 替换成 docs/images/xxx

```jsx
<link rel="apple-touch-icon" sizes="180x180" href={relePath(props.distPath, 'images/apple-touch-icon.png')} />
<link rel="icon" type="image/png" sizes="32x32" href={relePath(props.distPath, 'images/favicon-32x32.png')} />
<link rel="icon" type="image/png" sizes="16x16" href={relePath(props.distPath, 'images/favicon-16x16.png')} />
<link rel="manifest" href={relePath(props.distPath, 'images/manifest.json')} />
<link rel="mask-icon" href={relePath(props.distPath, 'images/safari-pinned-tab.svg')} color="#5bbad5" />
```

### 引入 js 和 css
配置如下：
```json
{
  "pluginsConfig": {
    "import-asset": {
      "css": ["custom.css"],
      "js": ["custom.js"]
    }
  }
}

```


