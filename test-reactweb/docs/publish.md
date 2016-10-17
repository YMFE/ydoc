## 构建发布

React Web的构建也是整合到Qunar React Native的构建工具内，只需要不同的参数、同样的命令，就可以合并、打包代码。构建工具默认情况下会同时输出ios、android和web端产物。

#### 构建
```sh
    sh build-web.sh target[dev|beta|prod] enableSourceMap[true|false]
```

#### 发布

##### 1.发布touch

- 确保你的项目是在fe namespace下
- 在schema/fe下创建项目的schema配置 [创建](http://wanshiwu.corp.qunar.com/schema/new)
- 新建job【也可以直接复制delivery_react_web_demo_dev、delivery_react_web_demo】 [新建](http://wanshiwu.corp.qunar.com/job/search/new)
![run-rn-init](images/new-job.png)
- 在extra_params添加
```sh
    build_command:"sh build-web.sh"
```
![run-rn-init](images/build-command.jpeg)
- 关联后端项目，即可发布到dev、beta、prod环境

##### 2.发布qp包

参见<a href="http://wiki.corp.qunar.com/pages/viewpage.action?pageId=90096457#%E7%A6%BB%E7%BA%BF%E5%8C%85%E5%8F%91%E5%B8%83%E6%B5%81%E7%A8%8B-%E8%AE%B0%E5%BE%97%E5%9C%A8%E8%BF%99%E7%94%B3%E8%AF%B7hybridid" target="_blank">离线包发布流程</a>


