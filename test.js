const React = require('react')
const babel = require('babel-standalone')
const transformJSX = require('babel-plugin-transform-react-jsx')

const parse = raw => babel.transform(raw, {
  plugins: [
    transformJSX
  ]
}).code

const wrap = jsx => `<React.Fragment>${jsx}</React.Fragment>`

const toComponent = (jsx, scope = {}) => {
  const el = parse(wrap(jsx))
  const scopeKeys = Object.keys(scope)
  const scopeValues = scopeKeys.map(key => scope[key])
  const create = new Function('React', ...scopeKeys, `return props => ${el}`)
  const Comp = create(React, ...scopeValues)
  // todo: validate
  return Comp
}

const fs = require('fs-extra');
let filepath = './theme/template';
let rootFiles = fs.readdirSync(filepath);
const path = require('path');
const ComponentRegexp = /<([A-Z][\w]*)\s+[^>]*>/g;
const ComponentNameRegexp = /<([A-Z][\w]*)/;
const clearCommentRegexp = /\/\*[\s\S]*?\*\//;
const tplExt = '.jsx';

const Components = {};
const queue = [];

rootFiles.forEach(item=>{
  if(path.extname(item) !== tplExt) return;
  let componentName = path.basename(item, tplExt);
  
  let content = fs.readFileSync(path.resolve(filepath, item), 'utf8');
  Components[componentName] = {
    status: 0,
    depends: [],
    content: content
  };
  let replaceContent = content.replace(clearCommentRegexp, '')
  let dependComponents = replaceContent.match(ComponentRegexp);
  if(dependComponents){
    dependComponents.forEach(c=>{
      let name = c.match(ComponentNameRegexp)[1];
      Components[componentName].depends.push(name);
    })
  }
})

function checkCompents(){
  let sign = true;
  Object.keys(Components).forEach(componentName=>{
    if(Components[componentName].status === 0){
      sign = false;
    }
  })
  return sign;
}

function findComponent(level){
  if(level > 1000) throw new Error('递归深度超过 1000，程序自动结束执行');
  level++;
  Object.keys(Components).forEach(componentName=>{
    let component = Components[componentName];
    if(component.status === 0){
      if( component.depends.length === 0){
        component.status = 1;
        component.fn = toComponent(component.content, {});
      }else{
        let sign = true, scope = {};
        component.depends.forEach(d=>{
          if(Components[d].status === 0){
            sign = false;
          }
          scope[d] = Components[d].fn;
        })
        if(sign) {
          component.status = 1;
          component.fn = toComponent(component.content, scope)
        }
      }
    }
  })
  if(checkCompents() === false) findComponent(level+1);
}

module.exports = findComponent;