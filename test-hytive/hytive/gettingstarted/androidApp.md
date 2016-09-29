### 1. 大客户端中使用HyBrid方案  
#### 使用自己的WebView打开Hybrid页面   
*这种方式的特点是定制性强，自己可控。*  
1、添加对hy库的依赖。
```java
if (project.properties.'adj' || project.properties.'rsj') {
//        compile 'com.qunar.spider:hy:1.0.0@aar'
} else {
    compile 'com.qunar.spider:hy:1.0.0@aar'
}
compile 'com.qunar.hy:browser:1.0.0@aar'
compile 'com.qunar.hy:hypatch:1.0.0@aar'
```
2、使用Hy库中的 **HyPRWebView** （封装了loading动画以及下拉刷新的WebView）布局。
3、HyPRWebView所在的View、Fragment或者Activity实现**HyIBaseContext**接口，并设置到HyPRWebView中。
```java
hyPRWebView.setIBaseContext(this);
```
4、根据业务组件的一个唯一标识(如HybridId)去获取 **Project** 实例，再在HyPRWebView
实例化时将此Project与HyPRWebView关联起来
```java
webView.setProject(ProjectManager.getInstance().getProject(唯一标识));
```
5、在project中注册自己的**Plugin**

```java
Project project = ProjectManager.getInstance().getProject(唯一标识);
project.addPlugin(Plugin.class.getName());
```
#### 使用browser组件打开Hybrid页面   
*使用新的scheme:"qunaraphone://hy/url?url='xxx'&name='xxx'&type='xxx'&navigation='xxx'"。*
*参数跟webview.open类似*
```java
try {
    JSONObject navigationJson = new JSONObject();
    JSONObject left = new JSONObject();
    left.put("style", "icon");
    left.put("icon", "\uf07d");

    JSONObject title = new JSONObject();
    title.put("text", "hello");
    title.put("style", "text");

    navigationJson.put("left", left);
    navigationJson.put("title", title);

    Bundle bundle = new Bundle();
    String url = "http://hcy.qunar.com:8080/zzz.htm";
    url = URLEncoder.encode(url, "utf-8");
    String navigation = URLEncoder.encode(navigationJson.toString(), "utf-8");
    SchemeDispatcher.sendScheme(this,"qunaraphone://hy/url?url=" + url+"" +
            "&name=pageName"+
            "&type=navibar-normal"+
            "&navigation="+navigation);
} catch (Exception e) {

}
```

### 2. 独立app中使用HyBrid方案  
如果没有特殊定制需求，可以直接使用adr_tempate_app这个工程
