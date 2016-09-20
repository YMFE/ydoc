
;(function(__context){
    var module = {
        id : "08ea436ba00b2c3de0c3bcb11912e372" ,
        filename : "util.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /* Zepto v1.1.3-27-gb9328f1 - zepto event touch - zeptojs.com/license */
/**
 * kami定制化的zepto，对于事件
 * 
 * @type {[type]}
 */
var global = global || window;
window.Kami = window.Kami || {};
var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
    document = window.document,
    elementDisplay = {}, classCache = {},
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,
    capitalRE = /([A-Z])/g,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    simpleSelectorRE = /^[\w-]*$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div'),
    propMap = {
      'tabindex': 'tabIndex',
      'readonly': 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      'maxlength': 'maxLength',
      'cellspacing': 'cellSpacing',
      'cellpadding': 'cellPadding',
      'rowspan': 'rowSpan',
      'colspan': 'colSpan',
      'usemap': 'useMap',
      'frameborder': 'frameBorder',
      'contenteditable': 'contentEditable'
    },
    isArray = Array.isArray ||
      function(object){ return object instanceof Array }

  zepto.matches = function(element, selector) {
    if (!selector || !element || element.nodeType !== 1) return false
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) { return type(value) == "function" }
  function isWindow(obj)     { return obj != null && obj == obj.window }
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
  }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return filter.call(array, function(item){ return item != null }) }
  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    var dom, nodes, container

    // A special case optimization for a single tag
    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

    if (!dom) {
      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
      if (!(name in containers)) name = '*'

      container = containers[name]
      container.innerHTML = '' + html
      dom = $.each(slice.call(container.childNodes), function(){
        container.removeChild(this)
      })
    }

    if (isPlainObject(properties)) {
      nodes = $(dom)
      $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }

    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. Note that `__proto__` is not supported on Internet
  // Explorer. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    dom = dom || []
    dom.__proto__ = $.fn
    dom.selector = selector || ''
    return dom
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    var dom
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // Optimize for string selectors
    else if (typeof selector == 'string') {
      selector = selector.trim()
      // If it's a html fragment, create nodes from it
      // Note: In both Chrome 21 and Firefox 15, DOM error 12
      // is thrown if the fragment doesn't begin with <
      if (selector[0] == '<' && fragmentRE.test(selector))
        dom = zepto.fragment(selector, RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // If it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, just return it
    else if (zepto.isZ(selector)) return selector
    else {
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // Wrap DOM nodes.
      else if (isObject(selector))
        dom = [selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // create a new Zepto collection from the nodes found
    return zepto.Z(dom, selector)
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
      }
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found,
        maybeID = selector[0] == '#',
        maybeClass = !maybeID && selector[0] == '.',
        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
        isSimple = simpleSelectorRE.test(nameOnly)
    return (isDocument(element) && isSimple && maybeID) ?
      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
      slice.call(
        isSimple && !maybeID ?
          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
          element.getElementsByTagName(selector) : // Or a tag
          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
      )
  }

  function filtered(nodes, selector) {
    return selector == null ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = function(parent, node) {
    return parent !== node && parent.contains(node)
  }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className,
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    var num
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          !/^0/.test(value) && !isNaN(num = Number(value)) ? num :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) {
    return str == null ? "" : String.prototype.trim.call(str)
  }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      // need to check if document.body exists for IE as that browser reports
      // document ready when it hasn't yet created the body element
      if (readyRE.test(document.readyState) && document.body) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (!selector) result = []
      else if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var node = this[0], collection = false
      if (typeof selector == 'object') collection = $(selector)
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
        node = node !== context && !isDocument(node) && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = '')
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return 0 in arguments ?
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        }) :
        (0 in this ? this[0].innerHTML : null)
    },
    text: function(text){
      return 0 in arguments ?
        this.each(function(idx){
          var newText = funcArg(this, text, idx, this.textContent)
          this.textContent = newText == null ? '' : ''+newText
        }) :
        (0 in this ? this[0].textContent : null)
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && !(1 in arguments)) ?
        (!this.length || this[0].nodeType !== 1 ? undefined :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && setAttribute(this, name) })
    },
    prop: function(name, value){
      name = propMap[name] || name
      return (1 in arguments) ?
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        }) :
        (this[0] && this[0][name])
    },
    data: function(name, value){
      var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

      var data = (1 in arguments) ?
        this.attr(attrName, value) :
        this.attr(attrName)

      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      return 0 in arguments ?
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        }) :
        (this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
           this[0].value)
        )
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (!this.length) return null
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      if (arguments.length < 2) {
        var element = this[0], computedStyle = getComputedStyle(element, '')
        if(!element) return
        if (typeof property == 'string')
          return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
        else if (isArray(property)) {
          var props = {}
          $.each(isArray(property) ? property: [property], function(_, prop){
            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
          })
          return props
        }
      }

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      if (!name) return false
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      if (!name) return this
      return this.each(function(idx){
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      if (!name) return this
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(value){
      if (!this.length) return
      var hasScrollTop = 'scrollTop' in this[0]
      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
      return this.each(hasScrollTop ?
        function(){ this.scrollTop = value } :
        function(){ this.scrollTo(this.scrollX, value) })
    },
    scrollLeft: function(value){
      if (!this.length) return
      var hasScrollLeft = 'scrollLeft' in this[0]
      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
      return this.each(hasScrollLeft ?
        function(){ this.scrollLeft = value } :
        function(){ this.scrollTo(value, this.scrollY) })
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    var dimensionProperty =
      dimension.replace(/./, function(m){ return m[0].toUpperCase() })

    $.fn[dimension] = function(value){
      var offset, el = this[0]
      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var i = 0, len = node.childNodes.length; i < len; i++)
      traverseNode(node.childNodes[i], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            argType = type(arg)
            return argType == "object" || argType == "array" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        var parentInDocument = document.documentElement.contains(parent)

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          parent.insertBefore(node, target)
          if (parentInDocument) traverseNode(node, function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src)
              window['eval'].call(window, el.innerHTML)
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()



;(function($){
  var _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function(obj){ return typeof obj == 'string' },
      handlers = {},
      specialEvents={},
      focusinSupported = 'onfocusin' in window,
      focus = { focus: 'focusin', blur: 'focusout' },
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (!focusinSupported && (handler.e in focus)) ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || (focusinSupported && focus[type]) || type
  }

  function add(element, events, fn, data, selector, delegator, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    events.split(/\s/).forEach(function(event){
      if (event == 'ready') return $(document).ready(fn)
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = delegator
      var callback  = delegator || fn
      handler.proxy = function(e){
        e = compatible(e)
        if (e.isImmediatePropagationStopped()) return
        e.data = data
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      if ('addEventListener' in element)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    ;(events || '').split(/\s/).forEach(function(event){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
      if ('removeEventListener' in element)
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    var args = (2 in arguments) && slice.call(arguments, 2)
    if (isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (isString(context)) {
      if (args) {
        args.unshift(fn[context], fn)
        return $.proxy.apply(null, args)
      } else {
        return $.proxy(fn[context], fn)
      }
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, data, callback){
    return this.on(event, data, callback)
  }
  $.fn.unbind = function(event, callback){
    return this.off(event, callback)
  }
  $.fn.one = function(event, selector, data, callback){
    return this.on(event, selector, data, callback, 1)
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }

  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event)

      $.each(eventMethods, function(name, predicate) {
        var sourceMethod = source[name]
        event[name] = function(){
          this[predicate] = returnTrue
          return sourceMethod && sourceMethod.apply(source, arguments)
        }
        event[predicate] = returnFalse
      })

      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
          'returnValue' in source ? source.returnValue === false :
          source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue
    }
    return event
  }

  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    return compatible(proxy, event)
  }

  $.fn.delegate = function(selector, event, callback){
    return this.on(event, selector, callback)
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.off(event, selector, callback)
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, data, callback, one){
    var autoRemove, delegator, $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.on(type, selector, data, fn, one)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined
    if (isFunction(data) || data === false)
      callback = data, data = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(_, element){
      if (one) autoRemove = function(e){
        remove(element, e.type, callback)
        return callback.apply(this, arguments)
      }

      if (selector) delegator = function(e){
        var evt, match = $(e.target).closest(selector, element).get(0)
        if (match && match !== element) {
          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
        }
      }

      add(element, event, callback, data, selector, delegator || autoRemove)
    })
  }
  $.fn.off = function(event, selector, callback){
    var $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.off(type, selector, fn)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.trigger = function(event, args){
    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
    event._args = args
    return this.each(function(){
      // items in the collection might not be DOM elements
      if('dispatchEvent' in this) this.dispatchEvent(event)
      else $(this).triggerHandler(event, args)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, args){
    var e, result
    this.each(function(i, element){
      e = createProxy(isString(event) ? $.Event(event) : event)
      e._args = args
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return callback ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  ;['focus', 'blur'].forEach(function(name) {
    $.fn[name] = function(callback) {
      if (callback) this.bind(name, callback)
      else this.each(function(){
        try { this[name]() }
        catch(e) {}
      })
      return this
    }
  })

  $.Event = function(type, props) {
    if (!isString(type)) props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true)
    return compatible(event)
  }

})(Zepto)

;(function($){
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
    longTapDelay = 750,
    gesture

  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >=
      Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }

  function longTap() {
    longTapTimeout = null
    if (touch.last) {
      touch.el.trigger('longTap')
      touch = {}
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout)
    longTapTimeout = null
  }

  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout)
    if (tapTimeout) clearTimeout(tapTimeout)
    if (swipeTimeout) clearTimeout(swipeTimeout)
    if (longTapTimeout) clearTimeout(longTapTimeout)
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
    touch = {}
  }

  function isPrimaryTouch(event){
    return (event.pointerType == 'touch' ||
      event.pointerType == event.MSPOINTER_TYPE_TOUCH)
      && event.isPrimary
  }

  function isPointerEventType(e, type){
    return (e.type == 'pointer'+type ||
      e.type.toLowerCase() == 'mspointer'+type)
  }

  $(document).ready(function(){
    var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType

    if ('MSGesture' in window) {
      gesture = new MSGesture()
      gesture.target = document.body
    }

    $(document)
      .bind('MSGestureEnd', function(e){
        var swipeDirectionFromVelocity =
          e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
        if (swipeDirectionFromVelocity) {
          if (touch && touch.el) {
            touch.el.trigger('swipe')
            touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
          }
          
        }
      })
      .on('touchstart MSPointerDown pointerdown', function(e){
        if((_isPointerType = isPointerEventType(e, 'down')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0]
        if (e.touches && e.touches.length === 1 && touch.x2) {
          // Clear out touch movement data if we have it sticking around
          // This can occur if touchcancel doesn't fire due to preventDefault, etc.
          touch.x2 = undefined
          touch.y2 = undefined
        }
        now = Date.now()
        delta = now - (touch.last || now)
        touch.el = $('tagName' in firstTouch.target ?
          firstTouch.target : firstTouch.target.parentNode)
        touchTimeout && clearTimeout(touchTimeout)
        touch.x1 = firstTouch.pageX
        touch.y1 = firstTouch.pageY
        if (delta > 0 && delta <= 250) touch.isDoubleTap = true
        touch.last = now
        longTapTimeout = setTimeout(longTap, longTapDelay)
        // adds the current touch contact for IE gesture recognition
        if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
      })
      .on('touchmove MSPointerMove pointermove', function(e){
        if((_isPointerType = isPointerEventType(e, 'move')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0]
        cancelLongTap()
        touch.x2 = firstTouch.pageX
        touch.y2 = firstTouch.pageY

        deltaX += Math.abs(touch.x1 - touch.x2)
        deltaY += Math.abs(touch.y1 - touch.y2)
      })
      .on('touchend MSPointerUp pointerup', function(e){
        if((_isPointerType = isPointerEventType(e, 'up')) &&
          !isPrimaryTouch(e)) return
        cancelLongTap()

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

          swipeTimeout = setTimeout(function() {
            if (touch && touch.el) {
              touch.el.trigger('swipe');
              touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
            }
            // touch.el.trigger('swipe')
            // touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
            touch = {}
          }, 0)

        // normal tap
        else if ('last' in touch)
          // don't fire tap when delta position changed by more than 30 pixels,
          // for instance when moving to a point and back to origin
          if (deltaX < 30 && deltaY < 30) {
            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
            // ('tap' fires before 'scroll')
            tapTimeout = setTimeout(function() {

              // trigger universal 'tap' with the option to cancelTouch()
              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
              
              if (!!!global.Kami.disableTapEvent) {

                var event = $.Event('tap')
                event.cancelTouch = cancelAll
                touch.el.trigger(event)
              }

              // trigger double tap immediately
              if (touch.isDoubleTap) {
                if (touch.el) touch.el.trigger('doubleTap')
                touch = {}
              }

              // trigger single tap after 250ms of inactivity
              else {
                touchTimeout = setTimeout(function(){
                  touchTimeout = null
                  if (touch.el) touch.el.trigger('singleTap')
                  touch = {}
                }, 250)
              }
            }, 0)
          } else {
            touch = {}
          }
          deltaX = deltaY = 0

      })
      // when the browser window loses focus,
      // for example when a modal dialog is shown,
      // cancel all ongoing events
      .on('touchcancel MSPointerCancel pointercancel', cancelAll)

    // scrolling the window indicates intention of the user
    // to scroll, not tap or swipe, so cancel all ongoing events
    $(window).on('scroll', cancelAll)
  })

  // ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
  //   'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
  //   $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
  // })
  ;['tap'].forEach(function(eventName){
    $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
  })
})(Zepto)

;(function($){
  function detect(ua, platform){
    var os = this.os = {}, browser = this.browser = {},
        webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
        android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
        osx = !!ua.match(/\(Macintosh\; Intel /),
        ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
        iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
        win = /Win\d{2}|Windows/.test(platform),
        wp = ua.match(/Windows Phone ([\d.]+)/),
        touchpad = webos && ua.match(/TouchPad/),
        kindle = ua.match(/Kindle\/([\d.]+)/),
        silk = ua.match(/Silk\/([\d._]+)/),
        blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
        bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
        rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
        playbook = ua.match(/PlayBook/),
        chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
        firefox = ua.match(/Firefox\/([\d.]+)/),
        firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
        ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
        webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
        safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/)

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    if (browser.webkit = !!webkit) browser.version = webkit[1]

    if (android) os.android = true, os.version = android[2]
    if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
    if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
    if (wp) os.wp = true, os.version = wp[1]
    if (webos) os.webos = true, os.version = webos[2]
    if (touchpad) os.touchpad = true
    if (blackberry) os.blackberry = true, os.version = blackberry[2]
    if (bb10) os.bb10 = true, os.version = bb10[2]
    if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
    if (playbook) browser.playbook = true
    if (kindle) os.kindle = true, os.version = kindle[1]
    if (silk) browser.silk = true, browser.version = silk[1]
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
    if (chrome) browser.chrome = true, browser.version = chrome[1]
    if (firefox) browser.firefox = true, browser.version = firefox[1]
    if (firefoxos) os.firefoxos = true, os.version = firefoxos[1]
    if (ie) browser.ie = true, browser.version = ie[1]
    if (safari && (osx || os.ios || win)) {
      browser.safari = true
      if (!os.ios) browser.version = safari[1]
    }
    if (webview) browser.webview = true

    os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
    (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
    os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
    (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
    (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
  }

  detect.call($, navigator.userAgent, navigator.platform)
  // make available to unit tests
  $.__detect = detect

})(Zepto)

module.exports = Zepto;

    })( module.exports , module , __context );
    __context.____MODULES[ "08ea436ba00b2c3de0c3bcb11912e372" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "897499f6c44f901ecc6fd2b84da5b878" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['08ea436ba00b2c3de0c3bcb11912e372']

    })( module.exports , module , __context );
    __context.____MODULES[ "897499f6c44f901ecc6fd2b84da5b878" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "d2b65d2151464ba0c57479ffffee2ea9" ,
        filename : "class.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * [Kami description]
 * 所以由Kami.create 或者由 Kami.extend创建的类要想用到父类的方法,需要通过
 * xxxClass.superClass.xxxmethod.apply| call(this, options)
 * 来调用
 * @category core
 */

(function () {

    'use strict';

    var utils = {};

    function Kami(options) {
        
        //由于this可能为superClass.call而来，所以this对象未必是Kami类型
        //
        if (!(this instanceof Kami) && 
            utils.isFunction(options)) {
            return utils.classify(options);
        }
        
    }

    
    /**
     * create a new Class, the base for Kami.extend and you can
     * var Dialog = Kami.create({
     *     Extends: 'Popup',
     *     Mixins: 'Position',
     *     initialize: function() {
     *         Dialog.superClass.initialize.apply(this, arguments);
     *     }
     * })
     * Kami.create(Object)
     * Kami.create(Object, options)
     * Kami.create(Function, Object)
     * @param  {Function| Object}   superClass  the parent of the created class
     * @param  {Object}             options     the options to overide or extend to 
     * @return {Class}              
     */
    Kami.create = function (superClass, options) {
        

        if (utils.isObject(superClass) && 
            superClass != null) {

            if (options && utils.isObject(options)) {
                utils.extend(superClass, options);
            }
            options = superClass;
            superClass = null;
        }
        else if (utils.isFunction(superClass)) {
            options = options || {};
            options.Extends = superClass;
        }
        else {
            throw ('invalid type of superClass to create class');
        }

        superClass = superClass || options.Extends || Kami;

        function subClass() {
            var arg = [].slice.call(arguments);
            // debugger
            superClass.apply(this, arg);
            // debugger
            if (this.constructor === subClass && utils.isFunction(this.initialize)) {
                this.initialize.apply(this, arg);
            }
        }
        if (subClass !== Kami) {
            utils.extend(subClass, superClass);
        }
        // debugger
        utils.implement.call(subClass, options);

        // subClass.superClass = superClass.prototype;
        // subClass.prototype.constructor = subClass;

        return utils.classify(subClass);
    };

    /**
     * 使用Extend的方式来拓展对象
     * 
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    Kami.extend = function (options) {
        
        // debugger
        options || (options = {});
        options.Extends = this;

        return Kami.create(options);
    };
    

    var TYPES = ['Function', 'Object', 'Array'];
    TYPES.forEach(function (type, i) {

        utils['is' + type] = function (o)  {
            return utils.toString.call(o) === '[object ' + type + ']';
        };
    });
    Array.prototype.forEach = [].forEach ? [].forEach:
    function (fn, scope) {
        for (var i = 0; i < this.length; i++) {
            fn.call(scope, this[i], i);
        }
    };

    /**
     * 除了Extend和Mixin方法以外，其他的options里的选项都拷贝到
     * subClass.prototype上
     * @param  {Object} options 选项
     */
    utils.implement = function (options) {
        var StaticMethods = Kami.StaticMethods;

        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                if (StaticMethods.hasOwnProperty(key)) {
                    StaticMethods[key].call(this, options[key]);
                }
                else {
                    this.prototype[key] = options[key];
                }
            }
        }
    };
    /**
     * 为fun添加必要的方法extend和mixin
     * 
     * @param  {[type]} fun [description]
     * @return {[type]}     [description]
     */
    utils.classify = function (fun) {
        fun.extend = Kami.extend;
        // fun.implement = utils.implement;
        return fun;
    };
    


    utils.createObject = function (proto) {
        if (Object.create) {
            return Object.create(proto);//es5
        }
        else if (Object.__proto__) {//firefox
            return {
                __proto__: proto
            };
        }
        else {
            var Ctor = function () {};
            Ctor.prototype = proto;
            return new Ctor();
        }
    };
    /**
     * 深度复制source的属性和值到target中，如果deep则递归复制
     * @param  {[type]} target [description]
     * @param  {[type]} source [description]
     * @param  {[type]} deep   [description]
     * @return {[type]}        [description]
     */
    utils.extend = function (target, source, deep) {

        for (var key in source) {
            if (source.hasOwnProperty(key) && 
                key !== 'utils') 
            { //skip Kami.utils
                if (deep && utils.isObject(source[key])) {
                    utils.extend(target[key], source[key], deep);
                }
                else {
                    if (key  !== 'prototype') {
                        target[key] = source[key];
                    }
                    
                }
            }
        }
    };
    utils.toString = Object.prototype.toString;

    /**
     * Kami static methods t
     */

    
    Kami.StaticMethods = {
        /**
         * 需要mixin的对象，数组或者单个对象，由于采用extend的方式
         * 来实现多个对象的混入，所以如果mixin的对象本身有重复的key那么
         * 遵循相同属性后边的object覆盖前边对象
         * @param  {Array | Object} superClass 父类
         */
        'Mixins': function (superClass) {

            if (!utils.isArray(superClass)) {
                superClass = [superClass];
            }
            for (var i = 0; i < superClass.length; i++) {
                var sp = superClass[i];
                //普通对象没有prototype 所以只能赋值sp本身
                utils.extend(this.prototype, sp.prototype || sp);
            }
        },
        /**
         * 通过原型链的形式来实现集成
         * 只能是唯一的，不能实现多重继承
         * @param  {Function} superClass 父类
         */
        'Extends':  function (superClass) {
            // debugger
            var superClassInstance = utils.createObject(superClass.prototype);
            utils.extend(superClassInstance, this.prototype);
            this.prototype = superClassInstance;
            this.prototype.constructor = this;
            this.superClass = superClass.prototype;
        }
        // ,
        // 'Statics': function (superClass) {
        //     for (var key in superClass) {
        //         if (superClass.hasOwnProperty(key)) {
        //             this[key] = superClass[key];
        //         }
        //     }
        // }
    };
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Kami;
    }


}());







    })( module.exports , module , __context );
    __context.____MODULES[ "d2b65d2151464ba0c57479ffffee2ea9" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "2aa616cd8537012234a4f75239bbb891" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['d2b65d2151464ba0c57479ffffee2ea9'];


    })( module.exports , module , __context );
    __context.____MODULES[ "2aa616cd8537012234a4f75239bbb891" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "ff21b565e1a890a59a1ce1bf37e9a6de" ,
        filename : "event.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    // Events
// -----------------
// 参考
//  - https://github.com/documentcloud/backbone/blob/master/backbone.js
//  - https://github.com/joyent/node/blob/master/lib/events.js

'use strict';

var eventSplitter = /\s+/;


//
//     var object = new Events();
//     object.on('expand', function(){ alert('expanded'); });
//     object.trigger('expand');
//
function Events() {
}



Events.prototype.on = function (events, callback, context) {
    var cache, event, list;
    if (!callback) {
        return this;
    }

    cache = this._events || (this._events = {});
    events = events.split(eventSplitter);//多个事件同时挂载，用空格分开'change test'

    while (event = events.shift()) {
        list = cache[event] || (cache[event] = []);
        var tmp = {
            handler: callback,
            context: context
        };
        list.push(tmp);
    }

    return this;
};

Events.prototype.once = function (events, callback, context) {
    var me = this;
    var cb = function () {
        me.off(events, cb);
        callback.apply(context || me, arguments);
    };
    return this.on(events, cb, context);
};


Events.prototype.off = function (events, callback, context) {
    var cache, event, list, i;

    // No events, or removing *all* events.
    if (!(cache = this._events)) {
        return this;
    }
    if (!(events || callback || context)) {
        delete this._events;
        return this;
    }

    events = events ? events.split(eventSplitter) : keys(cache);

  // Loop through the callback list, splicing where appropriate.
    while (event = events.shift()) {
        list = cache[event];
        if (!list) {
            continue;
        }

        if (!(callback || context)) {
            delete cache[event];
            continue;
        }

    
        for (i = list.length - 1 ; i >= 0; i--) {
            var tmp = list[i];
            if (!(callback && tmp.handler !== callback ||
                context && tmp.context !== context)) {
                list.splice(i, 1);
            }
        }
    }

    return this;
};

Events.prototype.trigger = function (events) {
    var cache, event, all, list, i, len, rest = [], args, returned = true;
    if (!(cache = this._events)) return this;

    events = events.split(eventSplitter);

  
    rest = Array.prototype.splice.call(arguments, 1);



    while (event = events.shift()) {
        // Copy callback lists to prevent modification.
        if (all = cache.all) {
            all = all.slice();
        }
        if (list = cache[event]) {
            list = list.slice();
        }

        // Execute event callbacks
        if (event !== 'all') {
            returned = triggerEvents(list, rest, this) && returned;
        }

    
    }

    return returned;
};

// Helpers
// get Enumberable property of Object

var keys = Object.keys;

if (!keys) {
    keys = function (o) {
        var result = [];

        for (var name in o) {
            if (o.hasOwnProperty(name)) {
                result.push(name);
            }
        }
        return result;
    };
}


// Execute callbacks
function triggerEvents(list, args, context) {
    var pass = true;

    if (list) {
        var i = 0, l = list.length, a1 = args[0], a2 = args[1], a3 = args[2];
    
    // http://blog.csdn.net/zhengyinhui100/article/details/7837127
        

        switch (args.length) {
            case 0: 
                for (; i < l; i ++) {
                    var tmp = list[i];
                    pass = tmp.handler.call(tmp.context || context) !== false && pass;
                }
                break;
            case 1: 
                for (; i < l; i ++) {
                    var tmp = list[i];
                    pass = tmp.handler.call(tmp.context  || context, a1) !== false && pass;
                }
                break;
            case 2: for (; i < l; i ++) {
                    var tmp = list[i];
                    pass = tmp.handler.call(tmp.context  || context, a1, a2) !== false && pass;
                }
                break;
            case 3: 
                for (; i < l; i ++) {
                    var tmp = list[i];
                    pass = tmp.handler.call(tmp.context || context, a1, a2, a3) !== false && pass;
                } 
                break;
            default: 
                for (; i < l; i ++) {
                    var tmp = list[i];
                    pass = tmp.handler.apply(tmp.context  || context, args) !== false && pass;
                } 
                break;
        }
    }
    // trigger will return false if one of the callbacks return false
    return pass;
}
module.exports = Events;

    })( module.exports , module , __context );
    __context.____MODULES[ "ff21b565e1a890a59a1ce1bf37e9a6de" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "4120380dba6629de1d4e31134cbbd9e4" ,
        filename : "attribute.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * @namespace Attribute
 * kami中属性的处理对象mixin到base中
 * @name {Object} Attribute
 * @private
 */
;(function () {
    'use strict';
    var Attribute = {
        /**
         * 合并和解析参数
         * 
         * @function initAttrs
         * @memberOf  Attribute
         * @private
         * @param  {Object} config 配置项
         */
        initAttrs : function (config) {
            
            var options = this.options = {};

            mergeInheritedOptions(options, this);

            if (config) {
                
                merge(options, config);
                
            }
            
            parseEventsFromOptions(this, options);

        },
        /**
         * 获取options中的参数
         * @function get
         * @memberOf  Attribute
         * @version  0.0.1
         * @param  {String} key key的名字
         * @return {Object}     对应的key的值
         * 
         */
        get: function (key) {
            var options = this.options;
            
            var value = null;
            if (options.hasOwnProperty(key)) {
                value = options[key];
            }
            
            return value;

        },
        /**
         * 设置options中的参数
         * @function set
         * @memberOf  Attribute
         * @param  {String} key key的名字
         * @param {Object}  value   对应的key的值
         */
        set: function (key, value) {
            //【TODO setter和getter】
            var options = this.options;
            if (options.hasOwnProperty(key)) {
                options[key] = value;
            }
        }
        
    };

    /**
     * 暴露当前接口
     */
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Attribute;
    } 

    var toString = Object.prototype.toString;
    


    var isArray = Array.isArray || function (val) {
        return toString.call(val) === '[object Array]';
    };

    function isFunction(val) {
        return toString.call(val) === '[object Function]';
    }

    function isWindow(o) {
        return o != null && o == o.window;
    }

    function isPlainObject(o) {

        if (!o || toString.call(o) !== '[object Object]' ||
            o.nodeType || isWindow(o)) {
            return false;
        }
        else {
            return true;
        }

    }

    function isEmptyObject(o) {
        if (!o || toString.call(o) !== '[object Object]' ||
          o.nodeType || isWindow(o) || !o.hasOwnProperty) {
            return false;
        }

        for (var p in o) {
            if (o.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    }

    

    function merge(receiver, supplier) {
        var key, value;
        for (key in supplier) {
            if (supplier.hasOwnProperty(key)) {
                value = supplier[key];
                // 只 clone 数组和 plain object，其他的保持不变
                if (isArray(value)) {
                    value = value.slice();
                } else if (isPlainObject(value)) {
                    var prev = receiver[key];
                    isPlainObject(prev) || (prev = {});
                    value = merge(prev, value);
                }
                receiver[key] = value;
            }
        }
        return receiver;
    }

    function mergeInheritedOptions(options, instance) {
        // debugger
        var inherited = [];
        // debugger
        var proto = instance.constructor.prototype;
        //在类的创建时，已经将options拷贝到subClass.prototype上
        //
        while (proto) {
            // 不要拿到 prototype 上的
            if (!proto.hasOwnProperty('options')) {
                proto.options = {};
            }
            // 为空时不添加
            if (!isEmptyObject(proto.options)) {
                inherited.unshift(proto.options);
            }

            // 向上回溯一级
            proto = proto.constructor.superClass;

            
        }

        // Merge and clone default values to instance.
        while (inherited.length) {
            var item = inherited.shift();
            merge(options, item);
        }
 
    }



    var EVENT_PATTERN = /^(on)([a-zA-Z]*)$/;
    var EVENT_NAME_PATTERN = /^([cC]hange)?([a-zA-Z]*)/;

    function parseEventsFromOptions(host, options) {
        // debugger
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                var value, m;
                if (options[key] != null) {
                    value = options[key].value || options[key];
                }
                
                // debugger
                if (isFunction(value) && (m = key.match(EVENT_PATTERN))) {
                    // this.on('show', value)
                    //this.on('change:title', value);
                    host[m[1]](getEventName(m[2]), value);
                    delete options[key];
                }
            }
        }
    }

    // Converts `Show` to `show` and `changeTitle` to `change:title`
    function getEventName(name) {
        //[TODO] 优化暴露事件
        // debugger
        // var m = name.match(EVENT_NAME_PATTERN);
        // var ret = m[1] ? 'change:' : '';
        // ret += m[2].toLowerCase();
        // return ret;
        name = name || '';
        return name.toLowerCase();
    }

    return Attribute;
    
}());

    })( module.exports , module , __context );
    __context.____MODULES[ "4120380dba6629de1d4e31134cbbd9e4" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "abd579a8b2b24e29a951c5f179d83f8d" ,
        filename : "base.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * @class Base
 * 工具类组件的基类
 * @constructor
 * @mixin Attribute,Event
 * @category core
 */

;(function () {
    'use strict';

    var Kami =__context.____MODULES['2aa616cd8537012234a4f75239bbb891'];
    var Event =__context.____MODULES['ff21b565e1a890a59a1ce1bf37e9a6de'];
    
    var Attribute =__context.____MODULES['4120380dba6629de1d4e31134cbbd9e4'];
    
    var Base = Kami.create({
        Mixins: [Event, Attribute],

        /**
         * 初始化Kami组件
         * @param  {Object} config 用户传进来的选项
         * @memberOf  Base
         * @function initialize
         */
        initialize: function (config) {
           
            this.initAttrs(config);
        },
        /**
         * 销毁组件
         * @memberOf  Base
         * @function destroy
         */
        destroy: function () {
            this.off();
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
            this.destroy = function () {};
            this.isDestroy = true;
        }

    });
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Base;
    }
    
}());





    })( module.exports , module , __context );
    __context.____MODULES[ "abd579a8b2b24e29a951c5f179d83f8d" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "ba335bae023b1e48c033d17d911cf60a" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['abd579a8b2b24e29a951c5f179d83f8d'];


    })( module.exports , module , __context );
    __context.____MODULES[ "ba335bae023b1e48c033d17d911cf60a" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "55edef3ca75bcd9fc263a892f982352f" ,
        filename : "widget.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * Kami非工具类组件的基类，提供了组件的生命周期，初始化，渲染，销毁等
 * 
 * @author  sharon.li <xuan.li@qunar.com>
 * @class Widget
 * @constructor
 * @extends Base
 * @category core
 * @required yo-base, yo-ddd
 * 
 */
/**
 * @quote
 * 关于resize的处理，当窗口resize后
 * 需要重新计算与节点属性相关的属性，默认调用组件的resize方法
 * 继承与widget或者widget子类的组件，需要实现自己的resize方法
 * 
 * 关于组合组件，例如组件A由 A1, A2组成，为了避免A1 A2的resize和
 * A出现问题，推荐在A中实现resize，而A1,A2的实例将resizable
 * 设置为false
 * @return {[type]} [description]
 */

(function () {

    'use strict';
    

    var $ =__context.____MODULES['897499f6c44f901ecc6fd2b84da5b878'];
    
    var Base =__context.____MODULES['ba335bae023b1e48c033d17d911cf60a'];
    
    
    window.Kami = window.Kami || {};
    window.Kami._widgetCache = {};

    
    var EVENT_PREFIX = 'delegate-event-{cid}:';
    var DATA_WIDGET_CID = 'data-widget-cid';
    var DELEGATE_EVENT_NS = '.delegate-events-';
    var $PARENT_NODE = document.body;
    var Widget = Base.extend({
        /**
         * @property {HTMLElement| String} container @require组件的容器
         * @property {HTMLElement} parentNode 父容器，默认为body
         * @property {String} template 模板字符串
         * @property {String} skin 默认的皮肤
         * @property {String} extraClass 组件根节点添加的额外样式
         * @property {Boolean} resizable 组件是否会根据响应窗口变化事件，默认为true
         * @memberOf Widget
         */
        options: {
            //当前组件的类型
            type: 'widget',

            container: null,

            // // 默认数据模型
            // datasource: null,

            // 组件的默认父节点
            parentNode: document.body,

            template: null,

            //组件界别的主题
            skin: 'ui',

            //组件提供的额外样式选项
            extraClass: '',

            // attr: {},
            // yo: false,

            events: {
                // 'eventName selector' : function() {}
            },
            resizable: true //是否允许监听窗口resize
        },
        /**
         * 获取组件样式命名空间的前缀
         * @function  getClassNamePrefix
         * @memberOf  Widget
         * @private
         * @return {String} 返回组件命名空间前缀
         */
        getClassNamePrefix : function () {
            

            var uiPrefix = window.Kami.theme || this.get('skin');
            uiPrefix += '-';


            if (!this.classNamePrefix) {
                var options = this.options;
                if (!this.get('className')) {
                    var type = options.type || 'widget';
                    this.classNamePrefix =  uiPrefix + type.toLowerCase();
                }
                else {
                    this.classNamePrefix = this.get('className').toString();
                }
            }
            return this.classNamePrefix;
        },
        /**
         * 获得组件的样式命名空间
         * @function  getClassName
         * @memberOf  Widget
         * @param  {String} name 样式名称
         * @return {String}   组件的样式命名空间
         */
        getClassName: function (name) {
            /**
             * @type {[type]}
             */
            if (!this.classNamePrefix) {
                this.getClassNamePrefix();
            }
            if (name) {
                name = '-' + name;
            }
            else {
                name = '';
            }
            return this.classNamePrefix + name;
        },

        /**
         * 获得组件根节点
         * 获得组件的样式命名空间
         * @function  _getMainElement
         * @memberOf  Widget
         * @private
         * @param  {Object} config 配置项
         */
        _getMainElement: function (config) {
            this.widgetEl = null;
            var container = this.get('container');

            if (this.get('template')) {
                this.fromTemplate = true;
                try {
                    this.widgetEl = $(this.parseTemplate(this.get('template')));
                    //获得组件的容器
                    container = container || $PARENT_NODE;
                    container = $(container);
                }
                catch (e) {
                    throw new Error('template is not valid');
                }
            }
            else {
                //没传模板，只有容器，仅仅兼容在页面上自己写组件HTML的形式
                container = container || $PARENT_NODE;
                container = $(container);

                if (!container.length) { 
                    console.log('type of widget is ' + this.options.type);
                    throw new Error('container is not valid');
                } else {
                    //获得组件的容器
                    this.widgetEl = $(container[0].firstElementChild);
                }
            }
            
            this.container = $(container);
        },
        
        /**
         * 子类可以覆盖如何处理tpl
         * @function parseTemplate
         * @memberOf  Widget
         * @param  {String} tpl 模板字符串
         * @return {String}     解析后的模板字符串
         */
        parseTemplate : function (tpl) {
            return tpl || '';
        },
        
        /**
         * 组件初始化方法,initialize是new组件时调用的，而init是给子组件暴露的方法
         * 可以在该方法中绑定事件或者处理其他逻辑
         * @function init
         * @private
         * @memberOf  Widget
         */
        init : function () {

        },
        /**
         * 对参数进行初始化，内部调用Base的initialize方法来
         * 进行参数初始化
         * @function initialize
         * @private
         * @memberOf  Widget
         * @param  {Object} config  配置项
         * @return {Kami}        返回当前组件的实例
         */
        initialize: function (config) {
            if (!this._isInit) {
               
                

                this.cid = uniqueCid();

                this._widgetMap = this.get('_widgetMap') || {};


                // debugger
                Widget.superClass.initialize.call(this, config);

                //初始化样式和样式名称前缀
                this.getClassNamePrefix();

                

                //启动UI
                //init方法是对子类开发的接口，如果需要在new的时候进行初始化，那么可以覆盖这个方法
                //
                this.init();
                

                //初始化this.container 和 .this.widgetEl 对象
                //
            
                this._getMainElement(config);

                this.delegateEvents();
                
                //缓存UI
                this._cacheWidget();

                this._isInit = true;

                return this;

            }
            else {
                return this;
            }
            
        },
        /**
         * 缓存当前组件
         * 进行参数初始化
         * @memberOf  Widget
         * @function _cacheWidget
         * @private
         */
        _cacheWidget: function () {
            var cid = this.cid;
            Kami._widgetCache[this.cid] = this;
            this.widgetEl.attr(DATA_WIDGET_CID, cid);
            // debugger

        },
        /**
         * 渲染组件到页面中
         * 并且出发事件，方便用户处理在组件渲染后的行为
         * @function render
         * @memberOf  Widget
         * @return {Kami} 返回当前组件实例
         */
        render: function () {
            
            if (!this._isRender) {
                
                 
                // 插入到文档流中
                if (this.fromTemplate) {
                    this.widgetEl.appendTo(this.container);
                }
                this._isRender = true;
                
                this.widgetEl.addClass(this.getClassName());
                var extraClass = this.get('extraClass') || '';
                if (extraClass) {
                    this.widgetEl.addClass(extraClass);
                }
                // this.__renderEvent();
            }
            
            return this;

        },
        /**
         * 空方法，需要子类自己去实现
         * @function resize
         * @memberOf  Widget
         */
        resize: function () {},
        /**
         * 不需要在代理到container的事件，解绑方法
         * 例如resize
         * @function __renderEvent
         * @memberOf  Widget
         * @private
         */
        __renderEvent: function () {

            var widget = this;
            
            
            widget.__resizeFun = function () {
            // debugger
                if (widget.__resizeTimer) {
                    clearTimeout(widget.__resizeTimer);
                }
                widget.__resizeTimer = setTimeout(function () {
                    // console.log('resize');
                    widget.resize();
                }, 200);
                
            };

            var resizable = !!this.get('resizable');
            if (resizable) {
                window.addEventListener('resize', widget.__resizeFun);
            }
        },
        /**
         * 不需要在代理到container的事件，解绑方法
         * 例如resize
         * @function __unrenderEvent
         * @memberOf  Widget
         * @private
         */
        __unrenderEvent: function () {

            var widget = this;
            var resizable = !!this.get('resizable');
            if (resizable) {
                window.removeEventListener('resize', widget.__resizeFun);
            }
        },
        
        /**
         * 注册事件代理
         * @function delegateEvents
         * @memberOf  Widget
         * @param  {HTMLElement} element 代理事件的节点
         * @param  {Object} events  事件对象
         * @param  {Function} handler 事件的处理方法
         * @return {Kami}        返回Kami组件
         */
        delegateEvents: function (element, events, handler) {
            // debugger
            if (arguments.length === 0) {
                events = this.get('events');
                element = this.widgetEl;
            }
            else if (arguments.length === 1) {
                events = element;
                element = this.widgetEl;
            }
            else if (arguments.length === 2) {
                handler = events;
                events = element;
                element = this.widgetEl;
            }
            else {
                element = element || this.widgetEl;
                this._delegateEvent = this._delegateEvent || [];
                this._delegateEvent.push(element);
            }
            
            // debugger
            // key 为 'event selector'
            for (var key in events) {
                if (!events.hasOwnProperty(key)) {
                    continue;
                }
                //args:{type, selector}
                //type: tap.delegateeventtype{cid}
                var args = parseEventKey(key, this);
                var eventType = args.type;
                // console.log('widget:eventType=' + eventType);
                var selector = args.selector;

                
                (function (handler, widget) {
                    
                    //事件如果为字符串而非function则默认在this中查找
                    var callback = function (ev) {

                        if ($.isFunction(handler)) {
                            return handler.call(widget, ev, this);
                        } else {
                            
                            return widget[handler](ev, this);
                        }
                    };

                    if (selector) {
                        // console.log(element[0])
                        $(element).on(eventType, selector, callback);
                    } else {
                        $(element).on(eventType, callback);
                    }
                }(events[key], this));
            }

            // 绑定window resize handler
            this.__renderEvent();

            return this;
        },

        
        /**
         * 卸载事件代理
         * @function undelegateEvents
         * @memberOf  Widget
         * @param  {HTMLElement} element  需要卸载事件的节点
         * @param  {String} eventKey 需要卸载的事件名称
         * @return {Kami}        返回Kami组件
         */
        undelegateEvents: function (element, eventKey) {
            

            if (!eventKey) {
                eventKey = element;
                element = null;
            }
            // 卸载所有
            if (arguments.length === 0) {
                var type = DELEGATE_EVENT_NS + this.cid;
                
                this.widgetEl && this.widgetEl.off(type);
                // 卸载所有外部传入的 element
                if (this._delegateElements) {
                    for (var de in this._delegateEvent) {
                        if (!this._delegateEvent.hasOwnProperty(de)) continue;
                        this._delegateEvent[de].off(type);
                    }
                }
            } else {
                var args = parseEventKey(eventKey, this);
                // 卸载 this.widgetEl
                // .undelegateEvents(events)
                if (!element) {
                    this.widgetEl && this.widgetEl.off(args.type, args.selector);
                } else {
                    $(element).off(args.type, args.selector);
                }
            }

            // 绑定window resize handler
            this.__unrenderEvent();

            return this;
        },
        
        /**
         * 销毁组件
         * @function destroy
         * @memberOf  Widget
         */
        destroy: function () {
            this.undelegateEvents();
            delete Kami._widgetCache[this.cid];

            var widgetMap = this._widgetMap || {};
            for (var key in widgetMap) {
                if (widgetMap.hasOwnProperty(key)) {
                    var _widget = widgetMap[key];
                    if (_widget && _widget instanceof Widget) {
                        _widget.destroy && _widget.destroy();
                    }
                }
            }
            
            if (this.fromTemplate) {
                
                this.widgetEl.remove();
            }
            
            

            Widget.superClass.destroy.call(this);
            

            this.container = null;
            this.widgetEl = null;
            
        }


    });

    
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Widget;
    }

    $.isEmptyObject = function(obj) {
        return $.isPlainObject(obj) && (Object.keys(obj) === 0);
    };
    /**
     * 是否已经在document中
     * @param  {[type]}  el [description]
     * @return {Boolean}    [description]
     */
    function isInDocument (el) {
        if (el && !el.nodeName) {
            el = el[0];
        }
        return $.contains(document, el);
    }
    /**
     * handler is not function then skip it
     * @param  {[type]} events [description]
     * @return {[type]}        [description]
     */
    function parseEvent(events, widget) {
        var newEvent = [];
        for (var key in events) {
            if (!events.hasOwnProperty(key)) {
                continue;
            }
            var value = events[key];
            if ($.isFunction(value)) {
                var o  = {};
                var keyArr = key.split(/\s+/);
                o.type = EVENT_PREFIX.replace('{cid}', widget.cid) +  keyArr[0];
                o.selector = keyArr.length > 1 ? keyArr[1] : null;
                o.handler = value;
                newEvent.push(o);
            }

        }
        return newEvent;
    }
    function uniqueCid() {
        return 'widget-' + setTimeout('1');
    }
    //默认dom 绑定事件格式为'tap selector': function() {}
    //
    var EVENT_KEY_SPLITTER = /^(\S+)\s*(.*)$/;
    var INVALID_SELECTOR = 'INVALID_SELECTOR';

    function parseEventKey(eventKey, widget) {
        var match = eventKey.match(EVENT_KEY_SPLITTER);
        //tap.delegateeventtype{cid}
        var eventType = match[1] + DELEGATE_EVENT_NS + widget.cid;

        // 当没有 selector 时，需要设置为 undefined，以使得 zepto 能正确转换为 bind
        var selector = match[2] || undefined;

        return {
            type: eventType,
            selector: selector
        };
    }

    window.addEventListener('unload', function () {
        
        for (var key in Kami._widgetCache) {
            if (Kami._widgetCache.hasOwnProperty(key)) {
                var widget = Kami._widgetCache[key];
                widget && widget.destroy && widget.destroy();
                
            }
        }
    });

}());




    })( module.exports , module , __context );
    __context.____MODULES[ "55edef3ca75bcd9fc263a892f982352f" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "727699dca154f9ef72d5e879dadfb5a5" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['55edef3ca75bcd9fc263a892f982352f']

    })( module.exports , module , __context );
    __context.____MODULES[ "727699dca154f9ef72d5e879dadfb5a5" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "541bfb7b549627999e3defd0404b76bf" ,
        filename : "arttemplate.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /*!
 * artTemplate - Template Engine
 * https://github.com/aui/artTemplate
 * Released under the MIT, BSD, and GPL Licenses
 */
 
!(function () {


/**
 * 模板引擎
 * @name    template
 * @param   {String}            模板名
 * @param   {Object, String}    数据。如果为字符串则编译并缓存编译结果
 * @return  {String, Function}  渲染好的HTML字符串或者渲染方法
 */
var template = function (filename, content) {
    return typeof content === 'string'
    ?   compile(content, {
            filename: filename
        })
    :   renderFile(filename, content);
};


template.version = '3.0.0';


/**
 * 设置全局配置
 * @name    template.config
 * @param   {String}    名称
 * @param   {Any}       值
 */
template.config = function (name, value) {
    defaults[name] = value;
};



var defaults = template.defaults = {
    openTag: '{{#',    // 逻辑语法开始标签
    closeTag: '}}',   // 逻辑语法结束标签
    escape: true,     // 是否编码输出变量的 HTML 字符
    cache: true,      // 是否开启缓存（依赖 options 的 filename 字段）
    compress: false,  // 是否压缩输出
    parser: null      // 自定义语法格式器 @see: template-syntax.js
};


var cacheStore = template.cache = {};


/**
 * 渲染模板
 * @name    template.render
 * @param   {String}    模板
 * @param   {Object}    数据
 * @return  {String}    渲染好的字符串
 */
template.render = function (source, options) {
    return compile(source, options);
};


/**
 * 渲染模板(根据模板名)
 * @name    template.render
 * @param   {String}    模板名
 * @param   {Object}    数据
 * @return  {String}    渲染好的字符串
 */
var renderFile = template.renderFile = function (filename, data) {
    var fn = template.get(filename) || showDebugInfo({
        filename: filename,
        name: 'Render Error',
        message: 'Template not found'
    });
    return data ? fn(data) : fn;
};


/**
 * 获取编译缓存（可由外部重写此方法）
 * @param   {String}    模板名
 * @param   {Function}  编译好的函数
 */
template.get = function (filename) {

    var cache;
    
    if (cacheStore[filename]) {
        // 使用内存缓存
        cache = cacheStore[filename];
    } else if (typeof document === 'object') {
        // 加载模板并编译
        var elem = document.getElementById(filename);
        
        if (elem) {
            var source = (elem.value || elem.innerHTML)
            .replace(/^\s*|\s*$/g, '');
            cache = compile(source, {
                filename: filename
            });
        }
        else {
            var source = filename
            .replace(/^\s*|\s*$/g, '').replace(/<!--[\s\S]*?-->/g, '');
            cache = compile(source, {
                templateStr: filename
            });
        }
    }

    return cache;
};


var toString = function (value, type) {

    if (typeof value !== 'string') {

        type = typeof value;
        if (type === 'number') {
            value += '';
        } else if (type === 'function') {
            value = toString(value.call(value));
        } else {
            value = '';
        }
    }

    return value;

};


var escapeMap = {
    "<": "&#60;",
    ">": "&#62;",
    '"': "&#34;",
    "'": "&#39;",
    "&": "&#38;"
};


var escapeFn = function (s) {
    return escapeMap[s];
};

var escapeHTML = function (content) {
    return toString(content)
    .replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
};


var isArray = Array.isArray || function (obj) {
    return ({}).toString.call(obj) === '[object Array]';
};


var each = function (data, callback) {
    var i, len;        
    if (isArray(data)) {
        for (i = 0, len = data.length; i < len; i++) {
            callback.call(data, data[i], i, data);
        }
    } else {
        for (i in data) {
            callback.call(data, data[i], i);
        }
    }
};


var utils = template.utils = {

    $helpers: {},

    $include: renderFile,

    $string: toString,

    $escape: escapeHTML,

    $each: each
    
};/**
 * 添加模板辅助方法
 * @name    template.helper
 * @param   {String}    名称
 * @param   {Function}  方法
 */
template.helper = function (name, helper) {
    helpers[name] = helper;
};

var helpers = template.helpers = utils.$helpers;




/**
 * 模板错误事件（可由外部重写此方法）
 * @name    template.onerror
 * @event
 */
template.onerror = function (e) {
    var message = 'Template Error\n\n';
    for (var name in e) {
        message += '<' + name + '>\n' + e[name] + '\n\n';
    }
    
    if (typeof console === 'object') {
        console.error(message);
    }
};


// 模板调试器
var showDebugInfo = function (e) {

    template.onerror(e);
    
    return function () {
        return '{Template Error}';
    };
};


/**
 * 编译模板
 * 2012-6-6 @TooBug: define 方法名改为 compile，与 Node Express 保持一致
 * @name    template.compile
 * @param   {String}    模板字符串
 * @param   {Object}    编译选项
 *
 *      - openTag       {String}
 *      - closeTag      {String}
 *      - filename      {String}
 *      - escape        {Boolean}
 *      - compress      {Boolean}
 *      - debug         {Boolean}
 *      - cache         {Boolean}
 *      - parser        {Function}
 *
 * @return  {Function}  渲染方法
 */
var compile = template.compile = function (source, options) {
    // 合并默认配置
    options = options || {};
    for (var name in defaults) {
        if (options[name] === undefined) {
            options[name] = defaults[name];
        }
    }


    var filename = options.filename;


    try {
        var Render = compiler(source, options);
        
    } catch (e) {
    
        e.filename = filename || 'anonymous';
        e.name = 'Syntax Error';

        return showDebugInfo(e);
        
    }
    
    
    // 对编译结果进行一次包装

    function render (data) {
        
        try {
            
            return new Render(data, filename) + '';
            
        } catch (e) {
            
            // 运行时出错后自动开启调试模式重新编译
            if (!options.debug) {
                options.debug = true;
                return compile(source, options)(data);
            }
            
            return showDebugInfo(e)();
            
        }
        
    }
    

    render.prototype = Render.prototype;
    render.toString = function () {
        return Render.toString();
    };


    if (filename && options.cache) {
        cacheStore[filename] = render;
    }

    
    return render;

};




// 数组迭代
var forEach = utils.$each;


// 静态分析模板变量
var KEYWORDS =
    // 关键字
    'break,case,catch,continue,debugger,default,delete,do,else,false'
    + ',finally,for,function,if,in,instanceof,new,null,return,switch,this'
    + ',throw,true,try,typeof,var,void,while,with'

    // 保留字
    + ',abstract,boolean,byte,char,class,const,double,enum,export,extends'
    + ',final,float,goto,implements,import,int,interface,long,native'
    + ',package,private,protected,public,short,static,super,synchronized'
    + ',throws,transient,volatile'

    // ECMA 5 - use strict
    + ',arguments,let,yield'

    + ',undefined';

var REMOVE_RE = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g;
var SPLIT_RE = /[^\w$]+/g;
var KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g');
var NUMBER_RE = /^\d[^,]*|,\d[^,]*/g;
var BOUNDARY_RE = /^,+|,+$/g;
var SPLIT2_RE = /^$|,+/;


// 获取变量
function getVariable (code) {
    return code
    .replace(REMOVE_RE, '')
    .replace(SPLIT_RE, ',')
    .replace(KEYWORDS_RE, '')
    .replace(NUMBER_RE, '')
    .replace(BOUNDARY_RE, '')
    .split(SPLIT2_RE);
};


// 字符串转义
function stringify (code) {
    return "'" + code
    // 单引号与反斜杠转义
    .replace(/('|\\)/g, '\\$1')
    // 换行符转义(windows + linux)
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n') + "'";
}


function compiler (source, options) {
    
    var debug = options.debug;
    var openTag = options.openTag;
    var closeTag = options.closeTag;
    var parser = options.parser;
    var compress = options.compress;
    var escape = options.escape;
    

    
    var line = 1;
    var uniq = {$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1};
    


    var isNewEngine = ''.trim;// '__proto__' in {}
    var replaces = isNewEngine
    ? ["$out='';", "$out+=", ";", "$out"]
    : ["$out=[];", "$out.push(", ");", "$out.join('')"];

    var concat = isNewEngine
        ? "$out+=text;return $out;"
        : "$out.push(text);";
          
    var print = "function(){"
    +      "var text=''.concat.apply('',arguments);"
    +       concat
    +  "}";

    var include = "function(filename,data){"
    +      "data=data||$data;"
    +      "var text=$utils.$include(filename,data,$filename);"
    +       concat
    +   "}";

    var headerCode = "'use strict';"
    + "var $utils=this,$helpers=$utils.$helpers,"
    + (debug ? "$line=0," : "");
    
    var mainCode = replaces[0];

    var footerCode = "return new String(" + replaces[3] + ");"
    
    // html与逻辑语法分离
    forEach(source.split(openTag), function (code) {
        code = code.split(closeTag);
        
        var $0 = code[0];
        var $1 = code[1];
        
        // code: [html]
        if (code.length === 1) {
            
            mainCode += html($0);
         
        // code: [logic, html]
        } else {
            
            mainCode += logic($0);
            
            if ($1) {
                mainCode += html($1);
            }
        }
        

    });
    
    var code = headerCode + mainCode + footerCode;
    
    // 调试语句
    if (debug) {
        code = "try{" + code + "}catch(e){"
        +       "throw {"
        +           "filename:$filename,"
        +           "name:'Render Error',"
        +           "message:e.message,"
        +           "line:$line,"
        +           "source:" + stringify(source)
        +           ".split(/\\n/)[$line-1].replace(/^\\s+/,'')"
        +       "};"
        + "}";
    }
    
    
    
    try {
        
        
        var Render = new Function("$data", "$filename", code);
        Render.prototype = utils;

        return Render;
        
    } catch (e) {
        e.temp = "function anonymous($data,$filename) {" + code + "}";
        throw e;
    }



    
    // 处理 HTML 语句
    function html (code) {
        
        // 记录行号
        line += code.split(/\n/).length - 1;

        // 压缩多余空白与注释
        if (compress) {
            code = code
            .replace(/\s+/g, ' ')
            .replace(/<!--[\w\W]*?-->/g, '');
        }
        
        if (code) {
            code = replaces[1] + stringify(code) + replaces[2] + "\n";
        }

        return code;
    }
    
    
    // 处理逻辑语句
    function logic (code) {

        var thisLine = line;
       
        if (parser) {
        
             // 语法转换插件钩子
            code = parser(code, options);
            
        } else if (debug) {
        
            // 记录行号
            code = code.replace(/\n/g, function () {
                line ++;
                return "$line=" + line +  ";";
            });
            
        }
        
        
        // 输出语句. 编码: <%=value%> 不编码:<%=#value%>
        // <%=#value%> 等同 v2.0.3 之前的 <%==value%>
        if (code.indexOf('=') === 0) {
            var codeEscape = /^=[=#]/.test(code);
            var escapeSyntax = null;
            if (escape) {
                if (codeEscape) {
                    escapeSyntax = false;
                }
                else {
                    escapeSyntax = true;
                }
            }
            else {
                if (!codeEscape) {
                    escapeSyntax = false;
                }
                else {
                    escapeSyntax = true;
                }
            }
            
            // var escapeSyntax = escape ^ !/^=[=#]/.test(code);

            code = code.replace(/^=[=#]?|[\s;]*$/g, '');

            // 对内容编码
            if (escapeSyntax) {

                var name = code.replace(/\s*\([^\)]+\)/, '');

                // 排除 utils.* | include | print
                
                if (!utils[name] && !/^(include|print)$/.test(name)) {
                    code = "$escape(" + code + ")";
                }

            // 不编码
            } else {
                code = "$string(" + code + ")";
            }
            

            code = replaces[1] + code + replaces[2];

        }
        
        if (debug) {
            code = "$line=" + thisLine + ";" + code;
        }
        
        // 提取模板中的变量名
        forEach(getVariable(code), function (name) {
            
            // name 值可能为空，在安卓低版本浏览器下
            if (!name || uniq[name]) {
                return;
            }

            var value;

            // 声明模板变量
            // 赋值优先级:
            // [include, print] > utils > helpers > data
            if (name === 'print') {

                value = print;

            } else if (name === 'include') {
                
                value = include;
                
            } else if (utils[name]) {

                value = "$utils." + name;

            } else if (helpers[name]) {

                value = "$helpers." + name;

            } else {

                value = "$data." + name;
            }
            
            headerCode += name + "=" + value + ",";
            uniq[name] = true;
            
            
        });
        
        return code + "\n";
    }
    
    
};



// 定义模板引擎的语法


defaults.openTag = '{{';
defaults.closeTag = '}}';


var filtered = function (js, filter) {
    var parts = filter.split(':');
    var name = parts.shift();
    var args = parts.join(':') || '';

    if (args) {
        args = ', ' + args;
    }

    return '$helpers.' + name + '(' + js + args + ')';
}


defaults.parser = function (code, options) {

    // var match = code.match(/([\w\$]*)(\b.*)/);
    // var key = match[1];
    // var args = match[2];
    // var split = args.split(' ');
    // split.shift();

    code = code.replace(/^\s/, '');

    var split = code.split(' ');
    var key = split.shift();
    var args = split.join(' ');

    

    switch (key) {

        case 'if':

            code = 'if(' + args + '){';
            break;

        case 'else':
            
            if (split.shift() === 'if') {
                split = ' if(' + split.join(' ') + ')';
            } else {
                split = '';
            }

            code = '}else' + split + '{';
            break;

        case '/if':

            code = '}';
            break;

        case 'each':
            
            var object = split[0] || '$data';
            var as     = split[1] || 'as';
            var value  = split[2] || '$value';
            var index  = split[3] || '$index';
            
            var param   = value + ',' + index;
            
            if (as !== 'as') {
                object = '[]';
            }
            
            code =  '$each(' + object + ',function(' + param + '){';
            break;

        case '/each':

            code = '});';
            break;

        case 'echo':

            code = 'print(' + args + ');';
            break;

        case 'print':
        case 'include':

            code = key + '(' + split.join(',') + ');';
            break;

        default:

            // 过滤器（辅助方法）
            // {{value | filterA:'abcd' | filterB}}
            // >>> $helpers.filterB($helpers.filterA(value, 'abcd'))
            // TODO: {{ddd||aaa}} 不包含空格
            if (/^\s*\|\s*[\w\$]/.test(args)) {

                var escape = true;

                // {{#value | link}}
                if (code.indexOf('#') === 0) {
                    code = code.substr(1);
                    escape = false;
                }

                var i = 0;
                var array = code.split('|');
                var len = array.length;
                var val = array[i++];

                for (; i < len; i ++) {
                    val = filtered(val, array[i]);
                }

                code = (escape ? '=' : '=#') + val;

            // 即将弃用 {{helperName value}}
            } else if (template.helpers[key]) {
                
                code = '=#' + key + '(' + split.join(',') + ');';
            
            // 内容直接输出 {{value}}
            } else {

                code = '=' + code;
            }

            break;
    }
    
    
    return code;
};



// RequireJS && SeaJS
if (typeof define === 'function') {
    define(function() {
        return template;
    });

// NodeJS
} else if (typeof exports !== 'undefined') {
    module.exports = template;
} else {
    this.template = template;
}

})();

    })( module.exports , module , __context );
    __context.____MODULES[ "541bfb7b549627999e3defd0404b76bf" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "a7b332e3aae389b1d4ef919d43d23251" ,
        filename : "template.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    var template =__context.____MODULES['541bfb7b549627999e3defd0404b76bf'];
template.config('parser', parser);
template.config('escape', false);
function parser(code, options) {

    // var match = code.match(/([\w\$]*)(\b.*)/);
    // var key = match[1];
    // var args = match[2];
    // var split = args.split(' ');
    // split.shift();

    code = code.replace(/^\s/, '');

    var split = code.split(/\s+/);
    var key = split.shift();
    var args = split.join(' ');

    

    switch (key) {

        case 'if':
        case '#if':

            code = 'if(' + args + '){';
            break;

        case 'else':
        case '#else':
            if (split.shift() === 'if') {
                split = ' if(' + split.join(' ') + ')';
            } else {
                split = '';
            }

            code = '}else' + split + '{';
            break;

        case '/if':

            code = '}';
            break;

        case 'each':
        case '#each':    
            var object = split[0] || '$data';
            var as     = split[1] || 'as';
            var value  = split[2] || '$value';
            var index  = split[3] || '$index';
            
            var param   = value + ',' + index;
            
            if (as !== 'as') {
                object = '[]';
            }
            
            code =  '$each(' + object + ',function(' + param + '){';
            break;

        case '/each':

            code = '});';
            break;

        case 'echo':
        case '#echo':
            code = 'print(' + args + ');';
            break;

        case 'print':
        case 'include':
        case '#print':
        case '#include':
        

            code = key + '(' + split.join(',') + ');';
            break;

        default:

            // 过滤器（辅助方法）
            // {{value | filterA:'abcd' | filterB}}
            // >>> $helpers.filterB($helpers.filterA(value, 'abcd'))
            // TODO: {{ddd||aaa}} 不包含空格
            if (/^\s*\|\s*[\w\$]/.test(args)) {

                var escape = true;

                // {{#value | link}}
                if (code.indexOf('#') === 0) {
                    code = code.substr(1);
                    escape = false;
                }

                var i = 0;
                var array = code.split('|');
                var len = array.length;
                var val = array[i++];

                for (; i < len; i ++) {
                    val = filtered(val, array[i]);
                }

                code = (escape ? '=' : '=#') + val;

            // 即将弃用 {{helperName value}}
            } else if (template.helpers[key]) {
                
                code = '=#' + key + '(' + split.join(',') + ');';
            
            // 内容直接输出 {{value}}
            } else {

                code = '=' + code;
            }

            break;
    }
    
    
    return code;
};
module.exports = template;


    })( module.exports , module , __context );
    __context.____MODULES[ "a7b332e3aae389b1d4ef919d43d23251" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "9e11d69af7743de93f8c257f13101434" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['a7b332e3aae389b1d4ef919d43d23251'];


    })( module.exports , module , __context );
    __context.____MODULES[ "9e11d69af7743de93f8c257f13101434" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "49c8adec3ed3f1e8122094f2eedec8d2" ,
        filename : "list.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["list"] = "<div class=\"yo-group\">\n    <div class=\"scroll-wrap\" data-role=\"scroller\">\n        <ul class=\"yo-list\" data-role=\"itemwrap\"></ul>\n    </div>\n</div>\n";
if (typeof module !== "undefined") module.exports = window.QTMPL["list"];

    })( module.exports , module , __context );
    __context.____MODULES[ "49c8adec3ed3f1e8122094f2eedec8d2" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "d75b37b3e7a283d8c15c32d58210b6ac" ,
        filename : "list-item.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["list-item"] = "<li class=\"item\" data-role=\"list-item\">{{text}}</li>";
if (typeof module !== "undefined") module.exports = window.QTMPL["list-item"];

    })( module.exports , module , __context );
    __context.____MODULES[ "d75b37b3e7a283d8c15c32d58210b6ac" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "29aa7a3eccfc48ce987c07fcc1d67442" ,
        filename : "list.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * 列表基类，只支持纵向滑动
 * 
 * @author zxiao <jiuhu.zh@gmail.com>
 * @class List
 * @constructor
 * @extends Widget
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/list/index.html
 */

var $ =__context.____MODULES['897499f6c44f901ecc6fd2b84da5b878'];
var Widget =__context.____MODULES['727699dca154f9ef72d5e879dadfb5a5'];
var Template =__context.____MODULES['9e11d69af7743de93f8c257f13101434'];
var ListTpl =__context.____MODULES['49c8adec3ed3f1e8122094f2eedec8d2'];
var ItemTpl =__context.____MODULES['d75b37b3e7a283d8c15c32d58210b6ac'];

var rAF = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) { return window.setTimeout(callback, 1000 / 60); };

