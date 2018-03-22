<header className="m-header" id="js-header">
  <div className="m-header-title js-logo">
    <a href={relePath(props.distPath, "index.html")} target="_self">
      <img className="logo" src={relePath(props.distPath, props.nav.logo)} />
      <h6 className="name">{props.nav.title}</h6>
    </a>
  </div>
  <Hook name="header" ydoc={props.ydoc} />
  <nav className="m-header-nav js-nav">
    <ul className="m-header-items">
      {(() => {
          const getItems = (items) => {
            return items.map((item, index) => {
              return (
                <li className="item" key={index}>
                  <a href={relePath(props.distPath, item.ref)}>{item.title}</a>
                </li>
              );
            });
          };

        return props.nav.menus.map((sortItem) => {
          const distPath = props.distPath;
          const activeItem = distPath.split(props.buildPath + '/')[1];
          let active = '';

          // 存在二级导航时
          if (sortItem.title) {
            if (props.ydoc.bookpath) {
              if (props.ydoc.bookpath === sortItem.absolutePath) {
                active = 'active';
              }
            }
            return (
              <li className={'item ' + active}>
                {sortItem.title}
                {
                  sortItem.title.length ? <ul className="m-header-subtitle">{getItems(sortItem.items)}</ul> : null
                }
              </li>
            );
          } else { // 不存在二级导航时
            return sortItem.items.map((menuitem, index) => {
              // 判断是否为高亮项
              if (props.ydoc.bookpath) {
                active = (props.ydoc.bookpath === menuitem.absolutePath) ? 'active' : '';
              }
              return (
                <li className={'item ' + active} key={index}>
                  <a className="href" href={menuitem.ref ? relePath(props.distPath, menuitem.ref) : '#'}>{menuitem.title}</a>
                  {
                    sortItem.title.length ? <ul className="m-header-subtitle">{getItems(menuitem.items)}</ul> : null
                  }
                </li>
              );
            });
          }

          });
        })()
      }
    </ul>
  </nav>
  <div id="js-nav-btn" className="m-header-btn ui-font-ydoc">&#xf020;</div>
</header>