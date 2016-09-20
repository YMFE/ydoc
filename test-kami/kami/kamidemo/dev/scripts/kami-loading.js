
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
        id : "e043f2686c14ccae31ca6c2e64b3df50" ,
        filename : "overlay.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["overlay"] = "<div class=\"{{uiClass}}\">{{content}}</div>";
if (typeof module !== "undefined") module.exports = window.QTMPL["overlay"];

    })( module.exports , module , __context );
    __context.____MODULES[ "e043f2686c14ccae31ca6c2e64b3df50" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "2d3c12a5f27393892fff6130acff491d" ,
        filename : "mask.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["mask"] = "<div class=\"yo-mask \"></div>";
if (typeof module !== "undefined") module.exports = window.QTMPL["mask"];

    })( module.exports , module , __context );
    __context.____MODULES[ "2d3c12a5f27393892fff6130acff491d" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "556430f1dec546d081eee313fcb44e95" ,
        filename : "overlay.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    
/**
 * 浮层的基类
 * @author  sharon.li <xuan.li@qunar.com>
 * @class Overlay
 * @constructor
 * @extends Widget
 * @category primary
 */

var Widget =__context.____MODULES['727699dca154f9ef72d5e879dadfb5a5'];
var Template =__context.____MODULES['9e11d69af7743de93f8c257f13101434'];
var $ =__context.____MODULES['897499f6c44f901ecc6fd2b84da5b878'];
var OverlayTpl =__context.____MODULES['e043f2686c14ccae31ca6c2e64b3df50'];


var MaskTpl =__context.____MODULES['2d3c12a5f27393892fff6130acff491d'];
var Overlay = Widget.extend({

    /**
     * @property {String} width 宽度字符串，如：36px，默认不传
     * @property {String} height 高度字符串，如：36px，默认不传
     * @property {Number} zIndex 组件默认的z-index，如果有mask, mask的z-index为zIndex-1
     * @property {Boolean} hasMask 是否有遮罩，默认为true
     * @property {Boolean} effect 当前组件是否有动画效果，默认为false
     * @property {String} maskTpl 遮罩的模板字符串
     * @property {Array} maskOffset 遮罩的上下偏移,默认为[0, 0]
     * @memberOf Overlay
     */
    
    /**
     * @event {function} show 组件显示时触发的事件
     * @event {function} hide 组件隐藏时触发的事件
     * @memberOf Overlay
     */
    
    /**
     * 右侧确定按钮点击时触发的事件
     * @event ok
     * @memberOf Overlay
     */
    
    /**
     * 左侧取消按钮点击时触发的事件
     * @event cancel
     * @memberOf Overlay
     */
    options: {
        width: null,
        height: null,
        zIndex: 3001,//mask 99
        hasMask: true,
        template: OverlayTpl,
        visiable: false,
        type: 'overlay',
        effect: null,
        maskTpl: null,
        maskOffset: [0, 0]
    },

    /**
     * 解析模板
     * @function parseTemplate
     * @memberOf Overlay
     * @private
     * @param  {String} tpl 待解析的模板
     * @return {String}     解析后的模板
     */
    parseTemplate: function (tpl) {
    
        
        this.content = this.get('content') || '';
        // debugger
        return Template(tpl || OverlayTpl, {
            uiClass: this.getClassName(),
            content: this.content
        });
        
        
    },

    /**
     * 根据窗口大小重新调整组件位置和大小
     * @function resize
     * @memberOf Overlay
     */
    resize: function () {
    },


    /**
     * 组件当前是否有遮罩
     * @function _hasMask
     * @memberOf Overlay
     * @private
     * @return {Boolean} 当前组件是否有mask
     */
    
    _hasMask : function () {
        return this.hasMask && this.mask && this.mask.length;
    },


    /**
     * 显示组件
     * @function show
     * @memberOf Overlay
     */
    show: function () {
        if (!this._isRender) {
            this.render();
            if (this._hasMask()) {
                
                this.mask.css('display', 'block'); 
            }
        }
        
        
        

        this.visiable = true;
        if (this._hasMask()) {
            this.mask.css('display', 'block');
        }
        
        
        this.widgetEl.css('display', this.displayStyle);
        var effect = this.get('effect');
        if (effect) {
            this.widgetEl.addClass('ani fade-in');
        }
        this.trigger('show');
        this.resize();
        
    },

    /**
     * 隐藏组件
     * @function hide
     * @memberOf Overlay
     */
    hide: function () {
        this.visiable = false;
        
        
        var effect = this.get('effect');
        if (effect) {
            
            this.widgetEl.addClass('fade-out');
        }
        else {
            this.widgetEl.css('display', 'none');    
        }
        if (this._hasMask()) {
            this.mask.css('display', 'none');
            
        }

        
        this.trigger('hide');
    },

    /**
     * 处理组件数据
     * @function init
     * @memberOf Overlay
     * @private
     */
    init: function () {
        
        this.hasMask = this.get('hasMask');
        this.zIndex = this.get('zIndex') || 3001;
        this.useYo = !!this.get('yo');

        // this.parentNode = this.get('parentNode');

    },
   

    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf Overlay
     */
    render: function () {
        Overlay.superClass.render.call(this);
        

        this.initProp();

        this.initUi();
        
    },

    /**
     * 处理组件样式
     * @function initUi
     * @memberOf Overlay
     * @private
     */
    initUi: function () {

        if (!this._hasMask()) {

            this.mask = this.get('maskTpl') || MaskTpl;
            this.mask = $(this.mask);

        }

        this.maskOffset = this.get('maskOffset') || [0, 0];
        this.widgetEl.css('z-index', this.zIndex);
        if (this._hasMask()) {
            var maskHeight = Math.max($(document.documentElement).height(), $(document.body).height(), window.innerHeight);
            this.mask.css({
                'z-index': (this.zIndex - 1),
                'position': 'absolute',
                'display': 'none',
                'top': (0 + this.maskOffset[0]),
                'bottom': (0 + this.maskOffset[1]),
                'left': 0,
                'right': 0,
                'height': maskHeight + 'px'
            });
            

            var maskClass = this.useYo ? 'yo-' : 'ui-';
            maskClass += 'mask';
            this.mask.addClass(maskClass);
            // debugger
            this.mask.insertBefore(this.widgetEl);
        }
        var width = this.get('width');
        if (width) {
            this.widgetEl.css('width', width);
        }
        var height = this.get('height');
        if (height) {
            this.widgetEl.css('height', height);
        }
        // debugger
        
        
        this.displayStyle = this.widgetEl.css('display');
        // debugger
    },

    /**
     * 初始化组件与ui相关的属性
     * @function initProp
     * @memberOf Overlay
     * @private
     */
    initProp: function () {
        
    },

    /**
     * 销毁组件
     * @function destroy
     * @memberOf  Overlay
     */
    destroy : function () {

        if (this.hasMask && this.mask) {
            
            this.mask.remove();
        }
        
        Overlay.superClass.destroy.call(this);
    }

});


module.exports = Overlay;


    })( module.exports , module , __context );
    __context.____MODULES[ "556430f1dec546d081eee313fcb44e95" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "d79271f5e1db960ae5a5827a5ebf276d" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['556430f1dec546d081eee313fcb44e95'];


    })( module.exports , module , __context );
    __context.____MODULES[ "d79271f5e1db960ae5a5827a5ebf276d" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "423d87bf44ba942ab6cede3ad80759d7" ,
        filename : "loading.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["loading"] = "<div class=\"yo-loading\"><div class=\"inner\" data-role=\"inner\"><i class=\"yo-ico\"></i>{{content}}</div></div>";
if (typeof module !== "undefined") module.exports = window.QTMPL["loading"];

    })( module.exports , module , __context );
    __context.____MODULES[ "423d87bf44ba942ab6cede3ad80759d7" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "560ee09ae50ef0d1e184b63747aff446" ,
        filename : "loading.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * 弹层组件
 * @author  eva.li <eva.li@qunar.com>
 * @class Loading
 * @constructor
 * @extends Widget
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/loading/index.html
 */

var Overlay =__context.____MODULES['d79271f5e1db960ae5a5827a5ebf276d'];
var LoadingTpl =__context.____MODULES['423d87bf44ba942ab6cede3ad80759d7'];
var Widget =__context.____MODULES['727699dca154f9ef72d5e879dadfb5a5'];
var $ =__context.____MODULES['897499f6c44f901ecc6fd2b84da5b878'];

//【TODO】init里的posObj不需要了
//【TODO】参考alert改一下
var Loading = Widget.extend({

    /**
     * @property {HTMLElement| String} container 组件的容器
     * @property {Boolean} hasMask 是否有遮罩，默认为true
     * @property {String} width 宽度字符串，如：36px，默认不传
     * @property {String} height 高度字符串，如：36px，默认不传
     * @property {Number} zIndex 组件默认的z-index，如果有mask, mask的z-index为zIndex-1
     * @property {String | HTMLElement} content 组件的内容
     * @property {String} unit 单位
     * @property {Array} maskOffset 遮罩的上下偏移,默认为[0, 0]
     * @memberOf Loading
     */
    options: {
        type: 'loading',
        hasMask: false,
        width: null,
        height: null,
        zIndex: 3001,
        content: '',
        unit: 'px',
        maskOffset: [0, 0],
        template: LoadingTpl,
        /**
         * 显示时触发的事件
         * @event show
         * @memberOf Loading
         */
        onshow: function () {},
        /**
         * 隐藏时触发的事件
         * @event hide
         * @memberOf Loading
         */
        onhide: function () {}
    },


    /**
     * 处理组件数据
     * @function init
     * @memberOf Loading
     * @private
     */
    init: function () {
        this._opt = {
            hasMask: this.get('hasMask') || false,
            width: this.get('width') || null,
            height: this.get('height') || null,
            zIndex: this.get('zIndex') || null,
            content: this.get('content') || '',
            unit: this.get('unit') || 'px',
            maskOffset: this.get('maskOffset') || [0,0],
            template: this.get('template'),
            posObj: this.get('posObj')
        };
        this._isRender = false;
        this._isShow = false;
        Loading.superClass.init.call(this);
    },

    /**
     * 处理组件样式
     * @function initUi
     * @memberOf Loading
     * @private
     */
    initUi: function(){
        $(this.widgetEl).css('top', this.get('maskOffset')[0]+ this.get('unit'));
        $(this.widgetEl).css('bottom', this.get('maskOffset')[1]+ this.get('unit'));
        $(this.widgetEl).css('position', 'absolute');
    },

    /**
     * 显示组件
     * @function show
     * @memberOf Loading
     */
    show: function(){
        if(!this._isRender){
            this.render();
        }else if(!this._isShow){
            this._isShow = true;
            this._widgetMap['overlay'].show();
        }
    },

    /**
     * 显示组件
     * @function hide
     * @memberOf Loading
     */
    hide: function(){
        this._isShow = false;
        this._widgetMap['overlay'].hide();
    },

    /**
     * 将组件渲染到document中
     * @function render
     * @private
     * @memberOf Loading
     */
    render: function(){
        var loading = this;
        var dialog;
        dialog = new Overlay(this._opt);
        dialog.on('hide', function(){
            var defaultAct = loading.trigger('hide');
            if(defaultAct === false){
                this.container.off('touchmove', stopMove);
            }
        });
        dialog.on('show', function(){
            var defaultAct = loading.trigger('show');
            if(defaultAct === false){
                this.container.on('touchmove', stopMove);
            }
        });
        dialog.render();
        this.widgetEl = dialog.widgetEl;
        this._widgetMap['overlay'] = dialog;
        this.initUi();
        this._isRender = true;
        this._isShow = true;
        this.trigger('show');
    }
});

// this deal with singleton
var loading = null;
var stopMove = function () {
    return false;
};

var DEFAULT_OPT = {
    hasMask: false,
    content: '',
    force: false,
    type: 'loading',
    template: LoadingTpl,
    maskOffset: [0, 0]
};
/**
 * Loading的静态方法显示组件的单例
 * @function Loading.show
 * @static
 * @param  {Object} opt 单例属性与属性一致
 * @paramDetails {Boolean} hasMask 是否有遮罩，默认为true
 * @paramDetails {String} width 宽度字符串，如：36px，默认不传
 * @paramDetails {String} height 高度字符串，如：36px，默认不传
 * @paramDetails {Number} zIndex 组件默认的z-index，如果有mask, mask的z-index为zIndex-1
 * @paramDetails {String | HTMLElement} content 组件的内容
 * @paramDetails {String} unit 单位
 * @paramDetails {Array} maskOffset 遮罩的上下偏移,默认为[0, 0]
 * @memberOf Loading
 */
Loading.show = function (opt) {
    var _opt = {};
    $.extend(_opt, DEFAULT_OPT, opt);
    if (loading == null) {
        loading = new Loading(_opt);
        loading.show();
    }
    else if (!!_opt.force) {
        Loading.destroy();
        Loading.show(_opt);
    }
    else {
        loading.show();
    }
};
/**
 * Loading的静态方法隐藏组件的单例
 * @function Loading.hide
 * @static
 * @memberOf Loading
 */
Loading.hide = function(){
    if(!!loading){
        loading.hide();
    }
}
/**
 * Loading的静态方法销毁组件的单例
 * @function Loading.destroy
 * @static
 * @memberOf Loading
 */
Loading.destroy = function(){
    if(!!loading){
        loading.destroy();
        loading = null;
    }
}
module.exports = Loading;


    })( module.exports , module , __context );
    __context.____MODULES[ "560ee09ae50ef0d1e184b63747aff446" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "666925dc0895fb555b9b4baaa7ed7ae0" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['560ee09ae50ef0d1e184b63747aff446']

    })( module.exports , module , __context );
    __context.____MODULES[ "666925dc0895fb555b9b4baaa7ed7ae0" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "07839cd893dc5887bbb0ce745d0de516" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    var obj = {};
obj["loading"] = __context.____MODULES['666925dc0895fb555b9b4baaa7ed7ae0'];
module.exports = obj["loading"];

    })( module.exports , module , __context );
    __context.____MODULES[ "07839cd893dc5887bbb0ce745d0de516" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "d8385ba7cb2d2596b06b2bbb5f376ddb" ,
        filename : "kami-loading.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    var Widget =__context.____MODULES['07839cd893dc5887bbb0ce745d0de516'];

var kami = window.Kami || {};

kami.Loading = Widget;

window.Kami = kami;

    })( module.exports , module , __context );
    __context.____MODULES[ "d8385ba7cb2d2596b06b2bbb5f376ddb" ] = module.exports;
})(this);
