### kami文档站

生成的文档静态文件上传到gitlab上面，地址是：git@gitlab.corp.qunar.com:kami/doc.git

#### 生成文档站

在package.json里面配置文档站的设置后在，doc目录下输入如下命令

```
sudo npm install 
gulp
```
使用git上传到远程分支并合并到master上，配置了webHook，自动访问地址为http://l-uedapp0.h.cn6.qunar.com:8888?project=kami_doc。

#### 访问

http://ued.qunar.com/mobile/kami/doc


### 历史版本

####20151019
```
 * @memberOf Alert
 * @template alertTemplate
 * alert默认模板 可根据需求替换alert默认模板 需求替换alert默认模板 可根据需求替换alert默认模板 可根据需求替换
 * @path ./alert.string
```
添加模板的引用
> 注意：请将memberOf写在path上面