## 测试和部署

<!-- TODO: 调试工具部分 -->
在准备进行测试和部署前，需要准备一下发布所需要的各种资源。

### hybridId配置

如果已经申请了 hybridId ，可直接转到[git仓库配置](#git-repo-config)。

hybridId 是项目的标识，在客户端中启动某个项目、在发布系统中发布某个项目，均需要使用 hybridId 来标识。

申请 hybridId ，参见[Wiki](http://wiki.corp.qunar.com/pages/viewpage.action?pageId=89134521)。

<a name="git-repo-config"/>
### git 仓库配置

在[项目创建](index-项目创建.html)过程中，通过`react-native init`命令创建的项目，会在项目的根目录中存在如下几个文件：

- package.json
- index.yaml
- build.sh
- index.js
- QFontSet.js
- QImageSet.js

如果你的项目是手动创建的，确保你的项目中存在以上几个文件。如果没有，可以在[这里](http://gitlab.corp.qunar.com/react_native/js_template/tree/release)下载到模板文件，复制到项目的根目录。

### 项目准备

<a name="prepare-index-yaml"/>

修改`index.yaml`文件，来决定项目的发布目标。一个 RN 项目的`index.yaml`文件内容如下：

``` yaml
hybridid : template
iOS_vid : vid_80019999 # 所需iOS客户端最低版本
android_vid : vid_60009999,com.mqunar.react_2 # 所需android客户端及模块最低版本
rnpackage : true
```

- 修改`hybridid`的值为项目申请到的 hybridId 。
- 修改`iOS_vid`的值为本次发布所适用的 iOS 客户端版本。该版本及更新版本的客户端均可以在代码发布后更新到此次发布的代码。
- 修改`android_vid`的值为本次发布所适用的 android 客户端及模块版本。该版本及更新版本的客户端均可以在代码发布后更新到此次发布的代码。

#### 需要提交的文件

需要向 git 仓库中提交的文件包括以上提到的文件，项目的其他源文件，以及`node_modules`目录。

> 为什么要提交`node_modules`？  
> 因为项目中可能会写入各种各样的其他依赖，而它们的版本可能不固定，因此在发布机上进行npm install的结果可能与开发时不同，会导致编译结果出问题时难以排查。因此我们要求开发者提交`node_modules`目录。

### 发布 job 配置

RN Job 现在可以自助创建了~ 直接在[万事屋](http://wanshiwu.corp.qunar.com/mobile/register?id=4)自助创建即可。

<span style="text-decoration:line-through;">联系 CM 创建 RN 前端项目的 job ，需要提供 hybridId 、 git 仓库地址，即可创建项目的发布 job 。这个 job 将用于项目的测试和发布。</span>

RN job 的主要参数如下：

- deploy_type: 发布类型（beta/线上）
- git_root: 项目的 git 地址
- tag_name: 要发布的分支
- app_platform: 要发布的目标平台，用逗号分隔
- app_pid: 如果项目面向多个应用，填写本次发布使用的pid。否则不必填写
- vid_info: prod发布时，需要发布人员填写此参数手动确认发布目标版本

<a name="beta-online-test"/>
### beta 测试（在线）

在 job 中进行 beta 发布后，可以在客户端中通过设置 RN 为 beta 加载模式来进行 beta 测试。方法如下：

- 在客户端中打开项目的页面。第一次打开会使用线上模式，在项目未进行线上发布前会出错，可以关掉错误提示。
- 摇动手机，出现浮动菜单。选中“JS Bundle 加载方式”。
- 选中项目的 hybridId
- 在弹出的设置内，选中“beta”选项，并填入项目当前正在开发的分支名称（不是 btag ）。
- 如果代码有更新，同一分支重新发布 beta 版本，则无需重新设置，只需要退出并重新进入页面即可看到新发布的代码生效。

这种 beta 测试直接由机器向 beta 机器拉取发布结果，需要机器能够访问网络（不需要内网访问）。

### beta/prod 测试（离线）

每次在 job 中进行发布，会生成一个 qp 格式的发布产物，可以在发布记录中点击查看。

qp 是客户端使用的离线资源包，将 qp 包加入客户端的资源中后，无需联网即可使用发布后的代码。在发布完成后，点击发布的产物链接，可以看到`build.qp.ios`和`build.qp.android`两个目录，分别对应两个平台的资源包。将各平台目录下 **扩展名为`qp`和`qpmd5`的文件** 加入到 Native 工程的资源列表中，随客户端打包即可。

客户端在测试时，需要按照[beta 测试（在线）](#beta-online-test)中的流程，设置代码的加载方式为“release”。

> **注意**： 由于 beta 版本的离线包版本号与 prod 的版本号是分别计数的，因此如果你在 native 项目里加入了 prod 的打包产物，则在安装之前，请删除之前安装的 beta 版本，再继续安装应用。否则客户端将使用已经保存的高版本号的包。

#### iOS 大客户端自动集成

如果你的项目是针对 Qunar 的 iOS 大客户端，你可以不必手动加入 RN 资源文件到 bundle 中，而由所在业务线的 lib 在打包时自动完成。（感谢 CM 的大力支持）

在业务线 lib 发布时，可以填写`rn_config`参数，在打包时自动将发布的 RN 资源加入。具体格式如下：

```
hybridIdA:b-160504-102734-xxx.yyy
hybridIdB:master
```
冒号后面填写 tag 时，使用对应 tag 的内容；填写分支时，则使用对应分支最新一次发布的内容。

> 如果你所在的业务线的 lib 没有这样的打包参数，请联系 CM 进行修改。

### 项目热发布

得益于直接使用 hybrid 的发布系统， RN 直接支持代码的热发布。只要在 job 中进行项目的 prod 发布，对应版本的客户端即可在再次进入客户端后更新到新版本的代码。有关如何确定热发的目标版本，参考[准备index.yaml文件](#prepare-index-yaml)。
