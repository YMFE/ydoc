# Kami升级checklist

* 是否使用了新的adapter，`QApp-plugin-kami-adapter`,未使用，还是原有adapter的话，那么组件使用方式不需要改变

* 若使用了新的适配器 kami升级 checklist如下：

2. 组件调用方式统一改成
	
		QApp.showWidget('widgetName', options)
	
3. 新组建不提供pop形式的调用方式，之前调用通过QApp.showWidget('pop<widgetName>')需要改成 自己define QApp view + 在view的show事件中调用组件的形式，需要改动的有

		popdatepicker
		popcalendar
		popdoublelist
		poppagelist
		popsearchlist
		popselect
		popselectlist
		popsuggest
		poptime
	
4. 组件tips numbers 更名为tip 和 number使用方式不变，但是提供了非单例的调用模式可以

	单例模式：
	
		 //使用loading,通过QApp.showWiget来使用loading
	    var loading = QApp.showWidget('loading');
	    var options = {};
	    loading.show(options);
	
	    //使用全局变量调用
	    var options = {};
	    QApp.Kami.loading.show(options);
	
	非单例模式：
	
		var ins = new QApp.Kami.tip({})

	




 

