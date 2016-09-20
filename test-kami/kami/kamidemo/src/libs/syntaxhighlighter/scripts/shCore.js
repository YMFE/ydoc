/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 *
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
var XRegExp;
if (XRegExp) throw Error("can't load XRegExp twice in the same frame");
(function() {
    function r(f, e) {
        if (!XRegExp.isRegExp(f)) throw TypeError("type RegExp expected");
        var a = f._xregexp;
        f = XRegExp(f.source, t(f) + (e || ""));
        if (a) f._xregexp = {
            source: a.source,
            captureNames: a.captureNames ? a.captureNames.slice(0) : null
        };
        return f
    }

    function t(f) {
        return (f.global ? "g" : "") + (f.ignoreCase ? "i" : "") + (f.multiline ? "m" : "") + (f.extended ? "x" : "") + (f.sticky ? "y" : "")
    }

    function B(f, e, a, b) {
        var c = u.length,
            d, h, g;
        v = true;
        try {
            for (; c--;) {
                g = u[c];
                if (a & g.scope && (!g.trigger || g.trigger.call(b))) {
                    g.pattern.lastIndex = e;
                    if ((h = g.pattern.exec(f)) && h.index === e) {
                        d = {
                            output: g.handler.call(b, h, a),
                            match: h
                        };
                        break
                    }
                }
            }
        } catch (i) {
            throw i
        } finally {
            v = false
        }
        return d
    }

    function p(f, e, a) {
        if (Array.prototype.indexOf) return f.indexOf(e, a);
        for (a = a || 0; a < f.length; a++)
            if (f[a] === e) return a;
        return -1
    }
    XRegExp = function(f, e) {
        var a = [],
            b = XRegExp.OUTSIDE_CLASS,
            c = 0,
            d, h;
        if (XRegExp.isRegExp(f)) {
            if (e !== undefined) throw TypeError("can't supply flags when constructing one RegExp from another");
            return r(f)
        }
        if (v) throw Error("can't call the XRegExp constructor within token definition functions");
        e = e || "";
        for (d = {
            hasNamedCapture: false,
            captureNames: [],
            hasFlag: function(g) {
                return e.indexOf(g) > -1
            },
            setFlag: function(g) {
                e += g
            }
        }; c < f.length;)
            if (h = B(f, c, b, d)) {
                a.push(h.output);
                c += h.match[0].length || 1
            } else if (h = n.exec.call(z[b], f.slice(c))) {
            a.push(h[0]);
            c += h[0].length
        } else {
            h = f.charAt(c);
            if (h === "[") b = XRegExp.INSIDE_CLASS;
            else if (h === "]") b = XRegExp.OUTSIDE_CLASS;
            a.push(h);
            c++
        }
        a = RegExp(a.join(""), n.replace.call(e, w, ""));
        a._xregexp = {
            source: f,
            captureNames: d.hasNamedCapture ? d.captureNames : null
        };
        return a
    };
    XRegExp.version = "1.5.0";
    XRegExp.INSIDE_CLASS = 1;
    XRegExp.OUTSIDE_CLASS = 2;
    var C = /\$(?:(\d\d?|[$&`'])|{([$\w]+)})/g,
        w = /[^gimy]+|([\s\S])(?=[\s\S]*\1)/g,
        A = /^(?:[?*+]|{\d+(?:,\d*)?})\??/,
        v = false,
        u = [],
        n = {
            exec: RegExp.prototype.exec,
            test: RegExp.prototype.test,
            match: String.prototype.match,
            replace: String.prototype.replace,
            split: String.prototype.split
        },
        x = n.exec.call(/()??/, "")[1] === undefined,
        D = function() {
            var f = /^/g;
            n.test.call(f, "");
            return !f.lastIndex
        }(),
        y = function() {
            var f = /x/g;
            n.replace.call("x", f, "");
            return !f.lastIndex
        }(),
        E = RegExp.prototype.sticky !== undefined,
        z = {};
    z[XRegExp.INSIDE_CLASS] = /^(?:\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S]))/;
    z[XRegExp.OUTSIDE_CLASS] = /^(?:\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??)/;
    XRegExp.addToken = function(f, e, a, b) {
        u.push({
            pattern: r(f, "g" + (E ? "y" : "")),
            handler: e,
            scope: a || XRegExp.OUTSIDE_CLASS,
            trigger: b || null
        })
    };
    XRegExp.cache = function(f, e) {
        var a = f + "/" + (e || "");
        return XRegExp.cache[a] || (XRegExp.cache[a] = XRegExp(f, e))
    };
    XRegExp.copyAsGlobal = function(f) {
        return r(f, "g")
    };
    XRegExp.escape = function(f) {
        return f.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    };
    XRegExp.execAt = function(f, e, a, b) {
        e = r(e, "g" + (b && E ? "y" : ""));
        e.lastIndex = a = a || 0;
        f = e.exec(f);
        return b ? f && f.index === a ? f : null : f
    };
    XRegExp.freezeTokens = function() {
        XRegExp.addToken = function() {
            throw Error("can't run addToken after freezeTokens")
        }
    };
    XRegExp.isRegExp = function(f) {
        return Object.prototype.toString.call(f) === "[object RegExp]"
    };
    XRegExp.iterate = function(f, e, a, b) {
        for (var c = r(e, "g"), d = -1, h; h = c.exec(f);) {
            a.call(b, h, ++d, f, c);
            c.lastIndex === h.index && c.lastIndex++
        }
        if (e.global) e.lastIndex = 0
    };
    XRegExp.matchChain = function(f, e) {
        return function a(b, c) {
            var d = e[c].regex ? e[c] : {
                    regex: e[c]
                },
                h = r(d.regex, "g"),
                g = [],
                i;
            for (i = 0; i < b.length; i++) XRegExp.iterate(b[i], h, function(k) {
                g.push(d.backref ? k[d.backref] || "" : k[0])
            });
            return c === e.length - 1 || !g.length ? g : a(g, c + 1)
        }([f], 0)
    };
    RegExp.prototype.apply = function(f, e) {
        return this.exec(e[0])
    };
    RegExp.prototype.call = function(f, e) {
        return this.exec(e)
    };
    RegExp.prototype.exec = function(f) {
        var e = n.exec.apply(this, arguments),
            a;
        if (e) {
            if (!x && e.length > 1 && p(e, "") > -1) {
                a = RegExp(this.source, n.replace.call(t(this), "g", ""));
                n.replace.call(f.slice(e.index), a, function() {
                    for (var c = 1; c < arguments.length - 2; c++)
                        if (arguments[c] === undefined) e[c] = undefined
                })
            }
            if (this._xregexp && this._xregexp.captureNames)
                for (var b = 1; b < e.length; b++)
                    if (a = this._xregexp.captureNames[b - 1]) e[a] = e[b];!D && this.global && !e[0].length && this.lastIndex > e.index && this.lastIndex--
        }
        return e
    };
    if (!D) RegExp.prototype.test = function(f) {
        (f = n.exec.call(this, f)) && this.global && !f[0].length && this.lastIndex > f.index && this.lastIndex--;
        return !!f
    };
    String.prototype.match = function(f) {
        XRegExp.isRegExp(f) || (f = RegExp(f));
        if (f.global) {
            var e = n.match.apply(this, arguments);
            f.lastIndex = 0;
            return e
        }
        return f.exec(this)
    };
    String.prototype.replace = function(f, e) {
        var a = XRegExp.isRegExp(f),
            b, c;
        if (a && typeof e.valueOf() === "string" && e.indexOf("${") === -1 && y) return n.replace.apply(this, arguments);
        if (a) {
            if (f._xregexp) b = f._xregexp.captureNames
        } else f += ""; if (typeof e === "function") c = n.replace.call(this, f, function() {
            if (b) {
                arguments[0] = new String(arguments[0]);
                for (var d = 0; d < b.length; d++)
                    if (b[d]) arguments[0][b[d]] = arguments[d + 1]
            }
            if (a && f.global) f.lastIndex = arguments[arguments.length - 2] + arguments[0].length;
            return e.apply(null, arguments)
        });
        else {
            c = this + "";
            c = n.replace.call(c, f, function() {
                var d = arguments;
                return n.replace.call(e, C, function(h, g, i) {
                    if (g) switch (g) {
                        case "$":
                            return "$";
                        case "&":
                            return d[0];
                        case "`":
                            return d[d.length - 1].slice(0, d[d.length - 2]);
                        case "'":
                            return d[d.length - 1].slice(d[d.length - 2] + d[0].length);
                        default:
                            i = "";
                            g = +g;
                            if (!g) return h;
                            for (; g > d.length - 3;) {
                                i = String.prototype.slice.call(g, -1) + i;
                                g = Math.floor(g / 10)
                            }
                            return (g ? d[g] || "" : "$") + i
                    } else {
                        g = +i;
                        if (g <= d.length - 3) return d[g];
                        g = b ? p(b, i) : -1;
                        return g > -1 ? d[g + 1] : h
                    }
                })
            })
        } if (a && f.global) f.lastIndex = 0;
        return c
    };
    String.prototype.split = function(f, e) {
        if (!XRegExp.isRegExp(f)) return n.split.apply(this, arguments);
        var a = this + "",
            b = [],
            c = 0,
            d, h;
        if (e === undefined || +e < 0) e = Infinity;
        else {
            e = Math.floor(+e);
            if (!e) return []
        }
        for (f = XRegExp.copyAsGlobal(f); d = f.exec(a);) {
            if (f.lastIndex > c) {
                b.push(a.slice(c, d.index));
                d.length > 1 && d.index < a.length && Array.prototype.push.apply(b, d.slice(1));
                h = d[0].length;
                c = f.lastIndex;
                if (b.length >= e) break
            }
            f.lastIndex === d.index && f.lastIndex++
        }
        if (c === a.length) {
            if (!n.test.call(f, "") || h) b.push("")
        } else b.push(a.slice(c));
        return b.length > e ? b.slice(0, e) : b
    };
    XRegExp.addToken(/\(\?#[^)]*\)/, function(f) {
        return n.test.call(A, f.input.slice(f.index + f[0].length)) ? "" : "(?:)"
    });
    XRegExp.addToken(/\((?!\?)/, function() {
        this.captureNames.push(null);
        return "("
    });
    XRegExp.addToken(/\(\?<([$\w]+)>/, function(f) {
        this.captureNames.push(f[1]);
        this.hasNamedCapture = true;
        return "("
    });
    XRegExp.addToken(/\\k<([\w$]+)>/, function(f) {
        var e = p(this.captureNames, f[1]);
        return e > -1 ? "\\" + (e + 1) + (isNaN(f.input.charAt(f.index + f[0].length)) ? "" : "(?:)") : f[0]
    });
    XRegExp.addToken(/\[\^?]/, function(f) {
        return f[0] === "[]" ? "\\b\\B" : "[\\s\\S]"
    });
    XRegExp.addToken(/^\(\?([imsx]+)\)/, function(f) {
        this.setFlag(f[1]);
        return ""
    });
    XRegExp.addToken(/(?:\s+|#.*)+/, function(f) {
        return n.test.call(A, f.input.slice(f.index + f[0].length)) ? "" : "(?:)"
    }, XRegExp.OUTSIDE_CLASS, function() {
        return this.hasFlag("x")
    });
    XRegExp.addToken(/\./, function() {
        return "[\\s\\S]"
    }, XRegExp.OUTSIDE_CLASS, function() {
        return this.hasFlag("s")
    })
})();
var SyntaxHighlighter = function() {
    function r(a, b) {
        a.className.indexOf(b) != -1 || (a.className += " " + b)
    }

    function t(a) {
        return a.indexOf("highlighter_") == 0 ? a : "highlighter_" + a
    }

    function B(a) {
        return e.vars.highlighters[t(a)]
    }

    function p(a, b, c) {
        if (a == null) return null;
        var d = c != true ? a.childNodes : [a.parentNode],
            h = {
                "#": "id",
                ".": "className"
            }[b.substr(0, 1)] || "nodeName",
            g, i;
        g = h != "nodeName" ? b.substr(1) : b.toUpperCase();
        if ((a[h] || "").indexOf(g) != -1) return a;
        for (a = 0; d && a < d.length && i == null; a++) i = p(d[a], b, c);
        return i
    }

    function C(a, b) {
        var c = {},
            d;
        for (d in a) c[d] = a[d];
        for (d in b) c[d] = b[d];
        return c
    }

    function w(a, b, c, d) {
        function h(g) {
            g = g || window.event;
            if (!g.target) {
                g.target = g.srcElement;
                g.preventDefault = function() {
                    this.returnValue = false
                }
            }
            c.call(d || window, g)
        }
        a.attachEvent ? a.attachEvent("on" + b, h) : a.addEventListener(b, h, false)
    }

    function A(a, b) {
        var c = e.vars.discoveredBrushes,
            d = null;
        if (c == null) {
            c = {};
            for (var h in e.brushes) {
                var g = e.brushes[h];
                d = g.aliases;
                if (d != null) {
                    g.brushName = h.toLowerCase();
                    for (g = 0; g < d.length; g++) c[d[g]] = h
                }
            }
            e.vars.discoveredBrushes = c
        }
        d = e.brushes[c[a]];
        d == null && b != false && window.alert(e.config.strings.alert + (e.config.strings.noBrush + a));
        return d
    }

    function v(a, b) {
        for (var c = a.split("\n"), d = 0; d < c.length; d++) c[d] = b(c[d], d);
        return c.join("\n")
    }

    function u(a, b) {
        if (a == null || a.length == 0 || a == "\n") return a;
        a = a.replace(/</g, "&lt;");
        a = a.replace(/ {2,}/g, function(c) {
            for (var d = "", h = 0; h < c.length - 1; h++) d += e.config.space;
            return d + " "
        });
        if (b != null) a = v(a, function(c) {
            if (c.length == 0) return "";
            var d = "";
            c = c.replace(/^(&nbsp;| )+/, function(h) {
                d = h;
                return ""
            });
            if (c.length == 0) return d;
            return d + '<code class="' + b + '">' + c + "</code>"
        });
        return a
    }

    function n(a, b) {
        a.split("\n");
        for (var c = "", d = 0; d < 50; d++) c += "                    ";
        return a = v(a, function(h) {
            if (h.indexOf("\t") == -1) return h;
            for (var g = 0;
                (g = h.indexOf("\t")) != -1;) h = h.substr(0, g) + c.substr(0, b - g % b) + h.substr(g + 1, h.length);
            return h
        })
    }

    function x(a) {
        return a.replace(/^\s+|\s+$/g, "")
    }

    function D(a, b) {
        if (a.index < b.index) return -1;
        else if (a.index > b.index) return 1;
        else if (a.length < b.length) return -1;
        else if (a.length > b.length) return 1;
        return 0
    }

    function y(a, b) {
        function c(k) {
            return k[0]
        }
        for (var d = null, h = [], g = b.func ? b.func : c;
            (d = b.regex.exec(a)) != null;) {
            var i = g(d, b);
            if (typeof i == "string") i = [new e.Match(i, d.index, b.css)];
            h = h.concat(i)
        }
        return h
    }

    function E(a) {
        var b = /(.*)((&gt;|&lt;).*)/;
        return a.replace(e.regexLib.url, function(c) {
            var d = "",
                h = null;
            if (h = b.exec(c)) {
                c = h[1];
                d = h[2]
            }
            return '<a href="' + c + '">' + c + "</a>" + d
        })
    }

    function z() {
        for (var a = document.getElementsByTagName("script"), b = [], c = 0; c < a.length; c++) a[c].type == "syntaxhighlighter" && b.push(a[c]);
        return b
    }

    function f(a) {
        a = a.target;
        var b = p(a, ".syntaxhighlighter", true);
        a = p(a, ".container", true);
        var c = document.createElement("textarea");
        if (!(!a || !b || p(a, "textarea"))) {
            B(b.id);
            r(b, "source");
            for (var d = a.childNodes, h = [], g = 0; g < d.length; g++) h.push(d[g].innerText || d[g].textContent);
            h = h.join("\r");
            c.appendChild(document.createTextNode(h));
            a.appendChild(c);
            c.focus();
            c.select();
            w(c, "blur", function() {
                c.parentNode.removeChild(c);
                b.className = b.className.replace("source", "")
            })
        }
    }
    var e = {
        defaults: {
            "class-name": "",
            "first-line": 1,
            "pad-line-numbers": false,
            highlight: null,
            title: null,
            "smart-tabs": true,
            "tab-size": 4,
            gutter: true,
            toolbar: true,
            "quick-code": true,
            collapse: false,
            "auto-links": true,
            light: false,
            "html-script": false
        },
        config: {
            space: "&nbsp;",
            useScriptTags: true,
            bloggerMode: false,
            stripBrs: false,
            tagName: "pre",
            strings: {
                expandSource: "expand source",
                help: "?",
                alert: "SyntaxHighlighter\n\n",
                noBrush: "Can't find brush for: ",
                brushNotHtmlScript: "Brush wasn't configured for html-script option: ",
                aboutDialog: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>About SyntaxHighlighter</title></head><body style="font-family:Geneva,Arial,Helvetica,sans-serif;background-color:#fff;color:#000;font-size:1em;text-align:center;"><div style="text-align:center;margin-top:1.5em;"><div style="font-size:xx-large;">SyntaxHighlighter</div><div style="font-size:.75em;margin-bottom:3em;"><div>version 3.0.83 (July 02 2010)</div><div><a href="http://alexgorbatchev.com/SyntaxHighlighter" target="_blank" style="color:#005896">http://alexgorbatchev.com/SyntaxHighlighter</a></div><div>JavaScript code syntax highlighter.</div><div>Copyright 2004-2010 Alex Gorbatchev.</div></div><div>If you like this script, please <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2930402" style="color:#005896">donate</a> to <br/>keep development active!</div></div></body></html>'
            }
        },
        vars: {
            discoveredBrushes: null,
            highlighters: {}
        },
        brushes: {},
        regexLib: {
            multiLineCComments: /\/\*[\s\S]*?\*\//gm,
            singleLineCComments: /\/\/.*$/gm,
            singleLinePerlComments: /#.*$/gm,
            doubleQuotedString: /"([^\\"\n]|\\.)*"/g,
            singleQuotedString: /'([^\\'\n]|\\.)*'/g,
            multiLineDoubleQuotedString: new XRegExp('"([^\\\\"]|\\\\.)*"', "gs"),
            multiLineSingleQuotedString: new XRegExp("'([^\\\\']|\\\\.)*'", "gs"),
            xmlComments: /(&lt;|<)!--[\s\S]*?--(&gt;|>)/gm,
            url: /\w+:\/\/[\w-.\/?%&=:@;]*/g,
            phpScriptTags: {
                left: /(&lt;|<)\?=?/g,
                right: /\?(&gt;|>)/g
            },
            aspScriptTags: {
                left: /(&lt;|<)%=?/g,
                right: /%(&gt;|>)/g
            },
            scriptScriptTags: {
                left: /(&lt;|<)\s*script.*?(&gt;|>)/gi,
                right: /(&lt;|<)\/\s*script\s*(&gt;|>)/gi
            }
        },
        toolbar: {
            getHtml: function(a) {
                function b(i, k) {
                    return e.toolbar.getButtonHtml(i, k, e.config.strings[k])
                }
                for (var c = '<div class="toolbar">', d = e.toolbar.items, h = d.list, g = 0; g < h.length; g++) c += (d[h[g]].getHtml || b)(a, h[g]);
                c += "</div>";
                return c
            },
            getButtonHtml: function(a, b, c) {
                return '<span><a href="#" class="toolbar_item command_' + b + " " + b + '">' + c + "</a></span>"
            },
            handler: function(a) {
                var b = a.target,
                    c = b.className || "";
                b = B(p(b, ".syntaxhighlighter", true).id);
                var d = function(h) {
                    return (h = RegExp(h + "_(\\w+)").exec(c)) ? h[1] : null
                }("command");
                b && d && e.toolbar.items[d].execute(b);
                a.preventDefault()
            },
            items: {
                list: ["expandSource", "help"],
                expandSource: {
                    getHtml: function(a) {
                        if (a.getParam("collapse") != true) return "";
                        var b = a.getParam("title");
                        return e.toolbar.getButtonHtml(a, "expandSource", b ? b : e.config.strings.expandSource)
                    },
                    execute: function(a) {
                        a = document.getElementById(t(a.id));
                        a.className = a.className.replace("collapsed", "")
                    }
                },
                help: {
                    execute: function() {
                        var a = "scrollbars=0";
                        a += ", left=" + (screen.width - 500) / 2 + ", top=" + (screen.height - 250) / 2 + ", width=500, height=250";
                        a = a.replace(/^,/, "");
                        a = window.open("", "_blank", a);
                        a.focus();
                        var b = a.document;
                        b.write(e.config.strings.aboutDialog);
                        b.close();
                        a.focus()
                    }
                }
            }
        },
        findElements: function(a, b) {
            var c;
            if (b) c = [b];
            else {
                c = document.getElementsByTagName(e.config.tagName);
                for (var d = [], h = 0; h < c.length; h++) d.push(c[h]);
                c = d
            }
            c = c;
            d = [];
            if (e.config.useScriptTags) c = c.concat(z());
            if (c.length === 0) return d;
            for (h = 0; h < c.length; h++) {
                for (var g = c[h], i = a, k = c[h].className, j = void 0, l = {}, m = new XRegExp("^\\[(?<values>(.*?))\\]$"), s = new XRegExp("(?<name>[\\w-]+)\\s*:\\s*(?<value>[\\w-%#]+|\\[.*?\\]|\".*?\"|'.*?')\\s*;?", "g");
                    (j = s.exec(k)) != null;) {
                    var o = j.value.replace(/^['"]|['"]$/g, "");
                    if (o != null && m.test(o)) {
                        o = m.exec(o);
                        o = o.values.length > 0 ? o.values.split(/\s*,\s*/) : []
                    }
                    l[j.name] = o
                }
                g = {
                    target: g,
                    params: C(i, l)
                };
                g.params.brush != null && d.push(g)
            }
            return d
        },
        highlight: function(a, b) {
            var c = this.findElements(a, b),
                d = null,
                h = e.config;
            if (c.length !== 0)
                for (var g = 0; g < c.length; g++) {
                    b = c[g];
                    var i = b.target,
                        k = b.params,
                        j = k.brush,
                        l;
                    if (j != null) {
                        if (k["html-script"] == "true" || e.defaults["html-script"] == true) {
                            d = new e.HtmlScript(j);
                            j = "htmlscript"
                        } else if (d = A(j)) d = new d;
                        else continue;
                        l = i.innerHTML;
                        if (h.useScriptTags) {
                            l = l;
                            var m = x(l),
                                s = false;
                            if (m.indexOf("<![CDATA[") == 0) {
                                m = m.substring(9);
                                s = true
                            }
                            var o = m.length;
                            if (m.indexOf("]]\>") == o - 3) {
                                m = m.substring(0, o - 3);
                                s = true
                            }
                            l = s ? m : l
                        }
                        if ((i.title || "") != "") k.title = i.title;
                        k.brush = j;
                        d.init(k);
                        b = d.getDiv(l);
                        if ((i.id || "") != "") b.id = i.id;
                        i.parentNode.replaceChild(b, i)
                    }
                }
        },
        all: function(a) {
            w(window, "load", function() {
                e.highlight(a)
            })
        }
    };
    e.all = e.all;
    e.highlight = e.highlight;
    e.Match = function(a, b, c) {
        this.value = a;
        this.index = b;
        this.length = a.length;
        this.css = c;
        this.brushName = null
    };
    e.Match.prototype.toString = function() {
        return this.value
    };
    e.HtmlScript = function(a) {
        function b(j, l) {
            for (var m = 0; m < j.length; m++) j[m].index += l
        }
        var c = A(a),
            d, h = new e.brushes.Xml,
            g = this,
            i = "getDiv getHtml init".split(" ");
        if (c != null) {
            d = new c;
            for (var k = 0; k < i.length; k++)(function() {
                var j = i[k];
                g[j] = function() {
                    return h[j].apply(h, arguments)
                }
            })();
            d.htmlScript == null ? window.alert(e.config.strings.alert + (e.config.strings.brushNotHtmlScript + a)) : h.regexList.push({
                regex: d.htmlScript.code,
                func: function(j) {
                    for (var l = j.code, m = [], s = d.regexList, o = j.index + j.left.length, F = d.htmlScript, q, G = 0; G < s.length; G++) {
                        q = y(l, s[G]);
                        b(q, o);
                        m = m.concat(q)
                    }
                    if (F.left != null && j.left != null) {
                        q = y(j.left, F.left);
                        b(q, j.index);
                        m = m.concat(q)
                    }
                    if (F.right != null && j.right != null) {
                        q = y(j.right, F.right);
                        b(q, j.index + j[0].lastIndexOf(j.right));
                        m = m.concat(q)
                    }
                    for (j = 0; j < m.length; j++) m[j].brushName = c.brushName;
                    return m
                }
            })
        }
    };
    e.Highlighter = function() {};
    e.Highlighter.prototype = {
        getParam: function(a, b) {
            var c = this.params[a];
            c = c == null ? b : c;
            var d = {
                "true": true,
                "false": false
            }[c];
            return d == null ? c : d
        },
        create: function(a) {
            return document.createElement(a)
        },
        findMatches: function(a, b) {
            var c = [];
            if (a != null)
                for (var d = 0; d < a.length; d++)
                    if (typeof a[d] == "object") c = c.concat(y(b, a[d]));
            return this.removeNestedMatches(c.sort(D))
        },
        removeNestedMatches: function(a) {
            for (var b = 0; b < a.length; b++)
                if (a[b] !== null)
                    for (var c = a[b], d = c.index + c.length, h = b + 1; h < a.length && a[b] !== null; h++) {
                        var g = a[h];
                        if (g !== null)
                            if (g.index > d) break;
                            else if (g.index == c.index && g.length > c.length) a[b] = null;
                        else if (g.index >= c.index && g.index < d) a[h] = null
                    }
                return a
        },
        figureOutLineNumbers: function(a) {
            var b = [],
                c = parseInt(this.getParam("first-line"));
            v(a, function(d, h) {
                b.push(h + c)
            });
            return b
        },
        isLineHighlighted: function(a) {
            var b = this.getParam("highlight", []);
            if (typeof b != "object" && b.push == null) b = [b];
            a: {
                a = a.toString();
                var c = void 0;
                for (c = c = Math.max(c || 0, 0); c < b.length; c++)
                    if (b[c] == a) {
                        b = c;
                        break a
                    }
                b = -1
            }
            return b != -1
        },
        getLineHtml: function(a, b, c) {
            a = ["line", "number" + b, "index" + a, "alt" + (b % 2 == 0 ? 1 : 2).toString()];
            this.isLineHighlighted(b) && a.push("highlighted");
            b == 0 && a.push("break");
            return '<div class="' + a.join(" ") + '">' + c + "</div>"
        },
        getLineNumbersHtml: function(a, b) {
            var c = "",
                d = a.split("\n").length,
                h = parseInt(this.getParam("first-line")),
                g = this.getParam("pad-line-numbers");
            if (g == true) g = (h + d - 1).toString().length;
            else if (isNaN(g) == true) g = 0;
            for (var i = 0; i < d; i++) {
                var k = b ? b[i] : h + i,
                    j;
                if (k == 0) j = e.config.space;
                else {
                    j = g;
                    for (var l = k.toString(); l.length < j;) l = "0" + l;
                    j = l
                }
                a = j;
                c += this.getLineHtml(i, k, a)
            }
            return c
        },
        getCodeLinesHtml: function(a, b) {
            a = x(a);
            var c = a.split("\n");
            this.getParam("pad-line-numbers");
            var d = parseInt(this.getParam("first-line"));
            a = "";
            for (var h = this.getParam("brush"), g = 0; g < c.length; g++) {
                var i = c[g],
                    k = /^(&nbsp;|\s)+/.exec(i),
                    j = null,
                    l = b ? b[g] : d + g;
                if (k != null) {
                    j = k[0].toString();
                    i = i.substr(j.length);
                    j = j.replace(" ", e.config.space)
                }
                i = x(i);
                if (i.length == 0) i = e.config.space;
                a += this.getLineHtml(g, l, (j != null ? '<code class="' + h + ' spaces">' + j + "</code>" : "") + i)
            }
            return a
        },
        getTitleHtml: function(a) {
            return a ? "<caption>" + a + "</caption>" : ""
        },
        getMatchesHtml: function(a, b) {
            function c(l) {
                return (l = l ? l.brushName || g : g) ? l + " " : ""
            }
            for (var d = 0, h = "", g = this.getParam("brush", ""), i = 0; i < b.length; i++) {
                var k = b[i],
                    j;
                if (!(k === null || k.length === 0)) {
                    j = c(k);
                    h += u(a.substr(d, k.index - d), j + "plain") + u(k.value, j + k.css);
                    d = k.index + k.length + (k.offset || 0)
                }
            }
            h += u(a.substr(d), c() + "plain");
            return h
        },
        getHtml: function(a) {
            var b = "",
                c = ["syntaxhighlighter"],
                d;
            if (this.getParam("light") == true) this.params.toolbar = this.params.gutter = false;
            className = "syntaxhighlighter";
            this.getParam("collapse") == true && c.push("collapsed");
            if ((gutter = this.getParam("gutter")) == false) c.push("nogutter");
            c.push(this.getParam("class-name"));
            c.push(this.getParam("brush"));
            a = a.replace(/^[ ]*[\n]+|[\n]*[ ]*$/g, "").replace(/\r/g, " ");
            b = this.getParam("tab-size");
            if (this.getParam("smart-tabs") == true) a = n(a, b);
            else {
                for (var h = "", g = 0; g < b; g++) h += " ";
                a = a.replace(/\t/g, h)
            }
            a = a;
            a: {
                b = a = a;
                h = /<br\s*\/?>|&lt;br\s*\/?&gt;/gi;
                if (e.config.bloggerMode == true) b = b.replace(h, "\n");
                if (e.config.stripBrs == true) b = b.replace(h, "");
                b = b.split("\n");
                h = /^\s*/;
                g = 1E3;
                for (var i = 0; i < b.length && g > 0; i++) {
                    var k = b[i];
                    if (x(k).length != 0) {
                        k = h.exec(k);
                        if (k == null) {
                            a = a;
                            break a
                        }
                        g = Math.min(k[0].length, g)
                    }
                }
                if (g > 0)
                    for (i = 0; i < b.length; i++) b[i] = b[i].substr(g);
                a = b.join("\n")
            }
            if (gutter) d = this.figureOutLineNumbers(a);
            b = this.findMatches(this.regexList, a);
            b = this.getMatchesHtml(a, b);
            b = this.getCodeLinesHtml(b, d);
            if (this.getParam("auto-links")) b = E(b);
            typeof navigator != "undefined" && navigator.userAgent && navigator.userAgent.match(/MSIE/) && c.push("ie");
            return b = '<div id="' + t(this.id) + '" class="' + c.join(" ") + '">' + (this.getParam("toolbar") ? e.toolbar.getHtml(this) : "") + '<table border="0" cellpadding="0" cellspacing="0">' + this.getTitleHtml(this.getParam("title")) + "<tbody><tr>" + (gutter ? '<td class="gutter">' + this.getLineNumbersHtml(a) + "</td>" : "") + '<td class="code"><div class="container">' + b + "</div></td></tr></tbody></table></div>"
        },
        getDiv: function(a) {
            if (a === null) a = "";
            this.code = a;
            var b = this.create("div");
            b.innerHTML = this.getHtml(a);
            this.getParam("toolbar") && w(p(b, ".toolbar"), "click", e.toolbar.handler);
            this.getParam("quick-code") && w(p(b, ".code"), "dblclick", f);
            return b
        },
        init: function(a) {
            this.id = "" + Math.round(Math.random() * 1E6).toString();
            e.vars.highlighters[t(this.id)] = this;
            this.params = C(e.defaults, a || {});
            if (this.getParam("light") == true) this.params.toolbar = this.params.gutter = false
        },
        getKeywords: function(a) {
            a = a.replace(/^\s+|\s+$/g, "").replace(/\s+/g, "|");
            return "\\b(?:" + a + ")\\b"
        },
        forHtmlScript: function(a) {
            this.htmlScript = {
                left: {
                    regex: a.left,
                    css: "script"
                },
                right: {
                    regex: a.right,
                    css: "script"
                },
                code: new XRegExp("(?<left>" + a.left.source + ")(?<code>.*?)(?<right>" + a.right.source + ")", "sgi")
            }
        }
    };
    return e
}();
window.XRegExp = XRegExp;
module.exports = SyntaxHighlighter;
