---

title: 
 logoSrc: 'https://ydoc.ymfe.org/'
 name: YDoc
 copyRight: '© 2018 YMFE Team. Build by ydoc.'

links: 
 COMMUNITY:
  - { name: 'YMFE', href: 'https://ymfe.org/' }
  - { name: 'YMFE blog', href: 'https://blog.ymfe.org/' }
 BASE:
  - { name: 'FAQ', href: 'http://ymfe.corp.qunar.com/c/qrn' }
  - { name: 'QRN-WEB', href: 'https://github.com/GitbookIO/gitbook/blob/master/CHANGES.md' }

---

<footer className="m-footer">
	<div className="m-footer-container">
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
			<div className="m-footer-title">
				<p className="copyright">© 2018 <a href="">YMFE</a> Team.</p>
				<p>Build by <a href="">ydoc</a>.</p>
			</div>
	</div>
</footer>