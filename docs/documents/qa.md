# 常见问题

### icon
新建 _componets 文件夹，创建 Icon.jsx 文件，复制以下源码，可将系统默认的 icon 替换成根目录的 ydoc.ico

```html
<link rel="shortcut icon" href="/ydoc.ico" />
```

### 引入js和css
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


