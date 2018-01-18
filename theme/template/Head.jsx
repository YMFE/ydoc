<head>
	<title>{props.title}</title>
	<link rel="stylesheet" href={relePath(props.distPath, 'ydoc/styles/style.css')} />
	{props.asserts.css.map(item=>{
		return <link key={item} rel="stylesheet" href={relePath(props.distPath, item)} />
	})}
</head>