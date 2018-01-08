{/**
 * title: 
 * 
 */}
 <header>
  <div>title: {props.content.title}</div>
  <div>logo: {props.content.logo}</div>
  {/* <div>menu: {console.log(props.content.menus)}</div> */}
   <nav className="nav-collapse">
     <ul>
      {
         props.content.menus.map((sortItem) => {
           return sortItem.items.map((menuitem, index)=>{
             return <li><a href="#">{menuitem.title}</a></li>;
          })
        })
      }
     </ul>
   </nav>

   <button id="toggle" className="closed">Toggle Menu</button>
</header>