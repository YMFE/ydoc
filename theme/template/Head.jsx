<head>
	<title>{props.data.title}</title>
	<link rel="stylesheet" href={relePath(props.data.page.distPath, "ydoc/styles/style.css")} />
	{props.data.asserts.css.map(item=>{
		return <link key={item} rel="stylesheet" href={relePath(props.data.page.distPath, item)} />
	})}


</head>