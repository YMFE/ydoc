<header className="m-header" id="js-header">
  <div className="m-header-title js-logo">
    <Logo distPath={props.distPath} />
    {/* <img className="logo" src={props.nav.logo} /> */}
    {/* <h6 className="name">{props.nav.title}</h6> */}
  </div>
  <nav className="m-header-nav js-nav">
    <ul className="m-header-items">
      {
        props.nav.menus.map((sortItem) => {
          return sortItem.items.map((menuitem, index) => {
            const distPath = props.distPath;
            const activeItem = distPath.split('_site\/')[1].split('\/')[0];
            const isLink = /http(s?)\:\/\//.test(menuitem.ref);
            let path;
            
            if (isLink) {
              path = menuitem.ref;
            } else {
              path = relePath(props.distPath, menuitem.ref);
            }
            
            return (
              <li className={'item ' + (menuitem.ref.split('\/')[0] === activeItem ? 'active' : '')} key={index}>
                <a className="href" href={menuitem.ref ? path : '#'}>{menuitem.title}</a>
              </li>
              );
          });
        })
      }
    </ul>
  </nav>
  <div id="js-nav-btn" className="m-header-btn ui-font-ydoc">&#xf020;</div>
</header>