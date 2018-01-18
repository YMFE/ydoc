---

title: 
 logoSrc: 'https://ydoc.ymfe.org/'
 name: YDoc
 copyRight: '© 2018 YMFE Team. Build by ydoc.'

links: 
 COMMUNITY:
  - { name: 'one', href: 'https://ydoc.ymfe.org/' }
  - { name: 'two', href: 'https://ydoc.ymfe.org/' }
 BASE:
  - { name: 'one', href: 'https://ydoc.ymfe.org/' }
  - { name: 'two', href: 'https://ydoc.ymfe.org/' }
 MORE:
  - { name: 'one', href: 'https://ydoc.ymfe.org/' }
  - { name: 'two', href: 'https://ydoc.ymfe.org/' }

---

<footer className="m-footer">
	<div className="m-footer-container">
			<div className="m-footer-title">
				{/* <img className="logo" src={title.logoSrc} /> */}
				{/* <h6 className="name">{title.name}</h6> */}
				<Logo distPath={props.distPath} />
				<p className="copyright">© 2018 <a href="">YMFE</a> Team.<br/>Build by <a href="">ydoc</a>.</p>
			</div>
			<div className="m-footer-links">
				{
					(() => {

						const getItems = (value) => {
							return value.map((item, index) => {
								return <li key={index}><a className="href" href={item.href}>{item.name}</a></li>;
							});
						};

						let dom = [];
						for (let key in links) {
							dom.push(
								<div className="group" key={key}>
									<p className="title">{key}</p>
									<ul>{getItems(links[key])}</ul>
								</div>
							);
						}
						return dom;
					})()
				}
			</div>
	</div>
</footer>