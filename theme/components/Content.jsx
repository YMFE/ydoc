{
  props.type === 'md' ? (
    <div className="m-content">
      <div className="m-content-container markdown-body" dangerouslySetInnerHTML={{ __html: props.content }}>
      
      </div>
      {
        (props.prev || props.next) ? (
          <div className="m-content-container m-paging">
            {props.prev ?
              <div className="m-paging-prev">
                <span className="ui-font-ydoc">&#xf07d;</span>
                <a href={relePath(props.distPath, props.prev.releativePath)}>{props.prev.title}</a>
              </div> : null}
            {props.next ?
              <div className="m-paging-next">
                <a href={relePath(props.distPath, props.next.releativePath)}>{props.next.title}</a>
                <span className="ui-font-ydoc">&#xf07f;</span>
              </div> : null}
          </div>
        ) : null
      }
    </div>
  ) : (
    <div className="m-content" dangerouslySetInnerHTML={{ __html: props.content }}></div>
  )
}