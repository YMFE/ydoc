<header className="m-header">
  <div className="m-header-title">
     <div className="logo">logo: {props.content.logo}</div>
    <span className="name">title: {props.content.title}</span>
  </div>
  <nav className="m-header-nav js-nav">
    <ul>
      {
        props.content.menus.map((sortItem) => {
          return sortItem.items.map((menuitem) => {
            return <li className="item"><a href="#">{menuitem.title}</a></li>;
          });
        })
      }
    </ul>
  </nav>
  <div id="js-nav-btn" className="m-header-btn ui-font-ydoc">&#xf020;</div>
</header>