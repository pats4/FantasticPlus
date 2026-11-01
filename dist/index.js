(function (deckyFrontendLib, React) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  var DefaultContext = {
    color: undefined,
    size: undefined,
    className: undefined,
    style: undefined,
    attr: undefined
  };
  var IconContext = React__default["default"].createContext && React__default["default"].createContext(DefaultContext);

  var __assign = window && window.__assign || function () {
    __assign = Object.assign || function (t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var __rest = window && window.__rest || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  };
  function Tree2Element(tree) {
    return tree && tree.map(function (node, i) {
      return React__default["default"].createElement(node.tag, __assign({
        key: i
      }, node.attr), Tree2Element(node.child));
    });
  }
  function GenIcon(data) {
    // eslint-disable-next-line react/display-name
    return function (props) {
      return React__default["default"].createElement(IconBase, __assign({
        attr: __assign({}, data.attr)
      }, props), Tree2Element(data.child));
    };
  }
  function IconBase(props) {
    var elem = function (conf) {
      var attr = props.attr,
        size = props.size,
        title = props.title,
        svgProps = __rest(props, ["attr", "size", "title"]);
      var computedSize = size || conf.size || "1em";
      var className;
      if (conf.className) className = conf.className;
      if (props.className) className = (className ? className + " " : "") + props.className;
      return React__default["default"].createElement("svg", __assign({
        stroke: "currentColor",
        fill: "currentColor",
        strokeWidth: "0"
      }, conf.attr, attr, svgProps, {
        className: className,
        style: __assign(__assign({
          color: props.color || conf.color
        }, conf.style), props.style),
        height: computedSize,
        width: computedSize,
        xmlns: "http://www.w3.org/2000/svg"
      }), title && React__default["default"].createElement("title", null, title), props.children);
    };
    return IconContext !== undefined ? React__default["default"].createElement(IconContext.Consumer, null, function (conf) {
      return elem(conf);
    }) : elem(DefaultContext);
  }

  // THIS FILE IS AUTO GENERATED
  function FaFan (props) {
    return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M352.57 128c-28.09 0-54.09 4.52-77.06 12.86l12.41-123.11C289 7.31 279.81-1.18 269.33.13 189.63 10.13 128 77.64 128 159.43c0 28.09 4.52 54.09 12.86 77.06L17.75 224.08C7.31 223-1.18 232.19.13 242.67c10 79.7 77.51 141.33 159.3 141.33 28.09 0 54.09-4.52 77.06-12.86l-12.41 123.11c-1.05 10.43 8.11 18.93 18.59 17.62 79.7-10 141.33-77.51 141.33-159.3 0-28.09-4.52-54.09-12.86-77.06l123.11 12.41c10.44 1.05 18.93-8.11 17.62-18.59-10-79.7-77.51-141.33-159.3-141.33zM256 288a32 32 0 1 1 32-32 32 32 0 0 1-32 32z"}}]})(props);
  }

  // THIS FILE IS AUTO GENERATED
  function SiOnlyfans (props) {
    return GenIcon({"tag":"svg","attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"title","attr":{},"child":[]},{"tag":"path","attr":{"d":"M24 4.003h-4.015c-3.45 0-5.3.197-6.748 1.957a7.996 7.996 0 1 0 2.103 9.211c3.182-.231 5.39-2.134 6.085-5.173 0 0-2.399.585-4.43 0 4.018-.777 6.333-3.037 7.005-5.995zM5.61 11.999A2.391 2.391 0 0 1 9.28 9.97a2.966 2.966 0 0 1 2.998-2.528h.008c-.92 1.778-1.407 3.352-1.998 5.263A2.392 2.392 0 0 1 5.61 12Zm2.386-7.996a7.996 7.996 0 1 0 7.996 7.996 7.996 7.996 0 0 0-7.996-7.996Zm0 10.394A2.399 2.399 0 1 1 10.395 12a2.396 2.396 0 0 1-2.399 2.398Z"}}]})(props);
  }

  /* @ts-self-types="./fantastic_wasm.d.ts" */

  /**
   * @enum {0 | 1 | 2 | 3 | 4}
   */
  Object.freeze({
      Trace: 0, "0": "Trace",
      Debug: 1, "1": "Debug",
      Info: 2, "2": "Info",
      Warn: 3, "3": "Warn",
      Error: 4, "4": "Error",
  });

  /**
   * WASM/JS-compatible wrapper of a Rust nRPC service
   */
  class Fan {
      __destroy_into_raw() {
          const ptr = this.__wbg_ptr;
          this.__wbg_ptr = 0;
          FanFinalization.unregister(this);
          return ptr;
      }
      free() {
          const ptr = this.__destroy_into_raw();
          wasm.__wbg_fan_free(ptr, 0);
      }
      /**
       * @param {number} x
       * @param {number} y
       * @returns {Promise<boolean | undefined>}
       */
      add_curve_point(x, y) {
          const ret = wasm.fan_add_curve_point(this.__wbg_ptr, x, y);
          return takeObject(ret);
      }
      /**
       * @param {string} msg
       * @returns {Promise<string | undefined>}
       */
      echo(msg) {
          const ret = wasm.fan_echo(this.__wbg_ptr, addHeapObject(msg));
          return takeObject(ret);
      }
      /**
       * @param {boolean} ok
       * @returns {Promise<Array<any> | undefined>}
       */
      get_curve_x(ok) {
          const ret = wasm.fan_get_curve_x(this.__wbg_ptr, ok);
          return takeObject(ret);
      }
      /**
       * @param {boolean} ok
       * @returns {Promise<Array<any> | undefined>}
       */
      get_curve_y(ok) {
          const ret = wasm.fan_get_curve_y(this.__wbg_ptr, ok);
          return takeObject(ret);
      }
      /**
       * @param {boolean} ok
       * @returns {Promise<boolean | undefined>}
       */
      get_enable(ok) {
          const ret = wasm.fan_get_enable(this.__wbg_ptr, ok);
          return takeObject(ret);
      }
      /**
       * @param {boolean} ok
       * @param {Function} callback
       * @returns {Promise<void>}
       */
      get_fan_rpm(ok, callback) {
          const ret = wasm.fan_get_fan_rpm(this.__wbg_ptr, ok, addHeapObject(callback));
          return takeObject(ret);
      }
      /**
       * @param {boolean} ok
       * @returns {Promise<string | undefined>}
       */
      get_fixed_speed(ok) {
          const ret = wasm.fan_get_fixed_speed(this.__wbg_ptr, ok);
          return takeObject(ret);
      }
      /**
       * @param {boolean} ok
       * @returns {Promise<boolean | undefined>}
       */
      get_interpolate(ok) {
          const ret = wasm.fan_get_interpolate(this.__wbg_ptr, ok);
          return takeObject(ret);
      }
      /**
       * @param {boolean} ok
       * @returns {Promise<string | undefined>}
       */
      get_system_curve(ok) {
          const ret = wasm.fan_get_system_curve(this.__wbg_ptr, ok);
          return takeObject(ret);
      }
      /**
       * @param {boolean} ok
       * @param {Function} callback
       * @returns {Promise<void>}
       */
      get_temperature(ok, callback) {
          const ret = wasm.fan_get_temperature(this.__wbg_ptr, ok, addHeapObject(callback));
          return takeObject(ret);
      }
      /**
       * @param {string} name
       * @returns {Promise<string | undefined>}
       */
      hello(name) {
          const ret = wasm.fan_hello(this.__wbg_ptr, addHeapObject(name));
          return takeObject(ret);
      }
      /**
       * @param {boolean} ok
       * @returns {Promise<string | undefined>}
       */
      name(ok) {
          const ret = wasm.fan_name(this.__wbg_ptr, ok);
          return takeObject(ret);
      }
      /**
       * @param {number} port
       */
      constructor(port) {
          const ret = wasm.fan_new(port);
          this.__wbg_ptr = ret;
          FanFinalization.register(this, this.__wbg_ptr, this);
          return this;
      }
      /**
       * @param {Function | null} [handler]
       */
      on_error(handler) {
          wasm.fan_on_error(this.__wbg_ptr, isLikeNone(handler) ? 0 : addHeapObject(handler));
      }
      /**
       * @param {number} index
       * @returns {Promise<boolean | undefined>}
       */
      remove_curve_point(index) {
          const ret = wasm.fan_remove_curve_point(this.__wbg_ptr, index);
          return takeObject(ret);
      }
      /**
       * @param {string} text
       * @returns {Promise<boolean | undefined>}
       */
      set_curve(text) {
          const ret = wasm.fan_set_curve(this.__wbg_ptr, addHeapObject(text));
          return takeObject(ret);
      }
      /**
       * @param {boolean} is_enabled
       * @returns {Promise<boolean | undefined>}
       */
      set_enable(is_enabled) {
          const ret = wasm.fan_set_enable(this.__wbg_ptr, is_enabled);
          return takeObject(ret);
      }
      /**
       * @param {string} text
       * @returns {Promise<boolean | undefined>}
       */
      set_fixed_speed(text) {
          const ret = wasm.fan_set_fixed_speed(this.__wbg_ptr, addHeapObject(text));
          return takeObject(ret);
      }
      /**
       * @param {boolean} is_enabled
       * @returns {Promise<boolean | undefined>}
       */
      set_interpolate(is_enabled) {
          const ret = wasm.fan_set_interpolate(this.__wbg_ptr, is_enabled);
          return takeObject(ret);
      }
      /**
       * @param {string} text
       * @returns {Promise<boolean | undefined>}
       */
      set_system_profile(text) {
          const ret = wasm.fan_set_system_profile(this.__wbg_ptr, addHeapObject(text));
          return takeObject(ret);
      }
      /**
       * @param {boolean} ok
       * @returns {Promise<Map<any, any> | undefined>}
       */
      version(ok) {
          const ret = wasm.fan_version(this.__wbg_ptr, ok);
          return takeObject(ret);
      }
      /**
       * @param {boolean} ok
       * @returns {Promise<string | undefined>}
       */
      version_str(ok) {
          const ret = wasm.fan_version_str(this.__wbg_ptr, ok);
          return takeObject(ret);
      }
  }
  if (Symbol.dispose) Fan.prototype[Symbol.dispose] = Fan.prototype.free;

  /**
   * @enum {0 | 1 | 2 | 3 | 4}
   */
  Object.freeze({
      Trace: 0, "0": "Trace",
      Debug: 1, "1": "Debug",
      Info: 2, "2": "Info",
      Warn: 3, "3": "Warn",
      Error: 4, "4": "Error",
  });

  /**
   * Get the targeted plugin framework, or "any" if unknown
   * @returns {string}
   */
  function target_usdpl() {
      let deferred1_0;
      let deferred1_1;
      try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          wasm.target_usdpl(retptr);
          var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
          var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
          deferred1_0 = r0;
          deferred1_1 = r1;
          return getStringFromWasm0(r0, r1);
      } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
          wasm.__wbindgen_export5(deferred1_0, deferred1_1, 1);
      }
  }

  /**
   * Get the UDSPL front-end version
   * @returns {string}
   */
  function version_usdpl() {
      let deferred1_0;
      let deferred1_1;
      try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          wasm.version_usdpl(retptr);
          var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
          var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
          deferred1_0 = r0;
          deferred1_1 = r1;
          return getStringFromWasm0(r0, r1);
      } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
          wasm.__wbindgen_export5(deferred1_0, deferred1_1, 1);
      }
  }
  function __wbg_get_imports() {
      const import0 = {
          __proto__: null,
          __wbg___wbindgen_debug_string_4687d8d8c2017d52: function(arg0, arg1) {
              const ret = debugString(getObject(arg1));
              const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
              const len1 = WASM_VECTOR_LEN;
              getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
              getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
          },
          __wbg___wbindgen_is_function_1f9d30630b8b1d3d: function(arg0) {
              const ret = typeof(getObject(arg0)) === 'function';
              return ret;
          },
          __wbg___wbindgen_is_null_e343b7d08827ba72: function(arg0) {
              const ret = getObject(arg0) === null;
              return ret;
          },
          __wbg___wbindgen_is_string_90b56bc79aad6f6c: function(arg0) {
              const ret = typeof(getObject(arg0)) === 'string';
              return ret;
          },
          __wbg___wbindgen_is_undefined_8865fb403f8fe9d8: function(arg0) {
              const ret = getObject(arg0) === undefined;
              return ret;
          },
          __wbg___wbindgen_string_get_0380ccaa2f57f0d9: function(arg0, arg1) {
              const obj = getObject(arg1);
              const ret = typeof(obj) === 'string' ? obj : undefined;
              var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
              var len1 = WASM_VECTOR_LEN;
              getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
              getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
          },
          __wbg___wbindgen_throw_41e9ee4f547fc59a: function(arg0, arg1) {
              throw new Error(getStringFromWasm0(arg0, arg1));
          },
          __wbg__wbg_cb_unref_dcc1a90847f04c41: function(arg0) {
              getObject(arg0)._wbg_cb_unref();
          },
          __wbg_addEventListener_4d0db17c671ea324: function() { return handleError(function (arg0, arg1, arg2, arg3) {
              getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
          }, arguments); },
          __wbg_addEventListener_8d3235978b9c69a8: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
              getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3), getObject(arg4));
          }, arguments); },
          __wbg_call_187d372bd5fdd4aa: function() { return handleError(function (arg0, arg1, arg2) {
              const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
              return addHeapObject(ret);
          }, arguments); },
          __wbg_close_d3ed56b5763be5ae: function() { return handleError(function (arg0) {
              getObject(arg0).close();
          }, arguments); },
          __wbg_code_4cb6dbcfceec1eac: function(arg0) {
              const ret = getObject(arg0).code;
              return ret;
          },
          __wbg_data_522f7abc70721269: function(arg0) {
              const ret = getObject(arg0).data;
              return addHeapObject(ret);
          },
          __wbg_debug_52bda05ddf50b736: function(arg0) {
              console.debug(getObject(arg0));
          },
          __wbg_dispatchEvent_57e1a8af186ff471: function() { return handleError(function (arg0, arg1) {
              const ret = getObject(arg0).dispatchEvent(getObject(arg1));
              return ret;
          }, arguments); },
          __wbg_error_c9cf3fc2064683a9: function(arg0) {
              console.error(getObject(arg0));
          },
          __wbg_instanceof_ArrayBuffer_a99f175873e5d9b8: function(arg0) {
              let result;
              try {
                  result = getObject(arg0) instanceof ArrayBuffer;
              } catch (_) {
                  result = false;
              }
              const ret = result;
              return ret;
          },
          __wbg_instanceof_Error_80a725f81f2e102d: function(arg0) {
              let result;
              try {
                  result = getObject(arg0) instanceof Error;
              } catch (_) {
                  result = false;
              }
              const ret = result;
              return ret;
          },
          __wbg_length_7f3c00c40364105e: function(arg0) {
              const ret = getObject(arg0).length;
              return ret;
          },
          __wbg_log_17c30ef363c61cf4: function(arg0) {
              console.log(getObject(arg0));
          },
          __wbg_message_5f8387f0c32b90a7: function(arg0) {
              const ret = getObject(arg0).message;
              return addHeapObject(ret);
          },
          __wbg_name_e2eac7cdfa054f65: function(arg0) {
              const ret = getObject(arg0).name;
              return addHeapObject(ret);
          },
          __wbg_new_1dbf7428bba60a42: function(arg0) {
              const ret = new Uint8Array(getObject(arg0));
              return addHeapObject(ret);
          },
          __wbg_new_28744009d011f847: function() {
              const ret = new Map();
              return addHeapObject(ret);
          },
          __wbg_new_617a8cdb8bb1130e: function() {
              const ret = new Object();
              return addHeapObject(ret);
          },
          __wbg_new_ee2291f50781bf1d: function() {
              const ret = new Array();
              return addHeapObject(ret);
          },
          __wbg_new_typed_b01cb72a8af741a3: function(arg0, arg1) {
              try {
                  var state0 = {a: arg0, b: arg1};
                  var cb0 = (arg0, arg1) => {
                      const a = state0.a;
                      state0.a = 0;
                      try {
                          return __wasm_bindgen_func_elem_2385(a, state0.b, arg0, arg1);
                      } finally {
                          state0.a = a;
                      }
                  };
                  const ret = new Promise(cb0);
                  return addHeapObject(ret);
              } finally {
                  state0.a = 0;
              }
          },
          __wbg_new_with_event_init_dict_92dd01bedbb7ac30: function() { return handleError(function (arg0, arg1, arg2) {
              const ret = new CloseEvent(getStringFromWasm0(arg0, arg1), getObject(arg2));
              return addHeapObject(ret);
          }, arguments); },
          __wbg_new_with_str_d969ab40df6f3773: function() { return handleError(function (arg0, arg1, arg2, arg3) {
              const ret = new WebSocket(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
              return addHeapObject(ret);
          }, arguments); },
          __wbg_prototypesetcall_bc27214492979395: function(arg0, arg1, arg2) {
              Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), getObject(arg2));
          },
          __wbg_push_2baf45db356cf468: function(arg0, arg1) {
              const ret = getObject(arg0).push(getObject(arg1));
              return ret;
          },
          __wbg_queueMicrotask_9833f9a49df95a49: function(arg0) {
              const ret = getObject(arg0).queueMicrotask;
              return addHeapObject(ret);
          },
          __wbg_queueMicrotask_a72f977e97f23c5f: function(arg0) {
              queueMicrotask(getObject(arg0));
          },
          __wbg_readyState_d8514376867e415b: function(arg0) {
              const ret = getObject(arg0).readyState;
              return ret;
          },
          __wbg_reason_832acaf5f4083b7b: function(arg0, arg1) {
              const ret = getObject(arg1).reason;
              const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
              const len1 = WASM_VECTOR_LEN;
              getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
              getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
          },
          __wbg_removeEventListener_6e68185345978771: function() { return handleError(function (arg0, arg1, arg2, arg3) {
              getObject(arg0).removeEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
          }, arguments); },
          __wbg_resolve_0076e10020304ede: function(arg0) {
              const ret = Promise.resolve(getObject(arg0));
              return addHeapObject(ret);
          },
          __wbg_send_b5bdd806efe4baf6: function() { return handleError(function (arg0, arg1, arg2) {
              getObject(arg0).send(getStringFromWasm0(arg1, arg2));
          }, arguments); },
          __wbg_send_c1dad0ec2e52defb: function() { return handleError(function (arg0, arg1, arg2) {
              getObject(arg0).send(getArrayU8FromWasm0(arg1, arg2));
          }, arguments); },
          __wbg_set_145a351398b48c65: function() { return handleError(function (arg0, arg1, arg2) {
              const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
              return ret;
          }, arguments); },
          __wbg_set_6ae97e73113c4f0b: function(arg0, arg1, arg2) {
              const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
              return addHeapObject(ret);
          },
          __wbg_set_binaryType_21835bf0df8f70aa: function(arg0, arg1) {
              getObject(arg0).binaryType = __wbindgen_enum_BinaryType[arg1];
          },
          __wbg_set_code_f385a2b721072cea: function(arg0, arg1) {
              getObject(arg0).code = arg1;
          },
          __wbg_set_once_8c45bbbfb71d1b34: function(arg0, arg1) {
              getObject(arg0).once = arg1 !== 0;
          },
          __wbg_set_reason_b18f2b84e16d9b48: function(arg0, arg1, arg2) {
              getObject(arg0).reason = getStringFromWasm0(arg1, arg2);
          },
          __wbg_static_accessor_GLOBAL_266715b9d96ba635: function() {
              const ret = typeof global === 'undefined' ? null : global;
              return isLikeNone(ret) ? 0 : addHeapObject(ret);
          },
          __wbg_static_accessor_GLOBAL_THIS_10fb7dc1ae063179: function() {
              const ret = typeof globalThis === 'undefined' ? null : globalThis;
              return isLikeNone(ret) ? 0 : addHeapObject(ret);
          },
          __wbg_static_accessor_SELF_0b583911f537483a: function() {
              const ret = typeof self === 'undefined' ? null : self;
              return isLikeNone(ret) ? 0 : addHeapObject(ret);
          },
          __wbg_static_accessor_WINDOW_d7f903d1508cbdc4: function() {
              const ret = typeof window === 'undefined' ? null : window;
              return isLikeNone(ret) ? 0 : addHeapObject(ret);
          },
          __wbg_then_e71170d78fcf8954: function(arg0, arg1) {
              const ret = getObject(arg0).then(getObject(arg1));
              return addHeapObject(ret);
          },
          __wbg_toString_83fab3d7c865ecd3: function(arg0) {
              const ret = getObject(arg0).toString();
              return addHeapObject(ret);
          },
          __wbg_warn_13abc63e0d4b3527: function(arg0) {
              console.warn(getObject(arg0));
          },
          __wbg_wasClean_b246ecade802c6ff: function(arg0) {
              const ret = getObject(arg0).wasClean;
              return ret;
          },
          __wbindgen_generic_0000000000000001: function(arg0, arg1) {
              // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 271, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
              const ret = makeMutClosure(arg0, arg1, __wasm_bindgen_func_elem_2383);
              return addHeapObject(ret);
          },
          __wbindgen_generic_0000000000000002: function(arg0, arg1) {
              // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("CloseEvent")], shim_idx: 217, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
              const ret = makeMutClosure(arg0, arg1, __wasm_bindgen_func_elem_729);
              return addHeapObject(ret);
          },
          __wbindgen_generic_0000000000000003: function(arg0, arg1) {
              // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("Event")], shim_idx: 217, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
              const ret = makeMutClosure(arg0, arg1, __wasm_bindgen_func_elem_729_38);
              return addHeapObject(ret);
          },
          __wbindgen_generic_0000000000000004: function(arg0, arg1) {
              // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("MessageEvent")], shim_idx: 217, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
              const ret = makeMutClosure(arg0, arg1, __wasm_bindgen_func_elem_729_39);
              return addHeapObject(ret);
          },
          __wbindgen_generic_0000000000000005: function(arg0, arg1) {
              // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [], shim_idx: 216, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
              const ret = makeMutClosure(arg0, arg1, __wasm_bindgen_func_elem_728);
              return addHeapObject(ret);
          },
          __wbindgen_generic_0000000000000006: function(arg0) {
              // Cast intrinsic for `F64 -> Externref`.
              const ret = arg0;
              return addHeapObject(ret);
          },
          __wbindgen_generic_0000000000000007: function(arg0, arg1) {
              // Cast intrinsic for `Ref(String) -> Externref`.
              const ret = getStringFromWasm0(arg0, arg1);
              return addHeapObject(ret);
          },
          __wbindgen_generic_0000000000000008: function(arg0) {
              // Cast intrinsic for `U64 -> Externref`.
              const ret = BigInt.asUintN(64, arg0);
              return addHeapObject(ret);
          },
          __wbindgen_object_clone_ref: function(arg0) {
              const ret = getObject(arg0);
              return addHeapObject(ret);
          },
          __wbindgen_object_drop_ref: function(arg0) {
              takeObject(arg0);
          },
      };
      return {
          __proto__: null,
          "./fantastic_wasm_bg.js": import0,
      };
  }

  function __wasm_bindgen_func_elem_728(arg0, arg1) {
      wasm.__wasm_bindgen_func_elem_728(arg0, arg1);
  }

  function __wasm_bindgen_func_elem_729(arg0, arg1, arg2) {
      wasm.__wasm_bindgen_func_elem_729(arg0, arg1, addHeapObject(arg2));
  }

  function __wasm_bindgen_func_elem_729_38(arg0, arg1, arg2) {
      wasm.__wasm_bindgen_func_elem_729_38(arg0, arg1, addHeapObject(arg2));
  }

  function __wasm_bindgen_func_elem_729_39(arg0, arg1, arg2) {
      wasm.__wasm_bindgen_func_elem_729_39(arg0, arg1, addHeapObject(arg2));
  }

  function __wasm_bindgen_func_elem_2385(arg0, arg1, arg2, arg3) {
      wasm.__wasm_bindgen_func_elem_2385(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
  }

  function __wasm_bindgen_func_elem_2383(arg0, arg1, arg2) {
      try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          wasm.__wasm_bindgen_func_elem_2383(retptr, arg0, arg1, addHeapObject(arg2));
          var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
          var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
          if (r1) {
              throw takeObject(r0);
          }
      } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
      }
  }


  const __wbindgen_enum_BinaryType = ["blob", "arraybuffer"];
  (typeof FinalizationRegistry === 'undefined')
      ? { register: () => {}, unregister: () => {} }
      : new FinalizationRegistry(ptr => wasm.__wbg_devtools_free(ptr, 1));
  const FanFinalization = (typeof FinalizationRegistry === 'undefined')
      ? { register: () => {}, unregister: () => {} }
      : new FinalizationRegistry(ptr => wasm.__wbg_fan_free(ptr, 1));
  (typeof FinalizationRegistry === 'undefined')
      ? { register: () => {}, unregister: () => {} }
      : new FinalizationRegistry(ptr => wasm.__wbg_translations_free(ptr, 1));

  function addHeapObject(obj) {
      if (heap_next === heap.length) heap.push(heap.length + 1);
      const idx = heap_next;
      heap_next = heap[idx];

      heap[idx] = obj;
      return idx;
  }

  const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
      ? { register: () => {}, unregister: () => {} }
      : new FinalizationRegistry(state => wasm.__wbindgen_export4(state.a, state.b));

  function debugString(val) {
      // primitive types
      const type = typeof val;
      if (type == 'number' || type == 'boolean' || val == null) {
          return  `${val}`;
      }
      if (type == 'string') {
          return `"${val}"`;
      }
      if (type == 'symbol') {
          const description = val.description;
          if (description == null) {
              return 'Symbol';
          } else {
              return `Symbol(${description})`;
          }
      }
      if (type == 'function') {
          const name = val.name;
          if (typeof name == 'string' && name.length > 0) {
              return `Function(${name})`;
          } else {
              return 'Function';
          }
      }
      // objects
      if (Array.isArray(val)) {
          const length = val.length;
          let debug = '[';
          if (length > 0) {
              debug += debugString(val[0]);
          }
          for(let i = 1; i < length; i++) {
              debug += ', ' + debugString(val[i]);
          }
          debug += ']';
          return debug;
      }
      // Test for built-in
      const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
      let className;
      if (builtInMatches && builtInMatches.length > 1) {
          className = builtInMatches[1];
      } else {
          // Failed to match the standard '[object ClassName]'
          return toString.call(val);
      }
      if (className == 'Object') {
          // we're a user defined class or Object
          // JSON.stringify avoids problems with cycles, and is generally much
          // easier than looping through ownProperties of `val`.
          try {
              return 'Object(' + JSON.stringify(val) + ')';
          } catch (_) {
              return 'Object';
          }
      }
      // errors
      if (val instanceof Error) {
          return `${val.name}: ${val.message}\n${val.stack}`;
      }
      // TODO we could test for more things here, like `Set`s and `Map`s.
      return className;
  }

  function dropObject(idx) {
      if (idx < 1028) return;
      heap[idx] = heap_next;
      heap_next = idx;
  }

  function getArrayU8FromWasm0(ptr, len) {
      ptr = ptr >>> 0;
      return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
  }

  let cachedDataViewMemory0 = null;
  function getDataViewMemory0() {
      if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
          cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
      }
      return cachedDataViewMemory0;
  }

  function getStringFromWasm0(ptr, len) {
      return decodeText(ptr >>> 0, len);
  }

  let cachedUint8ArrayMemory0 = null;
  function getUint8ArrayMemory0() {
      if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
          cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
      }
      return cachedUint8ArrayMemory0;
  }

  function getObject(idx) { return heap[idx]; }

  function handleError(f, args) {
      try {
          return f.apply(this, args);
      } catch (e) {
          wasm.__wbindgen_export3(addHeapObject(e));
      }
  }

  let heap = new Array(1024).fill(undefined);
  heap.push(undefined, null, true, false);

  let heap_next = heap.length;

  function isLikeNone(x) {
      return x === undefined || x === null;
  }

  function makeMutClosure(arg0, arg1, f) {
      const state = { a: arg0, b: arg1, cnt: 1 };
      const real = (...args) => {

          // First up with a closure we increment the internal reference
          // count. This ensures that the Rust closure environment won't
          // be deallocated while we're invoking it.
          state.cnt++;
          const a = state.a;
          state.a = 0;
          try {
              return f(a, state.b, ...args);
          } finally {
              state.a = a;
              real._wbg_cb_unref();
          }
      };
      real._wbg_cb_unref = () => {
          if (--state.cnt === 0) {
              wasm.__wbindgen_export4(state.a, state.b);
              state.a = 0;
              CLOSURE_DTORS.unregister(state);
          }
      };
      CLOSURE_DTORS.register(real, state, state);
      return real;
  }

  function passStringToWasm0(arg, malloc, realloc) {
      if (realloc === undefined) {
          const buf = cachedTextEncoder.encode(arg);
          const ptr = malloc(buf.length, 1) >>> 0;
          getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
          WASM_VECTOR_LEN = buf.length;
          return ptr;
      }

      let len = arg.length;
      let ptr = malloc(len, 1) >>> 0;

      const mem = getUint8ArrayMemory0();

      let offset = 0;

      for (; offset < len; offset++) {
          const code = arg.charCodeAt(offset);
          if (code > 0x7F) break;
          mem[ptr + offset] = code;
      }
      if (offset !== len) {
          if (offset !== 0) {
              arg = arg.slice(offset);
          }
          ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
          const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
          const ret = cachedTextEncoder.encodeInto(arg, view);

          offset += ret.written;
          ptr = realloc(ptr, len, offset, 1) >>> 0;
      }

      WASM_VECTOR_LEN = offset;
      return ptr;
  }

  function takeObject(idx) {
      const ret = getObject(idx);
      dropObject(idx);
      return ret;
  }

  let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
  cachedTextDecoder.decode();
  const MAX_SAFARI_DECODE_BYTES = 2146435072;
  let numBytesDecoded = 0;
  function decodeText(ptr, len) {
      numBytesDecoded += len;
      if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
          cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
          cachedTextDecoder.decode();
          numBytesDecoded = len;
      }
      return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
  }

  const cachedTextEncoder = new TextEncoder();

  if (!('encodeInto' in cachedTextEncoder)) {
      cachedTextEncoder.encodeInto = function (arg, view) {
          const buf = cachedTextEncoder.encode(arg);
          view.set(buf);
          return {
              read: arg.length,
              written: buf.length
          };
      };
  }

  let WASM_VECTOR_LEN = 0;

  let wasm;
  function __wbg_finalize_init(instance, module) {
      wasm = instance.exports;
      cachedDataViewMemory0 = null;
      cachedUint8ArrayMemory0 = null;
      return wasm;
  }

  async function __wbg_load(module, imports) {
      if (typeof Response === 'function' && module instanceof Response) {
          if (!module.ok) {
              throw new Error(`failed to fetch Wasm: ${module.status} ${module.statusText} fetching '${module.url}'`);
          }

          if (typeof WebAssembly.instantiateStreaming === 'function') {
              try {
                  return await WebAssembly.instantiateStreaming(module, imports);
              } catch (e) {
                  const validResponse = expectedResponseType(module.type);

                  if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                      console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                  } else { throw e; }
              }
          }

          const bytes = await module.arrayBuffer();
          return await WebAssembly.instantiate(bytes, imports);
      } else {
          const instance = await WebAssembly.instantiate(module, imports);

          if (instance instanceof WebAssembly.Instance) {
              return { instance, module };
          } else {
              return instance;
          }
      }

      function expectedResponseType(type) {
          switch (type) {
              case 'basic': case 'cors': case 'default': return true;
          }
          return false;
      }
  }

  async function __wbg_init(module_or_path) {
      if (wasm !== undefined) return wasm;


      if (module_or_path !== undefined) {
          if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
              ({module_or_path} = module_or_path);
          } else {
              console.warn('using deprecated parameters for the initialization function; pass a single object instead');
          }
      }

      if (module_or_path === undefined) {
          module_or_path = new URL('fantastic_wasm_bg.wasm', (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT' && document.currentScript.src || new URL('index.js', document.baseURI).href));
      }
      const imports = __wbg_get_imports();

      if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
          module_or_path = fetch(module_or_path);
      }

      const { instance, module } = await __wbg_load(await module_or_path, imports);

      return __wbg_finalize_init(instance);
  }


  // USDPL customization
  const encoded = "AGFzbQEAAAAB2wEfYAAAYAABf2ABfwBgAX8Bf2ABfwF+YAJ/fwBgAn9/AX9gAn9/AX5gA39/fwBgA39/fwF/YAN/f38BfmAEf39/fwBgBH9/f38Bf2AFf39/f38AYAV/f39/fwF/YAZ/f39/f38AYAZ/f39/f38Bf2AIf39/f39/f38AYAZ/f39+f38AYAV/f39+fgF/YAZ/f399f38AYAZ/f398f38AYAV/f35/fwBgBX9/fX9/AGAFf398f38AYAR/fn9/AGAEf31/fwBgBH98f38AYAN/fHwBf2ABfgF/YAF8AX8Cgh5AFi4vZmFudGFzdGljX3dhc21fYmcuanMaX193YmluZGdlbl9vYmplY3RfZHJvcF9yZWYAAhYuL2ZhbnRhc3RpY193YXNtX2JnLmpzIF9fd2JnX25ld190eXBlZF9iMDFjYjcyYThhZjc0MWEzAAYWLi9mYW50YXN0aWNfd2FzbV9iZy5qcxtfX3diZ19jYWxsXzE4N2QzNzJiZDVmZGQ0YWEACRYuL2ZhbnRhc3RpY193YXNtX2JnLmpzG19fd2JnX3B1c2hfMmJhZjQ1ZGIzNTZjZjQ2OAAGFi4vZmFudGFzdGljX3dhc21fYmcuanMbX193YmluZGdlbl9vYmplY3RfY2xvbmVfcmVmAAMWLi9mYW50YXN0aWNfd2FzbV9iZy5qcxpfX3diZ19zZXRfNmFlOTdlNzMxMTNjNGYwYgAJFi4vZmFudGFzdGljX3dhc21fYmcuanMaX193YmdfbG9nXzE3YzMwZWYzNjNjNjFjZjQAAhYuL2ZhbnRhc3RpY193YXNtX2JnLmpzG19fd2JnX3dhcm5fMTNhYmM2M2UwZDRiMzUyNwACFi4vZmFudGFzdGljX3dhc21fYmcuanMcX193YmdfZGVidWdfNTJiZGEwNWRkZjUwYjczNgACFi4vZmFudGFzdGljX3dhc21fYmcuanMcX193YmdfZXJyb3JfYzljZjNmYzIwNjQ2ODNhOQACFi4vZmFudGFzdGljX3dhc21fYmcuanMfX193Ymdfc2V0X2NvZGVfZjM4NWEyYjcyMTA3MmNlYQAFFi4vZmFudGFzdGljX3dhc21fYmcuanMhX193Ymdfc2V0X3JlYXNvbl9iMThmMmI4NGUxNmQ5YjQ4AAgWLi9mYW50YXN0aWNfd2FzbV9iZy5qcx9fX3diZ19zZXRfb25jZV84YzQ1YmJiZmI3MWQxYjM0AAUWLi9mYW50YXN0aWNfd2FzbV9iZy5qcxtfX3diZ19zZW5kX2I1YmRkODA2ZWZlNGJhZjYACBYuL2ZhbnRhc3RpY193YXNtX2JnLmpzG19fd2JnX3NlbmRfYzFkYWQwZWMyZTUyZGVmYgAIFi4vZmFudGFzdGljX3dhc21fYmcuanMnX193YmdfYWRkRXZlbnRMaXN0ZW5lcl80ZDBkYjE3YzY3MWVhMzI0AAsWLi9mYW50YXN0aWNfd2FzbV9iZy5qcydfX3diZ19hZGRFdmVudExpc3RlbmVyXzhkMzIzNTk3OGI5YzY5YTgADRYuL2ZhbnRhc3RpY193YXNtX2JnLmpzH19fd2JnX3dhc0NsZWFuX2IyNDZlY2FkZTgwMmM2ZmYAAxYuL2ZhbnRhc3RpY193YXNtX2JnLmpzG19fd2JnX2RhdGFfNTIyZjdhYmM3MDcyMTI2OQADFi4vZmFudGFzdGljX3dhc21fYmcuanMbX193YmdfY29kZV80Y2I2ZGJjZmNlZWMxZWFjAAMWLi9mYW50YXN0aWNfd2FzbV9iZy5qcyRfX3diZ19kaXNwYXRjaEV2ZW50XzU3ZTFhOGFmMTg2ZmY0NzEABhYuL2ZhbnRhc3RpY193YXNtX2JnLmpzIV9fd2JnX3JlYWR5U3RhdGVfZDg1MTQzNzY4NjdlNDE1YgADFi4vZmFudGFzdGljX3dhc21fYmcuanMdX193YmdfcmVhc29uXzgzMmFjYWY1ZjQwODNiN2IABRYuL2ZhbnRhc3RpY193YXNtX2JnLmpzKl9fd2JnX3JlbW92ZUV2ZW50TGlzdGVuZXJfNmU2ODE4NTM0NTk3ODc3MQALFi4vZmFudGFzdGljX3dhc21fYmcuanMvX193YmdfbmV3X3dpdGhfZXZlbnRfaW5pdF9kaWN0XzkyZGQwMWJlZGJiN2FjMzAACRYuL2ZhbnRhc3RpY193YXNtX2JnLmpzJV9fd2JnX3NldF9iaW5hcnlUeXBlXzIxODM1YmYwZGY4ZjcwYWEABRYuL2ZhbnRhc3RpY193YXNtX2JnLmpzI19fd2JnX25ld193aXRoX3N0cl9kOTY5YWI0MGRmNmYzNzczAAwWLi9mYW50YXN0aWNfd2FzbV9iZy5qcxxfX3diZ19jbG9zZV9kM2VkNTZiNTc2M2JlNWFlAAIWLi9mYW50YXN0aWNfd2FzbV9iZy5qcxpfX3diZ19uZXdfNjE3YThjZGI4YmIxMTMwZQABFi4vZmFudGFzdGljX3dhc21fYmcuanMbX193YmdfdGhlbl9lNzExNzBkNzhmY2Y4OTU0AAYWLi9mYW50YXN0aWNfd2FzbV9iZy5qcx5fX3diZ19yZXNvbHZlXzAwNzZlMTAwMjAzMDRlZGUAAxYuL2ZhbnRhc3RpY193YXNtX2JnLmpzGl9fd2JnX25ld19lZTIyOTFmNTA3ODFiZjFkAAEWLi9mYW50YXN0aWNfd2FzbV9iZy5qcx5fX3diZ19tZXNzYWdlXzVmODM4N2YwYzMyYjkwYTcAAxYuL2ZhbnRhc3RpY193YXNtX2JnLmpzG19fd2JnX25hbWVfZTJlYWM3Y2RmYTA1NGY2NQADFi4vZmFudGFzdGljX3dhc21fYmcuanMfX193YmdfdG9TdHJpbmdfODNmYWIzZDdjODY1ZWNkMwADFi4vZmFudGFzdGljX3dhc21fYmcuanMaX193YmdfbmV3XzI4NzQ0MDA5ZDAxMWY4NDcAARYuL2ZhbnRhc3RpY193YXNtX2JnLmpzHV9fd2JnX2xlbmd0aF83ZjNjMDBjNDAzNjQxMDVlAAMWLi9mYW50YXN0aWNfd2FzbV9iZy5qcydfX3diZ19wcm90b3R5cGVzZXRjYWxsX2JjMjcyMTQ0OTI5NzkzOTUACBYuL2ZhbnRhc3RpY193YXNtX2JnLmpzGl9fd2JnX25ld18xZGJmNzQyOGJiYTYwYTQyAAMWLi9mYW50YXN0aWNfd2FzbV9iZy5qczJfX3diZ19zdGF0aWNfYWNjZXNzb3JfR0xPQkFMX1RISVNfMTBmYjdkYzFhZTA2MzE3OQABFi4vZmFudGFzdGljX3dhc21fYmcuanMrX193Ymdfc3RhdGljX2FjY2Vzc29yX1NFTEZfMGI1ODM5MTFmNTM3NDgzYQABFi4vZmFudGFzdGljX3dhc21fYmcuanMtX193Ymdfc3RhdGljX2FjY2Vzc29yX0dMT0JBTF8yNjY3MTViOWQ5NmJhNjM1AAEWLi9mYW50YXN0aWNfd2FzbV9iZy5qcy1fX3diZ19zdGF0aWNfYWNjZXNzb3JfV0lORE9XX2Q3ZjkwM2QxNTA4Y2JkYzQAARYuL2ZhbnRhc3RpY193YXNtX2JnLmpzLV9fd2JnX2luc3RhbmNlb2ZfQXJyYXlCdWZmZXJfYTk5ZjE3NTg3M2U1ZDliOAADFi4vZmFudGFzdGljX3dhc21fYmcuanMnX193YmdfaW5zdGFuY2VvZl9FcnJvcl84MGE3MjVmODFmMmUxMDJkAAMWLi9mYW50YXN0aWNfd2FzbV9iZy5qcyVfX3diZ19xdWV1ZU1pY3JvdGFza185ODMzZjlhNDlkZjk1YTQ5AAMWLi9mYW50YXN0aWNfd2FzbV9iZy5qcyVfX3diZ19xdWV1ZU1pY3JvdGFza19hNzJmOTc3ZTk3ZjIzYzVmAAIWLi9mYW50YXN0aWNfd2FzbV9iZy5qcxpfX3diZ19zZXRfMTQ1YTM1MTM5OGI0OGM2NQAJFi4vZmFudGFzdGljX3dhc21fYmcuanMnX193YmdfX193YmluZGdlbl90aHJvd180MWU5ZWU0ZjU0N2ZjNTlhAAUWLi9mYW50YXN0aWNfd2FzbV9iZy5qcylfX3diZ19fX3diaW5kZ2VuX2lzX251bGxfZTM0M2I3ZDA4ODI3YmE3MgADFi4vZmFudGFzdGljX3dhc21fYmcuanMrX193YmdfX193YmluZGdlbl9pc19zdHJpbmdfOTBiNTZiYzc5YWFkNmY2YwADFi4vZmFudGFzdGljX3dhc21fYmcuanMsX193YmdfX193YmluZGdlbl9zdHJpbmdfZ2V0XzAzODBjY2FhMmY1N2YwZDkABRYuL2ZhbnRhc3RpY193YXNtX2JnLmpzLV9fd2JnX19fd2JpbmRnZW5faXNfZnVuY3Rpb25fMWY5ZDMwNjMwYjhiMWQzZAADFi4vZmFudGFzdGljX3dhc21fYmcuanMuX193YmdfX193YmluZGdlbl9pc191bmRlZmluZWRfODg2NWZiNDAzZjhmZTlkOAADFi4vZmFudGFzdGljX3dhc21fYmcuanMuX193YmdfX193YmluZGdlbl9kZWJ1Z19zdHJpbmdfNDY4N2Q4ZDhjMjAxN2Q1MgAFFi4vZmFudGFzdGljX3dhc21fYmcuanMkX193YmdfX3diZ19jYl91bnJlZl9kY2MxYTkwODQ3ZjA0YzQxAAIWLi9mYW50YXN0aWNfd2FzbV9iZy5qcyNfX3diaW5kZ2VuX2dlbmVyaWNfMDAwMDAwMDAwMDAwMDAwMQAGFi4vZmFudGFzdGljX3dhc21fYmcuanMjX193YmluZGdlbl9nZW5lcmljXzAwMDAwMDAwMDAwMDAwMDIABhYuL2ZhbnRhc3RpY193YXNtX2JnLmpzI19fd2JpbmRnZW5fZ2VuZXJpY18wMDAwMDAwMDAwMDAwMDAzAAYWLi9mYW50YXN0aWNfd2FzbV9iZy5qcyNfX3diaW5kZ2VuX2dlbmVyaWNfMDAwMDAwMDAwMDAwMDAwNAAGFi4vZmFudGFzdGljX3dhc21fYmcuanMjX193YmluZGdlbl9nZW5lcmljXzAwMDAwMDAwMDAwMDAwMDUABhYuL2ZhbnRhc3RpY193YXNtX2JnLmpzI19fd2JpbmRnZW5fZ2VuZXJpY18wMDAwMDAwMDAwMDAwMDA2AB4WLi9mYW50YXN0aWNfd2FzbV9iZy5qcyNfX3diaW5kZ2VuX2dlbmVyaWNfMDAwMDAwMDAwMDAwMDAwNwAGFi4vZmFudGFzdGljX3dhc21fYmcuanMjX193YmluZGdlbl9nZW5lcmljXzAwMDAwMDAwMDAwMDAwMDgAHQPmB+QHBgYDBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYNCAwGDg4OCQ0NAhAFCQgICQsLDAgJCwwDBgAHBQICBQUGDgUCCAgFBQMDBgUIAwUGBgMGBgMDAwULBggGBgYGBgYGBgYGBgYGBgYGBgYNDQ0OBRELBgYGBgYFDwIGDAkIDQ0NBgYNAgwFCwkIDg4BCwgFCAULBQICAgICAgICAgICAgICAgICAgICAgICAgICCAUMBQgICA8PDwYIAgUCCAIGDwgFCAIICAUGCAIIDwUIBQIMCwgCDQ0NDQwMBgwIBQUIBgIFBQgCCAICAgUFBQUFBQ8GBQILAwICAwgIBQUDCwgFCAgCCQsCAgIICwUIBQYFBQsGBQgICAgICAgICAgICAgICAgICAgICAgIBQUGCAgIBQUFBQgICAgICAgICAgICAgICAgICAgICAgIAgUCAgIOCAUEBgYICA0FDwYICAIDDQgFBQUFBQMODg4ODg4ODg4ODg4OBQIFBQUFBQgIAgICAgICAgICAgICAgICAgICAgICDAUFAgsCDQMCAgsLDwUCAgICCwgICA0PFRQPDxIIAw0FCw0GBQ0FCAUGCwsCAgICAgICAgICAgICAgICAgICAgICAgICAgUFAgYJCAIJBQUFCQYCCAgCAgIFCAILCwMCCwkGDQUCAhMGAgIDAgIGCAUGCAsPAgUIAgICBQIDAgICAgkCAgICCQkDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwkJAgICDQ0NDQgCAgICCAUCAgIcCwsGCwsDAgMDAwUCCAgJAwMDAgkJBgUGAgYGBgYGBgYGBgYGBgYPBg8OAgICAgICAgICAgYCAggFAgICAgICAgYCAgICAgYGAwMGBgMGBgYGBgMGDQMMBQUIBgIFBQYCAgICAgICAgICAgICAgICAgICAgUDAgUFCwICAgICAgINAgIDAgICAwICAgsDBQMQAgIFDQ4ODRgXDRYFCAgDDQsMAgICAgICAgICAgICCgoCBQgCCQsCAgIFAwIDAgYKCgsIAgIFAwICBQMCBgIGBgYGAgICAgUCAgYCCAgGBQkGBQIIBQUJBQsGBQ0GBgYFDAYGBgYJAwgIBggIAgUGBgYGCAYLCwMDBgkDAwMDAwMFCQAJAgICCQMCBgIGAgYCBgYGBgIDBgIGBgYGBgIGCwYDAwMFAgIDAwMDAQUAAAIFBQYFBgYGCQUDAwICAgIeAwUGAgICAgUFAgIDHh0CAgIICAMBAQECAx0GAgECAAEGAwMAAQMDAwAIAgUCAggCAAACBAcBcAHdAt0CBQMBABEGGQN/AUGAgMAAC38AQbi/wQALfwBB4MPBAAsH9Qg1Bm1lbW9yeQIAE19fd2JnX2RldnRvb2xzX2ZyZWUAiwMOX193YmdfZmFuX2ZyZWUAjAMXX193YmdfdHJhbnNsYXRpb25zX2ZyZWUAjAMNZGV2dG9vbHNfZWNobwC7BQxkZXZ0b29sc19sb2cArwUMZGV2dG9vbHNfbmV3AOkFEWRldnRvb2xzX29uX2Vycm9yALsEEGRldnRvb2xzX3ZlcnNpb24AlQYTZmFuX2FkZF9jdXJ2ZV9wb2ludACgBQhmYW5fZWNobwDrBQ9mYW5fZ2V0X2N1cnZlX3gAvAUPZmFuX2dldF9jdXJ2ZV95AL0FDmZhbl9nZXRfZW5hYmxlAL4FD2Zhbl9nZXRfZmFuX3JwbQC0BRNmYW5fZ2V0X2ZpeGVkX3NwZWVkAL8FE2Zhbl9nZXRfaW50ZXJwb2xhdGUAwAUUZmFuX2dldF9zeXN0ZW1fY3VydmUAwQUTZmFuX2dldF90ZW1wZXJhdHVyZQC1BQlmYW5faGVsbG8A7AUIZmFuX25hbWUAwgUHZmFuX25ldwDtBQxmYW5fb25fZXJyb3IAvAQWZmFuX3JlbW92ZV9jdXJ2ZV9wb2ludADuBQ1mYW5fc2V0X2N1cnZlAO8FDmZhbl9zZXRfZW5hYmxlAMMFE2Zhbl9zZXRfZml4ZWRfc3BlZWQA8AUTZmFuX3NldF9pbnRlcnBvbGF0ZQDEBRZmYW5fc2V0X3N5c3RlbV9wcm9maWxlAPEFC2Zhbl92ZXJzaW9uAMUFD2Zhbl92ZXJzaW9uX3N0cgDGBQlnZXRfdmFsdWUAlgQJc2V0X3ZhbHVlAN0CDHRhcmdldF91c2RwbACPBRl0cmFuc2xhdGlvbnNfZ2V0X2xhbmd1YWdlAPIFHHRyYW5zbGF0aW9uc19nZXRfdHJhbnNsYXRpb24A1AQQdHJhbnNsYXRpb25zX25ldwDzBRV0cmFuc2xhdGlvbnNfb25fZXJyb3IAvAQNdmVyc2lvbl91c2RwbACQBQ9fX2Fib3J0X2hhbmRsZXIDARVfX2luc3RhbmNlX3Rlcm1pbmF0ZWQDAh1fX3dhc21fYmluZGdlbl9mdW5jX2VsZW1fMjM4MwCYBB1fX3dhc21fYmluZGdlbl9mdW5jX2VsZW1fMjM4NQDBBhxfX3dhc21fYmluZGdlbl9mdW5jX2VsZW1fNzI5AL4GH19fd2FzbV9iaW5kZ2VuX2Z1bmNfZWxlbV83MjlfMzgAvgYfX193YXNtX2JpbmRnZW5fZnVuY19lbGVtXzcyOV8zOQC+BhxfX3dhc21fYmluZGdlbl9mdW5jX2VsZW1fNzI4ANIGEV9fd2JpbmRnZW5fZXhwb3J0ALgFEl9fd2JpbmRnZW5fZXhwb3J0MgD3BRJfX3diaW5kZ2VuX2V4cG9ydDMAgwcSX193YmluZGdlbl9leHBvcnQ0APgFH19fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIAuQcSX193YmluZGdlbl9leHBvcnQ1AIQHCYMFAQBBAQvcArkCjgelAaEH4QXZAaYBwQfvBtkDZ2hZWtoDQ1vb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IAJBOGoQrQcNBgsgAiACQThqNgK4ASACQegAaiACQThqEKYDAkACQCACKAJoQX9GDQAgAiACKAJwNgKQASACIAIpAmg3A4gBDAELIAJBCDYCzAEgAiACQbgBajYCyAEgAkGgAWpB6pnAACACQcgBahCaASACIAIpAqABNwOIASACIAIoAqgBNgKQAQtBACgCzMNBQQJLDQMMBAsgAkEINgLMASACIAJBuAFqNgLIASACQaABakHqmcAAIAJByAFqEJoBIAIgAikCoAE3A4gBIAIgAigCqAE2ApABCwJAQQAoAszDQUUNACACQQ02AswBIAJBk+3AADYCyAEgAkHAADYCdCACQQQ2AmwgAiACQYgBajYCcCACIAJByAFqNgJoIAJBnNnAABCSCDYCsAEgAkErNgKsASACQeDWwAA2AqgBIAJBKzYCpAEgAkHg1sAANgKgAUHTg8AAIAJB6ABqQQEgAkGgAWoQiQcLIAJBiAFqEKAIIAJBiAFqENYHIAIoAjgiB0GECEkNBCAHEAAMBAsgAiACKQNgNwN4IAIgAikDWDcDcCACIAc2AmwgAiAGNgJoAkACQCAAKAKUASIGKAIARQ0AIAJBk+3AAEENQeDYwABBCyACQegAahB7Igc2AoQBIAJBgAg2AtgBIAJBGGogBkEEaiACQdgBaiACQYQBahD3AyACKAIcIQYCQCACKAIYIgVBAXFFDQAgAiAGNgLcASAGIQsCQEEAKALMw0FFDQAgAkENNgI8IAJBk+3AADYCOCACQcgBaiACQdwBahCmAwJAAkAgAigCyAFBf0YNACACIAIoAtABNgLAASACIAIpAsgBNwO4AQwBCyACQQE2AowBIAIgAkHcAWo2AogBIAJBoAFqQeqZwAAgAkGIAWoQmgEgAiACKQKgATcDuAEgAiACKAKoATYCwAELIAJBwAA2ArQBIAJBAzYCrAEgAkEENgKkASACIAJBuAFqNgKwASACIAJB6ABqNgKoASACIAJBOGo2AqABIAJBrNnAABCSCDYCmAEgAkErNgKUASACQeDWwAA2ApABIAJBKzYCjAEgAkHg1sAANgKIAUHMi8AAIAJBoAFqQQEgAkGIAWoQiQcgAkG4AWoQoAggAkG4AWoQ1gcgAigC3AEhCwsgC0GECEkNACALEAALAkAgB0GECEkNACAHEAALIAVBAXENASAGQYQISQ0BIAYQAAwBC0EAKALMw0FFDQAgAkENNgLMASACQZPtwAA2AsgBIAJBAzYClAEgAkEENgKMASACIAJB6ABqNgKQASACIAJByAFqNgKIASACQbzZwAAQkgg2ArABIAJBKzYCrAEgAkHg1sAANgKoASACQSs2AqQBIAJB4NbAADYCoAFB04PAACACQYgBakEBIAJBoAFqEIkHCyACQegAahCpAwwECyACQQ02AswBIAJBk+3AADYCyAEgAkHAADYCdCACQQQ2AmwgAiACQYgBajYCcCACIAJByAFqNgJoIAJBjNnAABCSCDYCsAEgAkErNgKsASACQeDWwAA2AqgBIAJBKzYCpAEgAkHg1sAANgKgAUGQgMAAIAJB6ABqQQMgAkGgAWoQiQcLIAJBiAFqEKAIIAJBiAFqENYHCyACKAI4IgdBhAhJDQAgBxAACyAGQYQISQ0AIAYQAAtBACEGDAELQQEhBgwACwsgBCAGOgAAQQIhBkEDIQ0MAwsgCRDQAwsgAEGAAjsA4QEgAiACKQPIASIONwNIIAIgAigC0AEiDTYCUCACIA02AnwgAiAONwJ0IAIgBzYCcCACIAU2AmwgAiAGNgJoAkACQAJAAkAgACgClAEiBigCAEUNACACQZPtwABBDUHg2MAAQQsgAkHoAGoQeyINNgKEASACQYAINgLYASACQTBqIAZBBGogAkHYAWogAkGEAWoQ9wMgAigCNCEGIAIoAjAiB0EBRw0CIAIgBjYC3AEgBiEBQQAoAszDQUUNASACQQ02AjwgAkGT7cAANgI4IAJByAFqIAJB3AFqEKYDAkACQCACKALIAUF/Rg0AIAIgAigC0AE2AsABIAIgAikCyAE3A7gBDAELIAJBATYCpAEgAiACQdwBajYCoAEgAkG4AWpB6pnAACACQaABahCaAQsgAkHAADYCtAEgAkEDNgKsASACQQQ2AqQBIAIgAkG4AWo2ArABIAIgAkHoAGo2AqgBIAIgAkE4ajYCoAEgAkHs2MAAEJIINgKYASACQSs2ApQBIAJB4NbAADYCkAEgAkErNgKMASACQeDWwAA2AogBQcyLwAAgAkGgAWpBASACQYgBahCJByACQbgBahCgCCACQbgBahDWByACKALcASEBDAELQQAoAszDQUUNAiACQQ02AswBIAJBk+3AADYCyAEgAkEDNgKU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AkEFNgJ0IAJBBTYCbCACIAJByABqNgJwIAIgAkHAAGo2AmhBhpXAACACQegAakG00cAAEK0FAAtBCEEYEOQHAAtBxMfAABC3BwALQeC9wAAQtwcAC0G4usAAELcHAAsgCEGECEkNACAIEAALAkAgBUGECEkNACAFEAALIAZBAXENACADQYQISQ0AIAMQAAsgAkEYahCoA0GACCEGC0EBIQUgAEEBOgDIASAAQfQAahDOBUEAIQMLIAAgBToAzAFBAyEFAkACQAJAIANBAkYiCA0AIABB7ABqEIgGAkACQAJAIANBAUcNACACIAY2AhggAkGACDYCaCACIABB6ABqIAJB6ABqIAJBGGoQ9wMgAigCAEEBRg0EAkAgAigCBCIDQYQISQ0AIAMQAAsgBkGECE8NAQwCCyACIAY2AhggAkGACDYCaCACQQhqIABB5ABqIAJB6ABqIAJBGGoQ9wMgAigCCEEBRg0EAkAgAigCDCIDQYQISQ0AIAMQAAsgBkGECEkNAQsgBhAACwJAIAAoAmQiA0GECEkNACADEAALQQEhBSAAKAJoIgNBhAhJDQAgAxAACyAAIAU6ANABIAJBkAFqJAAgCA8LQej5wABBMRDdBwALQej5wABBMRDdBwALwRICCn8BfiMAQZABayICJAACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAAtANABDgQAFwIBAAsgAEHsAGogAEHkAPwKAAALAkACQAJAAkAgAC0AzAEOBAESBAABCyAAQYABaiEDIABByAFqIQQCQCAALQDIAQ4EABgEAwALIAAtAMkBIQUgACgCxAEhBgwBCyAAQfQAaiAAKAJsEO8DIABBADoAyAEgACAAKAJ0IgY2AsQBIAAgACgCcEEARyIFOgDJASAAQYABaiEDIABByAFqIQQLIAAgBToAlwEgAEEAOgCWASAAIAY2AsABIAAgBkEIaiIHNgKQASAAQZYBaiEIDAMLIABBlgFqIQgCQCAALQCWAQ4FAhQBBAACCyAAKAKYASIGKAIAIQUMBAsACyAALQCXASEFIAAoApABIQcLIAAgBToAlAEgAEEAOgCVASACQegAakEAQQBBAUEBEK4CIAIoAmwhBSACKAJoQQFGDQ0gAigCcCEGIABBAToAlQEg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usAAELcHAAsgCEGECEkNACAIEAALAkAgBUGECEkNACAFEAALIAZBAXENACADQYQISQ0AIAMQAAsgAkEYahCoA0GACCEGC0EBIQUgAEEBOgDIASAAQfQAahDOBUEAIQMLIAAgBToAzAFBAyEFAkACQAJAIANBAkYiCA0AIABB7ABqEIgGAkACQAJAIANBAUcNACACIAY2AhggAkGACDYCaCACIABB6ABqIAJB6ABqIAJBGGoQ9wMgAigCAEEBRg0EAkAgAigCBCIDQYQISQ0AIAMQAAsgBkGECE8NAQwCCyACIAY2AhggAkGACDYCaCACQQhqIABB5ABqIAJB6ABqIAJBGGoQ9wMgAigCCEEBRg0EAkAgAigCDCIDQYQISQ0AIAMQAAsgBkGECEkNAQsgBhAACwJAIAAoAmQiA0GECEkNACADEAALQQEhBSAAKAJoIgNBhAhJDQAgAxAACyAAIAU6ANABIAJBkAFqJAAgCA8LQej5wABBMRDdBwALQej5wABBMRDdBwALxBICCn8BfiMAQZABayICJAACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAAtANABDgQAFwIBAAsgAEHsAGogAEHkAPwKAAALAkACQAJAAkAgAC0AzAEOBAESBAABCyAAQYABaiEDIABByAFqIQQCQCAALQDIAQ4EABgEAwALIAAtAMkBIQUgACgCxAEhBgwBCyAAQfQAaiAAKAJsEO8DIABBADoAyAEgACAAKAJ0IgY2AsQBIAAgACgCcEEARyIFOgDJASAAQYABaiEDIABByAFqIQQLIAAgBToAlwEgAEEAOgCWASAAIAY2AsABIAAgBkEIaiIHNgKQASAAQZYBaiEIDAMLIABBlgFqIQgCQCAALQCWAQ4FAhQBBAACCyAAKAKYASIGKAIAIQUMBAsACyAALQCXASEFIAAoApABIQcLIAAgBToAlAEgAEEAOgCVASACQegAakEAQQBBAUEBEK4CIAIoAmwhBSACKAJoQQFGDQ0gAigCcCEGIABBAToAlQEgACAFNgKIASAAQQA2AoQBIAAgBjYCgAEgAEEgIAVBCnZnayIFQQcgBUEHSRtBAnRBAXIiBjYCjAECQCADKAIEQf////8HcyIJIAAtAJQBIgpBAXRBAnEi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QZ6PwAAgAkHoAGpBASACQdQAahCJByACQcgAahCgCCACQcgAahDWByACKAI8IQgMCQtBACgCzMNBRQ0KIAJBDTYCiAEgAkGn0cAANgKEASACQQM2AmAgAkEENgJYIAIgAkEYajYCXCACIAJBhAFqNgJUIAJB3LvAABCSCDYCeCACQSs2AnQgAkH0usAANgJwIAJBKzYCbCACQfS6wAA2AmhBuYbAACACQdQAakEBIAJB6ABqEIkHDAoLQejPwAAQtwcACyAEQQE6AABBgghBgwggBUEBcRshBAwJCyAFIAIoAnAQ9wYACyACIAY2AkggAkEFNgJ0IAJBBTYCbCACIAJByABqNgJwIAIgAkHAAGo2AmhBhpXAACACQegAakG00cAAEK0FAAtBCEEYEOQHAAtB8MbAABC3BwALQbC7wAAQtwcAC0G4usAAELcHAAsgCEGECEkNACAIEAALAkAgBUGECEkNACAFEAALIAZBAXENACADQYQISQ0AIAMQAAsgAkEYahCoAyAEQQE6AABBgAghBAsgAEH0AGoQzgVBACEDQQEhBQsgACAFOgDMAUEDIQUCQAJAAkAgA0ECRiIGDQAgAEHsAGoQiAYCQAJAIANBAUcNACACIAQ2AhggAkGACDYCaCACIABB6ABqIAJB6ABqIAJBGGoQ9wMgAigCAEEBRg0DIAIoAgQiA0GECEkNASADEAAMAQsgAiAENgIYIAJBgAg2AmggAkEIaiAAQeQAaiACQegAaiACQRhqEPcDIAIoAghBAUYNAyACKAIMIgNBhAhJDQAgAxAACwJAIAAoAmQiA0GECEkNACADEAALQQEhBSAAKAJoIgNBhAhJDQAgAxAACyAAIAU6ANABIAJBkAFqJAAgBg8LQej5wABBMRDdBwALQej5wABBMRDdBwALrBICCn8BfiMAQZABayICJAACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAAtANABDgQAFwIBAAsgAEHsAGogAEHkAPwKAAALAkACQAJAAkAgAC0AzAEOBAESBAABCyAAQYABaiEDIABByAFqIQQCQCAALQDIAQ4EABgEAwALIAAtAMkBIQUgACgCxAEhBgwBCyAAQfQAaiAAKAJsEO8DIABBADoAyAEgACAAKAJ0IgY2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bCACQejJwAA2AmhB5YLAACACQdQAakEBIAJB6ABqEIkHDAoLQfjPwAAQtwcACyAEQQE6AABBgghBgwggBUEBcRshBAwJCyAFIAIoAnAQ9wYACyACIAY2AkggAkEFNgJ0IAJBBTYCbCACIAJByABqNgJwIAIgAkHAAGo2AmhBhpXAACACQegAakG00cAAEK0FAAtBCEEYEOQHAAtB7MXAABC3BwALQaTKwAAQtwcAC0G4usAAELcHAAsgCEGECEkNACAIEAALAkAgBUGECEkNACAFEAALIAZBAXENACADQYQISQ0AIAMQAAsgAkEYahCoAyAEQQE6AABBgAghBAsgAEH0AGoQzAVBACEDQQEhBQsgACAFOgDMAUEDIQUCQAJAAkAgA0ECRiIGDQAgAEHsAGoQiwYCQAJAIANBAUcNACACIAQ2AhggAkGACDYCaCACIABB6ABqIAJB6ABqIAJBGGoQ9wMgAigCAEEBRg0DIAIoAgQiA0GECEkNASADEAAMAQsgAiAENgIYIAJBgAg2AmggAkEIaiAAQeQAaiACQegAaiACQRhqEPcDIAIoAghBAUYNAyACKAIMIgNBhAhJDQAgAxAACwJAIAAoAmQiA0GECEkNACADEAALQQEhBSAAKAJoIgNBhAhJDQAgAxAACyAAIAU6ANABIAJBkAFqJAAgBg8LQej5wABBMRDdBwALQej5wABBMRDdBwALrxICCn8BfiMAQZABayICJAACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAAtANABDgQAFwIBAAsgAEHsAGogAEHkAPwKAAALAkACQAJAAkAgAC0AzAEOBAESBAABCyAAQYABaiEDIABByAFqIQQCQCAALQDIAQ4EABgEAwALIAAtAMkBIQUgACgCxAEhBgwBCyAAQfQAaiAAKAJsEO8DIABBADoAyAEgACAAKAJ0IgY2AsQBIAAgACgCcEEARyIFOgDJASAAQYABaiEDIABByAFqIQQLIAAgBToAlwEgAEEAOgCWASAAIAY2AsABIAAgBkEIaiIHNgKQASAAQZYBaiEIDAMLIABBlgFqIQgCQCAALQCWAQ4FAhQBBAACCyAAKAKYASIGKAIAIQUMBAsACyAALQCXASEFIAAoApABIQcLIAAgBToA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NgIAAkAgBg0AIANBDGoQ0gQLIAVBf2oiBQ0ACwsCQCACQYQISQ0AIAIQAAsgAEEANgIAIANBIGokAA8LQbCZwQAQhQYAC4kDAQR/IAAoAgwhAgJAAkACQAJAIAFBgAJJDQAgACgCGCEDAkACQAJAIAIgAEcNACAAQRRBECAAKAIUIgIbaigCACIBDQFBACECDAILIAAoAggiASACNgIMIAIgATYCCAwBCyAAQRRqIABBEGogAhshBANAIAQhBSABIgJBFGogAkEQaiACKAIUIgEbIQQgAkEUQRAgARtqKAIAIgENAAsgBUEANgIACyADRQ0CAkACQCAAIAAoAhxBAnRB1L/BAGoiASgCAEYNACADKAIQIABGDQEgAyACNgIUIAINAwwECyABIAI2AgAgAkUNBAwCCyADIAI2AhAgAg0BDAILAkAgAiAAKAIIIgRGDQAgBCACNgIMIAIgBDYCCA8LQQBBACgC7MJBQX4gAUEDdndxNgLswkEPCyACIAM2AhgCQCAAKAIQIgFFDQAgAiABNgIQIAEgAjYCGAsgACgCFCIBRQ0AIAIgATYCFCABIAI2AhgPCw8LQQBBACgC8MJBQX4gACgCHHdxNgLwwkELjwMBAn8jAEEQayICJAACQCABKAIgIgMgACgCAEsNAAJAAkACQAJAAkAgA0F/ag4FAAECAwQACyACQQRqIAEQmAEgAigCCCACKAIMEPMHIQEgAkEEahCgCCACQQRqENYHIAIgATYCACACEO8HIAFBhAhJDQQgARAADAQLIAJBBGogARCYASACKAIIIAIoAgwQ8wchASACQQRqEKAIIAJBBGoQ1gcgAiABNgIAIAIQ7QcgAUGECEkNAyABEAAMAwsgAkEEaiABEJgBIAIoAgggAigCDBDzByEBIAJBBGoQoAggAkEEahDWByACIAE2AgAgAhDsByABQYQISQ0CIAEQAAwCCyACQQRqIAEQmAEgAigCCCACKAIMEPMHIQEgAkEEahCgCCACQQRqENYHIAIgATYCACACEO4HIAFBhAhJDQEgARAADAELIAJBBGogARCYASACKAIIIAIoAgwQ8wchASACQQRqEKAIIAJBBGoQ1gcgAiABNgIAIAIQ7gcgAUGECEkNACABEAALIAJBEGokAAvaAgEFf0EAIQFBAEEbIABB/OUGSRsiAiACQQ1qIgIgACAC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IAQoAgghBSAEKAIEQQFGDQIgBCgCDCEGIABBADYCCCAAIAY2AgQgACAFNgIAAkAgA0UNAAJAIANFDQAgBiACIAP8CgAACyAAIAM2AggLIAEQlgYMAQsgAUEANgIIIAEoAgAhBSABKAIEIQYgAUKAgICAEDcCACABEJYGAkAgA0UNACAGIAIgA/wKAAALIAAgAzYCCCAAIAY2AgQgACAFNgIACyAEQRBqJAAPCyAFIAQoAgwQ9wYAC88BAgF/An4jAEEQayIDJAAgAEEDdCIAQQJyrSEEAkAgAEGAAUkNAANAIAMgBCIFp0GAAXI6AAwgAiADQQxqQQEQ2gIgBUIHiCEEIAVC//8AVg0ACwsgAyAEPAANIAIgA0ENakEBENoCIAEoAggiAK0hBAJAIABBgAFJDQADQCADIAQiBadBgAFyOgAOIAIgA0EOakEBENoCIAVCB4ghBCAFQv//AFYNAAsLIAMgBDwADyACIANBD2pBARDaAiACIAEoAgQgABDaAiADQRBqJAAL3wEBBH8jAEEgayICJAACQAJAAkAgASgCCCIDIAEoAgAiBEYNABCPCEEMQQQQwwciBUUNAiAFQQE2AgggBSAENgIEIAUgASgCBCIBNgIAQciWwQAhBAwBCyACIAEoAgg2AhggAiABKQIANwMQIAJBCGogAkEQahDSAyACKAIIIgRBASACKAIMIgMbIQEgBEEBckEAIAMbIQVB7JbBAEGAl8EAIARBAXEbQbSWwQAgAxshBAsgACAFNgIMIAAgAzYCCCAAIAE2AgQgACAENgIAIAJBIGokAA8LQQRBDBDkBwAL2AEBAn8jAEEgayIDJAAgAUEEaiEEIAJBBGohAQJAAkAgAigCAEEBRw0AIAMgASkCADcDECADIAEoAggiAjYCGCADIAQgAygCFCACEKUFIAMoAgQhASADKAIAIQIgA0EQahCgCCADQRBqENYHDAELIAMgASkCADcDECADIAEoAggiAjYCGCADQQhqIAQgAygCFCACEKQFIAMoAgwhASADKAIIIQIgA0EQahCgCCADQRBqENYHCwJAAkAgAkEBRw0AIAAgARDoBAwBCyAAQX82AgALIANBIGokAAvuAQECfyMAQcAAayICJAAgAkEgakGw+MAAENkFIAJBACkD6PhANwMAIAJBACkD8PhANwMIIAIgAikDKDcDGCAC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IgFBf2o2AgAgAUEBRw0AIABBBGoQ1wQLC5sBAQJ/AkAgAC0ACEECRg0AIAAoAgAiASABKAIgIgJBf2o2AiACQCACQQFHDQACQCABKAIcQX9KDQAgASABKAIcQf////8HcTYCHAsgAUEkahCsBQsgACgCACIBIAEoAgAiAUF/ajYCAAJAIAFBAUcNACAAELUECyAAKAIEIgEgASgCACIBQX9qNgIAIAFBAUcNACAAQQRqENcECwuiAQECfyMAQSBrIgIkACACQQA2AgwgAkKAgICAEDcCBCACQQRqIAEQsgEhAyACIAIoAgw2AhggAiACKQIENwMQAkACQCADRQ0AIABBfzYCACAAIAM2AgQgAkEQahCgCCACQRBqENYHDAELIAAgAigCDDYCCCAAIAIpAgQ3AgALIAFBDGoQhAggASgCBCABKAIIIAEoAgAoAhARCAAgAkEgaiQAC6IBAQJ/IwBBIGsiAiQAIAJBADYCDCACQoCAgIAQNwIEIAJBBGogARC1ASEDIAIgAigCDDYCGCACIAIpAgQ3AxACQAJAIANFDQAgAEF/NgIAIAAgAzYCBCACQRBqEKAIIAJBEGoQ1gcMAQsgACACKAIMNgIIIAAgAikCBDcCAAsgAUEMahCECCABKAIEIAEoAgggASgCACgCEBEIACACQSBqJAALogEBAn8jAEEgayICJAAgAkEANgIMIAJCgICAgBA3AgQgAkEEaiABELYBIQMgAiACKAIMNgIYIAIgAikCBDcDEAJAAkAgA0UNACAAQX82AgAgACADNgIEIAJBEGoQoAggAkEQahDWBwwBCyAAIAIoAgw2AgggACACKQIENwIACyABQQxqEIQIIAEoAgQgASgCCCABKAIAKAIQEQgAIAJBIGokAAuiAQECfyMAQSBrIgIkACACQQA2AgwgAkKAgICAEDcCBCACQQRqIAEQtwEhAyACIAIoAgw2AhggAiACKQIENwMQAkACQCADRQ0AIABBfzYCACAAIAM2AgQgAkEQahCgCCACQRBqENYHDAELIAAgAigCDDYCCCAAIAIpAgQ3AgALIAFBDGoQhAggASgCBCABKAIIIAEoAgAoAhARCAAgAkEgaiQAC6IBAQJ/IwBBIGsiAiQAIAJBADYCDCACQoCAgIAQNwIEIAJBBGogARC4ASEDIAIgAigCDDYCGCACIAIpAgQ3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BEF/aiIBNgIEIAENACAAQSBBBBCjBwsLQgEBfwJAIAAoAgAiACgCDEUNACAAQQxqENsFCwJAIABBf0YNACAAIAAoAgRBf2oiATYCBCABDQAgAEEYQQQQowcLCz4BAn8jAEEQayIBJAAgAEF4aiIAIAAoAgBBf2oiAjYCACABIAA2AgwCQCACDQAgAUEMahDSBAsgAUEQaiQACz4BAn8jAEEQayIBJAAgAEF4aiIAIAAoAgBBf2oiAjYCACABIAA2AgwCQCACDQAgAUEMahCYBQsgAUEQaiQAC0ABAX8jAEEgayIDJAAgAyACNgIcIAMgATYCGCADIAI2AhQgA0EIaiADQRRqENUDIAAgAykDCDcDACADQSBqJAALSgECfyABKAIEIQIgASgCACEDEI8IAkBBCEEEEMMHIgENAEEEQQgQ5AcACyABIAI2AgQgASADNgIAIABBwJ7BADYCBCAAIAE2AgALSgEBfwJAAkACQCAALQCwAQ4EAAICAQILAkAgACgCpAEiAUGECEkNACABEAALIAAoAqgBIgBBhAhJDQEgABAADwsgAEEQahDuBAsLSgEBfwJAAkACQCAALQCwAQ4EAAICAQILAkAgACgCpAEiAUGECEkNACABEAALIAAoAqgBIgBBhAhJDQEgABAADwsgAEEQahDzBAsLUAEBfyAAKAIAIgEoAighACABQQA2AigCQAJAAkAgAA4CAAIBC0GXgsEAQRZBsILBABD9BgALIAAoAgQgACgCACgCBBECACAAQQhBBBCjBwsLQwEBfyMAQbABayIDJAAgA0EAOgCoASADIAI5AxAgAyABOQMIIAMgADYCmAEgA0EIahCxBRCXCCEAIANBsAFqJAAgAAtFAQF/IAEoAgAiASABKAIIIgRBAWo2AggCQCAEQX9KDQAQlAgACyAAIAE2AgwgACADNgIIIAAgAjYCBCAAQciWwQA2AgALRQEBfyABKAIAIgEgASgCECIEQQFqNgIQAkAgBEF/Sg0AEJQIAAsgACABNgIMIAAgAzYCCCAAIAI2AgQgAEHYl8EANgIAC0EBAX8jAEEQayICJAAgAkGFAjYCDCACIABBGGo2AgggASgCACABKAIEQeqZwAAgAkEIahCMASEBIAJBEGokACABCz8BAX8jAEEQayIEJAAgASgCACACIAMQDSAEQQhqELEGIAQoAgwhASAAIAQoAgg2AgAgACABNgIEIARBEGokAAs/AQF/IwBBEGsiBCQAIAEoAgAgAiADEA4gBEEIahCxBiAEKAIMIQEgACAEKAIINgIAIAAgATYCBCAEQRBqJAALRAEBfxCPCAJAQRhBBBDDByIBDQBBBEEYEOQHAAsgAUEANgIUIAEgACgCEDYCECABIAApAgg3AgggASAAKQIANwIAIAELPwEBfwJAIAAoAgQiAEUNAANAIAAoAhQhAQJAIAAoAgBFDQAgAEEEahC5BQsgAEEYQQQQowcgASEAIAENAAsLC0gBAX8QjwgCQEEgQQQQwwciAQ0AQQRBIBDkBwALIAFCgYCAgBA3AgAgASAAKQIANwIIIAEgACkCCDcCECABIAApAhA3AhggAQtEAQF/EI8IAkBBGEEEEMMHIgENAEEEQRgQ5AcACyABQQA2AhQgASAAKAIQNgIQIAEgACkCCDcCCCABIAApAgA3AgAgAQtIAQF/EI8IAkBBIEEEEMMHIgENAEEEQSAQ5AcACyABQoGAgIAQNwIAIAEgACkCADcCCCABIAApAgg3AhAgASAAKQIQNwIYIAELQQEBf0EBIQICQAJAIAEoAgAiASABELMCIgEoAgBBAUYNAEEAIQIMAQsgASgCBBAEIQELIAAgATYCBCAAIAI2AgALQQEBfyAAIAAoAggiAUECcjYCCAJAIAENACAAQQA2AgggACgCACEBIABBADYCACABRQ0AIAAoAgQgASgCBBECAAsLPAEBfyMAQSBrIgMkACADIAE2AhAgAyAANgIMIANBATsBHCADIAI2AhggAyADQQxqNgIUIANBFGoQoAYACzsBAX8jAEEQayIDJAAgAyABNgIEIAMgADYCACADQdQCrUIghiADrYQ3AwhB6pnAACADQQhqIAIQrQUACz8BAX8jAEGQAWsiAyQAIANBADoAjAEgAyACNgIIIAMgATYCBCADIAA2AgAgAxCJBRCXCCECIANBkAFqJAAgAgtGAQF/EI8IAkBBGEEEEMMHIgENAEEEQRgQ5AcACyABQQA2AgggAUKAgICAwAA3AgAgASAAKQIANwIMIAEgACgCCDYCFCABC0ABAX8jAEGwAWsiASQAIAFCATcDACABQQhqIABBqAH8CgAAIAFBoP7AABABEJgIIQAgARD7AyABQbABaiQAIAALQAEBfyMAQfABayIBJAAgAUIBNwMAIAFBCGogAEHoAfwKAAAgAUGIgcEAEAEQmAghACABEJQCIAFB8AFqJAAgAAs6AQF/IAAoAgAiAEEIahDRAQJAIABBf0YNACAAIAAoAgQiAUF/ajYCBCABQQFHDQAgAEEsQQQQowcLCz4BAX8jAEHwAGsiAyQAIANBADoAbCADIAI2AgggAyABNgIEIAMgADYCACADEPoEEJcIIQIgA0HwAGokACACCz4BAX8jAEHwAGsiAyQAIANBADoAbCADIAI2AgggAyABNgIEIAMgADYCACADEP4EEJcIIQIgA0HwAGokACACCz4BAX8jAEEQayICJAAgAkHAATYCDCACIAA2AgggASgCACABKAIEQa+ZwAAgAkEIahCMASEBIAJBEGokACABCzsBAX8jAEEQayICJAAgASgCABAbIAJBCGoQsQYgAigCDCEBIAAgAigCCDYCACAAIAE2AgQgAkEQaiQACzYAAkAgAWlBAUcNACAAQYCAgIB4IAFrSw0AAkAgAEUNABCPCCAAIAEQwwciAUUNAQsgAQ8LAAs6AAJAIAAoAgBFDQAgAEEMahCECCAAKAIEIAAoAgggACgCACgCEBEIAA8LIABBBGoiABCgCCAAENYHCz4BAX8jAEEQayICJAAgAkEEaiABQbT4wABBDBCZBiACQQRqQcT4wABBzPjAABDUARDOAiEBIAJBEGokACABCzoBAX8jAEHwAGsiAiQAIAJBADoAbCACIAE2AhAgAiAANgIMIAJBDGoQigUQlwghASACQfAAaiQAIAELOgEBfyMAQfAAayICJAAgAkEAOgBsIAIgATYCECACIAA2AgwgAkEMahD4BBCXCCEBIAJB8ABqJAAgAQs6AQF/IwBB8ABrIgIkACACQQA6AGwgAiABNgIQIAIgADYCDCACQQxqEPkEEJcIIQEgAkHwAGokACABCzoBAX8jAEHwAGsiAiQAIAJBADoAbCACIAE2AhAgAiAANgIMIAJBDGoQ9gQQlwghASACQfAAaiQAIAELOgEBfyMAQfAAayICJAAgAkEAOgBsIAIgATYCECACIAA2AgwgAkEMahD8BBCXCCEBIAJB8ABqJAAgAQs6AQF/IwBB8ABrIgIkACACQQA6AGwgAiABNgIQIAIgADYCDCACQQxqEP0EEJcIIQEgAkHwAGokACABCzoBAX8j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ZDphZGRfY3VydmVfcG9pbnR8ZXJyb3I6wAAIc2VydmljZTrAGnxtZXRob2Q6dmVyc2lvbl9zdHJ8ZXJyb3I6wAAIc2VydmljZTrAFHxtZXRob2Q6aGVsbG98ZXJyb3I6wAAIc2VydmljZTrAE3xtZXRob2Q6ZWNob3xlcnJvcjrAAAhzZXJ2aWNlOsAefG1ldGhvZDpnZXRfdHJhbnNsYXRpb258ZXJyb3I6wAAIc2VydmljZTrAFnxtZXRob2Q6dmVyc2lvbnxlcnJvcjrAAAhzZXJ2aWNlOsAafG1ldGhvZDpnZXRfZmFuX3JwbXxlcnJvcjrAAAhzZXJ2aWNlOsASfG1ldGhvZDpsb2d8ZXJyb3I6wAAIc2VydmljZTrAGHxtZXRob2Q6c2V0X2N1cnZlfGVycm9yOsAACHNlcnZpY2U6wB98bWV0aG9kOmdldF9zeXN0ZW1fY3VydmV8ZXJyb3I6wAAIc2VydmljZTrAHnxtZXRob2Q6c2V0X2ludGVycG9sYXRlfGVycm9yOsAACHNlcnZpY2U6wB58bWV0aG9kOmdldF9pbnRlcnBvbGF0ZXxlcnJvcjrAAAhzZXJ2aWNlOsAefG1ldGhvZDpnZXRfdGVtcGVyYXR1cmV8ZXJyb3I6wAAIc2VydmljZTrAE3xtZXRob2Q6bmFtZXxlcnJvcjrAAAhzZXJ2aWNlOsAhfG1ldGhvZDpzZXRfc3lzdGVtX3Byb2ZpbGV8ZXJyb3I6wAAIc2VydmljZTrAGXxtZXRob2Q6c2V0X2VuYWJsZXxlcnJvcjrAAAhzZXJ2aWNlOsAZfG1ldGhvZDpnZXRfZW5hYmxlfGVycm9yOsAACHNlcnZpY2U6wBt8bWV0aG9kOmdldF9sYW5ndWFnZXxlcnJvcjrAAAhzZXJ2aWNlOsAefG1ldGhvZDpzZXRfZml4ZWRfc3BlZWR8ZXJyb3I6wAAIc2VydmljZTrAHnxtZXRob2Q6Z2V0X2ZpeGVkX3NwZWVkfGVycm9yOsAACHNlcnZpY2U6wBp8bWV0aG9kOmdldF9jdXJ2ZV95fGVycm9yOsAKfGpzIGVycm9yOsAACHNlcnZpY2U6wBp8bWV0aG9kOmdldF9jdXJ2ZV94fGVycm9yOsAKfGpzIGVycm9yOsAACHNlcnZpY2U6wCF8bWV0aG9kOnJlbW92ZV9jdXJ2ZV9wb2ludHxlcnJvcjrACnxqcyBlcnJvcjrAAAhzZXJ2aWNlOsAefG1ldGhvZDphZGRfY3VydmVfcG9pbnR8ZXJyb3I6wAp8anMgZXJyb3I6wAAIc2VydmljZTrAGnxtZXRob2Q6dmVyc2lvbl9zdHJ8ZXJyb3I6wAp8anMgZXJyb3I6wAAIc2VydmljZTrAFHxtZXRob2Q6aGVsbG98ZXJyb3I6wAp8anMgZXJyb3I6wAAIc2VydmljZTrAE3xtZXRob2Q6ZWNob3xlcnJvcjrACnxqcyBlcnJvcjrAAAhzZXJ2aWNlOsAefG1ldGhvZDpnZXRfdHJhbnNsYXRpb258ZXJyb3I6wAp8anMgZXJyb3I6wAAIc2VydmljZTrAFnxtZXRob2Q6dmVyc2lvbnxlcnJvcjrACnxqcyBlcnJvcjrAAAhzZXJ2aWNlOsAafG1ldGhvZDpnZXRfZmFuX3JwbXxlcnJvcjrACnxqcyBlcnJvcjrAAAhzZXJ2aWNlOsASfG1ldGhvZDpsb2d8ZXJyb3I6wAp8anMgZXJyb3I6wAAIc2VydmljZTrAGHxtZXRob2Q6c2V0X2N1cnZlfGVycm9yOsAKfGpzIGVycm9yOsAACHNlcnZpY2U6wB98bWV0aG9kOmdldF9zeXN0ZW1fY3VydmV8ZXJyb3I6wAp8anMgZXJyb3I6wAAIc2VydmljZTrAHnxtZXRob2Q6c2V0X2ludGVycG9sYXRlfGVycm9yOsAKfGpzIGVycm9yOsAACHNlcnZpY2U6wB58bWV0aG9kOmdldF9pbnRlcnBvbGF0ZXxlcnJvcjrACnxqcyBlcnJvcjrAAAhzZXJ2aWNlOsAefG1ldGhvZDpnZXRfdGVtcGVyYXR1cmV8ZXJyb3I6wAp8anMgZXJyb3I6wAAIc2VydmljZTrAE3xtZXRob2Q6bmFtZXxlcnJvcjrACnxqcyBlcnJvcjrAAAhzZXJ2aWNlOsAhfG1ldGhvZDpzZXRfc3lzdGVtX3Byb2ZpbGV8ZXJyb3I6wAp8anMgZXJyb3I6wAAIc2VydmljZTrAGXxtZXRob2Q6c2V0X2VuYWJsZXxlcnJvcjrACnxqcyBlcnJvcjrAAAhzZXJ2aWNlOsAZfG1ldGhvZDpnZXRfZW5hYmxlfGVycm9yOsAKfGpzIGVycm9yOsAACHNlcnZpY2U6wBt8bWV0aG9kOmdldF9sYW5ndWFnZXxlcnJvcjrACnxqcyBlcnJvcjrAAAhzZXJ2aWNlOsAefG1ldGhvZDpzZXRfZml4ZWRfc3BlZWR8ZXJyb3I6wAp8anMgZXJyb3I6wAAIc2VydmljZTrAHnxtZXRob2Q6Z2V0X2ZpeGVkX3NwZWVkfGVycm9yOsAKfGpzIGVycm9yOsAAwAE6wAAOd3M6Ly91c2RwbC13cy3ACy5sb2NhbGhvc3Q6wAEvwAEuwAEvwAAiYWR2YW5jZSBvdXQgb2YgYm91bmRzOiB0aGUgbGVuIGlzIMASIGJ1dCBhZHZhbmNpbmcgYnkgwAAsSW5pdGlhbGl6ZWQgd3Mgc2VydmljZSBUcmFuc2xhdGlvbnMgb24gcG9ydCDAAChJbml0aWFsaXplZCB3cyBzZXJ2aWNlIERldlRvb2xzIG9uIHBvcnQgwAAjSW5pdGlhbGl6ZWQgd3Mgc2VydmljZSBGYW4gb24gcG9ydCDAABxTdHJlYW0gbGVuZ3RoIGVycm9yOiB3YW50ZWQgwAYsIGdvdCDAABVieXRlIHJhbmdlIHN0YXJ0cyBhdCDADSBidXQgZW5kcyBhdCDAACBpbmRleCBvdXQgb2YgYm91bmRzOiB0aGUgbGVuIGlzIMASIGJ1dCB0aGUgaW5kZXggaXMgwAARc3RhcnQgYnl0ZSBpbmRleCDAJyBpcyBvdXQgb2YgYm91bmRzIGZvciBzdHJpbmcgb2YgbGVuZ3RoIMAAD2VuZCBieXRlIGluZGV4IMAnIGlzIG91dCBvZiBib3VuZHMgZm9yIHN0cmluZyBvZiBsZW5ndGggwAAhY2Fubm90IGFkdmFuY2UgcGFzdCBgcmVtYWluaW5nYDogwAQgPD0gwAAQYXNzZXJ0aW9uIGBsZWZ0IMAXIHJpZ2h0YCBmYWlsZWQKICBsZWZ0OiDACQogcmlnaHQ6IMAAEGFzc2VydGlvbiBgbGVmdCDAECByaWdodGAgZmFpbGVkOiDACQogIGxlZnQ6IMAJCiByaWdodDogwAAPd3Mgb3BlbiBlcnJvcjogwAAORW5jb2RlIGVycm9yOiDAAA5EZWNvZGUgZXJyb3I6IMAADk1ldGhvZCBlcnJvcjogwAAeRmFpbGVkIHRvIHNldHVwIFVTRFBMIGxvZ2dlcjogwABLaW50ZXJuYWwgZXJyb3I6IGVudGVyZWQgdW5yZWFjaGFibGUgY29kZTogbWVzc2FnZSBldmVudCwgcmVjZWl2ZWQgVW5rbm93bjogwAAYV2ViU29ja2V0IENsb3NlZDogY29kZTogwAosIHJlYXNvbjogwABIY2Fubm90IGFjY2VzcyBhIFRocmVhZCBMb2NhbCBTdG9yYWdlIHZhbHVlIGR1cmluZyBvciBhZnRlciBkZXN0cnVjdGlvbjogwAATaW52YWxpZCBrZXkgdmFsdWU6IMAAGWludmFsaWQgd2lyZSB0eXBlIHZhbHVlOiDAAA13cyB3aXRoIHVybCBgwBFgIGluaXRpYWwgc3RhdGU6IMAAD2ludmFsaWQgc3RhdGU6IMAAD0Vycm9yIG1lc3NhZ2U6IMAAFlVTRFBMIGluaXQgc3VjY2VlZGVkOiDAAMACOiDAAAFbwAJdKMACKSDAAC9ydXN0L2RlcHMvaGFzaGJyb3duLTAuMTcuMS9zcmMvcmF3LnJzAC9ob21lL2tvc3dvLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTE5NDljZjhjNmI1YjU1N2YvYnl0ZXMtMS4xMi4xL3NyYy9ieXRlc19tdXQucnMAL3J1c3RjLzU4Y2Y4ZjljMzViMzU1MTk5NzI3NjI3ZDA3YWUzNGE0ZTI4NDZkNjcvbGlicmFyeS9hbGxvYy9zcmMvZm10LnJzAC9ob21lL2tvc3dvLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTE5NDljZjhjNmI1YjU1N2YvZnV0dXJlcy11dGlsLTAuMy4zNC9zcmMvZnV0dXJlL3NlbGVjdC5ycwAvaG9tZS9rb3N3by8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby0xOTQ5Y2Y4YzZiNWI1NTdmL2J5dGVzLTEuMTIuMS9zcmMvYnl0ZXMucnMAL2hvbWUva29zd28vLmNhcmdvL3JlZ2lzdHJ5L3NyYy9pbmRleC5jcmF0ZXMuaW8tMTk0OWNmOGM2YjViNTU3Zi9nbG9vLW5ldC0wLjQuMC9zcmMvd2Vic29ja2V0L2Z1dHVyZXMucnMAL3J1c3RjLzU4Y2Y4ZjljMzViMzU1MTk5NzI3NjI3ZDA3YWUzNGE0ZTI4NDZkNjcvbGlicmFyeS9zdGQvc3JjL3N5cy9zeW5jL211dGV4L25vX3RocmVhZHMucnMAL3J1c3RjLzU4Y2Y4ZjljMzViMzU1MTk5NzI3NjI3ZDA3YWUzNGE0ZTI4NDZkNjcvbGlicmFyeS9zdGQvc3JjL3N5cy9zeW5jL3J3bG9jay9ub190aHJlYWRzLnJzAC9ob21lL2tvc3dvLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTE5NDljZjhjNmI1YjU1N2YvZ2xvby1uZXQtMC40LjAvc3JjL2Vycm9yLnJzAC9tbnQvZi9GYW50YXN0aWMvdXNkcGwtcnMvdXNkcGwtZnJvbnQvc3JjL2NsaWVudF9oYW5kbGVyLnJzAC9ob21lL2tvc3dvLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTE5NDljZjhjNmI1YjU1N2YvZnV0dXJlcy1jb3JlLTAuMy4zNC9zcmMvdGFzay9fX2ludGVybmFsL2F0b21pY193YWtlci5ycwAvaG9tZS9rb3N3by8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby0xOTQ5Y2Y4YzZiNWI1NTdmL2J5dGVzLTEuMTIuMS9zcmMvYnVmL2J1Zl9pbXBsLnJzAC9ob21lL2tvc3dvL3dhc20tdGFyZ2V0L3dhc20zMi11bmtub3duLXVua25vd24vcmVsZWFzZS9idWlsZC9mYW50YXN0aWMtd2FzbS01MGY5NzBkNzdjY2U4NmZhL291dC91c2RwbC5ycwAvbW50L2YvRmFudGFzdGljL3VzZHBsLXJzL3VzZHBsLWZyb250L3NyYy93YXNtL25vdF9xdWl0ZV90cml2aWFsLnJzAC9ydXN0Yy81OGNmOGY5YzM1YjM1NTE5OTcyNzYyN2QwN2FlMzRhNGUyODQ2ZDY3L2xpYnJhcnkvc3RkL3NyYy90aHJlYWQvbG9jYWwucnMAL2hvbWUva29zd28vLmNhcmdvL3JlZ2lzdHJ5L3NyYy9pbmRleC5jcmF0ZXMuaW8tMTk0OWNmOGM2YjViNTU3Zi9mdXR1cmVzLXV0aWwtMC4zLjM0L3NyYy9sb2NrL2JpbG9jay5ycwAvaG9tZS9rb3N3by8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby0xOTQ5Y2Y4YzZiNWI1NTdmL2pzLXN5cy0wLjMuMTA2L3NyYy9mdXR1cmVzL2pzcGkucnMAL2hvbWUva29zd28vLmNhcmdvL3JlZ2lzdHJ5L3NyYy9pbmRleC5jcmF0ZXMuaW8tMTk0OWNmOGM2YjViNTU3Zi9sb2ctMC40LjM0L3NyYy9fX3ByaXZhdGVfYXBpLnJzAC9ydXN0Yy81OGNmOGY5YzM1YjM1NTE5OTcyNzYyN2QwN2FlMzRhNGUyODQ2ZDY3L2xpYnJhcnkvYWxsb2Mvc3JjL3N0cmluZy5ycwAvaG9tZS9rb3N3by8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby0xOTQ5Y2Y4YzZiNWI1NTdmL2pzLXN5cy0wLjMuMTA2L3NyYy9mdXR1cmVzL3F1ZXVlLnJzAC9ob21lL2tvc3dvLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTE5NDljZjhjNmI1YjU1N2YvZnV0dXJlcy1jaGFubmVsLTAuMy4zNC9zcmMvbXBzYy9xdWV1ZS5ycwAvaG9tZS9rb3N3by8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby0xOTQ5Y2Y4YzZiNWI1NTdmL2J5dGVzLTEuMTIuMS9zcmMvYnVmL3Rha2UucnMAL3J1c3RjLzU4Y2Y4ZjljMzViMzU1MTk5NzI3NjI3ZDA3YWUzNGE0ZTI4NDZkNjcvbGlicmFyeS9jb3JlL3NyYy9mbXQvbW9kLnJzAC9ob21lL2tvc3dvLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTE5NDljZjhjNmI1YjU1N2YvanMtc3lzLTAuMy4xMDYvc3JjL2Z1dHVyZXMvbW9kLnJzAC9ydXN0Yy81OGNmOGY5YzM1YjM1NTE5OTcyNzYyN2QwN2FlMzRhNGUyODQ2ZDY3L2xpYnJhcnkvY29yZS9zcmMvc3RyL21vZC5ycwAvaG9tZS9rb3N3by8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby0xOTQ5Y2Y4YzZiNWI1NTdmL2Z1dHVyZXMtY2hhbm5lbC0wLjMuMzQvc3JjL21wc2MvbW9kLnJzAC9ydXN0Yy81OGNmOGY5YzM1YjM1NTE5OTcyNzYyN2QwN2FlMzRhNGUyODQ2ZDY3L2xpYnJhcnkvYWxsb2Mvc3JjL3Jhd192ZWMvbW9kLnJzAC9ob21lL2tvc3dvLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTE5NDljZjhjNmI1YjU1N2YvZnV0dXJlcy11dGlsLTAuMy4zNC9zcmMvc2luay9mZWVkLnJzAC9ob21lL2tvc3dvLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTE5NDljZjhjNmI1YjU1N2YvanMtc3lzLTAuMy4xMDYvc3JjL2Z1dHVyZXMvdGFzay9zaW5nbGV0aHJlYWQucnMAL3J1c3QvZGVwcy9kbG1hbGxvYy0wLjIuMTQvc3JjL2RsbWFsbG9jLnJzAC9ob21lL2tvc3dvL3dhc20tdGFyZ2V0L3dhc20zMi11bmtub3duLXVua25vd24vcmVsZWFzZS9idWlsZC9mYW50YXN0aWMtd2FzbS01MGY5NzBkNzdjY2U4NmZhL291dC9mYW50YXN0aWMucnMAL21udC9mL0ZhbnRhc3RpYy91c2RwbC1ycy91c2RwbC1mcm9udC9zcmMvbGliLnJzAC9ob21lL2tvc3dvLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTE5NDljZjhjNmI1YjU1N2YvanMtc3lzLTAuMy4xMDYvc3JjL2xpYi5ycwAvaG9tZS9rb3N3by8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby0xOTQ5Y2Y4YzZiNWI1NTdmL29uY2VfY2VsbC0xLjIxLjQvc3JjL2xpYi5ycwAvaG9tZS9rb3N3by8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby0xOTQ5Y2Y4YzZiNWI1NTdmL2J5dGVzLTEuMTIuMS9zcmMvbGliLnJzACZ1c2RwbC1mcm9udCB2MS4wLjAgKEdQTC0zLjAtb25seSkgZm9yIMBTIGJ5IE5Hbml1cyA8bmduaXVzbmVzc0BnbWFpbC5jb20+LCBtb3JlOiBodHRwczovL2dpdC5uZ25pLnVzL05HLVNELVBsdWdpbnMvdXNkcGwtcnMA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ABEAAAABEBAAOwAAAF4AAAAxAAAAchcQAG0AAAC6AwAABQAAABgREABpAAAAnAEAAAUAAAAYERAAaQAAAAYEAAAFAAAAARAQADsAAAChAAAACQAAAGoAAAAEAAAABAAAADcAAAA4AAAAARAQADsAAACbAAAARgAAAGsAAAAYAAAABAAAADoAAABjYWxsZWQgYFJlc3VsdDo6dW53cmFwKClgIG9uIGFuIGBFcnJgIHZhbHVldXNkcGwuRGV2VG9vbHN1c2RwbC5UcmFuc2xhdGlvbnNmYW50YXN0aWMuRmFuJQ4QAFoAAAC2AgAACQAAAENvbm5lY3RpbmdPcGVuQ2xvc2luZ0Nsb3NlZABsAAAADAAAAAQAAABtAAAAbgAAAD4AAAAAAAAAAAAAAAEAAABvAAAAYSBEaXNwbGF5IGltcGxlbWVudGF0aW9uIHJldHVybmVkIGFuIGVycm9yIHVuZXhwZWN0ZWRseQBDExAASwAAAIkLAAAOAAAAaW52YWxpZCBlbnVtIHZhbHVlIHBhc3NlZEVycm9yAAAKBAcGsDYQALo2EAC+NhAAxTYQAHJlcXVlc3RlZCBidWZmZXIgc2l6ZSB0b28gbGFyZ2UAtxUQAGcAAACEAQAABQAAAGludmFsaWQgdGFnIHZhbHVlOiAwZGVsaW1pdGVkIGxlbmd0aCBleGNlZWRlZGJ1ZmZlciB1bmRlcmZsb3d1bmV4cGVjdGVkIGVuZCBncm91cCB0YWdpbnZhbGlkIHZhcmludGludmFsaWQgc3RyaW5nIHZhbHVlOiBkYXRhIGlzIG5vdCBVVEYtOCBlbmNvZGVkQ3VydmVNZXNzYWdlWHhFY2hvTWVzc2FnZW1zZ0N1cnZlTWVzc2FnZVl5VGV4dE1lc3NhZ2V0ZXh0TmFtZU1lc3NhZ2VuYW1lUnBtTWVzc2FnZXJwbVRyYW5zbGF0aW9uc1JlcGx5dHJhbnNsYXRpb25zVGVtcGVyYXR1cmVNZXNzYWdldGVtcGVyYXR1cmVFbmFibGVtZW50TWVzc2FnZWlzX2VuYWJsZWRUcmFuc2xhdGVkU3RyaW5ndHJhbnNsYXRlZHV1aWRpc19kZWZhdWx0SGVsbG9SZXNwb25zZXBocmFzZU9rb2tFbXB0eVZlcnNpb25TdHJpbmd2ZXJzaW9uVmVyc2lvbk1lc3NhZ2Vt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AgIBAQUEAgIDAwEHBAEBBxEKAwEJAQMBFgEHAQIBBQIKAQMBAwIBDwQCDAcHAQMBCAICAhYBBwECAQUCCQICAgMHAwQCAQUCEgoCAQYDAwEEAwIBAQECAwIDAwMMBAUDAwEEAgEGAQ4VBQ0BAwEXARACCQEDAQQHAgEDAQICBAIKBxYBAwEXAQoBBQIJAQMBBAcCBQMBBAIKAQMMDQEDATMBAwEGBBACGgEDARIDGAEJAQECBwMBBAYBAQEIBgoCAww6BB0lAgEBAQUBGAEBARcCBQEBAQcBCgIEIEgBJAQnASQBDwENJcYBAQUBAgABBAIHAQEBBAIpAQQCIQEEAgcBAQEEAg8BOQEEAkMCIAMaBlYCBgIAA1kHFgkYCRQMDQEDAQIMXgIKBgoGGgZZBysFRgofAQwEDAQBAyoCBQssBBoGCwM+AkEBHQILBgoGDgIuAgwUTQGmCDwDDwM+BSsCCwgrBQACBgImAgYCCAEBAQEBAQEfAjUBDwEOAgYBEwIDAQkBZQEMAhsBDQMiDiEPjAQAFgsVAAIABS0BAQUBAjgHAg4YCQcBBwEHAQcBBwEHAQcBBwF+IhoBWQzWGlABVgJnBSsBXgFWCTABAAM3CQAUuAjdFDwDCgY4CEYIDAZ0Cx4DTgELBCEBNwkOAgoCZxgcCgYCBgIGCQcBBwE8BH4CCgYADBcEMQQAAmomBwwFBRoBBQEBAQIBAgEAICoGMwETAQQEBQGHAgEBvgMGAgYCBgIDAwcBBwoFAgwBGgETAQIBDwIOInsFAwQtA1gBDQMBLy6CHQMxDxwEJAkeBSsFHgElBA4qngIKBiQEJAQoCDQLDAEPAQcBAgELAQ8BBwECAzQMAAkWCggYBgEqAQlFBgIBASwBAgMBAhcBSAgJMBMBAgUhAxsFGyY4BBQCMgECBQgBAwEdAgMECgcJB0AgJwQMCTYDHQIbBRoHBAwHUEk3Mw0zBy4ICgYmAx0IAtAfASoBAwICEAYICSEuCCoWGiYcFBcJTgQkCUQKAQIZBwoGNQESCCcJYAEUCxIBLz4HAQEBBAEPAQsGOwUKBgQBCAICAhYBBwECAQUBCgICAgMCAQYBBQcCBwMFCwoBAQIBASYBCgEBAgEBBAEKAQIIAh1cAQUeSAgKpjYCJiJFCwoGDRM6BgoGFBwbAg8EF7k8ZFMMCAIBAggBAgEeAQIC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aGltX2lkeDogMjE3LCByZXQ6IFVuaXQsIGlubmVyX3JldDogU29tZShVbml0KSB9LCBtdXRhYmxlOiB0cnVlIH0pIC0+IEV4dGVybnJlZjuxAUNsb3N1cmUoQ2xvc3VyZSB7IG93bmVkOiB0cnVlLCBmdW5jdGlvbjogRnVuY3Rpb24geyBhcmd1bWVudHM6IFtOYW1lZEV4dGVybnJlZigiTWVzc2FnZUV2ZW50IildLCBzaGltX2lkeDogMjE3LCByZXQ6IFVuaXQsIGlubmVyX3JldDogU29tZShVbml0KSB9LCBtdXRhYmxlOiB0cnVlIH0pIC0+IEV4dGVybnJlZjyTAUNsb3N1cmUoQ2xvc3VyZSB7IG93bmVkOiB0cnVlLCBmdW5jdGlvbjogRnVuY3Rpb24geyBhcmd1bWVudHM6IFtdLCBzaGltX2lkeDogMjE2LCByZXQ6IFVuaXQsIGlubmVyX3JldDogU29tZShVbml0KSB9LCBtdXRhYmxlOiB0cnVlIH0pIC0+IEV4dGVybnJlZj0QRjY0IC0+IEV4dGVybnJlZj4YUmVmKFN0cmluZykgLT4gRXh0ZXJucmVmPxBVNjQgLT4gRXh0ZXJucmVmuQcfX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcgA8CXByb2R1Y2VycwEMcHJvY2Vzc2VkLWJ5AgZ3YWxydXMGMC4yNy4zDHdhc20tYmluZGdlbgcwLjIuMTI5";

  function asciiToBinary(str) {
    if (typeof atob === 'function') {
      return atob(str)
    } else {
      return new Buffer(str, 'base64').toString('binary');
    }
  }

  function decode() {
    var binaryString =  asciiToBinary(encoded);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return (async function() {
      return new Response(bytes.buffer, {
          status: 200,
          statusText: 'OK',
          headers: {
              'Content-Type': 'application/wasm'
          }
      });
    })();
  }

  function init_embedded() {
      return __wbg_init(decode())
  }

  //import {init_usdpl, target_usdpl, init_embedded, call_backend} from "usdpl-front";
  //@ts-ignore
  //const Fan = {};
  // Must match the back-end port; kept distinct from upstream Fantastic.
  const USDPL_PORT = 44445;
  var FAN_CLIENT = undefined;
  // Utility
  function resolve(promise, setter) {
      (async function () {
          let data = await promise;
          if (data != null) {
              console.debug("Got resolved", data);
              setter(data);
          }
          else {
              console.warn("Resolve failed:", data);
          }
      })();
  }
  async function initBackend() {
      // init usdpl
      await init_embedded();
      FAN_CLIENT = new Fan(USDPL_PORT);
      console.log("FANTASTIC: USDPL started for framework: " + target_usdpl());
      //setReady(true);
  }
  var initPromise = undefined;
  /**
   * Initialise the backend exactly once so callers can await readiness.
   *
   * The panel used to fire its first RPCs from a fire-and-forget IIFE, so on a slow
   * start they hit `FAN_CLIENT === undefined` and the UI stayed on "Loading..." forever.
   */
  function ensureReady() {
      if (initPromise == null) {
          initPromise = initBackend();
      }
      return initPromise;
  }
  // Back-end functions
  async function setEnabled(value) {
      return (await FAN_CLIENT.set_enable(value)) ?? value;
      //return (await call_backend("set_enable", [value]))[0];
  }
  async function getEnabled() {
      return (await FAN_CLIENT.get_enable(true)) ?? false;
  }
  async function setInterpolate(value) {
      return (await FAN_CLIENT.set_interpolate(value)) ?? value;
      //return (await call_backend("set_interpolate", [value]))[0];
  }
  async function getInterpolate() {
      return (await FAN_CLIENT.get_interpolate(true)) ?? false;
      //return (await call_backend("get_interpolate", []))[0];
  }
  async function getVersion() {
      return (await FAN_CLIENT.version_str(true)) ?? "version";
      //return (await call_backend("version", []))[0];
  }
  async function getName() {
      return (await FAN_CLIENT.name(true)) ?? "broken";
      //return (await call_backend("name", []))[0];
  }
  async function getCurve() {
      var x_s = (await FAN_CLIENT.get_curve_x(true)) ?? [];
      var y_s = (await FAN_CLIENT.get_curve_y(true)) ?? [];
      let result = [];
      for (let i = 0; i < x_s.length && i < y_s.length; i++) {
          result.push({
              x: x_s[i],
              y: y_s[i],
          });
      }
      return result;
  }
  async function getFanRpm(callback) {
      return (await FAN_CLIENT.get_fan_rpm(true, callback));
  }
  const DEFAULT_SAFETY_FLOOR = [[80, 0.4], [90, 0.6], [95, 1]];
  async function setCurve(points) {
      const payload = JSON.stringify(points.map((p) => [p.x, p.y]));
      return (await FAN_CLIENT.set_curve(payload)) ?? false;
  }
  /** Follow a SteamOS profile algorithm directly; null returns to the point curve. */
  async function setSystemProfile(name) {
      return (await FAN_CLIENT.set_system_profile(name ?? "")) ?? false;
  }
  /** Read the read-only SteamOS/vendor curves shipped under /usr/share. */
  async function getSystemCurve() {
      const empty = { profiles: [], active: null, fanMin: 0, fanMax: 0, floor: DEFAULT_SAFETY_FLOOR };
      const raw = await FAN_CLIENT.get_system_curve(true);
      if (!raw) {
          return empty;
      }
      try {
          const parsed = JSON.parse(raw);
          const profiles = (parsed.profiles ?? []).map((profile) => ({
              name: profile.name ?? "",
              points: (profile.points ?? []).map((pair) => ({ x: pair[0], y: pair[1] })),
              rpm: profile.rpm ?? [],
              source: profile.source ?? "none",
              fan_min: profile.fan_min ?? 0,
              fan_max: profile.fan_max ?? 0,
          }));
          return {
              profiles,
              active: parsed.active ?? null,
              fanMin: parsed.fan_min ?? 0,
              fanMax: parsed.fan_max ?? 0,
              floor: parsed.floor ?? DEFAULT_SAFETY_FLOOR,
          };
      }
      catch (e) {
          console.warn("[Fantastic] bad system curve payload", e);
          return empty;
      }
  }
  async function getTemperature(callback) {
      return (await FAN_CLIENT.get_temperature(true, callback));
  }
  /** Fixed fan ratio (0..1); null turns the override off. */
  async function setFixedSpeed(ratio) {
      return (await FAN_CLIENT.set_fixed_speed(ratio == null ? "" : String(ratio))) ?? false;
  }
  async function getFixedSpeed() {
      const raw = await FAN_CLIENT.get_fixed_speed(true);
      if (raw == null || raw === "") {
          return null;
      }
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : null;
  }

  const STORAGE_KEY = "fantasticplus.lang";
  function detect() {
      try {
          const saved = window.localStorage.getItem(STORAGE_KEY);
          if (saved === "zh" || saved === "en") {
              return saved;
          }
      }
      catch (e) {
          // localStorage may be unavailable; fall through to the browser language
      }
      try {
          if ((navigator.language || "").toLowerCase().startsWith("zh")) {
              return "zh";
          }
      }
      catch (e) {
          // ignore
      }
      return "en";
  }
  let current = detect();
  const listeners = new Set();
  function getLang() {
      return current;
  }
  function setLang(lang) {
      current = lang;
      try {
          window.localStorage.setItem(STORAGE_KEY, lang);
      }
      catch (e) {
          // not fatal, just not persisted
      }
      listeners.forEach((fn) => fn());
  }
  function useLang() {
      const [lang, setLocal] = React.useState(current);
      React.useEffect(() => {
          const listener = () => setLocal(getLang());
          listeners.add(listener);
          return () => {
              listeners.delete(listener);
          };
      }, []);
      return lang;
  }
  const DICT = {
      loadingTitle: { zh: "加载中…", en: "Loading..." },
      loadingBody: {
          zh: "如果一直停在这里，说明出了问题 :(",
          en: "If you can read this, something probably went wrong :(",
      },
      fanSpeed: { zh: "当前风扇转速", en: "Current Fan Speed" },
      temperature: { zh: "当前温度", en: "Current Temperature" },
      customCurve: { zh: "自定义风扇曲线", en: "Custom Fan Curve" },
      customCurveDesc: { zh: "覆盖 SteamOS 风扇曲线", en: "Overrides SteamOS fan curve" },
      fan: { zh: "风扇", en: "Fan" },
      editCurve: { zh: "✎ 编辑曲线", en: "✎ Edit curve" },
      fanStopped: { zh: "已停转", en: "stopped" },
      modelLabel: { zh: "模式", en: "Mode" },
      modeSystem: { zh: "系统默认", en: "System" },
      modeManual: { zh: "手动", en: "Manual" },
      modeFifty: { zh: "50%", en: "50%" },
      modeSeventyFive: { zh: "75%", en: "75%" },
      modeFull: { zh: "100%", en: "100%" },
      blankSlotName: { zh: "空白", en: "Blank" },
      migratedSlotName: { zh: "迁移的曲线", en: "Migrated curve" },
      fixedSpeedOff: { zh: "关闭", en: "Off" },
      quickSwitch: { zh: "快速切换", en: "Quick switch" },
      interpolate: { zh: "线性插值", en: "Linear Interpolation" },
      interpolateDesc: { zh: "用直线连接相邻点", en: "Pretends a straight line connects points" },
      modalTitle: { zh: "风扇曲线", en: "Fan Curve" },
      close: { zh: "关闭", en: "Close" },
      language: { zh: "语言 / Language", en: "Language / 语言" },
      readOnly: { zh: "只读参考", en: "read-only" },
      refOnlyNotice: {
          zh: "系统算法曲线 · 仅供参考，无法修改",
          en: "System algorithm curve · reference only",
      },
      refOnlyBody: {
          zh: "这是 SteamOS 内置算法的采样结果，插件不读取这些点，因此不能编辑或保存；红色禁区只对自定义曲线生效。想自己定义，请用「配置槽位」里的自定义曲线。",
          en: "Sampled from the built-in SteamOS algorithm: the plugin never reads these points, so they cannot be edited or saved. The red dead zone only applies to custom curves. Use a custom profile instead.",
      },
      tapAgainHint: {
          zh: "再次点击已选中的项可查看 / 编辑",
          en: "Tap the selected item again to view / edit",
      },
      needTwoPoints: { zh: "至少需要 2 个点才会生效", en: "at least 2 points required" },
      // No emoji on purpose: the Deck's UI font may not carry U+26A0 and would show a
      // hollow box instead.
      activeCoolingWarning: {
          zh: "警告：本设备为主动散热设备，起转温度过高或曲线设置过低会有零件损坏风险",
          en: "Warning: active cooling required; a too-high start temperature or a too-low curve risks component damage",
      },
      slotNameLabel: { zh: "槽位名称", en: "Profile name" },
      nameTaken: { zh: "名称已被占用，已改为", en: "name already used, renamed to" },
      canvasHint: {
          zh: "点击空白添加 · 点击节点删除",
          en: "Tap empty area to add · tap a point to delete",
      },
      deadZoneLabel: { zh: "安全下限", en: "safety floor" },
      fixedFloor: { zh: "固定速度已被下限提升到", en: "fixed speed raised to" },
      curveInactive: { zh: "曲线未生效", en: "curve inactive" },
      curveInactiveBody: {
          zh: "少于 2 个点，风扇已交还 SteamOS",
          en: "fewer than 2 points, SteamOS has the fan",
      },
      snapToFloor: {
          zh: "禁区内的点已贴到安全下限",
          en: "Point moved onto the safety floor",
      },
      curveClamped: { zh: "虚线 = 已贴下限", en: "dashed = held by the floor" },
      points: { zh: "点", en: "pts" },
      nowLabel: { zh: "当前", en: "Now" },
      outLabel: { zh: "输出", en: "Out" },
      slotsTitle: { zh: "配置槽位", en: "Profiles" },
      slotsButton: { zh: "配置槽位", en: "Profiles" },
      editLabel: { zh: "编辑", en: "Edit" },
      deleteLabel: { zh: "删除", en: "Delete" },
      restoreLabel: { zh: "还原", en: "Restore" },
      addSlot: { zh: "＋ 新建槽位", en: "+ New profile" },
      backLabel: { zh: "返回", en: "Back" },
      saveLabel: { zh: "保存", en: "Save" },
      doneLabel: { zh: "完成", en: "Done" },
      applyHint: {
          zh: "点击槽位名称即可应用该曲线",
          en: "Tap a profile name to apply it",
      },
      sysSlotName: { zh: "系统曲线 SteamOS", en: "System (SteamOS)" },
      newSlotName: { zh: "自定义", en: "Custom" },
      noSystemCurve: { zh: "未找到系统曲线", en: "No system curve found" },
      activeLabel: { zh: "使用中", en: "active" },
      referenceOnly: { zh: "系统算法 · 只读，不可修改", en: "system algorithm, read-only" },
      profileModeHint: {
          zh: "选中系统槽位将直接按 SteamOS 二次函数控速；选中自定义槽位才用曲线。",
          en: "Selecting a system profile uses the SteamOS quadratic directly; custom slots use the curve.",
      },
  };
  function t(lang, key) {
      return DICT[key][lang];
  }
  /** Build the one-line summary drawn inside the canvas. */
  function fmtSummary(lang, count, temperatureRatio, outputRatio) {
      let text = count + " " + DICT.points[lang];
      if (temperatureRatio != null && isFinite(temperatureRatio)) {
          text += " · " + DICT.nowLabel[lang] + " " + (temperatureRatio * 100).toFixed(1) + "\u00b0C";
      }
      if (outputRatio != null && isFinite(outputRatio)) {
          text += " · " + DICT.outLabel[lang] + " " + (outputRatio * 100).toFixed(0) + "%";
      }
      return text;
  }

  const POINT_RADIUS = 6;
  const HIT_RADIUS = 14;
  /** Room for the axis labels around the plot area. */
  const PADDING = { left: 30, right: 10, top: 10, bottom: 18 };
  /**
   * The safety floor steps from 0 % to its first entry at once (below 80 C a user
   * curve may stop the fan, at 80 C it may not). Sampling cannot represent that
   * step, so every break is duplicated with an epsilon offset; without it the
   * drawn limit turns into a diagonal that crosses the curve.
   */
  const FLOOR_EPS = 1e-4;
  /** Extra samples between two breakpoints of the sampled curve. */
  const SAMPLE_STEPS = 8;
  const COL_BG = "#1a1f2c";
  const COL_GRID = "#093455";
  const COL_GRID_MAJOR = "#12507f";
  // Dim frame: the curve has to stay visible when it runs along 0 % or 100 %.
  const COL_FRAME = "#12507f";
  const COL_LINE = "#1a9fff";
  const COL_TEXT = "#8ea3b0";
  const COL_TEMP = "#ffb300";
  const COL_FLOOR_LINE = "rgba(255, 92, 92, 0.55)";
  const COL_FLOOR_HATCH = "rgba(150, 165, 185, 0.16)";
  const COL_FLOOR_LABEL = "rgba(255, 130, 130, 0.9)";
  const COL_OVERLAY_BG = "rgba(8, 14, 24, 0.78)";
  const COL_OVERLAY_FG = "#cfe6ff";
  const COL_OVERLAY_DIM = "#7f94a6";
  const COL_OVERLAY_WARN = "#ff9d9d";
  /**
   * Everything inside the canvas is drawn in fixed CSS pixels, so on a 1080p display
   * a canvas that is 1.6x wider would keep 10 px labels and look emptier, not bigger.
   * All sizes are multiplied by this factor instead.
   */
  function drawScale(width) {
      return Math.min(1.8, Math.max(0.85, width / 840));
  }
  /** Plot area inside the canvas; the labels live in the padding around it. */
  function plotRect(width, height) {
      const s = drawScale(width);
      const left = Math.round(PADDING.left * s);
      const right = Math.round(PADDING.right * s);
      const top = Math.round(PADDING.top * s);
      const bottom = Math.round(PADDING.bottom * s);
      return {
          x: left,
          y: top,
          w: Math.max(1, width - left - right),
          h: Math.max(1, height - top - bottom),
      };
  }
  /**
   * Evaluate the curve exactly like the back-end does (endpoint hold, optional linear
   * interpolation). Used only to preview the output ratio inside the editor.
   */
  function evalCurve(curve, interpolate, temperatureRatio) {
      if (curve.length === 0) {
          return undefined;
      }
      let index = null;
      for (let i = curve.length - 1; i >= 0; i--) {
          if (curve[i].x < temperatureRatio) {
              index = i;
              break;
          }
      }
      if (!interpolate) {
          return index == null ? curve[0].y : curve[index].y;
      }
      if (index == null) {
          return curve[0].y;
      }
      if (index + 1 >= curve.length) {
          return curve[index].y;
      }
      const lower = curve[index];
      const upper = curve[index + 1];
      const dx = upper.x - lower.x;
      if (Math.abs(dx) < 1e-9) {
          return lower.y;
      }
      return lower.y + (upper.y - lower.y) * ((temperatureRatio - lower.x) / dx);
  }
  /** Minimum allowed fan ratio at a given temperature, 0 when below the first point. */
  function floorAt(temperatureC, floor) {
      if (floor.length === 0) {
          return 0;
      }
      if (temperatureC <= floor[0][0]) {
          return 0;
      }
      for (let i = 1; i < floor.length; i++) {
          const [t0, r0] = floor[i - 1];
          const [t1, r1] = floor[i];
          if (temperatureC <= t1) {
              const span = t1 - t0;
              return span > 0 ? r0 + ((temperatureC - t0) / span) * (r1 - r0) : r1;
          }
      }
      return floor[floor.length - 1][1];
  }
  /** Round a ratio up to the next whole percent, never down past the limit. */
  function ceilPercent(ratio) {
      return Math.ceil(ratio * 100 - 1e-9) / 100;
  }
  /** The lowest legal ratio for this point: the curve may never sit below the floor. */
  function snapToFloor(point, floor) {
      const limit = floorAt(point.x * 100, floor);
      return point.y < limit ? { x: point.x, y: ceilPercent(limit) } : point;
  }
  /**
   * Sort the points and pin the leftmost one, which is the fan start temperature.
   *
   * It becomes 0 % wherever the floor allows it, and the limit itself above that, so
   * the start of the curve can never sit inside the dead zone. A single point must
   * survive here, otherwise adding the first point to an empty curve would be
   * discarded and the curve could never be started; a curve with fewer than two
   * points is rejected by the back-end, not here.
   */
  function normalizeCurve(curve, floor = DEFAULT_SAFETY_FLOOR) {
      const sorted = curve.slice().sort((a, b) => a.x - b.x);
      // Two points at the same temperature make the interpolation divide by ~zero; the
      // back-end merges them (newest wins), so the editor has to do the same or the
      // canvas shows two dots on top of each other after integer rounding.
      const merged = [];
      for (const point of sorted) {
          const last = merged[merged.length - 1];
          if (last && Math.abs(point.x - last.x) < 1e-4) {
              merged[merged.length - 1] = point;
          }
          else {
              merged.push(point);
          }
      }
      if (merged.length >= 1) {
          merged[0] = { x: merged[0].x, y: ceilPercent(floorAt(merged[0].x * 100, floor)) };
      }
      return merged;
  }
  /** The safety limit as a polyline, including the vertical step at its first entry. */
  function floorPolyline(floor) {
      if (floor.length === 0) {
          return [];
      }
      const points = [{ x: floor[0][0] / 100, y: 0 }];
      for (const [temperature, ratio] of floor) {
          points.push({ x: temperature / 100, y: ratio });
      }
      points.push({ x: 1, y: floor[floor.length - 1][1] });
      return points;
  }
  /**
   * The curve exactly as the user authored it: leading hold, segments (or stairs in
   * step mode) and trailing hold, without any clamping.
   */
  function authoredPolyline(curve, interpolate) {
      if (curve.length === 0) {
          return [
              { x: 0, y: 0 },
              { x: 1, y: 0 },
          ];
      }
      const points = [{ x: 0, y: curve[0].y }];
      for (let i = 0; i < curve.length; i++) {
          points.push({ x: curve[i].x, y: curve[i].y });
          if (!interpolate && i + 1 < curve.length) {
              // Step mode holds the left point until the next one.
              points.push({ x: curve[i + 1].x, y: curve[i].y });
          }
      }
      points.push({ x: 1, y: curve[curve.length - 1].y });
      return points;
  }
  /** Value of a polyline at x (no extrapolation; the ends are held). */
  function polylineAt(poly, x) {
      if (poly.length === 0) {
          return 0;
      }
      if (x <= poly[0].x) {
          return poly[0].y;
      }
      for (let i = 1; i < poly.length; i++) {
          const from = poly[i - 1];
          const to = poly[i];
          if (x <= to.x) {
              const span = to.x - from.x;
              if (Math.abs(span) < 1e-12) {
                  return to.y;
              }
              return from.y + (to.y - from.y) * ((x - from.x) / span);
          }
      }
      return poly[poly.length - 1].y;
  }
  /** Samples of "curve" against "floor", one pair per breakpoint plus sub-steps. */
  function curveSamples(curve, floor, floorPoly) {
      const breaks = [0, 1];
      const add = (x) => {
          if (isFinite(x) && x >= 0 && x <= 1) {
              breaks.push(x);
          }
      };
      for (const point of curve) {
          add(point.x);
      }
      for (const point of floorPoly) {
          add(point.x);
          add(point.x + FLOOR_EPS);
      }
      breaks.sort((left, right) => left - right);
      const marks = [];
      for (const x of breaks) {
          if (marks.length === 0 || x - marks[marks.length - 1] > 1e-9) {
              marks.push(x);
          }
      }
      const samples = [];
      const sample = (x) => {
          samples.push({ x, curve: polylineAt(curve, x), floor: floorAt(x * 100, floor) });
      };
      for (let i = 0; i < marks.length; i++) {
          sample(marks[i]);
          if (i + 1 < marks.length) {
              const span = marks[i + 1] - marks[i];
              if (span > 1e-6) {
                  for (let step = 1; step < SAMPLE_STEPS; step++) {
                      sample(marks[i] + (span * step) / SAMPLE_STEPS);
                  }
              }
          }
      }
      return samples;
  }
  /**
   * What the fan is actually told to do: the authored curve, but never below the
   * safety floor. Where the floor wins, the curve runs along the dead zone edge and
   * is marked as limited so it can be drawn differently.
   */
  function effectivePolyline(curve, interpolate, floor) {
      const authored = authoredPolyline(curve, interpolate);
      if (floor.length === 0) {
          return authored.map((point) => ({ x: point.x, y: point.y, limited: false }));
      }
      return curveSamples(authored, floor, floorPolyline(floor)).map((sample) => ({
          x: sample.x,
          y: Math.max(sample.curve, sample.floor),
          limited: sample.floor > sample.curve + 1e-6,
      }));
  }
  const sx = (rect, x) => rect.x + x * rect.w;
  const sy = (rect, y) => rect.y + (1 - y) * rect.h;
  function drawAxes(ctx, rect, s) {
      // Vertical lines every 10 degrees C, horizontal lines every 10 %.
      ctx.lineWidth = 1;
      for (let i = 1; i < 10; i++) {
          ctx.strokeStyle = i % 2 === 0 ? COL_GRID_MAJOR : COL_GRID;
          const gx = sx(rect, i / 10);
          ctx.beginPath();
          ctx.moveTo(gx, rect.y);
          ctx.lineTo(gx, rect.y + rect.h);
          ctx.stroke();
          const gy = sy(rect, i / 10);
          ctx.beginPath();
          ctx.moveTo(rect.x, gy);
          ctx.lineTo(rect.x + rect.w, gy);
          ctx.stroke();
      }
      // Frame on the 0 / 100 boundaries so the curve never sits on the canvas edge.
      ctx.strokeStyle = COL_FRAME;
      ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.w - 1, rect.h - 1);
      ctx.fillStyle = COL_TEXT;
      ctx.font = Math.round(10 * s) + "px sans-serif";
      ctx.textBaseline = "alphabetic";
      for (let i = 0; i <= 10; i++) {
          const label = String(i * 10) + (i === 10 ? "\u00b0C" : "");
          ctx.textAlign = i === 0 ? "left" : i === 10 ? "right" : "center";
          ctx.fillText(label, sx(rect, i / 10), rect.y + rect.h + Math.round(13 * s));
      }
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (const pct of [20, 40, 60, 80, 100]) {
          ctx.fillText(String(pct) + "%", rect.x - 4, sy(rect, pct / 100));
      }
      ctx.textBaseline = "alphabetic";
  }
  /** Shade the region a curve is not allowed to enter (high temperature, low speed). */
  function drawFloorZone(ctx, rect, poly, lang, s) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(sx(rect, poly[0].x), rect.y + rect.h);
      for (const point of poly) {
          ctx.lineTo(sx(rect, point.x), sy(rect, point.y));
      }
      ctx.lineTo(rect.x + rect.w, rect.y + rect.h);
      ctx.closePath();
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = COL_FLOOR_HATCH;
      ctx.lineWidth = 1;
      for (let offset = -rect.h; offset < rect.w + rect.h; offset += Math.round(9 * s)) {
          ctx.beginPath();
          ctx.moveTo(rect.x + offset, rect.y + rect.h);
          ctx.lineTo(rect.x + offset + rect.h, rect.y);
          ctx.stroke();
      }
      ctx.restore();
      // Thin edge: the curve itself is drawn on top and stays the primary line.
      ctx.beginPath();
      ctx.moveTo(sx(rect, poly[0].x), sy(rect, poly[0].y));
      for (const point of poly) {
          ctx.lineTo(sx(rect, point.x), sy(rect, point.y));
      }
      ctx.strokeStyle = COL_FLOOR_LINE;
      ctx.lineWidth = Math.max(1, 1.5 * s);
      ctx.stroke();
      ctx.fillStyle = COL_FLOOR_LABEL;
      ctx.font = Math.round(10 * s) + "px sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(t(lang, "deadZoneLabel"), rect.x + rect.w - Math.round(8 * s), rect.y + rect.h - Math.round(10 * s));
      ctx.restore();
  }
  /** Solid where the curve is free, dashed where the floor is holding it down. */
  function drawCurveLine(ctx, rect, points, s) {
      ctx.strokeStyle = COL_LINE;
      ctx.lineWidth = 2 * s;
      ctx.lineJoin = "round";
      let index = 0;
      while (index < points.length - 1) {
          const limited = points[index].limited;
          let end = index + 1;
          while (end < points.length - 1 && points[end].limited === limited) {
              end++;
          }
          // Include the first point of the next group so the two strokes meet exactly.
          const stop = Math.min(end + 1, points.length);
          ctx.setLineDash(limited ? [6 * s, 4 * s] : []);
          ctx.beginPath();
          ctx.moveTo(sx(rect, points[index].x), sy(rect, points[index].y));
          for (let i = index + 1; i < stop; i++) {
              ctx.lineTo(sx(rect, points[i].x), sy(rect, points[i].y));
          }
          ctx.stroke();
          index = end;
      }
      ctx.setLineDash([]);
  }
  function drawOverlay(ctx, rect, curve, interpolate, lang, temperatureRatio, floor, clamped, readOnly, notice, s) {
      const validRatio = temperatureRatio != null && isFinite(temperatureRatio) ? temperatureRatio : undefined;
      const authored = validRatio == null ? undefined : evalCurve(curve, interpolate, validRatio);
      const floorRatio = validRatio == null ? 0 : floorAt(validRatio * 100, floor);
      const output = authored == null ? undefined : Math.max(authored, floorRatio);
      // The cooling notice sits on the first line of the info block, so it reads before
      // anything else and never covers the plot.
      const lines = [];
      if (!readOnly) {
          lines.push({ text: t(lang, "activeCoolingWarning"), color: COL_OVERLAY_WARN });
      }
      lines.push({ text: fmtSummary(lang, curve.length, validRatio, output), color: COL_OVERLAY_FG });
      if (curve.length === 1) {
          lines.push({ text: t(lang, "needTwoPoints"), color: COL_OVERLAY_WARN });
      }
      if (authored != null && floorRatio > authored + 1e-6) {
          lines.push({
              text: t(lang, "deadZoneLabel") + " " + (floorRatio * 100).toFixed(0) + "%",
              color: COL_OVERLAY_WARN,
          });
      }
      if (clamped) {
          lines.push({ text: t(lang, "curveClamped"), color: COL_OVERLAY_DIM });
      }
      const chunks = [];
      let current = "";
      for (let i = 0; i < curve.length; i++) {
          const text = i + 1 + ":" + (curve[i].x * 100).toFixed(0) + "\u00b0C/" + (curve[i].y * 100).toFixed(0) + "%";
          if (current === "") {
              current = text;
          }
          else if ((current + "  " + text).length > 46) {
              chunks.push(current);
              current = text;
          }
          else {
              current = current + "  " + text;
          }
      }
      if (current !== "") {
          chunks.push(current);
      }
      for (const chunk of chunks.slice(0, 4)) {
          lines.push({ text: chunk, color: COL_OVERLAY_FG });
      }
      if (notice) {
          lines.push({ text: notice, color: COL_OVERLAY_WARN });
      }
      else if (readOnly) {
          // A reference curve is sampled by the back-end; the points are not stored.
          lines.push({ text: t(lang, "refOnlyNotice"), color: COL_OVERLAY_WARN });
      }
      else {
          lines.push({ text: t(lang, "canvasHint"), color: COL_OVERLAY_DIM });
      }
      const lineHeight = Math.round(14 * s);
      const pad = Math.round(4 * s);
      ctx.font = Math.round(11 * s) + "px sans-serif";
      let boxW = 0;
      for (const line of lines) {
          boxW = Math.max(boxW, ctx.measureText(line.text).width);
      }
      boxW = Math.min(boxW + Math.round(12 * s), rect.w - 16);
      const boxH = lines.length * lineHeight + Math.round(8 * s);
      ctx.fillStyle = COL_OVERLAY_BG;
      ctx.fillRect(rect.x + pad, rect.y + pad, boxW, boxH);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      for (let i = 0; i < lines.length; i++) {
          ctx.fillStyle = lines[i].color;
          ctx.fillText(lines[i].text, rect.x + Math.round(10 * s), rect.y + pad + Math.round(14 * s) + i * lineHeight);
      }
  }
  /**
   * Draw a fan curve into a canvas of the given *CSS* size.
   *
   * Endpoint semantics match the back-end: below the first point and above the last
   * point the value is held, and step mode holds the left-hand point. The drawn line
   * is the *effective* output, so it can never enter the dead zone: wherever the
   * authored curve would dip below the safety floor it runs along the edge instead
   * and is drawn dashed.
   */
  function drawCurve(ctx, width, height, options) {
      const { curve, interpolate, lang, temperatureRatio, floor, notice } = options;
      const readOnly = !!options.readOnly;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = COL_BG;
      ctx.fillRect(0, 0, width, height);
      const rect = plotRect(width, height);
      const s = drawScale(width);
      drawAxes(ctx, rect, s);
      const floorPoly = floorPolyline(floor);
      if (floorPoly.length > 0) {
          drawFloorZone(ctx, rect, floorPoly, lang, s);
      }
      if (temperatureRatio != null && isFinite(temperatureRatio)) {
          const tx = sx(rect, Math.min(Math.max(temperatureRatio, 0), 1));
          ctx.save();
          ctx.strokeStyle = COL_TEMP;
          ctx.lineWidth = Math.max(1, s);
          ctx.setLineDash([5 * s, 4 * s]);
          ctx.beginPath();
          ctx.moveTo(tx, rect.y);
          ctx.lineTo(tx, rect.y + rect.h);
          ctx.stroke();
          ctx.restore();
      }
      // A system profile is evaluated by the back-end on its own, without the safety
      // floor, so the reference view must not clamp it either: the hatched area is
      // shown as context for custom curves only.
      const limit = readOnly ? [] : floor;
      const points = effectivePolyline(curve, interpolate, limit);
      drawCurveLine(ctx, rect, points, s);
      for (const point of curve) {
          // A point that is below the floor is drawn where it actually takes effect.
          const y = Math.max(point.y, floorAt(point.x * 100, limit));
          ctx.beginPath();
          ctx.arc(sx(rect, point.x), sy(rect, y), POINT_RADIUS * s, 0, Math.PI * 2);
          if (readOnly) {
              // Sampled values of a system algorithm: drawn hollow so they do not look
              // like points the user could grab or delete.
              ctx.fillStyle = COL_BG;
              ctx.fill();
              ctx.strokeStyle = COL_LINE;
              ctx.lineWidth = 2 * s;
              ctx.stroke();
          }
          else {
              ctx.fillStyle = COL_LINE;
              ctx.fill();
          }
      }
      drawOverlay(ctx, rect, curve, interpolate, lang, temperatureRatio, limit, points.some((point) => point.limited), readOnly, notice, s);
  }
  /**
   * Large curve editor.
   *
   * Everything except the close button is drawn inside the canvas, and the canvas
   * height depends only on its width, so adding points never shifts the layout.
   */
  const CurveEditor = ({ initialCurve, interpolate, lang, temperatureRatio, floor, readOnly, draft, onChange, onAdd, onRemove }) => {
      const safeFloor = floor ?? DEFAULT_SAFETY_FLOOR;
      const wrapRef = React.useRef(null);
      const canvasRef = React.useRef(null);
      const [dims, setDims] = React.useState({ w: 0, h: 0 });
      const [curve, setCurve] = React.useState(() => 
      // A reference curve belongs to SteamOS, so it is shown exactly as sampled.
      readOnly ? initialCurve : initialCurve.map((point) => snapToFloor(point, safeFloor)));
      const initialRef = React.useRef(initialCurve);
      const [busy, setBusy] = React.useState(false);
      const [notice, setNotice] = React.useState(null);
      const noticeTimer = React.useRef(undefined);
      React.useLayoutEffect(() => {
          const el = wrapRef.current;
          if (!el) {
              return;
          }
          const update = () => {
              const w = el.clientWidth;
              if (w > 0) {
                  // The 360 cap keeps the editor compact on the Deck, but on a 1080p display
                  // it would flatten the plot, so the cap follows the window height.
                  const tallest = Math.min(560, Math.round((window.innerHeight || 800) * 0.45));
                  const h = Math.round(Math.min(Math.max(w * 0.5, 180), Math.max(360, tallest)));
                  setDims((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
              }
          };
          update();
          const observer = new ResizeObserver(update);
          observer.observe(el);
          return () => observer.disconnect();
      }, []);
      React.useEffect(() => {
          return () => {
              if (noticeTimer.current != null) {
                  window.clearTimeout(noticeTimer.current);
              }
          };
      }, []);
      // The editor stays mounted while the parent swaps profiles, so follow the prop
      // instead of keeping the curve of the previously edited one.
      React.useEffect(() => {
          if (initialRef.current !== initialCurve) {
              initialRef.current = initialCurve;
              // Saved curves may still hold points below the floor; show (and later save)
              // them where they actually take effect, exactly like the back-end does.
              setCurve(readOnly ? initialCurve : initialCurve.map((point) => snapToFloor(point, safeFloor)));
          }
      }, [initialCurve, safeFloor, readOnly]);
      React.useEffect(() => {
          const canvas = canvasRef.current;
          if (!canvas || dims.w === 0) {
              return;
          }
          const dpr = window.devicePixelRatio || 1;
          canvas.width = Math.round(dims.w * dpr);
          canvas.height = Math.round(dims.h * dpr);
          const ctx = canvas.getContext("2d");
          if (!ctx) {
              return;
          }
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          drawCurve(ctx, dims.w, dims.h, {
              curve,
              interpolate,
              lang,
              temperatureRatio,
              floor: safeFloor,
              readOnly,
              notice,
          });
      }, [curve, dims, interpolate, lang, temperatureRatio, safeFloor, readOnly, notice]);
      const flash = (text) => {
          setNotice(text);
          if (noticeTimer.current != null) {
              window.clearTimeout(noticeTimer.current);
          }
          noticeTimer.current = window.setTimeout(() => setNotice(null), 1600);
      };
      const onClick = async (e) => {
          if (busy || readOnly) {
              return;
          }
          const bounds = e.currentTarget.getBoundingClientRect();
          const rect = plotRect(bounds.width, bounds.height);
          const clickX = e.nativeEvent.clientX - bounds.left - rect.x;
          const clickY = e.nativeEvent.clientY - bounds.top - rect.y;
          setBusy(true);
          try {
              for (let i = 0; i < curve.length; i++) {
                  // Points are shown at their effective height, so they are hit there too.
                  const y = Math.max(curve[i].y, floorAt(curve[i].x * 100, safeFloor));
                  const dx = curve[i].x * rect.w - clickX;
                  const dy = (1 - y) * rect.h - clickY;
                  const hit = HIT_RADIUS * drawScale(bounds.width);
                  if (dx * dx + dy * dy <= hit * hit) {
                      const next = draft
                          ? normalizeCurve(curve.filter((_, index) => index !== i), safeFloor)
                          : await onRemove(i);
                      if (next) {
                          setCurve(next);
                          onChange?.(next);
                      }
                      return;
                  }
              }
              const clamp = (v) => Math.min(1, Math.max(0, v));
              // Whole degrees and whole percent: a plotted point then always matches the
              // numbers in the read-out, which used to disagree by up to 0.5.
              const tapped = {
                  x: Math.round(clamp(clickX / rect.w) * 100) / 100,
                  y: Math.round(clamp(1 - clickY / rect.h) * 100) / 100,
              };
              // Nothing may be placed in the dead zone: a tap below the floor is pulled up
              // onto the edge instead of being refused.
              const point = snapToFloor(tapped, safeFloor);
              if (point.y !== tapped.y) {
                  flash(t(lang, "snapToFloor"));
              }
              const next = draft
                  ? normalizeCurve(curve.concat([point]), safeFloor)
                  : await onAdd(point);
              if (next) {
                  setCurve(next);
                  onChange?.(next);
              }
          }
          catch (err) {
              console.warn("[Fantastic] curve edit failed", err);
          }
          finally {
              setBusy(false);
          }
      };
      return (window.SP_REACT.createElement("div", { ref: wrapRef, style: { width: "100%" } },
          window.SP_REACT.createElement("canvas", { ref: canvasRef, onClick: onClick, style: {
                  width: "100%",
                  height: dims.h + "px",
                  display: "block",
                  border: "1px solid " + COL_LINE,
                  borderRadius: "4px",
                  backgroundColor: COL_BG,
                  cursor: readOnly ? "default" : "pointer",
              } })));
  };

  // v2: the default slot is now blank and the mode slider owns enable/fixed speed.
  const SLOTS_KEY = "fantasticplus.slots.v5";
  const ACTIVE_KEY = "fantasticplus.activeSlot.v5";
  function newId() {
      return "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  function loadSlots() {
      try {
          const raw = window.localStorage.getItem(SLOTS_KEY);
          if (!raw) {
              return null;
          }
          const parsed = JSON.parse(raw);
          if (!Array.isArray(parsed)) {
              return null;
          }
          return parsed.filter((slot) => slot && typeof slot.id === "string" && Array.isArray(slot.curve));
      }
      catch (e) {
          return null;
      }
  }
  function saveSlots(slots) {
      try {
          window.localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
      }
      catch (e) {
          console.warn("[Fantastic] could not persist profiles", e);
      }
  }
  /** Guarantee that exactly one always-present (locked) user slot exists. */
  function ensureLocked(slots) {
      if (slots.length === 0 || slots.some((slot) => slot.locked)) {
          return slots;
      }
      return slots.map((slot, index) => (index === 0 ? { ...slot, locked: true } : slot));
  }
  function loadActive() {
      try {
          return window.localStorage.getItem(ACTIVE_KEY);
      }
      catch (e) {
          return null;
      }
  }
  function saveActive(id) {
      try {
          if (id == null) {
              window.localStorage.removeItem(ACTIVE_KEY);
          }
          else {
              window.localStorage.setItem(ACTIVE_KEY, id);
          }
      }
      catch (e) {
          // not fatal
      }
  }

  /** Compact "30C->1500  60C->2371 ..." summary for a system profile. */
  function rpmSummary(profile) {
      const parts = [];
      for (const temperature of [50, 70, 90]) {
          const index = Math.round((temperature - 30) / 10);
          if (index >= 0 && index < profile.rpm.length) {
              parts.push(temperature + "\u00b0 " + Math.round(profile.rpm[index]));
          }
      }
      return parts.join("  ");
  }
  /**
   * Profile manager.
   *
   * System profiles are reference-only: they have no edit or delete action, and
   * selecting one switches the back-end to the SteamOS quadratic algorithm rather
   * than loading the sampled points. Custom slots are user curves stored locally.
   */
  const SlotsModal = ({ lang, initialCurve, interpolate, temperatureRatio, systemProfiles, activeProfile, floor, onApplyCurve, onApplySystem, onSaveSlotCurve, onClose, }) => {
      // System profiles are derived from the back-end on every open; only user slots
      // are persisted, so a stale or missing profile can never be "selected" silently.
      const [customSlots, setCustomSlots] = React.useState(() => ensureLocked((loadSlots() ?? []).filter((slot) => slot.builtin !== "system")));
      const systemSlots = systemProfiles.map((profile) => ({
          id: "system-" + profile.name,
          name: profile.name.charAt(0).toUpperCase() + profile.name.slice(1),
          builtin: "system",
          profile: profile.name,
          curve: profile.points.slice(),
          source: profile.source,
      }));
      const slots = systemSlots.concat(customSlots);
      const [activeId, setActiveId] = React.useState(loadActive());
      const [editingId, setEditingId] = React.useState(null);
      const [busy, setBusy] = React.useState(false);
      const [nameDraft, setNameDraft] = React.useState("");
      const [nameHint, setNameHint] = React.useState(null);
      /** The editor works on a copy: nothing is written until 保存 is pressed. */
      const [draftCurve, setDraftCurve] = React.useState([]);
      React.useEffect(() => {
          saveSlots(customSlots);
      }, [customSlots]);
      React.useEffect(() => {
          // Only user slots are persisted as "active"; a system profile is remembered by
          // the back-end, so storing its synthetic id here would desync the two models.
          const isCustom = customSlots.some((slot) => slot.id === activeId);
          saveActive(isCustom ? activeId : null);
      }, [activeId, customSlots]);
      const editing = slots.filter((slot) => slot.id === editingId)[0];
      // Opening a slot starts a fresh draft of its name and curve.
      React.useEffect(() => {
          const slot = customSlots.filter((s) => s.id === editingId)[0];
          setDraftCurve(slot ? slot.curve.slice() : []);
          setNameDraft(slot ? slot.name : "");
          setNameHint(null);
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [editingId]);
      /**
       * Names are compared case-insensitively and must stay unique across every slot,
       * including the read-only Jupiter/Galileo entries, so two profiles can never look
       * the same in the panel.
       */
      const uniqueName = (raw, exceptId) => {
          const cleaned = raw.replace(/\s+/g, " ").trim().slice(0, 24);
          const base = cleaned === "" ? t(lang, "newSlotName") : cleaned;
          const taken = new Set();
          for (const slot of customSlots) {
              if (slot.id !== exceptId) {
                  taken.add(slot.name.toLowerCase());
              }
          }
          for (const profile of systemProfiles) {
              taken.add(profile.name.toLowerCase());
          }
          if (!taken.has(base.toLowerCase())) {
              return base;
          }
          let index = 2;
          while (taken.has((base + " (" + index + ")").toLowerCase())) {
              index++;
          }
          return base + " (" + index + ")";
      };
      /** Resolve a colliding name early so the field shows what will be saved. */
      const resolveName = () => {
          if (!editing) {
              return;
          }
          const typed = nameDraft.trim();
          const finalName = uniqueName(nameDraft, editing.id);
          setNameDraft(finalName);
          setNameHint(finalName === typed ? null : t(lang, "nameTaken") + " " + finalName);
      };
      const saveEditing = async () => {
          if (!editing || busy) {
              return;
          }
          setBusy(true);
          try {
              const finalName = uniqueName(nameDraft, editing.id);
              const curve = normalizeCurve(draftCurve, floor);
              setCustomSlots((prev) => prev.map((s) => (s.id === editing.id ? { ...s, name: finalName, curve } : s)));
              // Only a slot that is already in charge reaches the running curve.
              await onSaveSlotCurve(editing.id, curve);
              setEditingId(null);
          }
          finally {
              setBusy(false);
          }
      };
      const isActive = (slot) => slot.builtin === "system" ? activeProfile === slot.profile : activeId === slot.id;
      const applySlot = async (slot) => {
          if (busy) {
              return;
          }
          setBusy(true);
          try {
              if (slot.builtin === "system" && slot.profile) {
                  await onApplySystem(slot.profile);
              }
              else {
                  await onApplyCurve(slot.curve, slot.id);
              }
              setActiveId(slot.id);
          }
          finally {
              setBusy(false);
          }
      };
      const deleteSlot = (slot) => {
          if (busy || slot.builtin === "system" || slot.locked) {
              return;
          }
          setCustomSlots((prev) => prev.filter((s) => s.id !== slot.id));
          if (activeId === slot.id) {
              setActiveId(null);
          }
      };
      const addSlot = () => {
          const base = customSlots.filter((s) => s.id === activeId)[0];
          const created = {
              id: newId(),
              // Counting alone used to collide after a delete, so it goes through the same
              // uniqueness check as a manual rename.
              name: uniqueName(t(lang, "newSlotName") + " " + (slots.filter((s) => s.builtin !== "system").length + 1), null),
              builtin: null,
              curve: (base ? base.curve : initialCurve).slice(),
          };
          setCustomSlots((prev) => [...prev, created]);
      };
      const cancelEditing = () => setEditingId(null);
      if (editing) {
          return (window.SP_REACT.createElement("div", null,
              window.SP_REACT.createElement(CurveEditor, { initialCurve: editing.curve, interpolate: interpolate, lang: lang, temperatureRatio: temperatureRatio, floor: floor, draft: true, onChange: (curve) => setDraftCurve(curve), onAdd: async () => draftCurve, onRemove: async () => draftCurve }),
              nameHint && (window.SP_REACT.createElement("div", { style: { fontSize: "11px", color: "#ff9d9d", marginTop: "4px" } }, nameHint)),
              window.SP_REACT.createElement(deckyFrontendLib.Focusable, { "flow-children": "row", style: { display: "flex", gap: "6px", marginTop: "6px", alignItems: "center" } },
                  window.SP_REACT.createElement("div", { style: { flex: "1 1 auto", minWidth: 0 } },
                      window.SP_REACT.createElement(deckyFrontendLib.TextField, { label: t(lang, "slotNameLabel"), value: nameDraft, onChange: (e) => setNameDraft(e.target.value), onBlur: resolveName })),
                  window.SP_REACT.createElement("div", { style: { flex: "0 0 auto", minWidth: "92px" } },
                      window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: cancelEditing }, t(lang, "backLabel"))),
                  window.SP_REACT.createElement("div", { style: { flex: "0 0 auto", minWidth: "92px" } },
                      window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: saveEditing }, t(lang, "saveLabel"))))));
      }
      return (window.SP_REACT.createElement("div", null,
          window.SP_REACT.createElement("div", { style: { fontSize: "12px", opacity: 0.75, marginBottom: "8px" } }, t(lang, "profileModeHint")),
          window.SP_REACT.createElement(deckyFrontendLib.Focusable, { "flow-children": "column", style: { display: "flex", flexWrap: "wrap", gap: "8px" } }, slots.map((slot) => (window.SP_REACT.createElement("div", { key: slot.id, style: { marginBottom: "8px", flex: slot.builtin === "system" ? "0 0 48%" : "1 1 100%" } },
              window.SP_REACT.createElement("div", { style: { display: "flex", gap: "6px", alignItems: "center" } },
                  window.SP_REACT.createElement("div", { style: { flex: "1 1 auto" } },
                      window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: () => applySlot(slot) }, (isActive(slot) ? "\u25cf " : "\u25cb ") + slot.name)),
                  slot.builtin !== "system" && (window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: () => setEditingId(slot.id) }, t(lang, "editLabel"))),
                  slot.builtin !== "system" && (window.SP_REACT.createElement("div", { style: { opacity: slot.locked ? 0.35 : 1 } },
                      window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: () => {
                              if (!slot.locked) {
                                  deleteSlot(slot);
                              }
                          } }, t(lang, "deleteLabel"))))),
              slot.builtin === "system" && (window.SP_REACT.createElement("div", { style: { fontSize: "11px", opacity: 0.65, padding: "2px 4px" } },
                  t(lang, "referenceOnly"),
                  (() => {
                      const profile = systemProfiles.filter((p) => p.name === slot.profile)[0];
                      return profile ? "  |  " + rpmSummary(profile) : "";
                  })())))))),
          window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: addSlot }, t(lang, "addSlot")),
          window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: onClose }, t(lang, "close"))));
  };

  var periodicHook = null;
  var usdplReady = false;
  var name = "";
  var version = "";
  var curve_backup = [];
  // Handle of the currently open curve modal, so it is closed before opening another.
  var curveModalHandle = undefined;
  /**
   * Modal sizes are CSS pixels, so a fixed 880x640 that fills the Deck screen shrinks
   * to 43% of a 1080p display. Scale from the window instead; the 880/640 floor keeps
   * the Deck layout exactly as it was.
   */
  function modalSize() {
      const width = typeof window === "undefined" ? 1280 : window.innerWidth || 1280;
      const height = typeof window === "undefined" ? 800 : window.innerHeight || 800;
      return {
          popupWidth: Math.round(Math.min(Math.max(width * 0.72, 880), 1600)),
          popupHeight: Math.round(Math.min(Math.max(height * 0.78, 640), 1080)),
      };
  }
  var tempCache = -1337;
  var setTemperature_display = (_) => { };
  // Timestamps of the last value received from each stream, used by the watchdog
  // below to notice a stream that died (e.g. the back-end restarted).
  var rpmStreamAt = 0;
  var tempStreamAt = 0;
  var fanRpmCache = -273;
  var setFanRpm_display = (_) => { };
  const Content = ({ serverAPI }) => {
      // const [result, setResult] = useState<number | undefined>();
      // const onClick = async () => {
      //   const result = await serverAPI.callPluginMethod<AddMethodArgs, number>(
      //     "add",
      //     {
      //       left: 2,
      //       right: 2,
      //     }
      //   );
      //   if (result.success) {
      //     setResult(result.result);
      //   }
      // };
      const [enabledGlobal, setEnableInternal] = React.useState(false);
      const [interpolGlobal, setInterpol] = React.useState(false);
      const [_serverApiGlobal, setServerApi] = React.useState(serverAPI);
      const [readyFlag, setReadyFlag] = React.useState(usdplReady);
      const lang = useLang();
      const [systemProfiles, setSystemProfiles] = React.useState([]);
      const [activeProfile, setActiveProfile] = React.useState(null);
      const [fixedSpeed, setFixedSpeed$1] = React.useState(null);
      const [fanBounds, setFanBounds] = React.useState({ min: 0, max: 0 });
      const [safetyFloor, setSafetyFloor] = React.useState(DEFAULT_SAFETY_FLOOR);
      const [customSlots, setCustomSlots] = React.useState(() => (loadSlots() ?? []).filter((slot) => slot.builtin !== "system"));
      const [activeSlotId, setActiveSlotId] = React.useState(loadActive());
      // Modals are created once and keep the values from that render, so live state is
      // mirrored here for the handlers they call later.
      const liveRef = React.useRef({ enabled: false, slot: null });
      const [curveGlobal, setCurve_internal] = React.useState(curve_backup);
      const setCurve$1 = (value) => {
          setCurve_internal(value);
          curve_backup = value;
      };
      liveRef.current = { enabled: enabledGlobal, slot: activeSlotId };
      const [temperatureGlobal, setTemperature] = React.useState(tempCache);
      const [fanRpmGlobal, setFanRpm] = React.useState(fanRpmCache);
      setTemperature_display = (x) => {
          setTemperature(x);
          tempCache = x;
          tempStreamAt = Date.now();
      };
      setFanRpm_display = (x) => {
          setFanRpm(x);
          fanRpmCache = x;
          rpmStreamAt = Date.now();
      };
      // Wait for the WASM/USDPL bridge before issuing any RPC, then load initial state.
      // This replaces the fire-and-forget module-level IIFE that raced startup.
      React.useEffect(() => {
          let cancelled = false;
          (async () => {
              await ensureReady();
              if (cancelled) {
                  return;
              }
              usdplReady = true;
              setServerApi(serverAPI);
              name = await getName();
              version = await getVersion();
              resolve(getEnabled(), setEnable);
              resolve(getInterpolate(), setInterpol);
              resolve(getCurve(), setCurve$1);
              resolve(getTemperature(setTemperature_display), (_) => { });
              resolve(getFanRpm(setFanRpm_display), (_) => { });
              setReadyFlag(true);
              // get_fan_rpm / get_temperature are long-lived streams that push an update
              // once a second (2 s for temperature), so subscribing once is enough.
              // They do not reconnect on their own, though: if the back-end restarts the
              // panel would freeze on the last value, so re-subscribe only when a stream
              // has gone quiet for a while.
              if (periodicHook != null) {
                  clearInterval(periodicHook);
              }
              periodicHook = setInterval(() => {
                  const now = Date.now();
                  if (now - rpmStreamAt > 5000) {
                      rpmStreamAt = now;
                      resolve(getFanRpm(setFanRpm_display), (_) => { });
                  }
                  if (now - tempStreamAt > 8000) {
                      tempStreamAt = now;
                      resolve(getTemperature(setTemperature_display), (_) => { });
                  }
              }, 3000);
              // Out-of-the-box behaviour: read the shipped SteamOS curves on startup and,
              // on a fresh install, seed the profile list so nothing has to be opened first.
              try {
                  const system = await getSystemCurve();
                  if (cancelled) {
                      return;
                  }
                  setSystemProfiles(system.profiles);
                  setActiveProfile(system.active);
                  setFanBounds({ min: system.fanMin, max: system.fanMax });
                  setSafetyFloor(system.floor);
                  setFixedSpeed$1(await getFixedSpeed());
                  // After a reboot the back-end resets to the SteamOS default, so nothing is
                  // selected any more; drop the remembered highlight to match.
                  if (!(await getEnabled())) {
                      saveActive(null);
                      setActiveSlotId(null);
                  }
                  // Only user slots are persisted; system profiles are regenerated from the
                  // back-end every time, so they can never go stale.
                  const stored = loadSlots();
                  const custom = (stored ?? []).filter((slot) => slot.builtin !== "system");
                  if (stored == null || custom.length === 0) {
                      // A fresh install gets exactly one blank, protected "custom" slot;
                      // selecting it hands the fan back to SteamOS.
                      const seeded = [
                          { id: newId(), name: t(lang, "newSlotName"), builtin: null, curve: [], locked: true },
                      ];
                      saveSlots(seeded);
                      // Publish it immediately: the panel used to show no cards until the
                      // profile dialog had been opened once (which is what refreshed state).
                      setCustomSlots(seeded);
                      setActiveSlotId(null);
                      // No automatic fan probe: the back-end must never take over the fan
                      // without an explicit user action.
                  }
                  else if (custom.length !== stored.length) {
                      saveSlots(custom);
                      setCustomSlots(custom);
                  }
              }
              catch (e) {
                  console.warn("[Fantastic] system profiles unavailable", e);
              }
          })();
          return () => {
              cancelled = true;
          };
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      function setEnable(enable) {
          setEnableInternal(enable);
      }
      function refreshSlots() {
          setCustomSlots((loadSlots() ?? []).filter((slot) => slot.builtin !== "system"));
          setActiveSlotId(loadActive());
          // Re-read the back-end too: the slots modal may have switched profile mode.
          getSystemCurve()
              .then((system) => {
              setSystemProfiles(system.profiles);
              setActiveProfile(system.active);
              setFanBounds({ min: system.fanMin, max: system.fanMax });
          })
              .catch((e) => console.warn("[Fantastic] refreshing profiles failed", e));
      }
      function closeCurveModal() {
          refreshSlots();
          if (curveModalHandle) {
              try {
                  curveModalHandle.Close();
              }
              catch (e) {
                  console.warn("[Fantastic] closing curve modal failed", e);
              }
              curveModalHandle = undefined;
          }
      }
      /**
       * Open the profile (slot) manager. It hosts its own editor view, so no nested
       * modal is required: pressing Edit swaps the list for the large curve editor.
       */
      function openSlotsModal() {
          closeCurveModal();
          const snapshot = curveGlobal.slice();
          const temperatureRatio = temperatureGlobal > 0 ? temperatureGlobal / 100 : undefined;
          (async () => {
              let profiles = systemProfiles;
              let active = activeProfile;
              try {
                  const system = await getSystemCurve();
                  profiles = system.profiles;
                  active = system.active;
                  setSystemProfiles(profiles);
                  setActiveProfile(active);
              }
              catch (e) {
                  console.warn("[Fantastic] system curve unavailable", e);
              }
              try {
                  curveModalHandle = deckyFrontendLib.showModal(window.SP_REACT.createElement(deckyFrontendLib.ModalRoot, { bAllowFullSize: true },
                      window.SP_REACT.createElement(SlotsModal, { lang: lang, initialCurve: snapshot, interpolate: interpolGlobal, temperatureRatio: temperatureRatio, systemProfiles: profiles, activeProfile: active, floor: safetyFloor, onApplyCurve: async (curve, slotId) => {
                              if (curve.length === 0) {
                                  await setEnabled(false);
                                  setEnable(false);
                                  saveActive(null);
                                  setActiveSlotId(null);
                              }
                              else {
                                  await setCurve(curve);
                                  await setEnabled(true);
                                  setCurve$1(curve);
                                  setEnable(true);
                                  saveActive(slotId);
                                  setActiveSlotId(slotId);
                              }
                              setFixedSpeed$1(null);
                              setActiveProfile(null);
                          }, onSaveSlotCurve: async (slotId, curve) => {
                              // A saved edit only reaches the running curve when that slot is the
                              // one in charge; otherwise editing a profile would silently take the
                              // fan over (or replace someone else's curve).
                              if (!liveRef.current.enabled || liveRef.current.slot !== slotId) {
                                  return;
                              }
                              try {
                                  await setCurve(curve);
                                  if (fixedSpeed != null) {
                                      await setFixedSpeed(fixedSpeed);
                                  }
                                  setCurve$1(curve);
                                  setActiveProfile(null);
                              }
                              catch (e) {
                                  console.warn("[Fantastic] pushing the edited curve failed", e);
                              }
                          }, onApplySystem: async (profileName) => {
                              await setSystemProfile(profileName);
                              await setFixedSpeed(null);
                              await setEnabled(true);
                              setActiveProfile(profileName);
                              // A system profile and a user slot cannot both be selected.
                              saveActive(null);
                              setActiveSlotId(null);
                              setFixedSpeed$1(null);
                              setEnable(true);
                          }, onClose: closeCurveModal })), undefined, { ...modalSize(), strTitle: t(lang, "slotsTitle"), bNeverPopOut: true });
              }
              catch (e) {
                  console.warn("[Fantastic] slots modal unavailable", e);
                  curveModalHandle = undefined;
              }
          })();
      }
      /**
       * Open the large curve view.
       *
       * The editor keeps its own copy of the curve and stays open while editing; every
       * successful change is pushed back into the Quick Access panel as well, so both
       * stay consistent without needing an atomic set_curve RPC.
       */
      /** The user slot that the standalone editor writes into. */
      function pickEditableSlot() {
          const stored = loadSlots() ?? [];
          const custom = stored.filter((slot) => slot.builtin !== "system");
          const activeId = (() => {
              try {
                  return window.localStorage.getItem("fantastic.activeSlot");
              }
              catch (e) {
                  return null;
              }
          })();
          const active = custom.filter((slot) => slot.id === activeId)[0];
          if (active) {
              return { id: active.id, name: active.name, curve: active.curve };
          }
          if (custom.length > 0) {
              saveActive(custom[0].id);
              return { id: custom[0].id, name: custom[0].name, curve: custom[0].curve };
          }
          const created = {
              id: newId(),
              name: t(lang, "newSlotName"),
              builtin: null,
              curve: curveGlobal.slice(),
          };
          saveSlots([...stored, created]);
          saveActive(created.id);
          return { id: created.id, name: created.name, curve: created.curve };
      }
      function openCurveModal(target) {
          closeCurveModal();
          const temperatureRatio = temperatureGlobal > 0 ? temperatureGlobal / 100 : undefined;
          // While a SteamOS profile is in charge, show the computed reference curve.
          // It is sampled from the quadratic, so it is read-only: the back-end never
          // evaluates these points, it re-computes the algorithm. A profile that is only
          // *selected* while the plugin is off is not in charge, so it stays editable.
          const systemName = target && target.kind === "system"
              ? target.name
              : !target && enabledGlobal && activeProfile
                  ? activeProfile
                  : null;
          const activeSystem = systemName
              ? systemProfiles.filter((profile) => profile.name === systemName)[0]
              : undefined;
          if (activeSystem) {
              try {
                  curveModalHandle = deckyFrontendLib.showModal(window.SP_REACT.createElement(deckyFrontendLib.ModalRoot, { bAllowFullSize: true },
                      window.SP_REACT.createElement(deckyFrontendLib.Focusable, { "flow-children": "column" },
                          window.SP_REACT.createElement("div", { style: { fontSize: "12px", color: "#ff9d9d", marginBottom: "6px" } }, t(lang, "refOnlyBody")),
                          window.SP_REACT.createElement(CurveEditor, { initialCurve: activeSystem.points, interpolate: interpolGlobal, lang: lang, temperatureRatio: temperatureRatio, floor: safetyFloor, readOnly: true, onAdd: async () => activeSystem.points, onRemove: async () => activeSystem.points }),
                          window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: closeCurveModal }, t(lang, "close")))), undefined, {
                      ...modalSize(),
                      strTitle: t(lang, "modalTitle") +
                          " \u00b7 " + activeSystem.name +
                          " \u00b7 " + t(lang, "readOnly"),
                      bNeverPopOut: true,
                  });
              }
              catch (e) {
                  console.warn("[Fantastic] reference modal unavailable", e);
                  curveModalHandle = undefined;
              }
              return;
          }
          // A card was tapped: edit exactly that slot, not whatever was active before.
          const storedSlots = loadSlots() ?? [];
          const picked = target && target.kind === "slot"
              ? storedSlots.filter((slot) => slot.id === target.id)[0]
              : undefined;
          const editable = picked ?? pickEditableSlot();
          // Start from the curve that belongs to the slot being edited, not from whatever
          // the back-end happens to be running, so saving cannot overwrite it silently.
          const snapshot = (editable ? editable.curve : curveGlobal).slice();
          // Edits are a draft: nothing reaches the back-end until the user saves.
          const draft = { curve: snapshot };
          const saveDraft = async () => {
              const next = draft.curve;
              try {
                  await setCurve(next);
                  if (fixedSpeed != null) {
                      // Preserve the current mode instead of silently switching to manual.
                      await setFixedSpeed(fixedSpeed);
                  }
                  setCurve$1(next);
                  setActiveProfile(null);
                  if (editable) {
                      const stored = loadSlots() ?? [];
                      saveSlots(stored.map((slot) => (slot.id === editable.id ? { ...slot, curve: next } : slot)));
                      saveActive(editable.id);
                      setActiveSlotId(editable.id);
                  }
              }
              catch (e) {
                  console.warn("[Fantastic] saving curve failed", e);
              }
              closeCurveModal();
          };
          try {
              curveModalHandle = deckyFrontendLib.showModal(window.SP_REACT.createElement(deckyFrontendLib.ModalRoot, { bAllowFullSize: true },
                  window.SP_REACT.createElement(deckyFrontendLib.Focusable, { "flow-children": "column" },
                      window.SP_REACT.createElement(CurveEditor, { initialCurve: snapshot, interpolate: interpolGlobal, lang: lang, temperatureRatio: temperatureRatio, floor: safetyFloor, draft: true, onChange: (curve) => { draft.curve = curve; }, onAdd: async () => draft.curve, onRemove: async () => draft.curve }),
                      window.SP_REACT.createElement(deckyFrontendLib.Focusable, { "flow-children": "row", style: { display: "flex", gap: "6px", marginTop: "6px" } },
                          window.SP_REACT.createElement("div", { style: { flex: "1 1 0" } },
                              window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: closeCurveModal }, t(lang, "backLabel"))),
                          window.SP_REACT.createElement("div", { style: { flex: "1 1 0" } },
                              window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: saveDraft }, t(lang, "saveLabel")))))), undefined, {
                  ...modalSize(),
                  strTitle: t(lang, "modalTitle") + (editable ? " · " + editable.name : ""),
                  bNeverPopOut: true,
              });
          }
          catch (e) {
              console.warn("[Fantastic] curve modal unavailable", e);
              curveModalHandle = undefined;
          }
      }
      const quickCards = systemProfiles
          .map((profile) => ({
          id: "system-" + profile.name,
          name: profile.name.charAt(0).toUpperCase() + profile.name.slice(1),
          profile: profile.name,
          curve: undefined,
      }))
          .concat(customSlots.map((slot) => ({
          id: slot.id,
          name: slot.name,
          profile: undefined,
          curve: slot.curve,
      })));
      const cardActiveBg = "rgba(26, 159, 255, 0.32)";
      const cardIdleBg = "rgba(255, 255, 255, 0.08)";
      const systemCards = quickCards.filter((card) => card.profile != null);
      const customCards = quickCards.filter((card) => card.profile == null);
      const fanPercent = fanBounds.max > fanBounds.min
          ? " (" +
              Math.round(((fanRpmGlobal - fanBounds.min) / (fanBounds.max - fanBounds.min)) * 100) +
              "%)"
          : "";
      // The highlight follows the *selected* profile, not the mode: profiles stay
      // selectable while SteamOS owns the fan, the mode slider decides who drives it.
      const cardActive = (card) => card.profile ? activeProfile === card.profile : activeSlotId === card.id;
      /** First tap selects the profile, a second tap opens it for viewing / editing. */
      const onCardPress = (card) => {
          if (!cardActive(card)) {
              applyCard(card);
              return;
          }
          openCurveModal(card.profile
              ? { kind: "system", name: card.profile }
              : { kind: "slot", id: card.id, name: card.name });
      };
      /** 0 = system default, 1 = manual (selected profile/curve), 2..4 = fixed speed. */
      // The back-end raises a fixed speed to the thermal floor, so the panel must not
      // keep claiming 50 % while the fan is running at 60 %.
      const floorNow = floorAt(temperatureGlobal, safetyFloor);
      const modeIndex = !enabledGlobal
          ? 0
          : fixedSpeed == null
              ? 1
              : fixedSpeed >= 1
                  ? 4
                  : fixedSpeed >= 0.75
                      ? 3
                      : 2;
      async function applyMode(index) {
          try {
              if (index === 0) {
                  // Hand the fan back to SteamOS.
                  await setFixedSpeed(null);
                  await setEnabled(false);
                  setFixedSpeed$1(null);
                  setEnable(false);
                  return;
              }
              if (index === 1) {
                  // Manual: follow whatever profile / curve is currently selected.
                  await setFixedSpeed(null);
                  await setEnabled(true);
                  setFixedSpeed$1(null);
                  setEnable(true);
                  return;
              }
              const ratio = index === 2 ? 0.5 : index === 3 ? 0.75 : 1;
              await setFixedSpeed(ratio);
              await setEnabled(true);
              setFixedSpeed$1(ratio);
              setEnable(true);
          }
          catch (e) {
              console.warn("[Fantastic] mode change failed", e);
          }
      }
      async function applyCard(card) {
          try {
              // Selecting a profile only changes WHICH curve is current; the mode slider
              // alone decides whether the plugin controls the fan.
              if (card.profile) {
                  await setSystemProfile(card.profile);
                  if (fixedSpeed != null) {
                      await setFixedSpeed(fixedSpeed);
                  }
                  setActiveProfile(card.profile);
                  saveActive(null);
                  setActiveSlotId(null);
              }
              else if (card.curve) {
                  await setCurve(card.curve);
                  if (fixedSpeed != null) {
                      await setFixedSpeed(fixedSpeed);
                  }
                  setCurve$1(card.curve);
                  setActiveProfile(null);
                  saveActive(card.id);
                  setActiveSlotId(card.id);
              }
          }
          catch (e) {
              console.warn("[Fantastic] applying slot failed", e);
          }
      }
      if (!readyFlag) {
          return (window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement(deckyFrontendLib.Field, { label: t(lang, "loadingTitle") }, t(lang, "loadingBody"))));
      }
      // TODO handle clicking on fan curve nodes
      return (window.SP_REACT.createElement(deckyFrontendLib.PanelSection, null,
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement(deckyFrontendLib.Field, { label: t(lang, "fanSpeed") }, fanRpmGlobal.toFixed(0) + " RPM" + (fanRpmGlobal < 1 ? " (" + t(lang, "fanStopped") + ")" : fanPercent))),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement(deckyFrontendLib.Field, { label: t(lang, "temperature") }, temperatureGlobal.toFixed(1) + " °C")),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement(deckyFrontendLib.SliderField, { label: t(lang, "modelLabel"), value: modeIndex, min: 0, max: 4, step: 1, notchCount: 5, notchLabels: [
                      { notchIndex: 0, label: t(lang, "modeSystem") },
                      { notchIndex: 1, label: t(lang, "modeManual") },
                      { notchIndex: 2, label: t(lang, "modeFifty") },
                      { notchIndex: 3, label: t(lang, "modeSeventyFive") },
                      { notchIndex: 4, label: t(lang, "modeFull") },
                  ], notchTicksVisible: true, showValue: false, onChange: (value) => { applyMode(value); } })),
          enabledGlobal && fixedSpeed != null && floorNow > fixedSpeed + 1e-6 &&
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.Field, { label: t(lang, "fixedFloor") }, Math.round(Math.min(1, floorNow) * 100) + "%")),
          enabledGlobal && activeProfile == null && fixedSpeed == null && curveGlobal.length < 2 &&
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.Field, { label: t(lang, "curveInactive") }, t(lang, "curveInactiveBody"))),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: () => openCurveModal() }, t(lang, "editCurve"))),
          quickCards.length > 0 &&
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement("div", { style: { width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "6px" } },
                      systemCards.length > 0 &&
                          window.SP_REACT.createElement(deckyFrontendLib.Focusable, { "flow-children": "row", style: { display: "flex", gap: "6px", width: "100%" } }, systemCards.map((card) => (window.SP_REACT.createElement(deckyFrontendLib.Focusable, { key: card.id, "flow-children": "row", onActivate: () => onCardPress(card), onClick: () => onCardPress(card), style: {
                                  flex: "1 1 0",
                                  minWidth: 0,
                                  boxSizing: "border-box",
                                  padding: "8px 10px",
                                  borderRadius: "4px",
                                  textAlign: "center",
                                  fontSize: "14px",
                                  backgroundColor: cardActive(card) ? cardActiveBg : cardIdleBg,
                              } }, card.name)))),
                      customCards.map((card) => (window.SP_REACT.createElement(deckyFrontendLib.Focusable, { key: card.id, "flow-children": "row", onActivate: () => onCardPress(card), onClick: () => onCardPress(card), style: {
                              width: "100%",
                              boxSizing: "border-box",
                              padding: "8px 10px",
                              borderRadius: "4px",
                              textAlign: "center",
                              fontSize: "14px",
                              backgroundColor: cardActive(card) ? cardActiveBg : cardIdleBg,
                          } }, card.name))),
                      window.SP_REACT.createElement("div", { style: { fontSize: "11px", opacity: 0.7, padding: "0 2px" } }, t(lang, "tapAgainHint")))),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: openSlotsModal }, t(lang, "slotsButton"))),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement(deckyFrontendLib.ToggleField, { label: t(lang, "interpolate"), description: t(lang, "interpolateDesc"), checked: interpolGlobal, onChange: (value) => {
                      resolve(setInterpolate(value), setInterpol);
                  } })),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement("div", { style: { width: "100%", boxSizing: "border-box" } },
                  window.SP_REACT.createElement(deckyFrontendLib.SliderField, { label: "", value: lang === "zh" ? 0 : 1, min: 0, max: 1, step: 1, notchCount: 2, notchTicksVisible: true, showValue: false, onChange: (value) => { setLang(value === 0 ? "zh" : "en"); } }),
                  window.SP_REACT.createElement("div", { style: {
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          boxSizing: "border-box",
                          padding: "0 8px",
                          marginTop: "-2px",
                          fontSize: "11px",
                          opacity: 0.75,
                      } },
                      window.SP_REACT.createElement("span", null, lang === "zh" ? "\u4e2d\u6587" : "Chinese"),
                      window.SP_REACT.createElement("span", null, lang === "zh" ? "EN" : "English")))),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement(deckyFrontendLib.Field, { label: name, onClick: () => { deckyFrontendLib.Navigation.NavigateToExternalWeb("https://git.ngni.us/NG-SD-Plugins/Fantastic/releases"); } }, "v" + version)),
          (version?.includes("alpha") || version?.includes("beta")) && window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement(deckyFrontendLib.Field, { label: "USDPL", onClick: () => { deckyFrontendLib.Navigation.NavigateToExternalWeb("https://git.ngni.us/NG-SD-Plugins/usdpl-rs"); } },
                  "v",
                  version_usdpl()))));
  };
  var index = deckyFrontendLib.definePlugin((serverApi) => {
      let ico = window.SP_REACT.createElement(FaFan, null);
      let now = new Date();
      if (now.getDate() == 1 && now.getMonth() == 3) {
          ico = window.SP_REACT.createElement(SiOnlyfans, null);
      }
      return {
          title: window.SP_REACT.createElement("div", { className: deckyFrontendLib.staticClasses.Title }, "Fantastic+"),
          content: window.SP_REACT.createElement(Content, { serverAPI: serverApi }),
          icon: ico,
          onDismount() {
              clearInterval(periodicHook);
          },
      };
  });

  return index;

})(DFL, SP_REACT);
