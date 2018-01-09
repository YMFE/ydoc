<header className="m-header">
  <div className="m-header-title">
    <img className="logo" src={props.path} />
    <h6 className="name">title: {props.content.title}</h6>
  </div>
  <nav className="m-header-nav js-nav">
    <ul className="m-header-items">
      {
        props.content.menus.map((sortItem) => {
          return sortItem.items.map((menuitem, index) => {
            return <li className={'item ' + (index===1?'active':'')}><a href="#">{menuitem.title}</a></li>;
          });
        })
      }
    </ul>
  </nav>
  <div id="js-nav-btn" className="m-header-btn ui-font-ydoc">&#xf020;</div>
</header>