**本文的章节均使用Android版测试机来说明步骤，iOS的步骤基本一致。**

## 如何启动Chrome调试
在开始这一节之前，首先先确认Chrome已经安装完毕，并且react native packager服务已经正确启动。React Native不支持Safari和火狐的调试工具。
- 首先需要遵循[简介](./index.html)内的第五步*开始测试*节，打开AwesomeProject的主页。
- 晃动手机，出现浮动菜单。选中“JS Bundle加载方式”。
- 选中应用的hybirdId
- 在弹出设置内启用"Debug In The Chrome"，然后按下“保存并重启”。
- Chrome会自动启动，打开Chrome调试工具，即可开始调试React Native的JS代码了。若Chrome未自动启动，可能是安装的某些软件的设定冲突阻止了Chrome启动（已知的软件有Mac版的Paralles Desktop），可以自行打开Chrome并访问[http://localhost:8081/debugger-ui](http://localhost:8081/debugger-ui)。
![enable-debugging.png](./images/Snip20160503_12.png)
