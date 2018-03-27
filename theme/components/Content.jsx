{
  props.type === 'md' ? (
    <div className="m-content">
      <div id="markdown-body" className="m-content-container markdown-body" dangerouslySetInnerHTML={{ __html: props.content }}>
      
      </div>
      {
        (props.prev || props.next) ? (
          <div className="m-content-container m-paging">
            {props.prev ?
              <div className="m-paging-prev m-paging-item">
                <a href={props.prev.releativePath} className="href">
                  <span className="ui-font-ydoc">&#xf07d;</span>
                  {props.prev.title}
                </a>
              </div> : null}
            {props.next ?
              <div className="m-paging-next m-paging-item">
                <a href={props.next.releativePath} className="href">
                  {props.next.title}
                  <span className="ui-font-ydoc">&#xf07f;</span>
                </a>
              </div> : null}
          </div>
        ) : null
      }
    </div>
  ) : (
    <div className="m-content" dangerouslySetInnerHTML={{ __html: props.content }}></div>
  )
}