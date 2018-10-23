---
plugins: 
  - { title: 'import-asset', href: 'https://www.npmjs.com/package/ydoc-plugin-import-asset', desc: '在页面中引入 js 与 css 文件' }
  - { title: 'search', href: 'https://www.npmjs.com/package/ydoc-plugin-search', desc: '为 YDoc 提供搜索功能' }
  - { title: 'react-styleguide', href: 'https://www.npmjs.com/package/ydoc-plugin-react-styleguide', desc: '根据代码结构和注释，生成 react 组件文档，基于 react-styleguide' }
  - { title: 'vue-styleguide', href: 'https://www.npmjs.com/package/ydoc-plugin-vue-styleguide', desc: '根据代码结构和注释，生成 vue 组件文档，基于 vue-styleguide' }
  - { title: 'copy', href: 'https://www.npmjs.com/package/ydoc-plugin-copy', desc: '用于快速复制 markdown 生成页面的代码片段。' }
  - { title: 'jsdoc', href: 'https://www.npmjs.com/package/ydoc-plugin-jsdoc', desc: '根据代码注释生成文档，基于 jsdoc' }
  - { title: 'pangu', href: 'https://www.npmjs.com/package/ydoc-plugin-pangu', desc: '自动替你在网页中所有的中文字和半形的英文、数字、符号之间插入空白(盘古之白)' }
  - { title: 'img-view', href: 'https://www.npmjs.com/package/ydoc-plugin-img-view', desc: '点击 markdown 页面中的图片可以浏览原图' }
  - { title: 'edit-page', href: 'https://www.npmjs.com/package/ydoc-plugin-edit-page', desc: '在页面尾部添加 ‘编辑此页面’ 的链接(链接到 Github/Gitlab 等页面)' }
  - { title: 'gitalk', href: 'https://www.npmjs.com/package/ydoc-plugin-gitalk', desc: '评论插件，基于 gitalk' }
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