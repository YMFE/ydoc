window.localDB = require('../../scripts/localDB/index.js');

localDB.DBremove('user');
localDB.DBinsert('user',{
	name:'xinyue',
	age:23
});
localDB.DBinsert('user',{
	name:'leila',
	age:23
})
localDB.DBinsert('user',{
	name:'sharon',
	age:23
})
console.log(localDB.DBfind('user',{age:23,name:'xinyue'}));


localDB.DBupdate('user',{age:23,name:'xinyue'},{$inc : {age:1}})
localDB.DBupdate('user',{age:24,name:'xinyue'},{$set : {name:'luoluo'}})
localDB.DBupdate('user',{age:24},{$set : {hobby:[1,2,3]}});
localDB.DBupdate('user',{age:24},{$push:{hobby:'sang'}})

localDB.DBupdate('cost',{'leisure':300},{$set:{'hotel':777}});
localDB.DBupdate('cost',{'leisure':100},{$inc:{'leisure':50,'flight':2000}});
localDB.DBremove('user',{name:'luoluo'})


localDB.setItem('name','xilixinluo');
localDB.getItem('name');
localDB.updateItem('name','hahaha','add');
localDB.updateItem('name','hahaha','del');
localDB.removeItem('name');