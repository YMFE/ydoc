---
plugins: 
  - { title: 'ydoc-plugin-copy', href: 'https://www.npmjs.com/package/ydoc-plugin-copy', desc: '用于快速复制 markdown 生成页面的代码片段。' }
  - { title: '插件一', href: '#', desc: '插件一插件一插件一插件一插件一插件一插件一' }
  - { title: '插件一', href: '#', desc: '插件一插件一插件一插件一插件一插件一插件一' }
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