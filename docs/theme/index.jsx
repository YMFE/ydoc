---
themes:
  - { title: 'demo', href: 'https://www.npmjs.com/package/ydoc-theme-demo', desc: '默认主题，以 ‘无形’ 代替 ‘有形’，去除冗余的设计元素', src: 'https://ws1.sinaimg.cn/large/006cGJIjly1fwkjg518vqj30850533yn.jpg', srcset: 'https://ws1.sinaimg.cn/large/006cGJIjly1fwkjg51sucj30ga0a6my0.jpg 2x' }
  - { title: 'dark', href: 'https://www.npmjs.com/package/ydoc-theme-dark', desc: '暗色主题，基于 PM2 文档 的样式改编', src: 'https://ws1.sinaimg.cn/large/006cGJIjly1fwkjk4jquyj308505374f.jpg', srcset: 'https://ws1.sinaimg.cn/large/006cGJIjly1fwkjk4k7jgj30ga0a674y.jpg 2x' }
---
  <div className="m-content-container m-pluginbox">
    {
      props.themes.map((item, index) => {
        return <div className="m-pluginbox-item" key={index}>
          <a href={item.href} target="_blank" className="href">
            <img className="img" src={item.src} srcSet={item.srcset} />
          </a>
          <h3 className="title"><a href={item.href} target="_blank" className="href">{item.title}</a></h3>
          <p className="desc">{item.desc}</p>
        </div>
      })
    }
  </div>