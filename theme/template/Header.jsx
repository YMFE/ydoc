{
  // console.log(JSON.stringify(props,null,2))
}

<header className="m-header js-header">
  <div className="m-header-title">
    <img className="logo" src={props.nav.logo} />
    <h6 className="name">{props.nav.title}</h6>
  </div>
  <nav className="m-header-nav js-nav">
    <ul className="m-header-items">
      {
        props.nav.menus.map((sortItem) => {
          return sortItem.items.map((menuitem, index) => {
            const bookpath = props.bookpath;
            const activeItem = bookpath.substring(bookpath.lastIndexOf('\/') + 1, bookpath.length)
            
            return (
              <li className={'item ' + (menuitem.title === activeItem ? 'active' : '')} key={index}>
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