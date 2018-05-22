# 常见问题

### icon
在 docs 目录下，新建 _components 文件夹，创建 Icon.jsx 文件，复制以下源码，可将系统默认的 icon 替换成 docs/ydoc.ico

```html
<link rel="shortcut icon" href={relePath(props.distPath, 'ydoc.ico')} />
```

### 引入js 和css
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


