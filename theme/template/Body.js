module.exports = function(props){
  return <div dangerouslySetInnerHTML={{__html: props.content}}></div>
}