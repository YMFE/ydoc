<div className="m-summary" id="js-menu">
	<div className="m-summary-content">
		{
			(() => {
				const getItems = (articles) => {
					return articles.map((item, index) => {
						// const distPath = props.distPath;
						// const activeItem = distPath.substring(distPath.lastIndexOf('\/') + 1, distPath.length);
						// const activeFlag = (item.ref.indexOf(activeItem) === 0);
						// console.log(props.releativePath, item.ref);
						// console.log(JSON.stringify(relePath(props.releativePath, item.ref), null, 2));

						return (
							<li className="item" key={index}>
								{
									item.articles.length ? (
										<div className="m-summary-block">
											{item.title ? <a href={relePath(props.releativePath, item.ref)} className="href" >{item.title}</a> : ''}
											<ul className={'m-summary-list' + (item.title ? ' indent' : '')}>{getItems(item.articles)}</ul>
										</div>
									) : <a href={relePath(props.releativePath, item.ref)} className="href" >{item.title}</a>
								}

							</li>
						);
					});
				};

				return props.summary.map((item, index) => {
					return (
						<div className="m-summary-block" key={index}>
							{item.title ? <div className="m-summary-title">{item.title}</div> : ''}
							<ul className={'m-summary-list' + (item.title ? ' indent' : '')}>{getItems(item.articles)}</ul>
						</div>
					);
				});
			})()
		}
	</div>
	
	<div className="m-summary-switch js-summaty-switch" >&#xf020;</div>
</div>