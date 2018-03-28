---
plugins: 
  - { title: 'ydoc-plugin-copy', href: 'https://www.npmjs.com/package/ydoc-plugin-copy', desc: '用于快速复制 markdown 生成页面的代码片段。' }
  - { title: 'ydoc-plugin-import-asset', href: 'https://www.npmjs.com/package/ydoc-plugin-import-asset', desc: '在页面中引入 js 与 css 文件' }
  - { title: 'ydoc-plugin-jsdoc', href: 'https://www.npmjs.com/package/ydoc-plugin-jsdoc', desc: '根据代码注释生成文档，基于 jsdoc' }
  - { title: '插件一', href: '#', desc: '插件一插件一插件一插件一插件一插件一插件一' }
  - { title: '插件一', href: '#', desc: '插件一插件一插件一插件一插件一插件一插件一' }
---
<div className="m-content-container m-pluginbox">
{
  props.plugins.map((item, index) => {
    return <div className="m-pluginbox-item" key={index}>
      <h3 className="title"><a href={item.href} target="_blank" className="href">{item.title}</a></h3>
      <p className="desc">{item.desc}</p>
    </div>
  })
}
</div>