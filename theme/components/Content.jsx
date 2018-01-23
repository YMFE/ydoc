
{
  // console.log(JSON.stringify(props, null, 2))
}
{
  props.type === 'md' ? (
    <div className="m-content">
      <div className="m-content-container markdown-body" dangerouslySetInnerHTML={{ __html: props.content }}></div>
    </div>
  ) : (
    <div className="m-content" dangerouslySetInnerHTML={{ __html: props.content }}></div>
  )
}