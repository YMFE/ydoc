调试React Native的JS代码时，可以使用Chrome或者Atom。使用Chrome调试无需额外的工具和配置，但是Atom集成的IDE和inspector功能更强。目前Atom的Nuclide插件没有完全定制化，还存在一些bug，仅供试用。**本文的章节均使用Android版测试机来说明步骤，iOS的步骤基本一致。**

## 如何使用Atom调试(试用，还有坑要填)
开始这一节前，首先安装一下必须的工具

- 安装Atom。前往[Atom官网](https://atom.io/)下载并安装最新版的Atom IDE。
- 安装Nuclide插件。前往[Nuclide官网](http://nuclide.io/docs/editor/setup/#mac)，并按照指引安装完Nuclide插件。

好。我们开始使用Atom来调试。

- Terminal内，在项目的根目录下键入<pre>atom ./</pre>
- Atom会启动，并且载入了项目的代码。
- 按住组合键<span style="border-radius:.2em;border:1px solid;box-shadow:.1em .1em;">⇧⌘P</span>，在弹窗内输入*react debugger*，并回车
![pic](./images/01.start-atom-debug.png)
- 遵照[如何使用Chrome调试](./index-使用Chrome调试JavaScript.html)这一节内的方式，在测试机内开启Chrome Debug，并重启壳程序。随后即可在Atom内调试了。
