1、Plugin必须实现**HyPlugin**接口。  

2、在receiveJsMsg方法上添加**PluginAnnotation**注解，注解里面的name为与前端约定的handleName。  
*推荐handleName定义成： **业务名称.功能**  这种形式*  

3、Plugin的onCreate在Plugin实例化的时候被调用，onDestory是Plugin被销毁的时候调用，receiveJsMsg是在接  
收到QunarAPI消息的时候被调用。  
*推荐在receiveJsMsg中每收到一条消息就new一个新的业务类实例来处理这条消息。禁止用静态变量来持有JSResponse对象。*  
```java
public class NetworkType implements HyPlugin {
    @Override
    public void onCreate() {
        //TODO 初始化
    }
    @Override
    public void onDestory() {
        //TODO 处理资源回收
    }
    @PluginAnnotation(name="network.getType")
    @Override
    public void receiveJsMsg(JSResponse jsResponse, String handlerName) {
        //TODO 编写业务分发逻辑
    }
}
```  
4、Plugin给js回数据  
```java
jsResponse.error(1, msg, null); 或者 jsResponse.success(jsonObject);
```  
5、如果需要接收onActivityResult的数据，需要向HyPRWebView中注册HyStatusListener实例。  
```java
jsResponse.getContextParam().hyView.getIBaseContext().registerActivityStatusListener(new HyStatusListener());
```  
6、Plugin在第一次被QunarJS调用的时候被实例化，在跟自己业务Project关联的所有WebView被销毁后才销毁。