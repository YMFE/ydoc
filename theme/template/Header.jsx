 <header className="m-header">
  <div className="row">
     <div className="m-header-title">title: {props.content.title}</div>
     <div className="m-header-logo">logo: {props.content.logo}</div>
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
     <button id="js-nav-btn" className="m-header-btn">Toggle Menu</button>
  </div>
</header>