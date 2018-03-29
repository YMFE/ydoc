---
plugins: 
  - { title: 'ydoc-plugin-copy', href: 'https://www.npmjs.com/package/ydoc-plugin-copy', desc: '用于快速复制 markdown 生成页面的代码片段。' }
  - { title: 'ydoc-plugin-import-asset', href: 'https://www.npmjs.com/package/ydoc-plugin-import-asset', desc: '在页面中引入 js 与 css 文件' }
  - { title: 'ydoc-plugin-jsdoc', href: 'https://www.npmjs.com/package/ydoc-plugin-jsdoc', desc: '根据代码注释生成文档，基于 jsdoc' }
  - { title: 'ydoc-plugin-pangu', href: 'https://www.npmjs.com/package/ydoc-plugin-pangu', desc: '自动替你在网页中所有的中文字和半形的英文、数字、符号之间插入空白(盘古之白)' }
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