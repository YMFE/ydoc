<header className="m-header" id="js-header">
  <div className="m-header-title js-logo">
    <Logo distPath={props.distPath} />
    {/* <img className="logo" src={props.nav.logo} /> */}
    {/* <h6 className="name">{props.nav.title}</h6> */}
    {console.log(JSON.stringify(props.nav.menus,null, 2))}
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
            return sortItem.items.map((menuitem, index) => {
              const distPath = props.distPath;
              const activeItem = distPath.split(props.buildPath + '/')[1];
              let active = '';
              if (props.ydoc.bookpath) {
                if (props.ydoc.bookpath === menuitem.absolutePath) {
                  active = 'active';
                }
              }

              return (
                <li className={'item ' + active} key={index}>
                  <a className="href" href={menuitem.ref ? relePath(props.distPath, menuitem.ref) : '#'}>{menuitem.title}</a>
                  {
                    menuitem.items.length ? <ul className="m-header-subtitle">{getItems(menuitem.items)}</ul> : null
                  }
                </li>
              );
            });
          });
        })()
      }
    </ul>
  </nav>
  <div id="js-nav-btn" className="m-header-btn ui-font-ydoc">&#xf020;</div>
</header>