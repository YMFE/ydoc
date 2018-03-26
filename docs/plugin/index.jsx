---
plugins: 
  - { title: '插件一', href: '#', desc: '插件一插件一插件一插件一插件一插件一插件一' }
  - { title: '插件一', href: '#', desc: '插件一插件一插件一插件一插件一插件一插件一' }
  - { title: '插件一', href: '#', desc: '插件一插件一插件一插件一插件一插件一插件一' }
  - { title: '插件一', href: '#', desc: '插件一插件一插件一插件一插件一插件一插件一' }
  - { title: '插件一', href: '#', desc: '插件一插件一插件一插件一插件一插件一插件一' }
---
<div className="m-content-container m-pluginbox">
{
  props.plugins.map((item, index) => {
    return <div className="m-pluginbox-item" key={index}>
      <h3 className="title"><a href={item.href} className="href">{item.title}</a></h3>
      <p className="desc">{item.desc}</p>
    </div>
  })
}
</div>