var clearRAF = window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    function (name){ window.clearTimeout(name)}

var Reg = /^(INPUT|TEXTAREA|BUTTON|SELECT)$/;

var List = Widget.extend({

    /**
     * @property {Boolean} isTransition 动画的效果，默认为true使用transition, false使用js动画
     * @property {Boolean} scrollLock 当数据项少于一屏时，是否锁定不允许滚动，默认为false
     * @property {String}  activeClass 激活状态的样式
     * @property {Boolean}  preventDefault 阻止浏览器默认事件，默认为true
     * @property {Boolean}  stopPropagation 阻止touch事件冒泡，默认为false
     * @property {Boolean}  resizable 可调整大小，默认为true
     * @property {Boolean}  canLockY 是否支持锁定Y轴滚动，默认为false， 在与slidermenu的配合使用时，需要设置为true
     * @property {String}  template 模板文件，自定义模板时需要传
     * @property {String}  itemTpl 列表项的模板，自定义模板时需要传
     * @property {Array} datasource @require组件的数据源，数组类型，每个数组项为object
     * @memberOf List
     */
    
   
    options: {
        type: 'list',
        // 动画的效果，默认为true使用transition, false使用js动画
        isTransition: true,
        // 当数据项少于一屏时，是否锁定不允许滚动，默认为false
        scrollLock: false,
        // 激活状态的样式
        activeClass: '',
        // 阻止浏览器默认事件
        preventDefault: true,
        // 阻止touch事件冒泡
        stopPropagation: false,
        // 可调整大小
        resizable: true,
        // 是否支持锁定Y轴滚动
        canLockY: false,
        // tap事件点击间隔时间
        tapInterval: 0,

        // 组件模板
        template: ListTpl,
        // 选项模板
        itemTpl: ItemTpl,
        
        datasource: [],

        // TODO 提供doubleTap、longTap等事件
        // 选项点击事件
        /**
         * 用户点击某项数据时触发的事件
         * @event tap
         * @memberOf List
         * @param  {HTMLEvent} e touch事件的事件对象
         */
        onTap: function (e) {},
        /**
         * 用户选择某项数据时触发的事件
         * @event selectitem
         * @param  {Object} data     当前选择项目的数据
         * @param  {HTMLElement} itemEl   当前选择项目的节点
         * @param  {HTMLElement} targetEl 用户点击的实际节点
         * @memberOf List
         */
        onSelectItem: function (data, itemEl, targetEl) {},

        /**
         * touchstart事件开始前触发的事件
         * @event beforestart
         * @param  {HTMLEvent} e touch事件的事件对象
         * @memberOf List
         */
        onBeforeStart: function (e) {},
        /**
         * touchmove事件开始前触发的事件
         * @event beforemove
         * @param  {HTMLEvent} e touch事件的事件对象
         * @memberOf List
         */
        onBeforeMove: function (e) {},
        /**
         * touchend事件开始前触发的事件
         * @event beforeend
         * @param  {HTMLEvent} e touch事件的事件对象
         * @memberOf List
         */
        onBeforeEnd: function (e) {},

        /**
         * touchmove事件结束后触发的事件
         * @event aftermove
         * @param  {Number} translateY 滚动偏移的translateY
         * @memberOf List
         */
        onAfterMove: function (translateY) {},

        /**
         * 列表滚动时触发的事件
         * @event 
         * @param  {Number} translateY 滚动偏移的translateY
         * @param  {Boolean} stopAnimate 是否停止动画
         * @memberOf List
         */
        onScroll: function (translateY, stopAnimate) {},

        events: {
            'touchstart': '_touchStart',
            'touchmove': '_touchMove',
            'touchend': '_touchEnd',
            'touchcancel': '_touchEnd',
            'webkitTransitionEnd [data-role=scroller]': '_transitionEnd',
            'transitionEnd [data-role=scroller]': '_transitionEnd'
        }
    },
    /**
     * 处理组件数据
     * @function init
     * @memberOf List
     * @private
     */
    init: function () {
        this.initProp();
    },

    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf List
     */
    render: function () {
        List.superClass.render.call(this);
        this._scroller = this.widgetEl.find('[data-role="scroller"]');
        this._itemWrap = this._scroller.find('[data-role="itemwrap"]');
        this.initUI();
        var self = this;
        this.widgetEl.on('tap', '[data-role="list-item"]', function(e) {
            !self._stopAnimate && !self._lockScrollY && self.trigger('tap', e);
            self._stopAnimate = false;
        });
        return this;
    },

    /**
     * 销毁组件
     * @function destroy
     * @memberOf  List
     */
    destroy: function() {
        this.animateTimer && clearRAF(this.animateTimer);
        this._cancelActive();
        List.superClass.destroy.call(this);
    },

    /**
     * 初始化私有属性
     * @function initProp
     * @private
     * @memberOf List
     */
    initProp: function() {
        this._scroller = null; // 列表滑动容器
        this._itemWrap = null; // 列表选项父容器
        this._listHeight = 0; // 列表高度

        this._startY = 0; // 开始滑动时的pageY
        this._lastY = 0; // 上一次滑动事件的pageY
        this._distY = 0; // 一次滑动事件的总距离
        this._translateY = 0; // 当前纵向滑动的总距离
        this._maxY = 0; // 最大滑动距离

        this._lastX = 0;
        this._lockScrollY = false; // 是否锁定Y轴滚动

        this._orientation = ''; // 列表滑动方向（与手势滑动方向相反） up || down
        this._startTime = 0; // 开始滑动时间
        this._endTime = 0; // 结束滑动时间
        this._isMoving = false; // 是否滑动中
        this._isAnimating = false; // 是否动画中
        this._canScroll = true; //是否可以滑动
        this._stopAnimate = false; // 本次点击是否阻止了动画效果（transition || requrestAnimationFrame）
        this._activeTimer = null; // 激活效果定时器
        this._actived = false;

        this._cancelMove = false; // 取消滑动，目前只有一种情况，当pageY小于0
        // TODO 增加支持两个手指滑动的功能
        this._initiated = false; // 是否初始化（touchstart是否正常执行了，主要用来解决多点触发滑动的判断）
    },

    /**
     * 处理组件样式
     * @function initUI
     * @private
     * @memberOf List
     */
    initUI: function () {
        this._renderListItem();
        this.resize();
    },

    /**
     * 容器高度发生变化后的处理
     * @function resize
     * @memberOf List
     */
    resize: function(scrollerHeight) {
        var otherHeight = 0;// 其他容器高度
        this._listHeight = +this.widgetEl[0].clientHeight;

        // 容器里如果有其他非滚动元素，计算最大滑动高度时去掉这些元素的高度
        var child = this.widgetEl.children();
        if(child.length > 1) {
            child.forEach(function(item){
                item.getAttribute('data-role') != 'scroller' && (otherHeight += (+item.offsetHeight));
            });
        }

        scrollerHeight = scrollerHeight || +this._scroller[0].clientHeight;
        this._maxY = this._listHeight - scrollerHeight - otherHeight;
        // 滑动容器高度不满外层容器高度时，是否需要滑动
        if(this._maxY >= 0) {
            if(this.get('scrollLock')) {
                this._canScroll = false;
            } else {
                this._canScroll = true;
                this._maxY = 0;
            }
        } else {
            this._canScroll = true;
        }
    },

    /**
     * 重新加载列表数据
     * @function reload
     * @param {Array} ds 重新加载的数据
     * @memberOf List
     */
    reload: function (ds) {
        ds && ds.length ? this.set('datasource', ds) : this.set('datasource', []);
        this.initUI();
    },

    /**
     * 滚动函数
     * @function scrollTo
     * @memberOf List
     * @param {Number} translateY 需要滚动的translateY值
     * @param {Array} time  是transition-duration表示过渡效果需要多少毫秒
     * @param {String | Function} effect transition-timing-function过渡效果的速度曲线
     * @private
     */
    scrollTo: function(translateY, time, effect) {
        if(this.get('isTransition')) {
            effect = effect || 'cubic-bezier(0.1, 0.57, 0.1, 1)';
            setTransitionTimingFunc(this._scroller, effect);
            setTransitionTime(this._scroller, time);
            this._translate(translateY);
        } else {
            effect || (effect = function (k) {
                return Math.sqrt( 1 - ( --k * k ) );
            });
            if(time) {
                this._animate(translateY, time, effect);
            } else {
                this._translate(translateY);
            }
        }
        this._translateY = translateY;
    },

    /**
     * 生成列表选项Html
     * @function createListItem
     * @memberOf List
     * @private
     */
    createListItem: function() {
        var itemHtml = '';
        var ds = this.get('datasource');
        var render = Template(this.get('itemTpl'));
        ds && ds.length && ds.forEach(function(item) {
            itemHtml += render(item);
        });
        return itemHtml;
    },

    /**
     * 停止动画
     * @function stopAnimate
     * @memberOf List
     * @private
     */
    stopAnimate: function() {
        var result = this._isAnimating;
        if(this._isAnimating) {
            this._isAnimating = false;
            this._stopAnimate = true;
            this.get('isTransition') && (this._translateY = getTranslateY(this._scroller));
            this.scrollTo(this._translateY, 0);
        }
        return result;
    },

    /**
     * 获取列表项节点
     * @function getItemNode
     * @memberOf List
     * @private
     */
    getItemNode: function(elem) {
        while(elem.length) {
            if(elem.data('role') == 'list-item') {
                return elem;
            } else {
                elem = elem.parent();
                continue;
            }
        }
        return null;
    },

    /**
     * 获取滚动方向
     * @function getOrientation
     * @memberOf List
     */
    getOrientation: function() {
        return this._orientation;
    },

    /**
     * 创建列表选项
     * @function _renderListItem
     * @private
     * @memberOf List
     */
    _renderListItem: function() {
        this._itemWrap.html(this.createListItem());
    },

    /**
     * 设置scroller的translateY值
     * @function _translate
     * @private
     * @param  {Number} translateY 要给scroller设置的translateY值
     * @memberOf List
     */
    _translate: function (translateY) {
        this._scroller[0].style.webkitTransform = 'translate(0px, ' + translateY + 'px) translateZ(0)';
        this._scroller[0].style.transform = 'translate(0px, ' + translateY + 'px) translateZ(0)';
        this.trigger('scroll', translateY, this._stopAnimate);
    },

 
    /**
     * touchstart事件的处理函数，初始化参数，停止正在进行的动画
     * @function _touchStart
     * @private
     * @param  {HTMLDOMEvent} e touchstart事件的事件对象
     * @memberOf List
     */
    _touchStart: function(e) {

        var target = e.target;
        this.get('preventDefault') && !Reg.test(target.tagName) && e.preventDefault();
        this.get('stopPropagation') && e.stopPropagation();

        if(this._initiated) return;

        if(this.get('activeClass')) {
            var self = this;
            var itemNode = this.getItemNode($(target));
            if(itemNode) {
                self._activeTimer = setTimeout(function() {
                    itemNode.addClass(self.get('activeClass'));
                }, 150);
                this._actived = true;
            }
        }

        this.trigger('beforestart', e);

        setTransitionTime(this._scroller);
        this._isMoving = false;
        this._startTime = +new Date();
        this._stopAnimate = false;
        this.stopAnimate();

        this._startY = this._translateY;
        this._distY = 0;
        this._lastY = e.touches[0].pageY;

        this._lastX = e.touches[0].pageX;
        this._lockScrollY = false;
        this._cancelMove = false;
        this._initiated = true;
    },

    /**
     * touchmove事件的处理函数，处理位移偏移，处理canLockY
     * @function _touchMove
     * @param  {HTMLDOMEvent} e touchmove事件的事件对象
     * @private
     * @memberOf List
     */
    _touchMove: function(e) {
        this.get('preventDefault') && e.preventDefault();
        this.get('stopPropagation') && e.stopPropagation();

        if(!this._initiated) return;

        if(this._actived && this.get('activeClass')) {
            this._cancelActive();
            var itemNode = this.getItemNode($(e.target));
            itemNode && itemNode.removeClass(this.get('activeClass'));
            this._actived = false;
        }

        if (!this.trigger('beforemove', e)) {
            this._initiated = false;
            return;
        };

        var translateY,
            timestamp = +new Date(),
            currY = e.touches[0].pageY,
            offsetY = currY - this._lastY;

        this._distY += offsetY;

        // 当滑动超出屏幕，自动触发touchend事件
        if (currY < 0) {
            this._initiated = false;
            if (this._cancelMove) {
                return;
            }
            this._cancelMove = true;
            this._touchEnd(e);
            return;
        }

        if (this.get('canLockY')) {
            // 横向滚动超过比例，锁定纵向滚动
            if (this._lockScrollY) {
                this._initiated = false;
                return;
            }
            var currX = e.touches[0].pageX;
            var offsetX = currX - this._lastX;
            if(Math.abs(this._distY) < 30 && Math.abs(offsetX) / 3 > Math.abs(this._distY)) {
                this._lockScrollY = true;
                this._initiated = false;
                return;
            }
        }

        // 当前时间大于上一次滑动的结束时间300毫秒，并且滑动距离不超过10像素，不触发move
        // 大于300毫秒的判断是为了能够处理手指在屏幕上快速搓动的效果
        if (timestamp - this._endTime > 300 && Math.abs(this._distY) < 10 ) {
            return;
        }

        this._orientation = offsetY > 0 ? 'up': 'down';
        !this._canScroll && (offsetY = 0);
        translateY = this._translateY + offsetY;
        // 超出滑动容器范围，减少滑动高度
        if (translateY > 0 || translateY < this._maxY) {
            translateY = this._translateY + offsetY / 3;
        }

        this._isMoving = true;
        this._translate(translateY);
        this._translateY = translateY;
        this._lastY = currY;
        if(timestamp - this._startTime > 300) {
            this._startTime = timestamp;
            this._startY = this._translateY;
        }
        this.trigger('aftermove', translateY);
    },

    /**
     * touchend事件的处理函数，添加active样式，处理组件的回弹，滚动到目标位置
     * @function _touchEnd
     * @param  {HTMLDOMEvent} e touchmove事件的事件对象
     * @private
     * @memberOf List
     */
    _touchEnd: function(e) {
        var target = e.target;

        this.get('preventDefault') && !Reg.test(target.tagName) && e.preventDefault();
        this.get('stopPropagation') && e.stopPropagation();

        if(this._actived && this.get('activeClass')) {
            this._cancelActive();
            var itemNode = this.getItemNode($(e.target));
            itemNode && itemNode.removeClass(this.get('activeClass'));
            this._actived = false;
        }

        this._initiated = false;
        this._endTime = +new Date();
        var duration = this._endTime - this._startTime;

        if(!this.trigger('beforeend', e)) {
            return;
        };

        // 1. 判断是否滑动回弹，回弹则return
        if(this.resetPosition()) {
            return;
        }

        // 2. 没有滚动
        if(!this._isMoving ) {
            return;
        }

        // 3. 滑动到目标位置
        this.scrollTo(this._translateY);

        // 4. 是否有惯性滑动，有则滑动到计算后的位置
        this._isMoving = false;
        if (duration < 300 && this._canScroll) {
            var momentumY = momentum(this._translateY, this._startY, duration, this._maxY, this._listHeight);
            var newY = momentumY.destination;
            if (newY != this._translateY ) {
                var effect = null;
                if(newY > 0 || newY < this._maxY) {
                    // 惯性滑动中超出边界回弹回来，切换动画效果函数
                    if(this.get('isTransition')) {
                        effect = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    } else {
                        effect = function (k) {
                            return k * ( 2 - k );
                        };
                    }
                }
                this.scrollTo(newY, momentumY.duration, effect);
            }
            this._isAnimating = true;
        }
    },
    /**
     * 滑动超出最大范围，回弹到终点
     * @function resetPosition
     * @memberOf List
     */
    resetPosition: function () {
        var translateY = this._translateY;
        if(this._canScroll) {
            translateY = translateY> 0 ? 0 : translateY < this._maxY ? this._maxY : translateY;
        }
        if(translateY == this._translateY) {
            return false;
        }
        this._orientation = translateY < 0 ? 'up': 'down';
        this.scrollTo(translateY, 600);
        this._isAnimating = true;
        return true;
    },

    /**
     * transition动画结束后的处理函数
     * @function _transitionEnd
     * @memberOf List
     * @param  {HTMLDOMEvent} e transitionEnd结束时事件对象
     * @private
     */
    _transitionEnd: function(e) {
        if (e.target != this._scroller[0]) {
            return;
        }
        setTransitionTime(this._scroller);
        this._isAnimating = false;
        this.resetPosition();
    },

    /**
     * 不适用transition时的惯性动画函数
     * @function _animate
     * @memberOf List
     * @private
     * @param  {Number} translateY scroller要滚动的目标translateY
     * @param  {Number} time       scorller要滚动到
     * @param  {Function} effect     滚动的效果函数
     */
    _animate: function(translateY, time, effect) {
        var self = this,
            startY = this._translateY,
            startTime = +new Date(),
            destTime = startTime + time;

        function step () {
            var now = +new Date(),
                newY,
                easing;

            if ( now >= destTime ) {
                self._isAnimating = false;
                self._translate(translateY);
                self._translateY = translateY;
                self.resetPosition();
                return;
            }

            now = ( now - startTime ) / time;
            easing = effect(now);
            newY = ( translateY - startY ) * easing + startY;
            self._translateY = newY;
            self._translate(newY);

            if ( self._isAnimating ) {
                self.animateTimer = rAF(step);
            }
        }
        this._isAnimating = true;
        step();
    },

    /**
     * 取消active的timer，用来防止多次点击
     * @function _cancelActive
     * @memberOf List
     * @private
     */
    _cancelActive: function() {
        this._activeTimer && clearTimeout(this._activeTimer);
        this._activeTimer = null;
    }
});

