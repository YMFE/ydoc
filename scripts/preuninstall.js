var path = require("path");
var fs = require("fs");
var pkg = require("../package.json");

var get_user_home = function() {
    return process.env[ (process.platform == 'win32') ? 'USERPROFILE' : 'HOME' ];
}

var extpath = path.join( get_user_home() , ".fekit" , ".extensions" , pkg.fekit_extension_command_name + ".js" );

try{
fs.unlinkSync( extpath );
} catch(e){}