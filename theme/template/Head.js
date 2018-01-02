const React = require('react');
module.exports = function (props) {
	return (
		<head>
			<title>{props.data.title}</title>
			<link rel="stylesheet" href="./css/style.css" />
		</head>
	);
};