// 滑动惯性计算
function momentum(current, start, time, lowerMargin, wrapperSize, deceleration) {
    var distance = current - start,
        speed = Math.abs(distance) / time,
        destination,
        duration;

    // 低版本安卓，降低惯性滑动速度
    var defaultDeceleration = 0.0006;
    $.os.android && $.os.version < '4.4' && (defaultDeceleration = 0.006);

    deceleration = deceleration === undefined ? defaultDeceleration : deceleration;

    destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
    duration = speed / deceleration;

    if ( destination < lowerMargin ) {
        destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
        distance = Math.abs(destination - current);
        duration = distance / speed;
    } else if ( destination > 0 ) {
        destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
        distance = Math.abs(current) + destination;
        duration = distance / speed;
    }

    return {
        destination: Math.round(destination),
        duration: duration
    };
};

function setTransitionTime(elem, time) {
    time = time || 0;
    elem[0].style.webkitTransitionDuration = time + 'ms';
    elem[0].style.transitionDuration = time + 'ms';
}
function setTransitionTimingFunc(elem, effect) {
    elem[0].style.webkitTransitionTimingFunction = effect;
    elem[0].style.transitionTimingFunction = effect;
}

// 获取元素的translateY
function getTranslateY(elem) {
    var matrix = window.getComputedStyle(elem[0], null);
    var transform = matrix['webkitTransform'] || matrix['transform'];
    var split = transform.split(')')[0].split(', ');
    return Math.round(+(split[13] || split[5]));
}

