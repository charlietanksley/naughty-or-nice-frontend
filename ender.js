/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://ender.no.de)
  * Build: ender build domready route wings valentine
  * Packages: ender-js@0.5.0 domready@0.2.13 route@0.2.5 wings@0.5.9 valentine@1.8.0
  * =============================================================
  */

/*!
  * Ender: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011-2012 (@ded @fat)
  * http://ender.jit.su
  * License MIT
  */
(function (context, window, document) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context

  // Implements simple module system
  // loosely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {}
    , old = context['$']
    , oldEnder = context['ender']
    , oldRequire = context['require']
    , oldProvide = context['provide']

  /**
   * @param {string} name
   */
  function require(name) {
    // modules can be required from ender's build system, or found on the window
    var module = modules['$' + name] || window[name]
    if (!module) throw new Error("Ender Error: Requested module '" + name + "' has not been defined.")
    return module
  }

  /**
   * @param {string} name
   * @param {*}      what
   */
  function provide(name, what) {
    return (modules['$' + name] = what)
  }

  context['provide'] = provide
  context['require'] = require

  function aug(o, o2) {
    for (var k in o2) k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k])
    return o
  }
  
  /**
   * @param   {*}  o  is an item to count
   * @return  {number|boolean}
   */
  function count(o) {
    if (typeof o != 'object' || !o || o.nodeType || o === window)
      return false
    return typeof (o = o.length) == 'number' && o === o ? o : false
  }

  /**
   * @constructor
   * @param  {*=}      item   selector|node|collection|callback|anything
   * @param  {Object=} root   node(s) from which to base selector queries
   */  
  function Ender(item, root) {
    var i
    this.length = 0 // Ensure that instance owns length

    if (typeof item == 'string')
      // Start @ strings so the result parlays into the other checks
      // The .selector prop only applies to strings
      item = ender['_select'](this['selector'] = item, root)

    if (null == item)
      return this // Do not wrap null|undefined

    if (typeof item == 'function')
      ender['_closure'](item, root)

    // DOM node | scalar | not array-like
    else if (false === (i = count(item)))
      this[this.length++] = item

    // Array-like - Bitwise ensures integer length:
    else for (this.length = i = i > 0 ? i >> 0 : 0; i--;)
      this[i] = item[i]
  }
  
  /**
   * @param  {*=}      item   selector|node|collection|callback|anything
   * @param  {Object=} root   node(s) from which to base selector queries
   * @return {Ender}
   */
  function ender(item, root) {
    return new Ender(item, root)
  }

  ender['_VERSION'] = '0.4.x'

  // Sync the prototypes for jQuery compatibility
  ender['fn'] = ender.prototype = Ender.prototype 

  Ender.prototype['$'] = ender // handy reference to self

  // dev tools secret sauce
  Ender.prototype['splice'] = function () { throw new Error('Not implemented') }
  
  /**
   * @param   {function(*, number, Ender)} fn
   * @param   {Object=} opt_scope
   * @return  {Ender}
   */
  Ender.prototype['forEach'] = function (fn, opt_scope) {
    var i, l
    // opt out of native forEach so we can intentionally call our own scope
    // defaulting to the current item and be able to return self
    for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(opt_scope || this[i], this[i], i, this)
    // return self for chaining
    return this
  }

  /**
   * @param {Object|Function} o
   * @param {boolean=}        chain
   */
  ender['ender'] = function (o, chain) {
    aug(chain ? Ender.prototype : ender, o)
  }

  /**
   * @param {string}  s
   * @param {Node=}   r
   */
  ender['_select'] = function (s, r) {
    return s ? (r || document).querySelectorAll(s) : []
  }

  /**
   * @param {Function} fn
   */
  ender['_closure'] = function (fn) {
    fn.call(document, ender)
  }

  /**
   * @param {(boolean|Function)=} fn  optional flag or callback
   * To unclaim the global $, use no args. To unclaim *all* ender globals, 
   * use `true` or a callback that receives (require, provide, ender)
   */
  ender['noConflict'] = function (fn) {
    context['$'] = old
    if (fn) {
      context['provide'] = oldProvide
      context['require'] = oldRequire
      context['ender'] = oldEnder
      typeof fn == 'function' && fn(require, provide, this)
    }
    return this
  }

  if (typeof module !== 'undefined' && module['exports']) module['exports'] = ender
  // use subscript notation as extern for Closure compilation
  // developers.google.com/closure/compiler/docs/api-tutorial3
  context['ender'] = context['$'] = ender

}(this, window, document));

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * domready (c) Dustin Diaz 2012 - License MIT
    */
  !function (name, definition) {
    if (typeof module != 'undefined') module.exports = definition()
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
    else this[name] = definition()
  }('domready', function (ready) {

    var fns = [], fn, f = false
      , doc = document
      , testEl = doc.documentElement
      , hack = testEl.doScroll
      , domContentLoaded = 'DOMContentLoaded'
      , addEventListener = 'addEventListener'
      , onreadystatechange = 'onreadystatechange'
      , readyState = 'readyState'
      , loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/
      , loaded = loadedRgx.test(doc[readyState])

    function flush(f) {
      loaded = 1
      while (f = fns.shift()) f()
    }

    doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
      doc.removeEventListener(domContentLoaded, fn, f)
      flush()
    }, f)


    hack && doc.attachEvent(onreadystatechange, fn = function () {
      if (/^c/.test(doc[readyState])) {
        doc.detachEvent(onreadystatechange, fn)
        flush()
      }
    })

    return (ready = hack ?
      function (fn) {
        self != top ?
          loaded ? fn() : fns.push(fn) :
          function () {
            try {
              testEl.doScroll('left')
            } catch (e) {
              return setTimeout(function() { ready(fn) }, 50)
            }
            fn()
          }()
      } :
      function (fn) {
        loaded ? fn() : fns.push(fn)
      })
  })

  if (typeof provide == "function") provide("domready", module.exports);

  !function ($) {
    var ready = require('domready')
    $.ender({domReady: ready})
    $.ender({
      ready: function (f) {
        ready(f)
        return this
      }
    }, true)
  }(ender);
}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  // Generated by CoffeeScript 1.4.0
  var route;

  route = typeof exports !== "undefined" && exports !== null ? exports : (this['route'] = {});

  route.Router = (function() {

    function Router() {
      this.routes = [];
    }

    Router.prototype.add = function(expr, fn) {
      var params, pattern, routes;
      if (typeof expr === 'object') {
        routes = expr;
      } else {
        routes = {};
        routes[expr] = fn;
      }
      for (expr in routes) {
        fn = routes[expr];
        pattern = "^" + expr + "$";
        pattern = pattern.replace(/([?=,\/])/g, '\\$1');
        pattern = pattern.replace(/\[(.*?)\]/g, '[[$1]]');
        params = ['path'];
        pattern = pattern.replace(/(:|\*)([\w\d]+)/g, function(all, op, name) {
          params.push(name);
          switch (op) {
            case ':':
              return '([^/]*)';
            case '*':
              return '(.*?)';
          }
        });
        pattern = pattern.replace(/\[\[(.*?)\]\]/g, '(?:$1)?');
        this.routes.push({
          expr: expr,
          params: params,
          pattern: new RegExp(pattern),
          fn: fn
        });
      }
    };

    Router.prototype.run = function(path, context, one) {
      var args, i, m, results, value, _i, _j, _len, _len1, _ref;
      results = [];
      _ref = this.routes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        route = _ref[_i];
        if ((m = route.pattern.exec(path))) {
          args = {};
          for (i = _j = 0, _len1 = m.length; _j < _len1; i = ++_j) {
            value = m[i];
            args[route.params[i]] = decodeURIComponent(value);
          }
          results.push(route.fn.call(context, args));
          if (one) {
            return results[0];
          }
        }
      }
      return results;
    };

    return Router;

  })();

  if (typeof provide == "function") provide("route", module.exports);

  // Generated by CoffeeScript 1.4.0

  (function($) {
    return $.ender({
      route: new require('route').Router
    });
  })(ender);

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  // Generated by CoffeeScript 1.6.3
  (function(wings) {
    var escapeXML, isArray, parsePattern, renderRawTemplate, replaceBraces, restoreBraces;
    wings.strict = false;
    wings.renderTemplate = function(template, data, links) {
      template = template.toString();
      template = replaceBraces(template);
      template = renderRawTemplate(template, data, links);
      template = restoreBraces(template);
      return template;
    };
    replaceBraces = function(template) {
      return template.replace(/\{\{/g, '\ufe5b').replace(/\}\}/g, '\ufe5d');
    };
    restoreBraces = function(template) {
      return template.replace(/\ufe5b/g, '{').replace(/\ufe5d/g, '}');
    };
    isArray = Array.isArray || (function(o) {
      return Object.prototype.toString.call(o) === '[object Array]';
    });
    escapeXML = function(s) {
      return s.toString().replace(/&(?!\w+;)|["<>]/g, function(s) {
        switch (s) {
          case '&':
            return '&amp;';
          case '"':
            return '&#34;';
          case '<':
            return '&lt;';
          case '>':
            return '&gt;';
          default:
            return s;
        }
      });
    };
    parsePattern = /\{([:!])\s*([^}\s]*?)\s*\}([\S\s]+?)\{\/\s*\2\s*\}|\{(\#)[\S\s]+?\#\}|\{([@&~]?)\s*([^}\s]*?)\s*\}/mg;
    return renderRawTemplate = function(template, data, links) {
      return template.replace(parsePattern, function(all, sectionOp, sectionName, sectionContent, commentOp, tagOp, tagName) {
        var content, i, link, name, op, part, parts, rest, v, value, _i, _len, _ref;
        op = sectionOp || commentOp || tagOp;
        name = sectionName || tagName;
        content = sectionContent;
        switch (op) {
          case ':':
            value = data[name];
            if (value == null) {
              if (wings.strict) {
                throw "Invalid section: " + (JSON.stringify(data)) + ": " + name;
              } else {
                return "";
              }
            } else if (isArray(value)) {
              parts = [];
              for (i = _i = 0, _len = value.length; _i < _len; i = ++_i) {
                v = value[i];
                v['#'] = i;
                parts.push(renderRawTemplate(content, v, links));
              }
              return parts.join('');
            } else if (typeof value === 'object') {
              return renderRawTemplate(content, value, links);
            } else if (typeof value === 'function') {
              return value.call(data, content);
            } else if (value) {
              return renderRawTemplate(content, data, links);
            } else {
              return "";
            }
            break;
          case '!':
            value = data[name];
            if (value == null) {
              if (wings.strict) {
                throw "Invalid inverted section: " + (JSON.stringify(data)) + ": " + name;
              } else {
                return "";
              }
            } else if (!value || (isArray(value) && value.length === 0)) {
              return renderRawTemplate(content, data, links);
            } else {
              return "";
            }
            break;
          case '#':
            return '';
          case '@':
            link = links ? links[name] : null;
            if (link == null) {
              if (wings.strict) {
                throw "Invalid link: " + (JSON.stringify(links)) + ": " + name;
              } else {
                return "";
              }
            } else if (typeof link === 'function') {
              link = link.call(data);
            }
            return renderRawTemplate(replaceBraces(link), data, links);
          case '~':
          case '&':
          case '':
            value = data;
            rest = name;
            while (value && rest) {
              _ref = rest.match(/^([^.]*)\.?(.*)$/), all = _ref[0], part = _ref[1], rest = _ref[2];
              value = value[part];
            }
            if (value == null) {
              if (wings.strict) {
                throw "Invalid value: " + (JSON.stringify(data)) + ": " + name;
              } else {
                return "";
              }
            } else if (typeof value === 'function') {
              value = value.call(data);
            }
            if (op === '~') {
              return JSON.stringify(value);
            } else if (op === '&') {
              return value;
            } else {
              return escapeXML(value);
            }
            break;
          default:
            throw "Invalid section op: " + op;
        }
      });
    };
  })(typeof exports !== "undefined" && exports !== null ? exports : (this['wings'] = {}));

  if (typeof provide == "function") provide("wings", module.exports);

  // Generated by CoffeeScript 1.6.3
  (function($) {
    var renderTemplate;
    renderTemplate = require('wings').renderTemplate;
    $.ender({
      renderTemplate: renderTemplate
    });
    return $.ender({
      render: function(data, links) {
        return renderTemplate(this[0].innerHTML, data, links);
      }
    }, true);
  })(ender);

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * Valentine: JavaScript's functional Sister
    * (c) Dustin Diaz 2013
    * https://github.com/ded/valentine
    * License MIT
    */

  (function (name, context, definition) {
    if (typeof module != 'undefined') module.exports = definition()
    else if (typeof define == 'function') define(definition)
    else context[name] = context['v'] = definition()
  })('valentine', this, function () {

    var context = this
      , old = context.v
      , ap = []
      , hasOwn = Object.prototype.hasOwnProperty
      , n = null
      , slice = ap.slice
      , nativ = 'map' in ap
      , nativ18 = 'reduce' in ap
      , trimReplace = /(^\s*|\s*$)/g
      , iters = {
      each: nativ ?
        function (a, fn, scope) {
          ap.forEach.call(a, fn, scope)
        } :
        function (a, fn, scope) {
          for (var i = 0, l = a.length; i < l; i++) {
            i in a && fn.call(scope, a[i], i, a)
          }
        }

    , map: nativ ?
        function (a, fn, scope) {
          return ap.map.call(a, fn, scope)
        } :
        function (a, fn, scope) {
          var r = [], i
          for (i = 0, l = a.length; i < l; i++) {
            i in a && (r[i] = fn.call(scope, a[i], i, a))
          }
          return r
        }

    , some: nativ ?
        function (a, fn, scope) {
          return a.some(fn, scope)
        } :
        function (a, fn, scope) {
          for (var i = 0, l = a.length; i < l; i++) {
            if (i in a && fn.call(scope, a[i], i, a)) return true
          }
          return false
        }

    , every: nativ ?
        function (a, fn, scope) {
          return a.every(fn, scope)
        } :
        function (a, fn, scope) {
          for (var i = 0, l = a.length; i < l; i++) {
            if (i in a && !fn.call(scope, a[i], i, a)) return false
          }
          return true
        }

    , filter: nativ ?
        function (a, fn, scope) {
          return a.filter(fn, scope)
        } :
        function (a, fn, scope) {
          for (var r = [], i = 0, j = 0, l = a.length; i < l; i++) {
            if (i in a) {
              if (!fn.call(scope, a[i], i, a)) continue;
              r[j++] = a[i]
            }
          }
          return r
        }

    , indexOf: nativ ?
        function (a, el, start) {
          return a.indexOf(el, isFinite(start) ? start : 0)
        } :
        function (a, el, start) {
          start = start || 0
          start = start < 0 ? 0 : start
          start = start > a.length ? a.length : start
          for (var i = start; i < a.length; i++) {
            if (i in a && a[i] === el) return i
          }
          return -1
        }

    , lastIndexOf: nativ ?
        function (a, el, start) {
          return a.lastIndexOf(el, isFinite(start) ? start : a.length)
        } :
        function (a, el, start) {
          start = start || a.length
          start = start >= a.length ? a.length :
            start < 0 ? a.length + start : start
          for (var i = start; i >= 0; --i) {
            if (i in a && a[i] === el) {
              return i
            }
          }
          return -1
        }

    , reduce: nativ18 ?
        function (o, i, m, c) {
          return ap.reduce.call(o, i, m, c);
        } :
        function (obj, iterator, memo, context) {
          if (!obj) obj = []
          var i = 0, l = obj.length
          if (arguments.length < 3) {
            do {
              if (i in obj) {
                memo = obj[i++]
                break;
              }
              if (++i >= l) {
                throw new TypeError('Empty array')
              }
            } while (1)
          }
          for (; i < l; i++) {
            if (i in obj) {
              memo = iterator.call(context, memo, obj[i], i, obj)
            }
          }
          return memo
        }

    , reduceRight: nativ18 ?
        function (o, i, m, c) {
          return ap.reduceRight.call(o, i, m, c)
        } :
        function (obj, iterator, memo, context) {
          !obj && (obj = [])
          var l = obj.length, i = l - 1
          if (arguments.length < 3) {
            do {
              if (i in obj) {
                memo = obj[i--]
                break;
              }
              if (--i < 0) {
                throw new TypeError('Empty array')
              }
            } while (1)
          }
          for (; i >= 0; i--) {
            if (i in obj) {
              memo = iterator.call(context, memo, obj[i], i, obj)
            }
          }
          return memo
        }

    , find: function (obj, iterator, context) {
        var result
        iters.some(obj, function (value, index, list) {
          if (iterator.call(context, value, index, list)) {
            result = value
            return true
          }
        })
        return result
      }

    , reject: function (a, fn, scope) {
        var r = []
        for (var i = 0, j = 0, l = a.length; i < l; i++) {
          if (i in a) {
            if (fn.call(scope, a[i], i, a)) {
              continue;
            }
            r[j++] = a[i]
          }
        }
        return r
      }

    , size: function (a) {
        return o.toArray(a).length
      }

    , compact: function (a) {
        return iters.filter(a, function (value) {
          return !!value
        })
      }

    , flatten: function (a) {
        return iters.reduce(a, function (memo, value) {
          if (is.arr(value)) {
            return memo.concat(iters.flatten(value))
          }
          memo[memo.length] = value
          return memo
        }, [])
      }

    , uniq: function (ar, opt_iterator) {
        var a = [], i, j
        ar = opt_iterator ? iters.map(ar, opt_iterator) : ar
        label:
        for (i = 0; i < ar.length; i++) {
          for (j = 0; j < a.length; j++) {
            if (a[j] === ar[i]) {
              continue label
            }
          }
          a[a.length] = ar[i]
        }
        return a
      }

    , merge: function (one, two) {
        var i = one.length, j = 0, l
        if (isFinite(two.length)) {
          for (l = two.length; j < l; j++) {
            one[i++] = two[j]
          }
        } else {
          while (two[j] !== undefined) {
            first[i++] = second[j++]
          }
        }
        one.length = i
        return one
      }

    , inArray: function (ar, needle) {
        return !!~iters.indexOf(ar, needle)
      }

    , memo: function (fn, hasher) {
        var store = {}
        hasher || (hasher = function (v) {
          return v
        })
        return function () {
          var key = hasher.apply(this, arguments)
          return hasOwn.call(store, key) ? store[key] : (store[key] = fn.apply(this, arguments))
        }
      }
    }

    var is = {
      fun: function (f) {
        return typeof f === 'function'
      }

    , str: function (s) {
        return typeof s === 'string'
      }

    , ele: function (el) {
        return !!(el && el.nodeType && el.nodeType == 1)
      }

    , arr: function (ar) {
        return ar instanceof Array
      }

    , arrLike: function (ar) {
        return (ar && ar.length && isFinite(ar.length))
      }

    , num: function (n) {
        return typeof n === 'number'
      }

    , bool: function (b) {
        return (b === true) || (b === false)
      }

    , args: function (a) {
        return !!(a && hasOwn.call(a, 'callee'))
      }

    , emp: function (o) {
        var i = 0
        return is.arr(o) ? o.length === 0 :
          is.obj(o) ? (function () {
            for (var k in o) {
              i++
              break;
            }
            return (i === 0)
          }()) :
          o === ''
      }

    , dat: function (d) {
        return !!(d && d.getTimezoneOffset && d.setUTCFullYear)
      }

    , reg: function (r) {
        return !!(r && r.test && r.exec && (r.ignoreCase || r.ignoreCase === false))
      }

    , nan: function (n) {
        return n !== n
      }

    , nil: function (o) {
        return o === n
      }

    , und: function (o) {
        return typeof o === 'undefined'
      }

    , def: function (o) {
        return typeof o !== 'undefined'
      }

    , obj: function (o) {
        return o instanceof Object && !is.fun(o) && !is.arr(o)
      }
    }

    // nicer looking aliases
    is.empty = is.emp
    is.date = is.dat
    is.regexp = is.reg
    is.element = is.ele
    is.array = is.arr
    is.string = is.str
    is.undef = is.und
    is.func = is.fun

    var o = {
      each: function each(a, fn, scope) {
        is.arrLike(a) ?
          iters.each(a, fn, scope) : (function () {
            for (var k in a) {
              hasOwn.call(a, k) && fn.call(scope, k, a[k], a)
            }
          }())
      }

    , map: function map(a, fn, scope) {
        var r = [], i = 0
        return is.arrLike(a) ?
          iters.map(a, fn, scope) : !function () {
            for (var k in a) {
              hasOwn.call(a, k) && (r[i++] = fn.call(scope, k, a[k], a))
            }
          }() && r
      }

    , some: function some(a, fn, scope) {
        if (is.arrLike(a)) return iters.some(a, fn, scope)
        for (var k in a) {
          if (hasOwn.call(a, k) && fn.call(scope, k, a[k], a)) {
            return true
          }
        }
        return false

      }

    , every: function every(a, fn, scope) {
        if (is.arrLike(a)) return iters.every(a, fn, scope)
        for (var k in a) {
          if (!(hasOwn.call(a, k) && fn.call(scope, k, a[k], a))) {
            return false
          }
        }
        return true
      }

    , filter: function filter(a, fn, scope) {
        var r = {}, k
        if (is.arrLike(a)) return iters.filter(a, fn, scope)
        for (k in a) {
          if (hasOwn.call(a, k) && fn.call(scope, k, a[k], a)) {
            r[k] = a[k]
          }
        }
        return r
      }

    , pluck: function pluck(a, k) {
        return is.arrLike(a) ?
          iters.map(a, function (el) {
            return el[k]
          }) :
          o.map(a, function (_, v) {
            return v[k]
          })
      }

    , toArray: function toArray(a) {
        if (!a) return []

        if (is.arr(a)) return a

        if (a.toArray) return a.toArray()

        if (is.args(a)) return slice.call(a)

        return iters.map(a, function (k) {
          return k
        })
      }

    , first: function first(a) {
        return a[0]
      }

    , last: function last(a) {
        return a[a.length - 1]
      }

    , keys: Object.keys ?
        function keysNative(o) {
          return Object.keys(o)
        } :
        function keysCustom(obj) {
          var keys = [], key
          for (key in obj) if (hasOwn.call(obj, key)) keys[keys.length] = key
          return keys
        }

    , values: function values(ob) {
        return o.map(ob, function (k, v) {
          return v
        })
      }

    , extend: function extend() {
        // based on jQuery deep merge
        var options, name, src, copy, clone
          , target = arguments[0], i = 1, length = arguments.length

        for (; i < length; i++) {
          if ((options = arguments[i]) !== n) {
            // Extend the base object
            for (name in options) {
              src = target[name]
              copy = options[name]
              if (target === copy) {
                continue;
              }
              if (copy && (is.obj(copy))) {
                clone = src && is.obj(src) ? src : {}
                target[name] = o.extend(clone, copy);
              } else if (copy !== undefined) {
                target[name] = copy
              }
            }
          }
        }
        return target
      }

    , trim: String.prototype.trim ?
        function trimNative(s) {
          return s.trim()
        } :
        function trimCustom(s) {
          return s.replace(trimReplace, '')
        }

    , bind: function bind(scope, fn) {
        var args = arguments.length > 2 ? slice.call(arguments, 2) : null
        return function () {
          return fn.apply(scope, args ? args.concat(slice.call(arguments)) : arguments)
        }
      }

    , curry: function curry(fn) {
        if (arguments.length == 1) return fn
        var args = slice.call(arguments, 1)
        return function () {
          return fn.apply(null, args.concat(slice.call(arguments)))
        }
      }

    , parallel: function parallel(fns, callback) {
        var args = o.toArray(arguments)
          , len = 0
          , returns = []
          , flattened = []

        if (is.arr(fns) && fns.length === 0 || (is.fun(fns) && args.length === 1)) throw new TypeError('Empty parallel array')
        if (!is.arr(fns)) {
          callback = args.pop()
          fns = args
        }

        iters.each(fns, function (el, i) {
          el(function () {
            var a = o.toArray(arguments)
              , e = a.shift()
            if (e) return callback(e)
            returns[i] = a
            if (fns.length == ++len) {
              returns.unshift(n)

              iters.each(returns, function (r) {
                flattened = flattened.concat(r)
              })

              callback.apply(n, flattened)
            }
          })
        })
      }

    , waterfall: function waterfall(fns, callback) {
        var args = o.toArray(arguments)
          , index = 0

        if (is.arr(fns) && fns.length === 0 || (is.fun(fns) && args.length === 1)) throw new TypeError('Empty waterfall array')
        if (!is.arr(fns)) {
          callback = args.pop()
          fns = args
        }

        (function f() {
          var args = o.toArray(arguments)
          args.push(f)
          var err = args.shift()
          if (!err && fns.length) fns.shift().apply(n, args)
          else {
            args.pop()
            args.unshift(err)
            callback.apply(n, args)
          }
        }(n))
      }

    , queue: function queue(ar) {
        return new Queue(is.arrLike(ar) ? ar : o.toArray(arguments))
      }

    , debounce: function debounce(wait, fn, opt_scope) {
        var timeout
        function caller() {
          var args = arguments
            , context = opt_scope || this
          function later() {
            timeout = null
            fn.apply(context, args)
          }
          clearTimeout(timeout)
          timeout = setTimeout(later, wait)
        }

        // cancelation method
        caller.cancel = function debounceCancel() {
          clearTimeout(timeout)
          timeout = null
        }

        return caller
      }

    , throttle: function throttle(wait, fn, opt_scope) {
        var timeout
        return function throttler() {
          var context = opt_scope || this
            , args = arguments
          if (!timeout) {
            timeout = setTimeout(function throttleTimeout() {
                fn.apply(context, args)
                timeout = null
              },
              wait
            )
          }
        }
      }

    , throttleDebounce: function (throttleMs, debounceMs, fn, opt_scope) {
        var args
          , context
          , debouncer
          , throttler

        function caller() {
          args = arguments
          context = opt_scope || this

          clearTimeout(debouncer)
          debouncer = setTimeout(function () {
            clearTimeout(throttler)
            throttler = null
            fn.apply(context, args)
          }, debounceMs)

          if (!throttler) {
            throttler = setTimeout(function () {
              clearTimeout(debouncer)
              throttler = null
              fn.apply(context, args)
            }, throttleMs)
          }
        }

        // cancelation method
        caller.cancel = function () {
          clearTimeout(debouncer)
          clearTimeout(throttler)
          throttler = null
        }

        return caller
      }
    }

    function Queue (a) {
      this.values = a
      this.index = 0
    }

    Queue.prototype.next = function () {
      this.index < this.values.length && this.values[this.index++]()
      return this
    }

    function v(a, scope) {
      return new Valentine(a, scope)
    }

    function aug(o, o2) {
      for (var k in o2) o[k] = o2[k]
    }

    aug(v, iters)
    aug(v, o)
    v.is = is

    v.v = v // vainglory

    // peoples like the object style
    function Valentine(a, scope) {
      this.val = a
      this._scope = scope || n
      this._chained = 0
    }

    v.each(v.extend({}, iters, o), function (name, fn) {
      Valentine.prototype[name] = function () {
        var a = v.toArray(arguments)
        a.unshift(this.val)
        var ret = fn.apply(this._scope, a)
        this.val = ret
        return this._chained ? this : ret
      }
    })

    // people like chaining
    aug(Valentine.prototype, {
      chain: function () {
        this._chained = 1
        return this
      }
    , value: function () {
        return this.val
      }
    })


    v.noConflict = function () {
      context.v = old
      return this
    }

    return v
  });

  if (typeof provide == "function") provide("valentine", module.exports);

  var v = require('valentine')
  ender.ender(v)
  ender.ender({
      merge: v.merge
    , extend: v.extend
    , each: v.each
    , map: v.map
    , toArray: v.toArray
    , keys: v.keys
    , values: v.values
    , trim: v.trim
    , bind: v.bind
    , curry: v.curry
    , parallel: v.parallel
    , waterfall: v.waterfall
    , inArray: v.inArray
    , queue: v.queue
  })

}());