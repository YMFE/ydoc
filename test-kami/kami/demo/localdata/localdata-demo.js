window.localdata = require('../../scripts/localdata/index.js');

localdata.DBremove('user');
localdata.DBinsert('user',{
	name:'xinyue',
	age:23
});
localdata.DBinsert('user',{
	name:'leila',
	age:23
})
localdata.DBinsert('user',{
	name:'sharon',
	age:23
})
console.log(localdata.DBfind('user',{age:23,name:'xinyue'}));


localdata.DBupdate('user',{age:23,name:'xinyue'},{$inc : {age:1}})
localdata.DBupdate('user',{age:24,name:'xinyue'},{$set : {name:'luoluo'}})
localdata.DBupdate('user',{age:24},{$set : {hobby:[1,2,3]}});
localdata.DBupdate('user',{age:24},{$push:{hobby:'sang'}})

localdata.DBupdate('cost',{'leisure':300},{$set:{'hotel':777}});
localdata.DBupdate('cost',{'leisure':100},{$inc:{'leisure':50,'flight':2000}});
localdata.DBremove('user',{name:'luoluo'})


localdata.setItem('name','xilixinluo');
localdata.getItem('name');
localdata.updateItem('name','hahaha','add');
localdata.updateItem('name','hahaha','del');
localdata.removeItem('name');