module.exports = List;

    })( module.exports , module , __context );
    __context.____MODULES[ "29aa7a3eccfc48ce987c07fcc1d67442" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "829e23a50a002055e2f4f456e935e485" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['29aa7a3eccfc48ce987c07fcc1d67442']

    })( module.exports , module , __context );
    __context.____MODULES[ "829e23a50a002055e2f4f456e935e485" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "5ab87e2332d7fe98f9a21829e848aacb" ,
        filename : "pagelist.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["pagelist"] = "<div class=\"yo-group\">\n    <div class=\"scroll-wrap\" data-role=\"scroller\">\n        <ul class=\"yo-list\" data-role=\"itemwrap\"></ul>\n    </div>\n    <div class=\"no-data\" data-role=\"nodata\"></div>\n</div>";
if (typeof module !== "undefined") module.exports = window.QTMPL["pagelist"];

    })( module.exports , module , __context );
    __context.____MODULES[ "5ab87e2332d7fe98f9a21829e848aacb" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "c04eae08a3563bb88610c5af16fe812b" ,
        filename : "pagelist-item.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["pagelist-item"] = "<li class=\"item\" data-role=\"list-item\" data-index={{dataIndex}}>{{text}}</li>";
if (typeof module !== "undefined") module.exports = window.QTMPL["pagelist-item"];

    })( module.exports , module , __context );
    __context.____MODULES[ "c04eae08a3563bb88610c5af16fe812b" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "e8cd2912133c33b8a443527bd6f96f83" ,
        filename : "pagelist-nodata.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["pagelist-nodata"] = "没有数据,点击刷新";
if (typeof module !== "undefined") module.exports = window.QTMPL["pagelist-nodata"];

    })( module.exports , module , __context );
    __context.____MODULES[ "e8cd2912133c33b8a443527bd6f96f83" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "04529342a29eaf1d7d058615384474c1" ,
        filename : "pagelist-refresh.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["pagelist-refresh"] = "<div style=\"position: absolute; text-align: center; width: 100%; height: 40px; line-height: 40px; top: -40px;\">\n    <div class=\"yo-loadtip\">\n        <i class=\"yo-ico\">&#xf07b;</i>\n        <div class=\"text\">下拉可以刷新</div>\n    </div>\n    <div class=\"yo-loadtip\">\n        <i class=\"yo-ico\">&#xf079;</i>\n        <div class=\"text\">释放立即更新</div>\n    </div>\n    <div class=\"yo-loadtip\">\n        <i class=\"yo-ico yo-ico-loading\">&#xf089;</i>\n        <div class=\"text\">努力加载中...</div>\n    </div>\n    <div class=\"yo-loadtip\">\n        <i class=\"yo-ico yo-ico-succ\">&#xf078;</i>\n        <div class=\"text\">加载成功</div>\n    </div>\n    <div class=\"yo-loadtip\">\n        <i class=\"yo-ico yo-ico-fail\">&#xf077;</i>\n        <div class=\"text\">加载失败</div>\n    </div>\n</div>";
if (typeof module !== "undefined") module.exports = window.QTMPL["pagelist-refresh"];

    })( module.exports , module , __context );
    __context.____MODULES[ "04529342a29eaf1d7d058615384474c1" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "2e3673ff7223e51f34f27d5f080bf748" ,
        filename : "pagelist-loadmore.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["pagelist-loadmore"] = "<div style=\"position: absolute; text-align: center; height: 40px; line-height: 40px; width: 100%; bottom: -40px;\">\n    <div class=\"yo-loadtip\">\n        <i class=\"yo-ico yo-ico-loading\">&#xf089;</i>\n        <div class=\"text\">正在加载...</div>\n    </div>\n    <div class=\"yo-loadtip\">\n        <div class=\"text\">没有更多了...</div>\n    </div>\n</div>";
if (typeof module !== "undefined") module.exports = window.QTMPL["pagelist-loadmore"];

    })( module.exports , module , __context );
    __context.____MODULES[ "2e3673ff7223e51f34f27d5f080bf748" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "623cbc449ca0e7a6f2cf4496da5ac8fe" ,
        filename : "pagelist.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * 分页列表
 * 
 * @author zxiao <jiuhu.zh@gmail.com>
 * @class Pagelist
 * @constructor
 * @extends List
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/pagelist/index.html
 */
var $ =__context.____MODULES['897499f6c44f901ecc6fd2b84da5b878'];
var List =__context.____MODULES['829e23a50a002055e2f4f456e935e485'];
var Template =__context.____MODULES['9e11d69af7743de93f8c257f13101434'];
var ListTpl =__context.____MODULES['5ab87e2332d7fe98f9a21829e848aacb'];
var ItemTpl =__context.____MODULES['c04eae08a3563bb88610c5af16fe812b'];
var NodataTpl =__context.____MODULES['e8cd2912133c33b8a443527bd6f96f83'];
var RefreshTpl =__context.____MODULES['04529342a29eaf1d7d058615384474c1'];
var LoadmoreTpl =__context.____MODULES['2e3673ff7223e51f34f27d5f080bf748'];

var Pagelist = List.extend({
    /**
     * @property {Number} pagesize 每页加载的数据量，默认15条
     * @property {Boolean} useRefresh 是否启用刷新功能，默认为true，开启下来刷新组件
     * @property {Boolean} useLoadmore 是否启用加载更多功能，默认为true，开启上拉加载更多
     * @property {Boolean} infinite 是否加载大量数据，默认为false，false是append节点，true会有固定个数的节点，滚动的时候移动节点和更新数据
     * @property {String} selectedClass 选中后的样式
     * @property {Boolean} isTransition 默认滚动的动画效果，默认为false，true使用css的transition，false使用js动画
     * @memberOf Pagelist
     */
    
    
    options: {
        // 每页加载的数据量
        pagesize: 15,
        // 刷新激活高度，一般等于刷新容器的高度
        refreshActiveY: 40,
        // 加载更多激活高度，设置成负数可以提前刷新，正数往下拉更多才刷新
        loadmoreActiveY: 0,
        // 加载更多容器高度，如果自定义了加载更多模板并且改变了高度，需要配置此参数
        loadmoreContY: 40,
        // 刷新结果显示时间，0为不显示刷新结果直接弹回，不等于0会显示刷新成功或刷新失败提示后再弹回
        refreshResultDelay: 0,
        // 是否启用刷新功能
        useRefresh: true,
        // 是否启用加载更多功能
        useLoadmore: true,
        // 是否加载大量数据，false是append节点，true会有固定个数的节点，滚动的时候移动节点和更新数据（不支持节点高度不一致的情况）
        infinite: false,
        // 列表项高度是否不一致，默认为true，如果列表高度一致，建议设置成false，可以提高性能
        // differentHeight: true,
        // 选中后的样式
        selectedClass: null,
        // 动画的效果，默认为true使用transition, false使用js动画
        isTransition: false,
        // 没有数据页面默认的数据（如果你传递的nodataTpl需要数据）
        nodataViewData: null,
        // 模板引擎
        compiler: null,

        // 组件模板
        template: ListTpl,
        // 选项模板
        itemTpl: ItemTpl,
        // 没有数据的提示模板
        nodataTpl: NodataTpl,
        // 刷新数据提示模板
        refreshTpl: RefreshTpl,
        // 加载更多提示提示模板
        loadmoreTpl: LoadmoreTpl,

        // 刷新中，该接口必须调用Pagelist.refresh()方法通知Pagelist数据已加载
        /**
         * 用户下拉列表满足刷新条件时触发的事件
         * @event refresh
         * @memberOf Pagelist
         * @param  {Number} pageNum 当前的页码
         */
        onRefresh: function (pageNum) {},
        // 加载更多中，该接口必须调用Pagelist.loadMore()方法通知Pagelist数据已加载
        /**
         * 用户上拉列表满足加载更多条件时触发的事件
         * @event loadmore
         * @memberOf Pagelist
         * @param  {Number} pageNum 当前的页码
         */
        onLoadMore: function (pageNum) {},
        // 渲染完成后
        /**
         * 渲染完成后触发的事件
         * @event ready
         * @memberOf Pagelist
         */
        onReady: function() {},

        /**
         * 用户选择某项数据时触发的事件
         * @event selectitem
         * @param  {Object} data     当前选择项目的数据
         * @param  {HTMLElement} itemEl   当前选择项目的节点
         * @param  {HTMLElement} targetEl 用户点击的实际节点
         * @memberOf Pagelist
         */
        //onselectitem: function() {}

        // 选项点击事件
        onTap: function(e) {},

        // 切换下拉刷新图标
        onAfterMove: function(translateY) {},

        // 下拉刷新触发判断
        onBeforeEnd: function(e) {},

        // 加载更多触发判断
        onScroll: function(translateY) {}
    },

    /**
     * 处理组件数据
     * @function init
     * @memberOf Pagelist
     * @private
     */
    init: function() {
        this.initProp();
        this.bindEvents();
    },


    /**
     * 处理组件的内部事件绑定
     * @function bindEvents
     * @memberOf Pagelist
     * @private
     */
    bindEvents: function() {
        // 选项点击事件
        this.on('tap', function(e){
            if(this._tapTimer) {
                return;
            }

            var targetEl = $(e.target);
            var itemEl = $(e.currentTarget);
            var index = itemEl.data('index');
            var selectedClass = this.get('selectedClass');
            if(selectedClass) {
                this._itemWrap.find('.' + selectedClass).removeClass(selectedClass);
                itemEl.addClass(selectedClass);
            }
            this.trigger('selectitem', this.get('datasource')[index], itemEl, targetEl);

            var self = this;
            var interval = this.get('tapInterval') || 0;
            if(interval) {
                this._tapTimer = setTimeout(function() {
                    clearTimeout(self._tapTimer);
                    self._tapTimer = null;
                }, interval);
            }
        });

        // 切换下拉刷新图标
        this.on('aftermove', function(translateY) {
            translateY > 0 && this.get('useRefresh') && !this._refreshing && this._changeRefreshStatus(translateY);
            this._moveWhenLoad = this._refreshing || this._loadmoreing;
        });

        // 下拉刷新触发判断
        this.on('beforeend', function(e) {
            if(this.get('useRefresh') && !this._loadmoreing && this._translateY >= this.get('refreshActiveY')) {
                if(this._refreshing) {
                    this.scrollTo(this.get('refreshActiveY'), 300);
                } else {
                    this._refreshInit();
                }
                return false;
            }

            return true;
        });

        // 加载更多触发判断
        this.on('scroll', function(translateY) {
            if(this._refreshing || this._loadmoreing) return;

            if(this.get('useLoadmore') && this._canLoadmore) {
                // 激活加载更多的translateY，负数
                var activeY = this._maxY - this.get('loadmoreActiveY');
                translateY < 0 && translateY < activeY && this._loadMoreInit();
            }
        });
    },

    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf Pagelist
     * @private
     */
    render: function() {
        if(!this._isRender){
            this._nodataEl = this.widgetEl.find('[data-role="nodata"]');
            this._nodataEl.on('touchmove', function() {return false;});
            this._nodataRender = this._compiler(this.get('nodataTpl')) || function() {return ''};
            this.reloadNodataView(this.get('nodataViewData'));

            Pagelist.superClass.render.call(this);
            // fix bug: infinite模式下滚动白屏了
            this.scrollTo(0);
            this._infiniteHandler();
            this._createDragIcon();
            this.trigger('ready');
        }
        return this;
    },
    /**
     * 销毁组件
     * @function destroy
     * @memberOf Pagelist
     */
    destroy: function() {
        if(this._tapTimer) {
            clearTimeout(this._tapTimer);
            this._tapTimer = null;
        }
        Pagelist.superClass.destroy.call(this);
    },

    /**
     * 初始化私有属性
     * @function initProp
     * @memberOf Pagelist
     * @private
     */
    initProp: function() {
        Pagelist.superClass.initProp.call(this);
        this._refreshing = false; // 刷新中
        this._loadmoreing = false; // 加载更多中
        this._pageNum = 1; // 当前页码
        // 支持定义itemRender，来自定义模板引擎
        this._itemRender = this.itemRender || null;
        this._extraHeight = 0;// 滚动容器里，除了列表外其他的元素高度

        this._nodataEl = null;
        this._dragEl = null; // 下拉刷新
        this._endEl = null; // 释放更新
        this._loadEl = null; // 加载中
        this._successEl = null; // 加载成功
        this._failEl = null; // 加载失败
        this._loadmoreEl = null; // 加载更多
        this._endmoreEl = null; // 没有更多

        // 是否可以加载更多，下面条件成立时，_canLoadmore都等于false
        // useLoadmore == false || 加载不到更多数据 || datasource.length < pagesize
        this._canLoadmore = this.get('useLoadmore');

        // 刷新或加载更多时，是否发生了滑动。如果没有滑动，会有默认滚动动作
        this._moveWhenLoad = false;

        // tap事件的定时器
        this._tapTimer = null;

        // 设置模板引擎
        this._compiler = this.get('compiler') || Template;
    },

    /**
     * 生成列表选项Html，覆盖父类方法
     * @function createListItem
     * @memberOf Pagelist
     * @private
     */
    createListItem: function() {
        var self = this;
        var itemHtml = '';
        var ds = this.get('datasource');

        !this._itemRender && (this._itemRender = this._compiler(this.get('itemTpl')));

        ds.length > this.get('pagesize') && console.warn('The length of the data is larger than pagesize.');
        ds && ds.length && ds.forEach(function(item, index) {
            var data = $.extend(true, {}, item);
            data.dataIndex = index;
            itemHtml += self._itemRender(data);
        });
        return itemHtml;
    },

    /**
     * 覆盖父类方法
     * @function initUI
     * @memberOf Pagelist
     * @private
     */
    initUI: function() {
        var ds = this.get('datasource');
        if(!ds || !ds.length) {
            this._nodataEl.show();
            this._scroller.hide();
        } else {
            this._nodataEl.hide();
            this._scroller.show();
        }

        Pagelist.superClass.initUI.call(this);
        this._setLoadmore();
    },

    /**
     * 获得当前组件的是第几页
     * @function getPageNum
     * @memberOf Pagelist
     * @return {Number} 获得当前组件的是第几页
     */
    getPageNum: function() {
        return this._pageNum;
    },

    /**
     * 设置页码
     * @function setPageNum
     * @memberOf Pagelist
     * @param {Number | String} pageNum 设置pagelist的页码
     * @version 0.1.11
     */
    setPageNum: function (pageNum) {
        var _pageNum = parseInt(pageNum, 10);
        if (!isNaN(_pageNum)) {

            this._pageNum = pageNum;
        }
    },

    /**
     * 根据窗口大小重新调整组件位置和大小
     * @function resize
     * @memberOf Pagelist
     */
    resize: function () {
        if(this._isRender){
            // 额外的元素，约定的data-role="extra"
            var extra = this._scroller.find('[data-role="extra"]');
            if(extra.length && this._infiniteElements) {
                var top = 0;
                extra.forEach(function(item) {
                    top += item.offsetHeight;
                });

                if(top != this._extraHeight) {
                    this._extraHeight = top;
                    this._infiniteElements.forEach(function(item) {
                        $(item).css({top: top});
                    });
                }
            }

            var scrollerHeight = null;
            if(this.get('infinite') && this._infiniteElementHeight) {
                scrollerHeight = this._infiniteElementHeight * this.get('datasource').length + this._extraHeight;
            }

            Pagelist.superClass.resize.call(this, scrollerHeight);
        }
    },

    /**
     * 更新列表数据
     * @function updateListItem
     * @memberOf Pagelist
     * @private
     */
    updateListItem: function (data, index) {
        var itemData = $.extend(true, {}, data);
        itemData.dataIndex = index;
        var newItem = $(this._itemRender(itemData));
        var item = this._itemWrap.find('[data-index="' + index + '"]');
        item.html(newItem.html());
    },

    /**
     * 重新渲染没有数据的模板
     * @function reloadNodataView
     * @memberOf Pagelist
     */
    reloadNodataView: function(data) {
        this._nodataEl.html(this._nodataRender(data));
    },

    /**
     * 刷新组件的数据
     * @function refresh
     * @memberOf Pagelist
     * @param {Array} data 加载到的数据
     * @param {Boolean} isFail 加载是否成功，如果加载数据碰到异常才设置成true
     */
    refresh: function(data, isFail) {
        this._loadEl.hide();
        if(!isFail) {
            this._pageNum = 1;
            this.reload(data);
            this._setLoadmore();
            this._infiniteHandler();
        }
        this._endmoreEl && this._endmoreEl.hide();

        var self = this, delay = this.get('refreshResultDelay');
        var resultEl = isFail ? self._failEl : self._successEl;

        delay && resultEl.show();

        setTimeout(function() {
            delay && resultEl.hide();

            var time = 0;
            // 滑动到原点
            if(!self._moveWhenLoad || (self._moveWhenLoad && self._translateY > 0)) {
                time = 300;
                self.scrollTo(0, time);
            }

            setTimeout(function() {
                self._dragEl.show();
                self._refreshing = false;
                self._moveWhenLoad = false;
            }, time);

        }, delay);
    },

    /**
     * 组件加载更多数据
     * @function loadMore
     * @memberOf Pagelist
     * @param {Array} data 加载到的数据
     * @param {Boolean} isFail 加载失败，如果加载数据碰到异常才设置成true
     */
    loadMore: function(data, isFail) {
        var isMoreData = data && data.length;
        this._maxY += this.get('loadmoreContY');
        this._loadmoreEl.hide();
        if(!isFail) {
            if(isMoreData) {
                this._pageNum++;
                var ds = this.get('datasource');
                this.set('datasource', ds.concat(data));
                this.updateData(data);
            }

            // 加载不到更多数据或加载到的数据不足一页
            if(!isMoreData || (isMoreData && data.length < this.get('pagesize'))) {
                this._endmoreEl.show();
                if(isMoreData && this.get('infinite')) {
                    var bottomIndex = this.get('pagesize') * (this._pageNum - 1) - 1;
                    var bottomElem = this._itemWrap.find('[data-index="'+bottomIndex+'"]');
                    // var moreContY = bottomElem[0]._top + this._infiniteElementHeight * (data.length + 1);
                    // 校正添加_extra height，修复由此可能造成的样式问题
                    var moreContY = bottomElem[0]._top + this._infiniteElementHeight * (data.length + 1) + (this._extraHeight || 0);
                    this._setTransform(this._moreCont[0], moreContY);
                }
            }
        }

        var self = this,
            delay = isMoreData ? 100 : 500,
            dist = isMoreData ? self._translateY - 20 : self._maxY;

        this.stopAnimate();

        setTimeout(function() {
            if(isMoreData) {
                !self._moveWhenLoad && self.scrollTo(dist, 300);
            } else {
                self.scrollTo(dist, 300);
            }
            setTimeout(function() {
                self._loadmoreing = false;
                self._canLoadmore = (isMoreData && data.length >= self.get('pagesize')) || isFail;
                self._moveWhenLoad = false;
            }, 300);
        }, delay);
    },

    /**
     * 手动模拟刷新列表操作，组件滚动到头部
     * @function simulateRefresh
     * @memberOf Pagelist
     */
    simulateRefresh: function () {
        var self = this;
        var refreshActiveY = this.get('refreshActiveY');
        this.scrollTo(refreshActiveY, 300);
        this._changeRefreshStatus(refreshActiveY);
        setTimeout(function() {
            self._refreshInit();
        }, 300);
    },

    /**
     * 重新加载数据
     * @function reloadData
     * @memberOf Pagelist
     * @param {Array} data 重新加载的数据
     */
    reloadData: function(data) {
        var self = this;
        var handler = function() {
            self._pageNum = 1;
            self.reload(data);
            self._setLoadmore();
            self.scrollTo(0);
            self._resetDragIcon();
            self._infiniteHandler();
        }

        if(this.stopAnimate()) {
            setTimeout(function() {
                handler();
            }, 200)
        } else {
            handler();
        }
    },

    /**
     * 根据数据更新组件item内容，对于infinite和非infinite进行不同的处理
     * @function updateData
     * @memberOf Pagelist
     * @private
     * @param {Array} data 需要更新的数据
     */
    updateData: function (data) {
        if (this.get('infinite')) {
            var update = [], eles = this._infiniteElements;
            var bottomIndex = this.get('pagesize') * (this._pageNum - 1) - 1;
            var bottomElem = this._itemWrap.find('[data-index="'+bottomIndex+'"]');
            // fix bug: 加载更多时用户进行了滚动操作，可能无法取到bottomElem
            if(bottomElem.length) {
                var firstTop = bottomElem[0]._top;
                for(var i = 0 ; i < eles.length; i++) {
                    if(eles[i]._top >= firstTop) {
                        update.push(this._infiniteElements[i]);
                    }
                }
                this._updateContent(update);
            }
        } else {
            var self = this;
            var ds = this.get('datasource');
            var leng = ds.length;
            var dataLength = 0;
            var html = '';
            data && (dataLength = data.length) && data.forEach(function(item, index) {
                var data = $.extend(true, {}, item);
                data.dataIndex = index + (leng - dataLength);
                html += self._itemRender(data);
            });
            self._itemWrap.append(html);
        }
        this.resize();
    },

    /**
     * 覆盖父类方法,超出刷新激活高度后回弹到激活高度,而不是0
     * @function resetPosition
     * @memberOf Pagelist
     * @private
     */
    resetPosition: function () {
        if(this._refreshing && this._translateY == this.get('refreshActiveY')) {
            return false;
        } else if(this._loadmoreing && this._translateY == this._maxY - this.get('loadmoreContY')) {
            return false;
        }

        var isReset = Pagelist.superClass.resetPosition.call(this);
        isReset && (this._moveWhenLoad = true);
        return isReset;
    },

    /**
     * 无限循环处理
     * @function _infiniteHandler
     * @memberOf Pagelist
     * @private
     */
    _infiniteHandler: function() {
        if(!this.get('infinite')) return;

        this._infiniteElements = this._itemWrap.find('[data-role="list-item"]');
        if(!this._infiniteElements.length) return;

        var top = this._extraHeight;
        this._infiniteElements.forEach(function(item) {
            $(item).css({
                position: 'absolute',
                top: top,
                left: 0,
                width: '100%'
            });
        });

        this._infiniteElementHeight = this._infiniteElements.first().height();
        var elementsPerPage = Math.ceil(this._listHeight / this._infiniteElementHeight);
        // 列表项个数由容器高度决定,而不是pagesize
        this._infiniteLength = elementsPerPage + 3;
        var itemLeng = this.get('datasource').length;
        // 数据量小的情况下，列表项个数由数据决定（不满一屏）
        itemLeng < this._infiniteLength && (this._infiniteLength = itemLeng);

        for(var i = this._infiniteLength; i < this._infiniteElements.length; i++) {
            this._itemWrap[0].removeChild(this._infiniteElements[i]);
        }

        this._infiniteHeight = this._infiniteLength * this._infiniteElementHeight;
        // 2147483645 数组长度限制  Math.pow(2, 32) - 1
        this._infiniteLimit = Math.floor(2147483645 / this._infiniteElementHeight);
        this._infiniteUpperBufferSize = Math.max(Math.floor((this._infiniteLength - elementsPerPage) / 2), 0);

        this.resize();

        this._reorderInfinite();

        this.on('scroll', function(translateY) {
            translateY < 0 && translateY > this._maxY && this._reorderInfinite();
        });
    },

    /**
     * 处理无限循环计算节点位置的逻辑
     * @function _reorderInfinite
     * @memberOf Pagelist
     * @private
     */
    _reorderInfinite: function() {
        // 小相位 当前要展示的item，所在所有波段中的位置，第n个
        // 大相位 当前展示的波段属于整体波段中的第n个，即第n屏
        // 相位   当前item，所在当前波段中的位置
        var minorPhase = Math.max(Math.floor((-this._translateY - this._extraHeight) / this._infiniteElementHeight) - this._infiniteUpperBufferSize, 0),
            majorPhase = Math.floor(minorPhase / this._infiniteLength),
            phase = minorPhase - majorPhase * this._infiniteLength;

        var top = 0;
        var i = 0;
        var update = [];

        //用this._infiniteElements[i]先临时hack主从scroll事件来的调用
        //之后会统一梳理所有的属性和变量
        while ( i < this._infiniteLength  && this._infiniteElements[i]) {
            top = i * this._infiniteElementHeight + majorPhase * this._infiniteHeight;

            if ( phase > i ) {
                top += this._infiniteElementHeight * this._infiniteLength;
            }

            if ( this._infiniteElements[i]._top !== top ) {
                this._infiniteElements[i]._phase = top / this._infiniteElementHeight;

                if ( this._infiniteElements[i]._phase < this._infiniteLimit ) {
                    this._infiniteElements[i]._top = top;
                    update.push(this._infiniteElements[i]);
                }
            }

            i++;
        }

        update.length && this._updateContent(update);
    },

    /**
     * 根据节点上的相位信息和data信息更新组件的属性和内容
     * @function _updateContent
     * @memberOf Pagelist
     * @param {HTMLElement} els 需要更新的节点
     * @private
     */
    _updateContent: function(els) {
        // TODO 缓存节点，一次批量更新多个节点测试性能
        var self = this, ds = this.get('datasource');
        var exclude = ['data-role', 'data-index', 'style'];
        els.forEach(function(elem) {
            var index = elem._phase, data = ds[index];
            if(data) {
                self._setTransform(elem, elem._top);
                var itemData = $.extend(true, {}, data);
                itemData.dataIndex = index;
                elem.setAttribute('data-index', index);
                var itemHtml = self._itemRender(itemData);

                // 更新dom属性
                for(var key in elem.attributes) {
                    if(elem.attributes.hasOwnProperty(key)) {
                        var name = elem.attributes[key].name;
                        if(exclude.indexOf(name) == -1) {
                            var val = elem.attributes[key].value;
                            var res = itemHtml.match(getAttrRegexp(name));
                            if(res && res.length == 2 && res[1] != val) {
                                elem.attributes[key].value = res[1];
                            }
                        }
                    }
                }

                // 去除item节点自己
                elem.innerHTML = itemHtml.substring(itemHtml.indexOf('>') + 1, itemHtml.lastIndexOf('</')).trim();
            }
        });
    },

    /**
     * 设置节点的translateY值
     * @function _setTransform
     * @private
     * @memberOf Pagesize
     * @param {HTMLElement} el 需要设置的节点
     * @param {Number} y  需要设置的translateY值
     */
    _setTransform: function(el, y) {
        el.style.webkitTransform = 'translate(0px, ' + y + 'px) translateZ(0)';
        el.style.transform = 'translate(0px, ' + y + 'px) translateZ(0)';
    },

    /**
     * 是否允许加载更多功能
     * @function _setLoadmore
     * @memberOf Pagelist
     * @private
     */
    _setLoadmore: function() {
        var ds = this.get('datasource');
        if(ds && ds.length) {
            if(ds.length >= this.get('pagesize')) {
                this._canLoadmore = true;
            } else {
                this._canLoadmore = false;
            }
        }
    },

    /**
     * 创建刷新和加载更多的操作图标
     * @function _createDragIcon
     * @memberOf Pagelist
     * @private
     */
    _createDragIcon: function() {
        if(this.get('useRefresh')) {
            var rh = this.get('refreshActiveY');
            var refreshContainer = $(this.get('refreshTpl'));
            refreshContainer.css({height: rh + 'px', lineHeight: rh + 'px', top: -rh}).appendTo(this._scroller);

            var child = refreshContainer.children();
            this._dragEl = child[0] && $(child[0]).show();
            this._endEl = child[1] && $(child[1]).hide();
            this._loadEl = child[2] && $(child[2]).hide();
            this._successEl = child[3] && $(child[3]).hide();
            this._failEl = child[4] && $(child[4]).hide();

            this._dragIcon = $(this._dragEl.children()[0]);
            this._endIcon = $(this._endEl.children()[0]);
            this._changeRefreshAnimate('down');
        }
        if(this.get('useLoadmore')) {
            var mh = this.get('loadmoreContY');
            var moreContainer = this._moreCont = $(this.get('loadmoreTpl'));
            // fix bug: infinite模式下，moreContainer的位置需要调整，否则会遮住item项
            if(this.get('infinite')) {
                moreContainer.css({height: mh + 'px', lineHeight: mh + 'px', top: -mh, bottom: 0}).appendTo(this._scroller);
            } else {
                moreContainer.css({height: mh + 'px', lineHeight: mh + 'px', bottom: -mh}).appendTo(this._scroller);
            }

            var child = moreContainer.children();
            this._loadmoreEl = child[0] && $(child[0]).hide();
            this._endmoreEl = child[1] && $(child[1]).hide();
        }
    },

    /**
     * 重置拖拽显示的icon
     * @function _resetDragIcon
     * @memberOf Pagelist
     * @private
     */
    _resetDragIcon: function() {
        if (this.get('useRefresh')) {
            this._dragEl.show();
            this._endEl.hide();
            this._loadEl.hide();
            if(this.get('refreshResultDelay')) {
                this._successEl.hide();
                this._failEl.hide();
            }
        }
        if(this.get('useLoadmore')) {
            this._loadmoreEl.hide();
            this._endmoreEl.hide();
        }
    },

    /**
     * 根据translateY改变刷新的显示状态（下拉刷新or释放更新）
     * @function _changeRefreshStatus
     * @memberOf Pagelist
     * @param {Number} translateY translateY的偏移
     * @private
     */
    _changeRefreshStatus: function (translateY) {
        var activeY = this.get('refreshActiveY');

        if (translateY >= activeY) {
            if(this._dragEl[0].style.display != "none") {
                this._dragEl.hide();
                this._endEl.show();
                this._changeRefreshAnimate('up');
            }
        } else if(translateY < activeY && translateY > 0) {
            if(this._dragEl[0].style.display == "none") {
                this._dragEl.show();
                this._endEl.hide();
                this._changeRefreshAnimate('down');
            }
        }
    },

    /**
     * 根据direction改变icon的样式
     * @function _changeRefreshAnimate
     * @memberOf Pagelist
     * @param {String} direction 方向，上为up下位down
     * @private
     */
    _changeRefreshAnimate: function (direction) {
        if(direction == 'up') {
            iconAnimate(this._dragIcon, 'addClass', true);
            iconAnimate(this._endIcon, 'removeClass');
        } else {
            iconAnimate(this._dragIcon, 'removeClass');
            iconAnimate(this._endIcon, 'addClass', false);
        }
    },

    /**
     * refresh状态初始化
     * @function _refreshInit
     * @memberOf Pagelist
     * @private
     */
    _refreshInit: function() {
        this._refreshing = true;
        this._dragEl.hide();
        this._endEl.hide();
        this._loadEl.show();
        this._changeRefreshAnimate('down');
        this.scrollTo(this.get('refreshActiveY'), 200);

        var self = this;
        setTimeout(function() {
            self.trigger('refresh', this._pageNum);
        }, 300);
    },

    /**
     * loadMore状态初始化
     * @function _loadMoreInit
     * @memberOf Pagelist
     * @private
     */
    _loadMoreInit: function() {
        this._loadmoreing = true;
        if (this.get('infinite')) {
            this._moreCont.css({top: 0, buttom: 0});
            var bottomIndex = this.get('pagesize') * this._pageNum - 1;
            var bottomElem = this._itemWrap.find('[data-index="'+bottomIndex+'"]');
            var _top = bottomElem.length ? bottomElem[0]._top : 0;
            var moreContY = _top + this._infiniteElementHeight + this._extraHeight;
            this._setTransform(this._moreCont[0], moreContY);
        }
        this._loadmoreEl.show();
        this._endmoreEl.hide();
        this._maxY -= this.get('loadmoreContY');
        this.trigger('loadmore', this._pageNum);
    }
});

/**
 * 添加下拉刷新和释放更新的动画
 *
 * @param elem 元素
 * @param action 操作，add || remove
 * @param positive 正负
 */
function iconAnimate(elem, action, positive) {
    var style = action == 'addClass' ? (positive ? 'rotate(180deg)' : 'rotate(-180deg)') : '';
    elem[0].style.webkitTransform = style;
    elem[0].style.transform = style;
}

function getAttrRegexp(key) {
    return new RegExp( key + '="(.+?)"')
}

module.exports = Pagelist;

    })( module.exports , module , __context );
    __context.____MODULES[ "623cbc449ca0e7a6f2cf4496da5ac8fe" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "3fd23ba05c908b38c2dbf8905bcf8380" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['623cbc449ca0e7a6f2cf4496da5ac8fe']

    })( module.exports , module , __context );
    __context.____MODULES[ "3fd23ba05c908b38c2dbf8905bcf8380" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "d7baf83f36776e4542297dfae9996245" ,
        filename : "imagelazyload.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * Imagelazyload 图片懒加载组件
 * 
 * @author eva.li<eva.li@qunar.com>
 * @class Imagelazyload
 * @constructor
 * @extends Base
 * @category tool
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/imagelazyload/index.html
 */

var $ =__context.____MODULES['897499f6c44f901ecc6fd2b84da5b878'],
	Base =__context.____MODULES['ba335bae023b1e48c033d17d911cf60a'];

var Imagelazyload = Base.extend({
	/**
	 * @property {String} container 容器
	 * @property {Number} offset 相对容器计算高度差值，默认为0
	 * @property {Number} target 懒加载元素选择器，默认为img
	 * @property {Boolean} vertical 是否为垂直，默认为true
	 * @property {Boolean} iscroll 是否为iscroll模式
	 * @property {Boolean} autoStoreSrc 是否自动拆出src
	 * @property {String} unloadImg 未加载时占位图片，无默认值
	 * @property {String} unloadImg 加载错误的替换图片，无默认值
	 * @property {String} loadClass 加载图片的时候样式，无默认值
	 * @property {String} effect 加载动画可选none(不需要动画),extra(自定义动画配置effectclasslist相配合）,其他为渐现
	 * @property {Array} effectclasslist 自定义动画样式数组
	 * @memberOf Imagelazyload
	 */
	options: {
		container: 'body',
		offset: 0,
		target: 'img',
		vertical: true,
		iscroll: true,
		autoStoreSrc: true,
		unloadImg: '',
		errorImg: '',
		loadClass: '',
		effect: 'none', //设置为extra 支持用户扩展效果
		effectclasslist: [] //用户扩展效果样式名称
	},
	/**
	 * 对于传入的数据进行格式化和初始化
	 * @private
	 * @function _formatParam 
	 * @memberOf Imagelazyload
	 */
	_formatParam: function() {
		var self = this;
		//对传入的参数进行格式化处理
		for (var key in this.options) {
			switch (key) {
				case 'offset':
					this.set(key, parseInt(this.get(key), 10));
					break;
				case 'vertical':
					this.set(key, Boolean(this.get(key)));
					break;
				default:
					break;
			}
		}
		//根据方向 设置不同的判断函数
		if (Boolean(self.get('vertical'))) {
			this.judge = function(imgItem, scroll, itemY) {
				var result,
					scroll = scroll || 0,
					itemY = itemY || 0,
					standard = window.scrollY + document.documentElement.clientHeight + self.get('offset') - scroll;
				//TODO对于绑定事件进行判断 如果是scroll 逻辑不变 如果是 touchend或是 transitionend 则设置图片加载区间 
				// var beginLine = this.container.offset().top - scroll;
				// 	deadLine = this.container.offset().top + this.container.offset().height - scroll;
				this.getOffset(imgItem) + itemY < standard ? result = true : result = false;
				// $(imgItem).offset().top + itemY < deadLine ? result = true : result = false;

				return result;
			}
		} else {
			this.judge = function(imgItem, scroll, itemX) {
				var result,
					scroll = scroll || 0,
					itemX = itemX || 0,
					standard = window.scrollX + document.documentElement.clientWidth + self.get('offset') - scroll;
				this.getOffset(imgItem, 'left') + itemX < standard ? result = true : result = false;
				return result;
			}
		}
		//根据传入的动画状态设置不同的动画类名
		switch (self.get('effect')) {
			case 'none':
				this.aniClassList = [];
				break;
			case 'extra':
				this.aniClassList = self.get('effectclasslist');
				break;
			default:
				this.aniClassList = ['ani', 'fade-in'];
		}
	},
	/**
	 * 绑定滚动事件
	 * @private
	 * @function _bindEvent
	 * @memberOf Imagelazyload
	 */
	_bindEvent: function() {
		var self = this;
		this.scrollEvent = function() {
			self.lazyload();
		};
		$(window).on('scroll', this.scrollEvent);
	},
	/**
	 * 接班事件
	 * @private
	 * @function _unbindEvent
	 * @memberOf Imagelazyload
	 */
	_unbindEvent: function() {
		var self = this;
		$(window).off('scroll', this.scrollEvent);
	},
	/**
	 * 扫描符合描述的元素节点
	 * @function scan
	 * @memberOf  Imagelazyload
	 */
	scan: function() {
		var self = this;
		self.list = $(self.get('container')).find(self.get('target')).not('[data-complete = true]');
		// console.log(self.list);
		if (self.get('autoStoreSrc')) {
			self.list.each(function(index, item) {
				var $item = $(item),
					href = $(item).attr('src');
				$item.data('src', href);
				$item.attr('src', self.get('unloadImg'));
			})
		}
		return self;
	},
	/**
	 * 执行懒加载
	 * @function lazyload
	 * @param  {Number} iscrool 滚动位置
	 * @param  {Number} itemoffset 偏差
	 * @memberOf Imagelazyload
	 */
	lazyload: function(iscroll, itemoffset) {
		var self = this;
		// 首次调用iscroll设置为1 为了防止与reload触发iscroll=0 时相混淆
		//支出组建内部缓存上次记载滚动位置
		self.iscroll = iscroll || self.iscroll || 1;
		//如果iscroll==0 则不执行 lazyload
		if (!!self.list.length && self.iscroll) {
			for (var i = 0, len = self.list.length; i < len; i++) {
				item = self.list[i];
				if (self.judge(item, self.iscroll, itemoffset)) {
					self._checkout(item);
					//对于图片大小为0的图片进行提示
					if (item.height === 0 && item.width === 0) {
						console.warn(item, '该图片大小为0，请核实')
					}
				} else {
					self.list = self.list.slice(i);
					break;
				}
				i == len - 1 ? self.list = [] : '';
			}
		}
	},
	/**
	 * 快速扫描并且加载
	 * @function scanandload
	 * @param  {Number} iscroll 滚动位置
	 * @memberOf Imagelazyload
	 */
	scanandload: function(iscroll) {
		this.scan().lazyload(iscroll);
	},
	/**
	 * 重新扫描未添加到队列中的节点
	 * @function refresh
	 * @memberOf Imagelazyload
	 */
	refresh: function() {
		var container = this.get('container'),
			list = $(this.get('container')).find(this.get('target'));
		if (this.get('autoStoreSrc')) {
			list.attr('data-src', '');
		} else {
			list.attr('src', this.get('unloadImg'));
		}
		list.attr('data-complete', false);
		this.scan().lazyload();
	},
	/**
	 * 初始化函数
	 * @private
	 * @function initialize
	 * @memberOf Imagelazyload
	 */
	initialize: function(config) {
		Imagelazyload.superClass.initialize.call(this, config);
		this.container = $(this.get('container'));
		this._formatParam();
		this.scan();
		this.lazyload();
		this.get('iscroll') ? ' ' : this._bindEvent();
	},
	/**
	 * 销毁组件
	 * @function destory
	 * @memberOf destory
	 */
	destroy: function() {
		this.get('iscroll') ? ' ' : this._unbindEvent();
		Imagelazyload.superClass.destroy.call(this);
	},
	/**
	 * 判断图片是否合法
	 * @private
	 * @function _checkout
	 * @param {Dom} imgDom 图片Dom节点
	 * @memberOf Imagelazyload
	 */
	//判断图片链接是否可用
	_checkout: function(item) {
		var self = this,
			$item = $(item);
		var itemSrc = $item.data('src'),
			img = new Image();
		$item.addClass(self.get('loadClass'));

		img.onerror = function(err) {
			if (self.get('errorImg')) {
				$item.attr('src', self.get('errorImg'));
			}
			$item.removeClass(self.get('loadClass'));
			$item.data('complete', true);
			$item.trigger('error', err);
			img = null;
		};
		img.onload = function() {
			$item.removeClass(self.get('loadClass'));
			self._effect($item);
			$item.attr('src', $item.data('src'));
			$item.data('complete', true);
			img = null;
		};
		img.src = itemSrc;
	},
	/**
	 * 动画效果处理函数
	 * @private
	 * @param  {Dom} 图片节点
	 * @memberOf Imagelazyload
	 */
	_effect: function($item) {
		var self = this;
		self.aniClassList.length && $.each(self.aniClassList, function(index, item) {
			$item.addClass(item);
		});
	},
	//zepto对于 offsetTop计算不准确 
	//TODO加上translateY值
	/**
	 * 内置计算图片offset函数
	 * @private
	 * @function getOffset
	 * @param  {Dom} 图片节点
	 * @param  {String}计算内容 top或者left,默认值为top
	 * @memberOf Imagelazyload
	 */
	getOffset: function(item, type) {
		var measure = type || 'top';
		if (measure == 'left') {
			var currentEle = item,
				offset = 0;
			while (currentEle && currentEle.offsetParent != document.body) {
				offset += currentEle.offsetLeft;
				currentEle = currentEle.offsetParent;
			}
			return offset;
		} else {
			var currentEle = item,
				offset = 0;
			while (currentEle && currentEle.offsetParent != document.body) {
				offset += currentEle.offsetTop;
				currentEle = currentEle.offsetParent;
			}
			return offset;
		}
	}

})
module.exports = Imagelazyload;

    })( module.exports , module , __context );
    __context.____MODULES[ "d7baf83f36776e4542297dfae9996245" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "9fd70c6a34ca22879b21a43ae45b1129" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports = __context.____MODULES['d7baf83f36776e4542297dfae9996245'];


    })( module.exports , module , __context );
    __context.____MODULES[ "9fd70c6a34ca22879b21a43ae45b1129" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "52a67316e0f01ecbd4a348e608fdd5d5" ,
        filename : "doublelist.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["doublelist"] = "<div class=\"yo-doublelist\">\n    <div class=\"item\" data-role=\"categorylist\"></div>\n    <div class=\"item\" data-role=\"mainlist\"></div>\n</div>\n";
if (typeof module !== "undefined") module.exports = window.QTMPL["doublelist"];

    })( module.exports , module , __context );
    __context.____MODULES[ "52a67316e0f01ecbd4a348e608fdd5d5" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "6a6e78f76777d2b638a68489e99951bd" ,
        filename : "list-category.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["list-category"] = "<div class=\"yo-group\">\n    <div class=\"scroll-wrap\" data-role=\"scroller\">\n        <ul class=\"yo-list\" data-role=\"itemwrap\"></ul>\n    </div>\n    <div class=\"no-data\" data-role=\"nodata\"></div>\n</div>\n";
if (typeof module !== "undefined") module.exports = window.QTMPL["list-category"];

    })( module.exports , module , __context );
    __context.____MODULES[ "6a6e78f76777d2b638a68489e99951bd" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "ee9b97df715ece48d8022f9703ebd26c" ,
        filename : "doublelist.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * 双列表，类似于外卖的左右两列选菜列表，是通过组合两个pagelist来完成的
 * 左侧为分类列表右侧为主列表
 * @author zxiao <jiuhu.zh@gmail.com>
 * @class DoubleList
 * @constructor
 * @extends Widget
 * @category business
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/doublelist/index.html
 */
var $ =__context.____MODULES['897499f6c44f901ecc6fd2b84da5b878'];
var Widget =__context.____MODULES['727699dca154f9ef72d5e879dadfb5a5'];
var Template =__context.____MODULES['9e11d69af7743de93f8c257f13101434'];
var Pagelist =__context.____MODULES['3fd23ba05c908b38c2dbf8905bcf8380'];
var ImageLazyLoad =__context.____MODULES['9fd70c6a34ca22879b21a43ae45b1129'];
var tpl =__context.____MODULES['52a67316e0f01ecbd4a348e608fdd5d5'];
var CategoryListTpl =__context.____MODULES['6a6e78f76777d2b638a68489e99951bd'];
var CategoryItemTpl =__context.____MODULES['c04eae08a3563bb88610c5af16fe812b'];
var MainListTpl =__context.____MODULES['6a6e78f76777d2b638a68489e99951bd'];
var MainItemTpl =__context.____MODULES['c04eae08a3563bb88610c5af16fe812b'];

var DoubleList = Widget.extend({

    /**
     * @property {String} categoryListActiveClass 分类列表激活状态的样式
     * @property {String} categoryListSelectedClass 分类列表选中后的样式
     * @property {String} mainListActiveClass 主列表激活状态的样式
     * @property {String} mainListSelectedClass 主列表选中后的样式
     * @property {Array} category 左侧分类列表数据
     * @property {String} key 分类数据与主列表数据关联字段，默认为null
     * @property {Boolean} selectFirst 是否默认选中分类列表第一项，默认为true
     * @property {Boolean} preventDefault 是否阻止浏览器默认事件，默认为true
     * @property {Boolean} resizable 窗口大小改变时，是否重新调节大小，默认为true
     * @property {Number} pagesize 主列表一页显示的条目树，默认为15
     * @property {Boolean} useRefresh 是否允许下拉刷新，默认为false
     * @property {Boolean} useLoadmore 是否允许下拉加载更多，默认为false
     * @property {Boolean} infinite 主列表是否加载大量数据，默认为false
     * @property {Boolean} imgLazyLoad 主列表图片是否延迟加载，默认为false
     * @property {String} template 组件模板，需要自定义时修改
     * @property {String} categoryListTpl 分类列表模板，需要自定义时修改
     * @property {String} categoryItemTpl 分类列表项模板，需要自定义时修改
     * @property {String} mainListTpl 主列表模板，需要自定义时修改
     * @property {String} mainItemTpl 主列表项模板，需要自定义时修改
     * @memberOf  DoubleList
     */
    

    options: {
        type: 'doublelist',
        // 分类列表激活状态的样式
        categoryListActiveClass: null,
        // 分类列表选中后的样式
        categoryListSelectedClass: null,
        // 数据列表激活状态的样式
        mainListActiveClass: null,
        // 数据列表选中后的样式
        mainListSelectedClass: null,
        // 分类数据
        category: [],
        // 分类数据与主列表数据关联字段
        key: null,
        // 默认选中分类列表第一项
        selectFirst: true,
        // 阻止浏览器默认事件
        preventDefault: false,
        // 可调整大小
        resizable: true,

        // 每页加载的数据量
        pagesize: 15,
        // 刷新激活高度
        refreshActiveY: 40,
        // 加载更多激活高度
        loadmoreActiveY: 40,
        // 刷新结果显示时间，0为不显示刷新结果
        refreshResultDelay: 0,
        // 是否启用刷新功能
        useRefresh: false,
        // 是否启用加载更多功能
        useLoadmore: false,
        // 是否加载大量数据
        infinite: false,
        // 主列表图片是否延迟加载
        imgLazyLoad: false,
        // 主列表tap事件点击间隔时间
        mainListTapInterval: 0,

        // 组件模板
        template: tpl,
        // 分类列表模板
        categoryListTpl: CategoryListTpl,
        // 分类列表项模板
        categoryItemTpl: CategoryItemTpl,
        // 数据列表模板
        mainListTpl: MainListTpl,
        // 数据列表项模板
        mainItemTpl: MainItemTpl,
        /**
         * 选择左侧分类列表时触发的事件
         * @event selectcategory
         * @param  {Object} data     当前选择项目的数据
         * @param  {HTMLElement} itemEl   当前选择项目的节点
         * @param  {HTMLElement} targetEl 用户点击的实际节点
         * @memberOf DoubleList
         */
        onSelectCategory: function (data, itemEl, targetEl) {},
        
        /**
         * 选择右侧主列表时触发的事件
         * @event selectmain
         * @param  {Object} data     当前选择项目的数据
         * @param  {HTMLElement} itemEl   当前选择项目的节点
         * @param  {HTMLElement} targetEl 用户点击的实际节点
         * @memberOf DoubleList
         */
        onSelectMain: function (data, itemEl, targetEl) {},
        // 刷新中，该接口必须调用Pagelist.refresh(true|false, data)方法通知Pagelist数据已加载
        /**
         * 下拉刷新时触发的事件
         * @event refresh
         * @param  {Number} pageNum 当前的页码
         * @memberOf DoubleList
         */
        onRefresh: function (pageNum) {},
        // 加载更多中，该接口必须调用Pagelist.loadMore(true|false, data)方法通知Pagelist数据已加载
        /**
         * 加载更多时触发的事件
         * @event loadmore
         * @param  {Number} pageNum 当前的页码
         * @memberOf DoubleList
         */
        onLoadMore: function(pageNum) {}
    },

    /**
     * 处理组件数据
     * @function init
     * @memberOf DoubleList
     * @private
     */
    init: function() {
        this.initProp();
    },


    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf DoubleList
     */
    render: function() {
        DoubleList.superClass.render.call(this);
        this.initUI();
        return this;
    },

    /**
     * 初始化组件的私有参数
     * @function initProp
     * @memberOf DoubleList
     * @private
     */
    initProp: function() {
        this._categoryList = null;
        this._mainList = null;
        this._imgLazyLoader = null;
    },

    /**
     * 渲染组件样式
     * @function initUI
     * @memberOf DoubleList
     * @private
     */
    initUI: function() {
        var self = this;

        var category = this.get('category');
        if(!category || !category.length) return;

        var selectFirst = this.get('selectFirst');

        this._categoryList = this._widgetMap['categorylist'] = new Pagelist({
            container: this.widgetEl.find('[data-role="categorylist"]'),
            datasource: category,
            useRefresh: false,
            useLoadmore: false,
            isTransition: true,
            preventDefault: this.get('preventDefault'),
            template: this.get('categoryListTpl'),
            itemTpl: this.get('categoryItemTpl'),
            activeClass: this.get('categoryListActiveClass'),
            selectedClass: this.get('categoryListSelectedClass'),
            onSelectItem: function(data, itemEl, targetEl) {
                self.trigger('selectcategory', data, itemEl, targetEl);
                self._mainList.scrollTo(0);
            },
            onReady: function() {
                if(selectFirst) {
                    var selectedClass = this.get('selectedClass');
                    if(selectedClass) {
                        $(this._itemWrap.children().get(0)).addClass(selectedClass);
                    }
                }
            }
        }).render();

        this._mainList = this._widgetMap['mainlist'] = new Pagelist ({
            container: this.widgetEl.find('[data-role="mainlist"]'),
            datasource: [],
            useRefresh: false,
            pagesize: this.get('pagesize'),
            refreshActiveY: this.get('refreshActiveY'),
            loadmoreActiveY: this.get('loadmoreActiveY'),
            refreshResultDelay: this.get('refreshResultDelay'),
            useRefresh: this.get('useRefresh'),
            useLoadmore: this.get('useLoadmore'),
            preventDefault: this.get('preventDefault'),
            infinite: this.get('infinite'),
            tapInterval: this.get('mainListTapInterval'),
            template: this.get('mainListTpl'),
            itemTpl: this.get('mainItemTpl'),
            activeClass: this.get('mainListActiveClass'),
            selectedClass: this.get('mainListSelectedClass'),
            onRefresh: this.get('onRefresh'),
            onLoadMore: this.get('onLoadMore'),
            onSelectItem: function(data, itemEl, targetEl) {
                self.trigger('selectmain', data, itemEl, targetEl);
            }
        }).render();

        selectFirst &&self.trigger('selectcategory', category[0]);
    },

    /**
     * 重新加载主列表的数据
     * @function reloadMainList
     * @memberOf DoubleList
     * @param  {Array} data 主列表重新加载的数据
     */
    reloadMainList: function(data) {
        this._mainList.reloadData(data);

        if(this.get('imgLazyLoad')) {
            if(!this._imgLazyLoader) {
                var self = this;
                this._imgLazyLoader = new ImageLazyLoad({
                    container: this._mainList.widgetEl
                });
                this._mainList.on('scroll', function(y) {
                    self._imgLazyLoader.lazyload(y);
                })
            } else {
                this._imgLazyLoader.scan();
            }
        }
    },

    /**
     * 根据窗口大小重新调整组件位置和大小
     * @function resize
     * @memberOf DoubleList
     */
    resize: function() {
        this._categoryList.resize();
        this._mainList.resize();
    }
});

module.exports = DoubleList;

    })( module.exports , module , __context );
    __context.____MODULES[ "ee9b97df715ece48d8022f9703ebd26c" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "c6d60da7da91049eceab1f835dd39b21" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['ee9b97df715ece48d8022f9703ebd26c']

    })( module.exports , module , __context );
    __context.____MODULES[ "c6d60da7da91049eceab1f835dd39b21" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "06cc1a8bc1b445148f686a7a65606d33" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    var obj = {};
obj["doublelist"] = __context.____MODULES['c6d60da7da91049eceab1f835dd39b21'];
module.exports = obj["doublelist"];

    })( module.exports , module , __context );
    __context.____MODULES[ "06cc1a8bc1b445148f686a7a65606d33" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "2e118925b78e8e8dc7c6538e1bec050d" ,
        filename : "kami-doublelist.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    var Widget =__context.____MODULES['06cc1a8bc1b445148f686a7a65606d33'];

var kami = window.Kami || {};

kami.DoubleList = Widget;

window.Kami = kami;

    })( module.exports , module , __context );
    __context.____MODULES[ "2e118925b78e8e8dc7c6538e1bec050d" ] = module.exports;
})(this);
