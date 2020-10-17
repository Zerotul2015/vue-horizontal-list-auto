'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopDefault(e){return(e&&(typeof e==='object')&&'default'in e)?e['default']:e}var smoothscroll=_interopDefault(require('smoothscroll-polyfill'));function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}smoothscroll.polyfill();
var script = {
  name: "VueHorizontalList",
  props: {
    /**
     * items to display in horizontal-list
     */
    items: {
      type: Array,
      required: true
    },

    /**
     * item.class = css class for each individual item
     * item.padding = padding between each item in the list
     *
     * list.class = css class for the parent of item
     * list.windowed = maximum width of the list it can extend to, basically the container max-width
     * list.padding = padding of the list, if container < windowed what is the left-right padding of the list
     *
     * responsive breakpoints to calculate how many items to show in the list at each width interval
     * Examples:
     * [{size: 5}] show 5 items regardless
     * [{end: 992, size: 3}},{size: 4}] < 992 show 3 items, else show 4 items
     * [{end: 576, size: 1}, {start: 576, end: 992, size: 2}, {size: 3}] < 576 show 1, 576 - 992 show 2, else show 3
     *
     * These are the default responsive fallback, if you don't have a catch all, it will fallback to this.
     * [{end: 576, size: 1},
     * {start: 576, end: 768, size: 2},
     * {start: 768, end: 992, size: 3},
     * {start: 992, end: 1200, size: 4},
     * {start: 1200, size: 5}]
     *
     *
     * autotoggle
     * Auto change next slider
     * Example([enable(bool), timer ms, repeat(bool)]):
     * [true, 5000, false]
     *
     */
    options: {
      type: Object,
      required: false
    }
  },
  data: function data() {
    return {
      /**
       * Current item position of list
       */
      position: 0,

      /**
       * Width of item, list and window
       */
      width: {
        container: 0,
        window: 576
      }
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$resize = function () {
      _this.width.window = window.innerWidth;
      _this.width.container = _this.$refs.container.clientWidth;
    };

    this.$resize();
    window.addEventListener('resize', this.$resize);

    if (this._options.autoToggle[0] && this._hasNext) {
      setTimeout(function (r) {
        _this.next();
      }, this._options.autoToggle[1]);
    }
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('resize', this.$resize);
  },
  computed: {
    _options: function _options() {
      var options = this.options; //auto toggle sliders

      var autoToggle = [false, 0, false]; //enable, timer ms, repeat

      if (options.autotoggle && options.autotoggle[0] && options.autotoggle[1]) {
        autoToggle = options.autotoggle;

        if (options.autotoggle[3]) {
          autoToggle[3] = true;
        }
      }

      var responsive1 = {
        end: 576,
        size: 1
      };
      var responsive2 = {
        start: 576,
        end: 768,
        size: 2
      };
      var responsive3 = {
        start: 768,
        end: 992,
        size: 3
      };
      var responsive4 = {
        start: 992,
        end: 1200,
        size: 4
      };
      var responsive5 = {
        start: 1200,
        size: 5
      };

      if (this.items.length < 5 && this.items.length) {
        responsive5.size = this.items.length;

        if (responsive5.size > responsive4.size) {
          responsive4.size = responsive5.size - 1;
        } else {
          responsive4.size = responsive5.size;
        }

        if (responsive4.size > responsive3.size) {
          responsive3.size = responsive4.size - 1;
        } else {
          responsive3.size = responsive4.size;
        }

        if (responsive3.size > responsive2.size) {
          responsive2.size = responsive3.size - 1;
        } else {
          responsive2.size = responsive3.size;
        }
      }

      return {
        autoToggle: autoToggle,
        navigation: {
          start: options && options.navigation && options.navigation.start || 992,
          color: options && options.navigation && options.navigation.color || '#000'
        },
        item: {
          class: options && options.item && options.item.class || '',
          padding: options && options.item && options.item.padding || 16
        },
        list: {
          class: options && options.list && options.list.class || '',
          windowed: options && options.list && options.list.windowed || 1200,
          padding: options && options.list && options.list.padding || 24
        },
        responsive: [].concat(_toConsumableArray(options && options.responsive || []), [// Fallback default responsive
        responsive1, responsive2, responsive3, responsive4, responsive5])
      };
    },
    _style: function _style() {
      var style = {
        container: {},
        list: {},
        item: {},
        tail: {}
      };
      var workingWidth = this._workingWidth;
      var size = this._size; // Full Screen Mode

      if (this.width.window < this._options.list.windowed) {
        style.container.marginLeft = "-".concat(this._options.list.padding, "px");
        style.container.marginRight = "-".concat(this._options.list.padding, "px");
        style.item.width = "".concat((workingWidth - (size - 1) * this._options.item.padding) / size, "px");
        style.item.paddingLeft = "".concat(this._options.list.padding, "px");
        style.item.paddingRight = "".concat(this._options.item.padding, "px");
        style.item.marginRight = "-".concat(this._options.list.padding, "px");
      } // Windowed Mode
      else {
          style.item.paddingLeft = "".concat(this._options.item.padding / 2, "px");
          style.item.paddingRight = "".concat(this._options.item.padding / 2, "px");
          style.container.marginLeft = "-".concat(this._options.item.padding / 2, "px");
          style.container.marginRight = "-".concat(this._options.item.padding / 2, "px");
          style.item.width = "".concat((workingWidth - (size - 1) * this._options.item.padding) / size, "px");
        }

      return style;
    },
    _itemWidth: function _itemWidth() {
      return (this._workingWidth - (this._size - 1) * this._options.item.padding) / this._size;
    },

    /**
     * @return number actual width of the container
     */
    _workingWidth: function _workingWidth() {
      // Full Screen Mode
      if (this.width.window < this._options.list.windowed) {
        return this.width.window - this._options.list.padding * 2;
      } // Windowed Mode
      else {
          return this.width.container;
        }
    },

    /**
     * @return visible items in horizontal list at the current width/state
     */
    _size: function _size() {
      var width = this._workingWidth;
      return this._options.responsive.find(function (value) {
        return (!value.start || value.start <= width) && (!value.end || value.end >= width);
      }).size;
    },

    /**
     * @return boolean whether there is prev set of items for navigation
     * @private internal use
     */
    _hasNext: function _hasNext() {
      return this.items.length > this.position + this._size;
    },

    /**
     * @return boolean whether there is next set of items for navigation
     * @private internal use
     */
    _hasPrev: function _hasPrev() {
      return this.position > 0;
    }
  },
  watch: {
    position: function position(newVal) {
      var _this2 = this;

      if (this._options.autoToggle[0]) {
        var timer = this._options.autoToggle[1];

        if (this._hasNext) {
          setTimeout(function (f) {
            return _this2.next();
          }, timer);
        } else {
          if (this._options.autoToggle[3] && this._hasPrev) {
            setTimeout(function (f) {
              return _this2.position = 0;
            }, timer);
          }
        }
      }
    }
  },
  methods: {
    /**
     * @param position of item to scroll to
     */
    go: function go(position) {
      var maxPosition = this.items.length - this._size;
      this.position = position > maxPosition ? maxPosition : position;
      var left = this._itemWidth * this.position + this.position * this._options.item.padding;
      this.$refs.list.scrollTo({
        top: 0,
        left: left,
        behavior: 'smooth'
      });
    },

    /**
     * Go to a set of previous items
     */
    prev: function prev() {
      this.go(this.position - this._size);
    },

    /**
     * Go to a set of next items
     */
    next: function next() {
      this.go(this.position + this._size);
    }
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group =  css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    ref: "container",
    staticClass: "vue-horizontal-list vhl-btn-right--list"
  }, [_vm._ssrNode((_vm.width.window > _vm._options.navigation.start ? "<div class=\"vhl-navigation\">" + (_vm._hasPrev ? "<div class=\"vhl-btn-left vhl-btn-left-custom\"><svg" + _vm._ssrAttr("fill", _vm._options.navigation.color) + " width=\"32px\" height=\"32px\" viewBox=\"0 0 24 24\"><path d=\"M10.757 12l4.95 4.95a1 1 0 1 1-1.414 1.414l-5.657-5.657a1 1 0 0 1 0-1.414l5.657-5.657a1 1 0 0 1 1.414 1.414L10.757 12z\"></path></svg></div>" : "<!---->") + " " + (_vm._hasNext ? "<div class=\"vhl-btn-right vhl-btn-right-custom\"><svg" + _vm._ssrAttr("fill", _vm._options.navigation.color) + " width=\"32px\" height=\"32px\" viewBox=\"0 0 24 24\"><path d=\"M13.314 12.071l-4.95-4.95a1 1 0 0 1 1.414-1.414l5.657 5.657a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 0 1-1.414-1.414l4.95-4.95z\"></path></svg></div>" : "<!---->") + "</div>" : "<!---->") + " "), _vm._ssrNode("<div class=\"vhl-container\"" + _vm._ssrStyle(null, _vm._style.container, null) + ">", "</div>", [_vm._ssrNode("<div" + _vm._ssrClass("vhl-list", _vm._options.list.class) + _vm._ssrStyle(null, _vm._style.list, null) + ">", "</div>", [_vm._l(_vm.items, function (item) {
    return _vm._ssrNode("<div" + _vm._ssrClass("vhl-item", _vm._options.item.class) + _vm._ssrStyle(null, _vm._style.item, null) + ">", "</div>", [_vm._t("default", [_vm._v(_vm._s(item))], {
      "item": item
    })], 2);
  }), _vm._ssrNode(" <div" + _vm._ssrStyle(null, _vm._style.tail, null) + "></div>")], 2)])], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-ca8a5e4a_0", {
    source: ".vue-horizontal-list[data-v-ca8a5e4a]{position:relative}.vhl-navigation[data-v-ca8a5e4a]{display:flex;align-items:center;position:absolute;width:100%;height:100%}.vhl-btn-left[data-v-ca8a5e4a],.vhl-btn-right[data-v-ca8a5e4a]{width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:24px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);z-index:2}.vhl-btn-left[data-v-ca8a5e4a]:hover,.vhl-btn-right[data-v-ca8a5e4a]:hover{cursor:pointer}.vhl-btn-left[data-v-ca8a5e4a]{margin-left:-24px;margin-right:auto}.vhl-btn-right[data-v-ca8a5e4a]{margin-left:auto;margin-right:-24px}.vhl-container[data-v-ca8a5e4a]{overflow-y:hidden;height:100%;margin-bottom:-24px}.vhl-list[data-v-ca8a5e4a]{display:flex;padding-bottom:24px;margin-bottom:-24px;overflow-x:scroll;overflow-y:hidden;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scroll-snap-type:x mandatory}.vhl-item[data-v-ca8a5e4a]{box-sizing:content-box}.vhl-list>*[data-v-ca8a5e4a]{scroll-snap-align:start;flex-shrink:0}.vhl-item[data-v-ca8a5e4a]{z-index:1}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-ca8a5e4a";
/* module identifier */

var __vue_module_identifier__ = "data-v-ca8a5e4a";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);// Import vue component

var install = function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('VueHorizontalList', __vue_component__);
}; // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

var GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
} // Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()


__vue_component__.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;
exports.default=__vue_component__;