# 历史记录

---
## 0.0.3
`modify` switch的适配器，增加对onchagnevalue的支持


## 0.0.4
`modify` confirm的适配器，增加对onok oncancel的支持


## 0.0.5
`modify` switch的适配器，直接返回switch的实例


## 0.0.6
`add` 打分组件rating的适配器

## 0.0.7
`modify` select qapp的适配器, 修复不支持自定义模板的问题

## 0.0.8
`modify` swtichable qapp的适配器, 容器问题

## 0.09
`add`  imagelazyload qqpp的适配器

## 0.0.10
`modify` select、calendar qapp的适配器, 在wagon中如果router为true则会新开一个webview导致actionSheet的组件都废了

## 0.0.11
`modify` pagelist使用setPopOption替换原来的setOption功能，setOption针对非pop组件

## 0.0.12
`modify` searchlist和pagelist移除callback

## 0.0.13
`add` bizpaydialog 和bizvericodedialog 适配器给支付的组件

## 0.0.15
`add` datepicker 适配器给业务日历组件

## 0.0.16
`add` numbers的template为可修改，修改selectlist的adapter，里面有命名错误

## 0.0.17
`add` numbers的适配，由于qapp会在销毁的时候会调用2次destroy，所以兼容了判断一下num是否存在

## 0.0.18
`add` panel的适配器

## 0.0.19
`add` grouplist的适配器
`fixed` 去掉datepicker 适配中checkCallback选项，改为监听checked方法
