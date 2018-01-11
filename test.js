var marked = require('marked');
var str = `
# Summary

* [first](test222.md#哈哈 哈哈 看看)

### sort 111

* [test111](test111.md)
* [test222](test222.md)

### 22sort222

* [test111](test111.md)
    * [test222](test222.md)

--

* [last](test222.md)


`

console.log(marked(str));