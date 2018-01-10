{
	// console.log(JSON.stringify(props.content, null, 2))
}

<div className="m-summary">
{
	(() => {
		const getItems = (articles) => {
			return articles.map((item) => {
				return <li className="item">{item.title}</li>;
			});
		};
		
		return props.content.map((item) => {
			console.log(item);
			
			return (
				<div className="m-summary-block">
					{item.title ? <div className="m-summary-title">{item.title}</div> : ''}
					<ul className="m-summary-list">{getItems(item.articles)}</ul>
				</div>
			);
		});
	})()
}
</div>