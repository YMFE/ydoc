$(function () {
  var pathname = location.pathname;
  var $markdownBody = $('#markdown-body');
  if ($markdownBody && ydoc_plugin_edit_json[pathname]) {
    $markdownBody.append('<a class="ui-edit" href="' + ydoc_plugin_edit_json.prefix + ydoc_plugin_edit_json[pathname] + '">编辑此页面</a>');  }
});