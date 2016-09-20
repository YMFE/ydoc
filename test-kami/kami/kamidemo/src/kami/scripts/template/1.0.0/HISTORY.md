# 历史记录

---


## 0.0.1

`add` template 

## 0.0.2
`modify` template为arttemplate，为了兼容kami老版本的template，默认不对html编码，改动了一下arttemplate，目前默认

    ```
    template.config('escape', false)//默认模板对html不进行编码转义
    {{htmlStr}} //默认不对html进行转义
    {{#htmlStr}} //会对html进行转义
    ```

业务自身也可以改成业界流行的模式，但是需要注意，kami组件的默认模板都是按照不转义进行开发的，所以需要根据需求改模板，然后传给组件

    ```
    template.config('escape', true)//默认模板对html进行编码转义
    {{htmlStr}} //会对html进行转义
    {{#htmlStr}} //默认不对html进行转义
    ```

## 1.0.0

### template模板


从1.0版本后，为了使用方便和提升解析效率，对比了业界的模板解析引擎，讲kami自带的template修改为arttemplate。为了兼容kami老版本的template，对arttemplate做了一些修改。


###### 修改默认配置
默认不对html编码，改动了一下arttemplate，目前默认

    ```
    template.config('escape', false)//默认模板对html不进行编码转义
    {{htmlStr}} //默认不对html进行转义
    {{#htmlStr}} //会对html进行转义
    ```

业务自身也可以改成业界流行的模式，但是需要注意，kami组件的默认模板都是按照不转义进行开发的，所以需要根据需求改模板，然后传给组件


    ```
    template.config('escape', true)//默认模板对html进行编码转义
    {{htmlStr}} //会对html进行转义
    {{#htmlStr}} //默认不对html进行转义
    ```

###### 修改支持的语法

支持arttemplate默认语法:

* 条件语句

    ```
    {{if}}{{/if}}
    ```

* 循环语句

    ```
    {{each}}{{/each}}
    ```

* 变量输出

    ```
    {{value}}
    ```

兼容kami 老版本template语法:

* 条件语句

    ```
    {{#if}}{{/if}}
    ```

* 循环语句

    ```
    {{#each}}{{/each}}
    ```
    
* 变量输出

    ```
    {{value}}
    ```