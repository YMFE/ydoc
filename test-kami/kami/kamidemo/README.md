## 项目初始化步骤

### 环境配置

1. fekit
2. fekit kami [安装](http://ued.qunar.com/mobile/kami/tool/build/)
3. fekit yo [安装](http://gitlab.corp.qunar.com/fed/yobuilder/tree/dev)

### 项目初始化&组件安装

1. fekit init
2. fekit kami --init
3. fekit kami -i --all
4. fekit yo -i
5. 依赖装载完毕

### QApp安装

1. fekit install QApp
2. fekit install QApp-plugin-kami-adapter


## 发布

### 本地发布

1. 开发完成后，执行node pack.js进行打包
2. 过程是有fekit进行打包，最后产出目录prd
3. git提交即可

### 服务端


* 服务器：l-uedapp0.h.cn6
* git path: /home/q/www/kami/demo/kamidemo
* files path: /home/q/www/kami/demo
* 访问地址：http://ued.qunar.com/mobile/kami/demos

### zip下载

[http://ued.qunar.com/mobile/kami/demos/kami.zip](http://ued.qunar.com/mobile/kami/demos/kami.zip）
下载有问题找谷野(ye.gu)

### 服务端文件

1. auto.js 进行更新、打包、压缩、复制等操作
2. build.sh 定时任务执行

### 定时任务

1. 执行定时任务：crontab -e
2. 查看定时任务：crontab -l

### 定时任务脚本
	
	*/1 * * * *  sh /home/q/www/kami/demo/kamidemo/build.sh
