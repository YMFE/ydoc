
{
  // // console.log(JSON.stringify(props.content, null, 2))
  
}

<div className="m-content">
  <div className="m-content-container markdown-body">
    <h1 className="title">Heading H1</h1>
    <div dangerouslySetInnerHTML={{ __html: props.content }}></div>
  </div>
</div>