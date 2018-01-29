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
            const activeItem = distPath.split(props.buildPath + '/')[1];
            
            return (
              <li className={'item ' + (menuitem.ref === activeItem ? 'active' : '')} key={index}>
                <a className="href" href={menuitem.ref ? relePath(props.distPath, menuitem.ref) : '#'}>{menuitem.title}</a>
              </li>
              );
          });
        })
      }
    </ul>
  </nav>
  <div id="js-nav-btn" className="m-header-btn ui-font-ydoc">&#xf020;</div>
</header>