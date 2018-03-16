{
  props.type === 'md' ? (
    <div className="m-content">
      <div className="m-content-container markdown-body" dangerouslySetInnerHTML={{ __html: props.content }}>
      
      </div>
      {
        (props.prev || props.next) ? (
          <div className="m-content-container m-paging">
            {props.prev ?
              <div className="m-paging-prev m-paging-item">
                <span className="ui-font-ydoc">&#xf07d;</span>
                <a href={props.prev.releativePath} class="href">{props.prev.title}</a>
              </div> : null}
            {props.next ?
              <div className="m-paging-next m-paging-item">
                <a href={props.next.releativePath} class="href">{props.next.title}</a>
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