---
features: 
  - { name: '优雅', desc: '经过精雕细琢，我们带给大家一个精心设计的、拥有卓越的视觉与交互体验的文档构建工具。' }
  - { name: '灵动', desc: '我们拥有非常灵活的 插件机制 与 主题定制 功能，正在努力构建活跃的插件社区。也许初次使用未见其惊艳，但当你灵活使用插件后便会发现她的强大。' }
  - { name: '灵动', desc: '我们拥有非常灵活的 插件机制 与 主题定制 功能，正在努力构建活跃的插件社区。也许初次使用未见其惊艳，但当你灵活使用插件后便会发现她的强大。' }
  - { name: '优雅', desc: '经过精雕细琢，我们带给大家一个精心设计的、拥有卓越的视觉与交互体验的文档构建工具。' }
---

<div className="g-home">
  <section className="m-section home">
    <div className="m-section-container">
      <div className="m-section-title">
        <h4 className="name">更懂你的文档站构建工具</h4>
        <p className="desc">基于 markdown 轻松生成完整静态站点</p>
        <div className="m-section-btngroup">
          <a href="./documents/index.html"><div className="btn">开始</div></a>
          <a href="https://github.com/YMFE/ydoc"><div className="btn btn-ghost">Github ></div></a>
        </div>
      </div>
      <Banner />
    </div>
  </section>
  <section className="m-section feature">
    <div className="m-section-container">
      <div className="m-section-box">
      {
        features.map((item, index) => {
          return <div className="item" key={index}>
            <h6 className="title">{item.name}</h6>
            <p className="desc">{item.desc}</p>
          </div>
        })
      }
      </div>
    </div>
  </section>
</div>
<Footer distPath={props.page.distPath} />