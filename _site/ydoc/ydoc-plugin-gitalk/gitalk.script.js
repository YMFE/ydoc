$(function () {
  var $markdownBody = $('#markdown-body');
  console.log(ydoc_plugin_gitalk_json);
  if ($markdownBody && ydoc_plugin_gitalk_json) {

    var gitalkJS = document.createElement("script");
    gitalkJS.type = "text/javascript";
    gitalkJS.src = "https://unpkg.com/gitalk/dist/gitalk.min.js";
    $markdownBody.append(gitalkJS);

    const { clientID, clientSecret, repo, owner, admin, on } = ydoc_plugin_gitalk_json;
    var dom = '<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css" ss="d"/>';

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = 'var gitalk = new Gitalk({' +
      'clientID: "' + clientID + '", ' +
      'clientSecret: "' + clientSecret + '", ' +
      'id: window.location.pathname, ' +
      'repo: "' + repo + '", ' +
      'owner: "' + owner + '", ' +
      'admin: "' + admin + '", ' +
      'distractionFreeMode: ' + on +
      '});' +
      'gitalk.render("gitalk-container");';

    $markdownBody.append(dom, '<div id="gitalk-container"></div>', script);
  }
});