{
  // console.log(JSON.stringify(props,null,2))
}

<header className="m-header js-header">
  <div className="m-header-title">
    <svg width="97px" height="25px" viewBox="0 0 97 25" version="1.1">
        <title>ydoc</title>
        <desc>ydoc logo.</desc>
        <defs></defs>
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="ydoc" transform="translate(0.000000, -1.000000)" fill="#1890FF">
            <g id="logo" transform="translate(0.000000, 1.000000)">
              <circle id="9" cx="23.2099997" cy="22.0199991" r="1.13999999"></circle>
              <circle id="8" cx="13.0149996" cy="22.0250008" r="2.82500005"></circle>
              <circle id="7" cx="2.82500005" cy="22.0250008" r="2.82500005"></circle>
              <circle id="6" cx="23.2049992" cy="12.4250004" r="2.82500005"></circle>
              <circle id="5" cx="13.0200001" cy="12.4199997" r="1.13999999"></circle>
              <circle id="4" cx="2.82500005" cy="12.4250004" r="2.82500005"></circle>
              <circle id="3" cx="23.2099997" cy="3.13999999" r="1.13999999"></circle>
              <circle id="2" cx="13.0149996" cy="2.82500005" r="2.82500005"></circle>
              <circle id="1" cx="2.82500005" cy="2.82500005" r="2.82500005"></circle>
            </g>
            <text id="title" fontFamily="ArialRoundedMTBold, Arial Rounded MT Bold" fontSize="24" fontWeight="normal">
              <tspan x="36" y="23">YDoc</tspan>
            </text>
          </g>
        </g>
    </svg>
    {/* <img className="logo" src={props.nav.logo} /> */}
    {/* <h6 className="name">{props.nav.title}</h6> */}
  </div>
  <nav className="m-header-nav js-nav">
    <ul className="m-header-items">
      {
        props.nav.menus.map((sortItem) => {
          return sortItem.items.map((menuitem, index) => {
            const bookpath = props.bookpath;
            const activeItem = bookpath.substring(bookpath.lastIndexOf('\/') + 1, bookpath.length);
            
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