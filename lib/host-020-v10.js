var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name3 in all)
    __defProp(target, name3, { get: all[name3], enumerable: true });
};

// ../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/cosmokit/lib/index.js
function isNullable(value) {
  return value === null || value === void 0;
}
function defineProperty(object, key, value) {
  return Object.defineProperty(object, key, {
    writable: true,
    value,
    enumerable: false
  });
}
function is(type, value) {
  if (arguments.length === 1) return (value2) => is(type, value2);
  return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
}
function isArrayBufferLike(value) {
  return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
}
function isArrayBufferSource(value) {
  return isArrayBufferLike(value) || ArrayBuffer.isView(value);
}
function tokenize(source, delimiters, delimiter) {
  const output = [];
  let state = 0;
  for (let i = 0; i < source.length; i++) {
    const code = source.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      if (state === 1) {
        const next = source.charCodeAt(i + 1);
        if (next >= 97 && next <= 122) output.push(delimiter);
        output.push(code + 32);
      } else {
        if (state !== 0) output.push(delimiter);
        output.push(code + 32);
      }
      state = 1;
    } else if (code >= 97 && code <= 122) {
      output.push(code);
      state = 2;
    } else if (delimiters.includes(code)) {
      if (state !== 0) output.push(delimiter);
      state = 0;
    } else output.push(code);
  }
  return String.fromCharCode(...output);
}
function paramCase(source) {
  return tokenize(source, [45, 95], 45);
}
var write, Binary, base64ToArrayBuffer, arrayBufferToBase64, hexToArrayBuffer, arrayBufferToHex, hyphenate, Time;
var init_lib = __esm({
  "../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/cosmokit/lib/index.js"() {
    write = Symbol.for("cosmokit.volatile.write");
    (function(Binary2) {
      Binary2.is = isArrayBufferLike;
      Binary2.isSource = isArrayBufferSource;
      function fromSource(source) {
        if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
        else return source;
      }
      Binary2.fromSource = fromSource;
      function toBase64(source) {
        source = fromSource(source);
        if (typeof Buffer !== "undefined") return Buffer.from(source).toString("base64");
        let binary = "";
        const bytes = new Uint8Array(source);
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
      }
      Binary2.toBase64 = toBase64;
      function fromBase64(source) {
        if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
        return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
      }
      Binary2.fromBase64 = fromBase64;
      function toHex(source) {
        source = fromSource(source);
        if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
        return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
      }
      Binary2.toHex = toHex;
      function fromHex(source) {
        if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
        const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
        const buffer = [];
        for (let i = 0; i < hex.length; i += 2) buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
        return Uint8Array.from(buffer).buffer;
      }
      Binary2.fromHex = fromHex;
    })(Binary || (Binary = {}));
    base64ToArrayBuffer = Binary.fromBase64;
    arrayBufferToBase64 = Binary.toBase64;
    hexToArrayBuffer = Binary.fromHex;
    arrayBufferToHex = Binary.toHex;
    hyphenate = paramCase;
    (function(Time2) {
      Time2.millisecond = 1;
      Time2.second = 1e3;
      Time2.minute = Time2.second * 60;
      Time2.hour = Time2.minute * 60;
      Time2.day = Time2.hour * 24;
      Time2.week = Time2.day * 7;
      let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
      function setTimezoneOffset(offset) {
        timezoneOffset = offset;
      }
      Time2.setTimezoneOffset = setTimezoneOffset;
      function getTimezoneOffset() {
        return timezoneOffset;
      }
      Time2.getTimezoneOffset = getTimezoneOffset;
      function getDateNumber(date = /* @__PURE__ */ new Date(), offset) {
        if (typeof date === "number") date = new Date(date);
        if (offset === void 0) offset = timezoneOffset;
        return Math.floor((date.valueOf() / Time2.minute - offset) / 1440);
      }
      Time2.getDateNumber = getDateNumber;
      function fromDateNumber(value, offset) {
        const date = new Date(value * Time2.day);
        if (offset === void 0) offset = timezoneOffset;
        return new Date(+date + offset * Time2.minute);
      }
      Time2.fromDateNumber = fromDateNumber;
      const numeric = /\d+(?:\.\d+)?/.source;
      const timeRegExp = new RegExp(`^${[
        "w(?:eek(?:s)?)?",
        "d(?:ay(?:s)?)?",
        "h(?:our(?:s)?)?",
        "m(?:in(?:ute)?(?:s)?)?",
        "s(?:ec(?:ond)?(?:s)?)?"
      ].map((unit) => `(${numeric}${unit})?`).join("")}$`);
      function parseTime(source) {
        const capture = timeRegExp.exec(source);
        if (!capture) return 0;
        return (parseFloat(capture[1]) * Time2.week || 0) + (parseFloat(capture[2]) * Time2.day || 0) + (parseFloat(capture[3]) * Time2.hour || 0) + (parseFloat(capture[4]) * Time2.minute || 0) + (parseFloat(capture[5]) * Time2.second || 0);
      }
      Time2.parseTime = parseTime;
      function parseDate(date) {
        const parsed = parseTime(date);
        if (parsed) date = Date.now() + parsed;
        else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date}`;
        else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date}`;
        return date ? new Date(date) : /* @__PURE__ */ new Date();
      }
      Time2.parseDate = parseDate;
      function format(ms) {
        const abs = Math.abs(ms);
        if (abs >= Time2.day - Time2.hour / 2) return Math.round(ms / Time2.day) + "d";
        else if (abs >= Time2.hour - Time2.minute / 2) return Math.round(ms / Time2.hour) + "h";
        else if (abs >= Time2.minute - Time2.second / 2) return Math.round(ms / Time2.minute) + "m";
        else if (abs >= Time2.second) return Math.round(ms / Time2.second) + "s";
        return ms + "ms";
      }
      Time2.format = format;
      function toDigits(source, length = 2) {
        return source.toString().padStart(length, "0");
      }
      Time2.toDigits = toDigits;
      function template(template2, time = /* @__PURE__ */ new Date()) {
        return template2.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
      }
      Time2.template = template;
    })(Time || (Time = {}));
  }
});

// ../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/cordis/lib/index.js
function isConstructor(func) {
  if (!func.prototype) return false;
  if (func instanceof GeneratorFunction) return false;
  if (AsyncGeneratorFunction !== Function && func instanceof AsyncGeneratorFunction) return false;
  return true;
}
function joinPrototype(proto1, proto2) {
  if (proto1 === Object.prototype) return proto2;
  const result = Object.create(joinPrototype(Object.getPrototypeOf(proto1), proto2));
  for (const key of Reflect.ownKeys(proto1)) Object.defineProperty(result, key, Object.getOwnPropertyDescriptor(proto1, key));
  return result;
}
function isObject(value) {
  return value && (typeof value === "object" || typeof value === "function");
}
function getPropertyDescriptor(target, prop) {
  let proto = target;
  while (proto) {
    const desc = Reflect.getOwnPropertyDescriptor(proto, prop);
    if (desc) return desc;
    proto = Object.getPrototypeOf(proto);
  }
}
function getTraceable(ctx, value) {
  if (!isObject(value)) return value;
  if (Object.hasOwn(value, symbols.shadow)) return Object.getPrototypeOf(value);
  const tracker = value[symbols.tracker];
  if (!tracker) return value;
  return createTraceable(ctx, value, tracker);
}
function withProps(target, props) {
  if (!props) return target;
  return new Proxy(target, {
    get: (target2, prop, receiver) => {
      if (prop in props && prop !== "constructor") return Reflect.get(props, prop, receiver);
      return Reflect.get(target2, prop, receiver);
    },
    set: (target2, prop, value, receiver) => {
      if (prop in props && prop !== "constructor") return Reflect.set(props, prop, value, receiver);
      return Reflect.set(target2, prop, value, receiver);
    }
  });
}
function withProp(target, prop, value) {
  return withProps(target, Object.defineProperty(/* @__PURE__ */ Object.create(null), prop, {
    value,
    writable: false
  }));
}
function createShadow(ctx, target, property, receiver) {
  if (!property) return receiver;
  const origin = Reflect.getOwnPropertyDescriptor(target, property)?.value;
  if (!origin) return receiver;
  return withProp(receiver, property, ctx.extend({ [symbols.shadow]: origin }));
}
function createShadowMethod(ctx, value, outer, shadow) {
  return new Proxy(value, { apply: (target, thisArg, args) => {
    if (thisArg === outer) thisArg = shadow;
    return getTraceable(ctx, Reflect.apply(target, thisArg, args));
  } });
}
function createTraceable(ctx, value, tracker) {
  if (ctx[symbols.shadow] && !tracker.noShadow) ctx = Object.getPrototypeOf(ctx);
  const proxy = new Proxy(value, {
    get: (target, prop, receiver) => {
      if (prop === symbols.original) return target;
      if (prop === tracker.property) return ctx;
      if (typeof prop === "symbol") return Reflect.get(target, prop, receiver);
      if (tracker.associate && ctx.reflect.props[`${tracker.associate}.${prop}`]) return Reflect.get(ctx, `${tracker.associate}.${prop}`, withProp(ctx, symbols.receiver, receiver));
      let shadow, innerValue;
      const desc = getPropertyDescriptor(target, prop);
      if (desc && "value" in desc) innerValue = desc.value;
      else {
        shadow = createShadow(ctx, target, tracker.property, receiver);
        innerValue = Reflect.get(target, prop, shadow);
      }
      const innerTracker = innerValue?.[symbols.tracker];
      if (innerTracker) return createTraceable(ctx, innerValue, innerTracker);
      else if (!tracker.noShadow && typeof innerValue === "function") {
        shadow ??= createShadow(ctx, target, tracker.property, receiver);
        return createShadowMethod(ctx, innerValue, receiver, shadow);
      } else return innerValue;
    },
    set: (target, prop, value2, receiver) => {
      if (prop === symbols.original) return false;
      if (prop === tracker.property) return false;
      if (typeof prop === "symbol") return Reflect.set(target, prop, value2, receiver);
      if (tracker.associate && ctx.reflect.props[`${tracker.associate}.${prop}`]) return Reflect.set(ctx, `${tracker.associate}.${prop}`, value2, withProp(ctx, symbols.receiver, receiver));
      const shadow = createShadow(ctx, target, tracker.property, receiver);
      return Reflect.set(target, prop, value2, shadow);
    },
    apply: (target, thisArg, args) => {
      return applyTraceable(proxy, target, thisArg, args);
    }
  });
  return proxy;
}
function applyTraceable(proxy, value, thisArg, args) {
  if (!value[symbols.invoke]) return Reflect.apply(value, thisArg, args);
  return value[symbols.invoke].apply(proxy, args);
}
function createCallable(name3, proto, tracker) {
  const self = function(...args) {
    return applyTraceable(createTraceable(self["ctx"], self, tracker), self, this, args);
  };
  defineProperty(self, "name", name3);
  return Object.setPrototypeOf(self, proto);
}
function handleError(info, reason, getOuterStack) {
  const innerLines = info.error.stack.split("\n");
  if (typeof reason?.stack !== "string") {
    const outerError = new Error(reason);
    const lines2 = outerError.stack.split("\n");
    lines2.splice(1, Infinity, ...getOuterStack());
    outerError.stack = lines2.join("\n");
    throw outerError;
  }
  const lines = reason.stack.split("\n");
  let index = lines.indexOf(innerLines[2]);
  if (index === -1) throw reason;
  index -= info.offset;
  while (index > 0) {
    if (!lines[index - 1].endsWith(" (<anonymous>)")) break;
    index -= 1;
  }
  lines.splice(index, Infinity, ...getOuterStack());
  reason.stack = lines.join("\n");
  throw reason;
}
function composeError(callback, getOuterStack = buildOuterStack()) {
  const info = {
    offset: 1,
    error: /* @__PURE__ */ new Error()
  };
  try {
    const result = callback(info);
    if (isObject(result) && "then" in result) return result.then(void 0, (reason) => handleError(info, reason, getOuterStack));
    else return result;
  } catch (reason) {
    handleError(info, reason, getOuterStack);
  }
}
function buildOuterStack(offset = 0) {
  const outerError = /* @__PURE__ */ new Error();
  return () => outerError.stack.split("\n").slice(3 + offset);
}
function isBailed(value) {
  return value !== null && value !== false && value !== void 0;
}
function isAggregateError(error) {
  return error instanceof Error && Array.isArray(error["errors"]);
}
function enhanceError(error) {
  const lines = error.stack.split("\n");
  lines.splice(0, 2, `Error: ${error.message}`);
  error.stack = lines.join("\n");
  return error;
}
function isSpecialProperty(prop) {
  return typeof prop === "symbol" || RESERVED_WORDS.includes(prop) || parseInt(prop).toString() === prop || prop.startsWith("_");
}
function resolveConfig(runtime, config) {
  if (!runtime.Config) return config;
  const result = runtime.Config["~standard"].validate(config);
  if ("then" in result) throw new TypeError("Async config validation is not supported");
  if (result.issues) throw new ValidationError(result.issues);
  else return result.value;
}
function runDisposable(dispose) {
  const result = dispose();
  return effectInertia.get(dispose)?.() ?? result;
}
function emitPluginDisposed(context, fiber) {
  const args = ["internal/plugin", fiber];
  let callbacks;
  try {
    callbacks = context.events.dispatch("emit", args);
  } catch (error) {
    context.logger.error(error);
    return;
  }
  for (const callback of callbacks) try {
    const returned = callback(...args);
    Promise.resolve(returned).catch((error) => context.logger.error(error));
  } catch (error) {
    context.logger.error(error);
  }
}
function isApplicable(object) {
  return object && typeof object === "object" && typeof object.apply === "function";
}
function Inject(name3, config) {
  return function(value, decorator) {
    if (decorator.kind === "class") {
      if (!Object.hasOwn(value, "inject")) {
        defineProperty(value, "inject", Object.create(Object.getPrototypeOf(value).inject ?? null));
        defineProperty(value.inject, symbols.checkProto, true);
      }
      value.inject[name3] = config;
    } else if (decorator.kind === "method") {
      const inject2 = (value[symbols.metadata] ??= {}).inject ??= /* @__PURE__ */ Object.create(null);
      inject2[name3] = config;
      decorator.addInitializer(function() {
        const property = this[symbols.tracker]?.property;
        (this[symbols.initHooks] ??= []).push(() => {
          this.ctx.inject(inject2, (ctx) => {
            return value.call(property ? withProps(this, { [property]: ctx }) : this);
          });
        });
      });
    } else throw new Error("@Inject() can only be used on class or class methods");
  };
}
var DisposableList, symbols, GeneratorFunction, AsyncGeneratorFunction, EventsService, defaultFormatters, Logger, c16, c256, LoggerService, RESERVED_WORDS, ReflectService, kValidationError, ValidationError, effectInertia, CordisError, INACTIVE, Fiber, RegistryService, Context, Service;
var init_lib2 = __esm({
  "../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/cordis/lib/index.js"() {
    init_lib();
    DisposableList = class {
      sn = 0;
      map = /* @__PURE__ */ new Map();
      weak = /* @__PURE__ */ new WeakMap();
      get length() {
        return this.map.size;
      }
      push(value) {
        const sn = ++this.sn;
        this.map.set(sn, value);
        this.weak.set(value, sn);
        return () => this.map.delete(sn);
      }
      delete(value) {
        const sn = this.weak.get(value);
        if (!sn) return false;
        return this.map.delete(sn);
      }
      clear() {
        const values = [...this.map.values()];
        this.map.clear();
        return values.reverse();
      }
      [Symbol.iterator]() {
        return this.map.values();
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this];
      }
    };
    symbols = {
      shadow: Symbol.for("cordis.shadow"),
      receiver: Symbol.for("cordis.receiver"),
      original: Symbol.for("cordis.original"),
      metadata: Symbol.for("cordis.metadata"),
      initHooks: Symbol.for("cordis.initHooks"),
      checkProto: Symbol.for("cordis.checkProto"),
      effect: Symbol.for("cordis.effect"),
      filter: Symbol.for("cordis.filter"),
      isolate: Symbol.for("cordis.isolate"),
      intercept: Symbol.for("cordis.intercept"),
      init: Symbol.for("cordis.init"),
      check: Symbol.for("cordis.check"),
      config: Symbol.for("cordis.config"),
      invoke: Symbol.for("cordis.invoke"),
      extend: Symbol.for("cordis.extend"),
      tracker: Symbol.for("cordis.tracker"),
      resolveConfig: Symbol.for("cordis.resolveConfig")
    };
    GeneratorFunction = function* () {
    }.constructor;
    AsyncGeneratorFunction = async function* () {
    }.constructor;
    EventsService = class {
      ctx;
      _hooks = {};
      constructor(ctx) {
        this.ctx = ctx;
        defineProperty(this, symbols.tracker, {
          property: "ctx",
          noShadow: true
        });
        this.on("internal/listener", function(name3, listener, options) {
          if (name3 === "internal/update" && !options.global) return (this.fiber._hooks["internal/update"] ??= new DisposableList())[options.prepend ? "unshift" : "push"](listener);
        });
        this.on("internal/update", function(config, noSave, next) {
          const cbs = [...this._hooks["internal/update"] || []];
          const _next = () => {
            return (cbs.shift() ?? next).call(this, config, noSave, _next);
          };
          return _next();
        }, {
          global: true,
          prepend: true
        });
      }
      /**
      * Resolve listeners for one dispatch and apply context filtering.
      *
      * @param type — the dispatch mode, reported on `internal/dispatch`.
      * @param args — the raw dispatch arguments; consumed up to the event name.
      * @returns the matching listener callbacks, bound to the dispatch `this`.
      */
      dispatch(type, args) {
        const thisArg = typeof args[0] === "object" || typeof args[0] === "function" ? args.shift() : null;
        const name3 = args.shift();
        if (!name3.startsWith("internal/")) this.emit("internal/dispatch", type, name3, args, thisArg);
        const filter = thisArg?.[Context.filter];
        return (this._hooks[name3] || []).filter((hook) => hook.global || !filter || filter.call(thisArg, hook.ctx)).map((hook) => hook.callback.bind(thisArg));
      }
      /**
      * Run listeners concurrently and wait for all of them.
      *
      * @param args — optional `this`, the event name, then listener arguments.
      * @returns a promise resolving once every listener has settled.
      */
      async parallel(...args) {
        const errors = (await Promise.allSettled(this.dispatch("emit", args).map(async (cb) => cb(...args)))).filter((result) => result.status === "rejected");
        if (errors.length) throw new AggregateError(errors.map((error) => error.reason));
      }
      /**
      * Run listeners synchronously without waiting for returned promises.
      *
      * @param args — optional `this`, the event name, then listener arguments.
      */
      emit(...args) {
        this.dispatch("emit", args).map((cb) => cb(...args));
      }
      /**
      * Run listeners in order, awaiting each, until one returns a bail value.
      *
      * @param args — optional `this`, the event name, then listener arguments.
      * @returns the first bail value (see {@link isBailed}), if any.
      */
      async serial(...args) {
        for (const cb of this.dispatch("serial", args)) {
          const result = await cb(...args);
          if (isBailed(result)) return result;
        }
      }
      /**
      * Run listeners synchronously until one returns a bail value.
      *
      * @param args — optional `this`, the event name, then listener arguments.
      * @returns the first bail value (see {@link isBailed}), if any.
      */
      bail(...args) {
        for (const cb of this.dispatch("bail", args)) {
          const result = cb(...args);
          if (isBailed(result)) return result;
        }
      }
      /**
      * Compose listeners around the final `next` callback.
      *
      * The last dispatch argument is treated as the innermost `next`. Listeners
      * run outermost-first; a listener that does not call `next()` vetoes the
      * rest of the chain, including the built-in behavior.
      *
      * @param args — optional `this`, the event name, listener arguments, then `next`.
      * @returns the outermost listener's return value.
      */
      waterfall(...args) {
        const cbs = this.dispatch("waterfall", args);
        const inner = args.pop();
        const next = () => {
          return (cbs.shift() ?? inner)(...args);
        };
        args.push(next);
        return next();
      }
      /**
      * Store a listener record as an effect on the current fiber.
      *
      * @param label — effect label shown in fiber diagnostics.
      * @param hooks — the listener list for one event.
      * @param callback — the listener to store.
      * @param options — placement and filtering options.
      * @returns a disposer that unregisters the listener.
      */
      register(label, hooks, callback, options) {
        const method = options.prepend ? "unshift" : "push";
        return this.ctx.fiber.effect(() => {
          hooks[method]({
            ctx: this.ctx,
            callback,
            ...options
          });
          return () => this.unregister(hooks, callback);
        }, label);
      }
      /**
      * Remove a stored listener record.
      *
      * @param hooks — the listener list for one event.
      * @param callback — the listener to remove.
      * @returns `true` if the listener was found and removed.
      */
      unregister(hooks, callback) {
        const index = hooks.findIndex((hook) => hook.callback === callback);
        if (index >= 0) {
          hooks.splice(index, 1);
          return true;
        }
      }
      /**
      * Register an event listener owned by the current fiber.
      *
      * The listener is removed automatically when the fiber unloads. Throws
      * `CordisError('INACTIVE_EFFECT')` if the fiber is already disposed.
      *
      * @param name — the event name to listen for.
      * @param listener — called with the dispatch arguments.
      * @param options — listener options; a boolean is shorthand for `prepend`.
      * @returns a disposer removing the listener; `true` if it was still registered.
      */
      on(name3, listener, options) {
        if (typeof options !== "object") options = { prepend: options };
        this.ctx.fiber.assertActive();
        listener = this.ctx.reflect.bind(listener);
        const result = this.bail(this.ctx, "internal/listener", name3, listener, options);
        if (result) return result;
        const hooks = this._hooks[name3] ||= [];
        const label = `ctx.on(${typeof name3 === "string" ? JSON.stringify(name3) : name3.toString()})`;
        return this.register(label, hooks, listener, options);
      }
      /**
      * Register an event listener that disposes itself after the first call.
      *
      * @param name — the event name to listen for.
      * @param listener — called at most once with the dispatch arguments.
      * @param options — listener options; a boolean is shorthand for `prepend`.
      * @returns a disposer removing the listener; `true` if it was still registered.
      */
      once(name3, listener, options) {
        const dispose = this.on(name3, function(...args) {
          dispose();
          return listener.apply(this, args);
        }, options);
        return dispose;
      }
    };
    defaultFormatters = {
      s: (value) => String(value),
      d: (value) => Math.trunc(Number(value)),
      i: (value) => Math.trunc(Number(value)),
      f: (value) => Number(value),
      o: (value) => JSON.stringify(value),
      O: (value) => JSON.stringify(value),
      c: () => "",
      C: (value, exporter, message) => {
        return Logger.color(exporter, Logger.code(message.name, exporter.colors), value);
      }
    };
    Logger = class {
      service;
      static color(exporter, code, value, decoration = "") {
        if (!exporter.colors) return "" + value;
        return `\x1B[3${code < 8 ? code : "8;5;" + code}${exporter.colors >= 2 ? decoration : ""}m${value}\x1B[0m`;
      }
      static code(name3, level) {
        let hash = 0;
        for (let i = 0; i < name3.length; i++) {
          hash = (hash << 3) - hash + name3.charCodeAt(i) + 13;
          hash |= 0;
        }
        const colors = !level ? [] : level >= 2 ? c256 : c16;
        return colors[Math.abs(hash) % colors.length];
      }
      static format(exporter, message) {
        const args = message.args.slice();
        if (args[0] instanceof Error) {
          args[0] = args[0].stack || args[0].message;
          args.unshift("%s");
        } else if (typeof args[0] !== "string") args.unshift("%o");
        let format = args.shift();
        format = format.replace(/%([a-zA-Z%])/g, (match, char) => {
          if (match === "%%") return "%";
          const formatter = exporter.formatters?.[char] ?? defaultFormatters[char];
          if (typeof formatter === "function") return formatter(args.shift(), exporter, message);
          return match;
        });
        const oFormatter = exporter.formatters?.o ?? defaultFormatters.o;
        for (let arg of args) {
          if (typeof arg === "object" && arg) arg = oFormatter(arg, exporter, message);
          format += " " + arg;
        }
        const { maxLength = 10240 } = exporter;
        return format.split(/\r?\n/g).map((line) => {
          return line.slice(0, maxLength) + (line.length > maxLength ? "..." : "");
        }).join("\n");
      }
      constructor(options, service) {
        this.service = service;
        Object.assign(this, options);
        this.error = this._method("error", 0);
        this.info = this._method("info", 1);
        this.warn = this._method("warn", 2);
        this.debug = this._method("debug", 3);
      }
      _method(type, level) {
        return (...args) => {
          if (args.length === 1 && args[0] instanceof Error) {
            if (args[0].cause) this[type](args[0].cause);
            else if (isAggregateError(args[0])) {
              args[0].errors.forEach((error) => this[type](error));
              return;
            }
          }
          const sn = ++this.service._snMessage;
          const ts = Date.now();
          for (const exporter of this.service.exporters.values()) {
            if ((exporter.levels?.[this.name] ?? exporter.levels?.default ?? this.level ?? 1) < level) continue;
            const message = {
              sn,
              ts,
              type,
              level,
              name: this.name,
              ...this.meta,
              args
            };
            exporter.export(message);
          }
        };
      }
    };
    c16 = [
      6,
      2,
      3,
      4,
      5,
      1
    ];
    c256 = [
      20,
      21,
      26,
      27,
      32,
      33,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      56,
      57,
      62,
      63,
      68,
      69,
      74,
      75,
      76,
      77,
      78,
      79,
      80,
      81,
      92,
      93,
      98,
      99,
      112,
      113,
      129,
      134,
      135,
      148,
      149,
      160,
      161,
      162,
      163,
      164,
      165,
      166,
      167,
      168,
      169,
      170,
      171,
      172,
      173,
      178,
      179,
      184,
      185,
      196,
      197,
      198,
      199,
      200,
      201,
      202,
      203,
      204,
      205,
      206,
      207,
      208,
      209,
      214,
      215,
      220,
      221
    ];
    LoggerService = class LoggerService2 {
      bufferSize = 1e3;
      buffer = [];
      ctx;
      _snMessage = 0;
      _snExporter = 0;
      exporters = /* @__PURE__ */ new Map();
      constructor(ctx) {
        const tracker = {
          property: "ctx",
          noShadow: true
        };
        const self = createCallable("logger", joinPrototype(Object.getPrototypeOf(this), Function.prototype), tracker);
        Object.assign(self, this);
        self.ctx = ctx;
        defineProperty(self, symbols.tracker, tracker);
        self.exporter({
          colors: 3,
          export: (message) => {
            self.buffer.push(message);
            if (self.buffer.length > self.bufferSize) self.buffer = self.buffer.slice(-self.bufferSize);
          }
        });
        return self;
      }
      /**
      * Register an exporter and dispose it with the current fiber.
      *
      * @param exporter — the sink that receives structured log messages.
      * @returns a disposer that removes the exporter.
      */
      exporter(exporter) {
        return this.ctx.effect(() => {
          const id = ++this._snExporter;
          this.exporters.set(id, exporter);
          return () => this.exporters.delete(id);
        }, "ctx.logger.exporter()");
      }
      _resolveConfig() {
        let intercept = this.ctx[symbols.intercept];
        const configs = [];
        while ("logger" in intercept) {
          if (Object.hasOwn(intercept, "logger")) configs.unshift(intercept["logger"]);
          intercept = Object.getPrototypeOf(intercept);
        }
        return Object.assign({}, ...configs);
      }
      [symbols.invoke](name3) {
        const config = this._resolveConfig();
        const fiber = (this.ctx[symbols.shadow] ?? this.ctx).fiber;
        name3 ??= config.name;
        name3 ??= hyphenate(fiber.name);
        return new Logger({
          name: name3,
          level: config.level,
          meta: { fiber: new WeakRef(fiber) }
        }, this);
      }
      static {
        for (const type of [
          "error",
          "info",
          "warn",
          "debug"
        ]) LoggerService2.prototype[type] = function(...args) {
          return this()[type](...args);
        };
      }
    };
    RESERVED_WORDS = ["prototype", "then"];
    ReflectService = class {
      ctx;
      /** Proxy traps implementing service resolution for every context object. */
      static handler = {
        get: (target, prop, ctx) => {
          if (isSpecialProperty(prop)) return Reflect.get(target, prop, ctx);
          if (Reflect.has(target, prop)) return getTraceable(ctx, Reflect.get(target, prop, ctx));
          const error = /* @__PURE__ */ new Error(`cannot get property "${prop}" without inject`);
          try {
            const def = target.reflect.props[prop];
            if (def?.type === "accessor") return def.get.call(ctx, ctx[symbols.receiver], error);
            if (!ctx.fiber.runtime) return ctx.reflect.get(prop, false);
            return ctx.events.waterfall("internal/get", ctx, prop, error, () => {
              const key = target[symbols.isolate][prop];
              let fiber = (ctx[symbols.shadow] ?? ctx).fiber;
              while (true) {
                const impl = fiber.store?.[prop];
                if (impl) return getTraceable(ctx, impl.value);
                if (prop in fiber.inject) {
                  error.message = `cannot get required service "${prop}" in inactive context`;
                  throw error;
                }
                if (!fiber.runtime) throw error;
                if (fiber.parent[symbols.isolate][prop] !== key) throw error;
                fiber = fiber.parent.fiber;
              }
            });
          } catch (e) {
            throw e === error ? enhanceError(e) : e;
          }
        },
        set: (target, prop, value, ctx) => {
          if (isSpecialProperty(prop)) return Reflect.set(target, prop, value, ctx);
          const error = /* @__PURE__ */ new Error(`cannot set property "${prop}" without provide`);
          const def = target.reflect.props[prop];
          if (!def) {
            if (!ctx.fiber.runtime) return Reflect.set(target, prop, value, ctx);
            throw enhanceError(error);
          }
          try {
            if (def.type === "accessor") {
              if (!def.set) return false;
              return def.set.call(ctx, value, ctx[symbols.receiver], error);
            }
            return ctx.events.waterfall("internal/set", ctx, prop, value, error, () => {
              return ctx.reflect.set(prop, value, error);
            });
          } catch (e) {
            throw e === error ? enhanceError(e) : e;
          }
        },
        has: (target, prop) => {
          if (isSpecialProperty(prop)) return Reflect.has(target, prop);
          if (Reflect.has(target, prop)) return true;
          return !!target.reflect.props[prop];
        }
      };
      /** Service implementations, keyed by isolation label. */
      store = /* @__PURE__ */ Object.create(null);
      /** Declared context properties (services and accessors), by name. */
      props = /* @__PURE__ */ Object.create(null);
      constructor(ctx) {
        this.ctx = ctx;
        defineProperty(this, symbols.tracker, {
          property: "ctx",
          noShadow: true
        });
        this.mixin("reflect", [
          "get",
          "set",
          "provide",
          "accessor",
          "mixin"
        ]);
        this.mixin("fiber", ["runtime", "effect"]);
        this.mixin("registry", ["inject", "plugin"]);
        this.mixin("events", [
          "on",
          "once",
          "parallel",
          "emit",
          "serial",
          "bail",
          "waterfall"
        ]);
      }
      /**
      * Read a service from the store without the inject requirement.
      *
      * @param name — the service name.
      * @param strict — when `true`, only return implementations whose providing
      * fiber is currently active.
      * @returns the service value, or `undefined` when not (yet) provided.
      */
      get(name3, strict = true) {
        return getTraceable(this.ctx, this._getImpl(name3, strict)?.value);
      }
      _getImpl(name3, strict = true) {
        const key = this.ctx[symbols.isolate][name3];
        const impl = key && this.store[key];
        if (!impl) return;
        if (strict && impl.fiber.state !== 2) return;
        return impl;
      }
      /**
      * Overwrite a provided service's value.
      *
      * @param name — the service name.
      * @param value — the new service value.
      * @param error — carrier for the caller stack in diagnostics.
      * @returns `true` on success.
      * @throws when `name` was never provided, or was provided by another fiber.
      */
      set(name3, value, error) {
        const key = this.ctx[symbols.isolate][name3];
        const impl = this.store[key];
        if (!impl) throw new Error(`cannot set property "${name3}" without provide`);
        if (impl.fiber !== this.ctx.fiber) throw new Error(`cannot set property "${name3}" in multiple fibers`);
        impl.value = value;
        return true;
      }
      /**
      * Register a service implementation owned by the current fiber.
      *
      * See the `ctx.provide()` overload above for the full contract.
      *
      * @param name — the service name.
      * @param value — the service value.
      * @param check — optional availability predicate for dependents.
      * @returns a disposer that unregisters the service.
      */
      provide(name3, value, check) {
        return this.ctx.fiber.effect(() => {
          if (!this.props[name3]) this.props[name3] ??= { type: "service" };
          else if (this.props[name3].type !== "service") throw new Error(`property "${name3}" is already declared as ${this.props[name3].type}`);
          this.props[name3] = { type: "service" };
          this.ctx.root[symbols.isolate][name3] ??= Symbol(name3);
          const key = this.ctx[symbols.isolate][name3];
          const impl = {
            name: name3,
            value,
            fiber: this.ctx.fiber,
            check
          };
          if (this.store[key]) throw new Error(`service "${name3}" has been registered at <${this.store[key].fiber.name}>`);
          this.store[key] = impl;
          this.ctx.fiber.store[name3] = impl;
          if (this.ctx.fiber.state === 2) this.notify([name3]);
          return async () => {
            delete this.store[key];
            const fibers = this.notify([name3]);
            await Promise.allSettled(fibers.map((fiber) => fiber.await()));
            delete this.ctx.fiber.store[name3];
          };
        }, `ctx.provide(${JSON.stringify(name3)})`);
      }
      /**
      * Re-evaluate every fiber that requires one of the given services.
      *
      * @param names — the service names that changed.
      * @param filter — restricts notification to matching isolation scopes.
      * @returns the fibers whose dependency state was refreshed.
      */
      notify(names, filter = (ctx, name3) => ctx[symbols.isolate][name3] === this.ctx[symbols.isolate][name3]) {
        const fibers = [];
        for (const runtime of this.ctx.registry.values()) for (const fiber of runtime.fibers) {
          let hasUpdate = false;
          for (const name3 of names) {
            if (!(name3 in fiber.inject)) continue;
            if (!filter(fiber.ctx, name3)) continue;
            hasUpdate = true;
            fiber._checkImpl(name3);
          }
          if (!hasUpdate) continue;
          fiber._refresh();
          fibers.push(fiber);
        }
        for (const name3 of names) {
          const self = Object.create(this.ctx);
          self[symbols.filter] = (target) => filter(target, name3);
          this.ctx.events.emit(self, "internal/service", name3, this._getImpl(name3, false)?.value);
        }
        return fibers;
      }
      /**
      * Define a computed context property backed by get/set hooks.
      *
      * @param name — the context property name.
      * @param options — the `get` hook and optional `set` hook.
      * @returns a disposer that removes the accessor.
      */
      accessor(name3, options) {
        return this.ctx.fiber.effect(() => {
          if (name3 in this.props) throw new Error(`property "${name3}" is already declared as ${this.props[name3].type}`);
          this.props[name3] = {
            type: "accessor",
            ...options
          };
          return () => delete this.props[name3];
        }, `ctx.accessor(${JSON.stringify(name3)})`);
      }
      /**
      * Expose selected members of a service directly on `ctx`.
      *
      * See the `ctx.mixin()` overload above for the full contract.
      *
      * @param source — a context property name or a source object.
      * @param mixins — keys to forward, or a source-key → ctx-key map.
      * @returns a disposer that removes all created accessors.
      */
      mixin(source, mixins) {
        const self = this;
        return this.ctx.fiber.effect(function* () {
          const entries = Array.isArray(mixins) ? mixins.map((key) => [key, key]) : Object.entries(mixins);
          const getTarget = (ctx, error) => {
            return ctx[source];
          };
          for (const [key, value] of entries) yield self.accessor(value, {
            get(receiver, error) {
              const service = getTarget(this, error);
              if (isNullable(service)) return service;
              const mixin = receiver ? withProps(receiver, service) : service;
              const value2 = Reflect.get(service, key, mixin);
              if (typeof value2 !== "function") return value2;
              return value2.bind(mixin ?? service);
            },
            set(value2, receiver, error) {
              const service = getTarget(this, error);
              const mixin = receiver ? withProps(receiver, service) : service;
              return Reflect.set(service, key, value2, mixin);
            }
          });
        }, `ctx.mixin(${JSON.stringify(source)})`);
      }
      /**
      * Attach this context's tracing wrapper to a value.
      *
      * @param value — the value to wrap.
      * @returns the traceable wrapper (or the value itself when not applicable).
      */
      trace(value) {
        return getTraceable(this.ctx, value);
      }
      /**
      * Wrap a callback so calls trace `this` and arguments to this context.
      *
      * @param callback — the function to wrap.
      * @returns a proxy delegating to `callback` with traced values.
      */
      bind(callback) {
        return new Proxy(callback, {
          apply: (target, thisArg, args) => {
            return Reflect.apply(target, this.trace(thisArg), args.map((arg) => this.trace(arg)));
          },
          construct: (target, args, newTarget) => {
            return Reflect.construct(target, args.map((arg) => this.trace(arg)), newTarget);
          }
        });
      }
    };
    kValidationError = Symbol.for("ValidationError");
    ValidationError = class extends TypeError {
      name = "ValidationError";
      /**
      * Build the aggregated message from schema issues.
      *
      * @param issues — the standard-schema issues, one message line each.
      */
      constructor(issues) {
        super(`invalid config:
` + issues.map((issue) => {
          if (issue.path) return `  - ${issue.message} (at ${issue.path.join(".")})`;
          else return `  - ${issue.message}`;
        }).join("\n"));
      }
    };
    Object.defineProperty(ValidationError.prototype, kValidationError, { value: true });
    effectInertia = /* @__PURE__ */ new WeakMap();
    CordisError = class CordisError2 extends Error {
      code;
      /**
      * @param code — the stable error code; also the default message.
      * @param message — optional human-readable override.
      */
      constructor(code, message) {
        super(message ?? CordisError2.Code[code]);
        this.code = code;
      }
    };
    (function(CordisError3) {
      CordisError3.Code = { INACTIVE_EFFECT: "cannot create effect on inactive context" };
    })(CordisError || (CordisError = {}));
    INACTIVE = "__INACTIVE__";
    Fiber = class {
      parent;
      inject;
      runtime;
      /** Unique id within the registry; 0 for the root fiber, `null` once disposed. */
      uid;
      /** The context this fiber's plugin runs in (extends the parent context). */
      ctx;
      /** The validated plugin config (updated by `update()`). */
      config;
      /** The raw plugin config, re-resolved before each activation. */
      _config;
      /** Current lifecycle state; transitions emit `internal/status`. */
      state = 0;
      /** Dispose this fiber: unload the plugin, then settle once cleanup finished. */
      dispose;
      /** Snapshot of required service implementations while loaded; `undefined` otherwise. */
      store;
      /** The in-flight load/unload transition, if one is currently running. */
      inertia;
      _hooks = /* @__PURE__ */ Object.create(null);
      _disposables = new DisposableList();
      context;
      _error;
      _runner;
      _store = /* @__PURE__ */ Object.create(null);
      /**
      * Create a fiber. Plugin authors normally obtain fibers from `ctx.plugin()`
      * rather than constructing them directly.
      *
      * @param parent — the context the plugin was loaded from.
      * @param config — raw config, validated against the runtime's schema.
      * @param inject — resolved dependency map (service name → intercept config).
      * @param runtime — the shared plugin runtime, or `null` for the root fiber.
      * @param getOuterStack — captures the caller stack for effect diagnostics.
      */
      constructor(parent, config, inject2, runtime, getOuterStack) {
        this.parent = parent;
        this.inject = inject2;
        this.runtime = runtime;
        this._config = config;
        const collect = (dispose) => {
          this._disposables.push(dispose);
        };
        if (runtime) {
          this.uid = parent.registry.counter;
          this.ctx = this.context = parent.extend({ fiber: this });
          const injectEntries = Object.entries(this.inject);
          if (injectEntries.length) {
            this.ctx[Context.intercept] = Object.create(parent[Context.intercept]);
            for (const [name3, config2] of injectEntries) {
              if (isNullable(config2)) continue;
              this.ctx[Context.intercept][name3] = config2;
            }
          }
          this._runner = {
            epoch: INACTIVE,
            getOuterStack,
            execute: function() {
              if (isConstructor(runtime.callback)) {
                const instance = new runtime.callback(this.ctx, this.config);
                for (const hook of instance?.[symbols.initHooks] ?? []) hook();
                return instance?.[symbols.init]?.();
              } else return runtime.callback(this.ctx, this.config);
            },
            collect
          };
          this.dispose = parent.fiber.effect(() => {
            const remove = runtime.fibers.push(this);
            return async () => {
              this.uid = null;
              emitPluginDisposed(this.context, this);
              if (this.ctx.registry.has(runtime.callback)) {
                remove();
                if (!runtime.fibers.length) this.ctx.registry.delete(runtime.callback);
              }
              this._setEpoch(INACTIVE);
              if (!this.inertia) this._updateState(() => {
                this.inertia = this._unload();
                return 5;
              });
              while (this.inertia) await this.inertia;
            };
          }, "ctx.plugin()");
          try {
            this.context.emit("internal/plugin", this);
          } catch (error) {
            Promise.resolve(this.dispose()).catch((reason) => this.ctx.logger.error(reason));
            throw error;
          }
          if (this.uid !== null && parent.fiber.state !== 5) {
            for (const name3 of Object.keys(this.inject)) this._checkImpl(name3);
            this._refresh();
          }
        } else {
          this.uid = 0;
          this.ctx = this.context = parent;
          this.state = 2;
          this.store = /* @__PURE__ */ Object.create(null);
          this._runner = {
            epoch: "",
            getOuterStack,
            execute: () => {
            },
            collect
          };
          this.dispose = () => this.restart();
        }
      }
      /** The plugin's display name, inherited from the nearest named ancestor, else `'root'`. */
      get name() {
        let fiber = this;
        do {
          if (fiber.runtime?.name) return fiber.runtime.name;
          fiber = fiber.parent.fiber;
        } while (fiber !== fiber.parent.fiber);
        return "root";
      }
      /**
      * Throw if the fiber has already been disposed.
      *
      * @returns nothing when the fiber is still active.
      * @throws {CordisError} `INACTIVE_EFFECT` when the fiber's uid has been cleared.
      */
      assertActive() {
        if (this.uid !== null) return;
        throw new CordisError("INACTIVE_EFFECT");
      }
      _execute(runner) {
        const oldEpoch = runner.epoch;
        return composeError((info) => {
          const safeCollect = (dispose) => {
            if (typeof dispose === "function") runner.collect(dispose);
            else if (!isNullable(dispose)) throw new TypeError("Invalid effect");
          };
          const effect = runner.execute.call(this);
          if (typeof effect === "function") return runner.collect(effect);
          else if (isNullable(effect)) {
          } else if (!isObject(effect)) throw new TypeError("Invalid effect");
          else if ("then" in effect) return effect.then(safeCollect);
          else if (Symbol.iterator in effect) {
            info.error = /* @__PURE__ */ new Error();
            const iter = effect[Symbol.iterator]();
            while (true) {
              const result = iter.next();
              safeCollect(result.value);
              if (result.done) return;
            }
          } else if (Symbol.asyncIterator in effect) {
            const iter = effect[Symbol.asyncIterator]();
            return (async () => {
              await Promise.resolve();
              info.error = /* @__PURE__ */ new Error();
              while (true) {
                if (runner.epoch !== oldEpoch) return;
                const result = await iter.next();
                safeCollect(result.value);
                if (result.done) return;
              }
            })();
          } else throw new TypeError("Invalid effect");
        }, runner.getOuterStack);
      }
      effect(execute, label = "anonymous") {
        this.assertActive();
        if (this.state === 5) throw new CordisError("INACTIVE_EFFECT");
        const disposables = [];
        let disposing = false;
        let disposalTask;
        const dispose = () => {
          if (disposing) return disposalTask;
          disposing = true;
          let task2;
          for (const disposable of disposables.splice(0).reverse()) if (task2) task2 = task2.then(() => runDisposable(disposable));
          else {
            const result = runDisposable(disposable);
            if (isObject(result) && "then" in result) task2 = result;
          }
          return disposalTask = task2;
        };
        const meta = {
          label,
          children: []
        };
        const runner = {
          execute,
          epoch: true,
          collect: (dispose2) => {
            disposables.push(dispose2);
            this._disposables.delete(dispose2);
            if (dispose2[symbols.effect]) meta.children.push(dispose2[symbols.effect]);
          },
          getOuterStack: buildOuterStack()
        };
        let task;
        let executing = true;
        let resolveSetup;
        let rejectSetup;
        let setupBarrier;
        let setupFailed = false;
        let inFlight;
        let removeWrapper = () => false;
        const waitForSetup = () => {
          setupBarrier ??= new Promise((resolve, reject) => {
            resolveSetup = resolve;
            rejectSetup = reject;
          });
          return setupBarrier;
        };
        const disposeAfter = (setup) => {
          return Promise.resolve(setup).then(() => dispose(), async (reason) => {
            await dispose();
            throw reason;
          });
        };
        const finalizeDisposal = (callback) => {
          let result;
          try {
            result = callback();
          } catch (error) {
            removeWrapper();
            throw error;
          }
          if (isObject(result) && "then" in result) {
            const pending = Promise.resolve(result).finally(() => {
              removeWrapper();
              if (inFlight === pending) inFlight = void 0;
            });
            return inFlight = pending;
          }
          removeWrapper();
          return result;
        };
        const wrapper = defineProperty(() => {
          if (!runner.epoch) return setupFailed ? inFlight : void 0;
          runner.epoch = false;
          return finalizeDisposal(() => {
            if (executing) return disposeAfter(waitForSetup());
            return task ? disposeAfter(task) : dispose();
          });
        }, symbols.effect, meta);
        effectInertia.set(wrapper, () => inFlight);
        removeWrapper = this._disposables.push(wrapper);
        try {
          task = this._execute(runner);
        } catch (reason) {
          executing = false;
          setupFailed = true;
          runner.epoch = false;
          let cleanup;
          try {
            cleanup = finalizeDisposal(dispose);
          } finally {
            rejectSetup?.(reason);
          }
          if (isObject(cleanup) && "then" in cleanup) cleanup.catch((error) => this.ctx.logger.error(error));
          throw reason;
        }
        executing = false;
        if (setupBarrier) Promise.resolve(task).then(resolveSetup, rejectSetup);
        task?.catch(() => {
          if (!runner.epoch) return dispose();
          return finalizeDisposal(dispose);
        }).catch((error) => this.ctx.logger.error(error));
        const disposeAsync = () => {
          if (!runner.epoch) return;
          runner.epoch = false;
          return finalizeDisposal(dispose);
        };
        wrapper.then = async (onFulfilled, onRejected) => {
          return Promise.resolve(task).then(() => disposeAsync).then(onFulfilled, onRejected);
        };
        return wrapper;
      }
      /**
      * Return metadata for currently registered effects.
      *
      * @returns one {@link EffectMeta} tree per labeled live effect.
      */
      getEffects() {
        return [...this._disposables].map((dispose) => dispose[symbols.effect]).filter(Boolean);
      }
      _getState() {
        if (this.uid === null) return 4;
        if (this._error) return 3;
        if (this._runner.epoch !== INACTIVE) return 2;
        return 0;
      }
      _updateState(callback) {
        const oldState = this.state;
        this.state = callback() ?? this._getState();
        if (oldState === this.state) return;
        this.context.emit("internal/status", this, oldState);
        if (oldState !== 2 && this.state !== 2) return;
        for (const key of Reflect.ownKeys(this.ctx.reflect.store)) {
          const impl = this.ctx.reflect.store[key];
          if (impl.fiber !== this) continue;
          this.ctx.reflect.notify([impl.name]);
        }
      }
      _checkImpl(name3) {
        const impl = this.ctx.reflect._getImpl(name3, true);
        if (!impl) return delete this._store[name3];
        try {
          if (impl.check && !impl.check.call(getTraceable(this.ctx, impl.value))) return delete this._store[name3];
        } catch (error) {
          impl.fiber.ctx.logger.error(error);
          return delete this._store[name3];
        }
        this._store[name3] = impl;
      }
      _refresh() {
        let epoch = false;
        epoch = "";
        for (const name3 of Object.keys(this.inject)) {
          const impl = this._store[name3];
          if (!impl) {
            epoch = INACTIVE;
            break;
          }
          epoch += ":" + impl.fiber.uid;
        }
        this._setEpoch(epoch);
      }
      _setEpoch(epoch) {
        const oldEpoch = this._runner.epoch;
        if (epoch === oldEpoch) return;
        this._runner.epoch = epoch;
        if (this.inertia) return;
        this._updateState(() => {
          if (epoch !== INACTIVE && oldEpoch === INACTIVE) {
            this.inertia = this._reload();
            return 1;
          } else {
            this.inertia = this._unload();
            return 5;
          }
        });
      }
      _resolveConfig(config) {
        config = this.context.waterfall(this, "internal/config", config, () => config);
        return this.runtime ? resolveConfig(this.runtime, config) : config;
      }
      async _reload() {
        this.store = { ...this._store };
        const oldEpoch = this._runner.epoch;
        try {
          await Promise.resolve();
          if (this._runner.epoch === oldEpoch) {
            this.config = this._resolveConfig(this._config);
            await this._execute(this._runner);
            this._error = void 0;
          }
        } catch (reason) {
          this.ctx.logger.error(reason);
          this._error = reason;
          this._runner.epoch = INACTIVE;
        }
        this._updateState(() => {
          if (this._runner.epoch === oldEpoch) this.inertia = void 0;
          else {
            this.inertia = this._unload();
            return 5;
          }
        });
      }
      async _unload() {
        await Promise.all(this._disposables.clear().map(async (dispose) => {
          try {
            await composeError(async (info) => {
              await Promise.resolve();
              info.error = /* @__PURE__ */ new Error();
              await runDisposable(dispose);
            }, this._runner.getOuterStack);
          } catch (reason) {
            this.ctx.logger.error(reason);
          }
        }));
        this.store = void 0;
        this._updateState(() => {
          if (this._runner.epoch === INACTIVE) this.inertia = void 0;
          else {
            this.inertia = this._reload();
            return 1;
          }
        });
      }
      /**
      * Wait for current lifecycle work and rethrow startup errors.
      *
      * @returns this fiber, once it has settled into a stable state.
      * @throws the config-validation or plugin-startup error, if any.
      */
      async await() {
        while (this.inertia) await this.inertia;
        if (this._error) throw this._error;
        return this;
      }
      /**
      * Dispose and immediately reload this plugin with its current config.
      *
      * @returns a promise resolving once the reload settled.
      * @throws {CordisError} `INACTIVE_EFFECT` when the fiber is already disposed.
      */
      async restart() {
        this.assertActive();
        this._setEpoch(INACTIVE);
        this._refresh();
        await this.await();
      }
      /**
      * Validate and apply new config, then restart the plugin.
      *
      * Runs the `internal/update` waterfall first, so update hooks (and HMR)
      * can veto or replace the restart.
      *
      * @param config — the new raw config; validated before anything restarts.
      * @param noSave — hint for persistence hooks not to write the change back.
      * @returns nothing; the restart runs behind the `internal/update` waterfall.
      * @throws {ValidationError} when the new config fails validation.
      */
      update(config, noSave = false) {
        this.assertActive();
        this._config = config;
        if (this.state !== 2) {
          this._error = void 0;
          this._setEpoch(INACTIVE);
          this._refresh();
          return;
        }
        config = this._resolveConfig(config);
        this.context.waterfall(this, "internal/update", config, noSave, () => {
          this.config = config;
          this._error = void 0;
          return this.restart();
        });
      }
    };
    (function(Inject2) {
      function resolve(inject2, result = /* @__PURE__ */ Object.create(null)) {
        if (!inject2) return result;
        if (Array.isArray(inject2)) for (const name3 of inject2) result[name3] = null;
        else if (Reflect.has(inject2, symbols.checkProto)) {
          Object.assign(result, resolve(Object.getPrototypeOf(inject2)));
          for (const name3 of Object.keys(inject2)) result[name3] = inject2[name3] ?? null;
        } else for (const name3 of Object.keys(inject2)) result[name3] = inject2[name3] ?? null;
        return result;
      }
      Inject2.resolve = resolve;
    })(Inject || (Inject = {}));
    RegistryService = class {
      ctx;
      _counter = 0;
      _internal = /* @__PURE__ */ new Map();
      constructor(ctx) {
        this.ctx = ctx;
        defineProperty(this, symbols.tracker, {
          property: "ctx",
          noShadow: true
        });
      }
      /** Allocate the next fiber uid (increments on every read). */
      get counter() {
        return ++this._counter;
      }
      /** Number of registered plugin runtimes. */
      get size() {
        return this._internal.size;
      }
      /**
      * Resolve a supported plugin shape to its executable callback.
      *
      * @param plugin — a function, class, or `{ apply }` object plugin.
      * @returns the callback identifying the plugin, or `undefined` if invalid.
      */
      resolve(plugin) {
        try {
          if (typeof plugin === "function") return plugin;
          if (isApplicable(plugin)) return plugin.apply;
        } catch {
        }
      }
      /**
      * Look up the runtime record for a plugin.
      *
      * @param plugin — any supported plugin shape.
      * @returns the runtime, or `undefined` when the plugin is not registered.
      */
      get(plugin) {
        const key = this.resolve(plugin);
        return key && this._internal.get(key);
      }
      /**
      * Check whether a plugin has a registered runtime.
      *
      * @param plugin — any supported plugin shape.
      * @returns `true` when at least one fiber of the plugin exists.
      */
      has(plugin) {
        const key = this.resolve(plugin);
        return !!key && this._internal.has(key);
      }
      /**
      * Dispose every running fiber for a plugin and remove its runtime record.
      *
      * @param plugin — any supported plugin shape.
      * @returns the removed runtime, or `undefined` when none was registered.
      */
      delete(plugin) {
        const key = this.resolve(plugin);
        const runtime = key && this._internal.get(key);
        if (!runtime) return;
        this._internal.delete(key);
        for (const fiber of runtime.fibers) fiber.dispose();
        return runtime;
      }
      /** Iterate the registered plugin callbacks. */
      keys() {
        return this._internal.keys();
      }
      /** Iterate the registered plugin runtimes. */
      values() {
        return this._internal.values();
      }
      /** Iterate `[callback, runtime]` pairs. */
      entries() {
        return this._internal.entries();
      }
      /**
      * Visit every registered runtime.
      *
      * @param callback — receives each runtime and its identifying callback.
      */
      forEach(callback) {
        return this._internal.forEach(callback);
      }
      /**
      * Start a callback once the requested dependencies are available.
      *
      * @param inject — required services, as an array or a name → config map.
      * @param callback — plugin body called with `(ctx, config)`.
      * @returns the fiber; awaiting it settles once loading finished.
      */
      inject(inject2, callback) {
        return this.plugin({
          inject: inject2,
          apply: callback,
          name: callback.name
        });
      }
      /**
      * Start a plugin in the current context and return its fiber.
      *
      * Creates (or reuses) the plugin's runtime record, then starts a new fiber
      * under the current context. Throws if `plugin` is not a supported shape or
      * if the current fiber is already disposed.
      *
      * @param plugin — a function, class, or `{ apply }` object plugin.
      * @param config — the plugin config, validated against its `Config` schema.
      * @param getOuterStack — captures the caller stack for effect diagnostics.
      * @returns the fiber; awaiting it settles once loading finished.
      */
      plugin(plugin, config, getOuterStack = buildOuterStack()) {
        const callback = this.resolve(plugin);
        if (!callback) throw new Error('invalid plugin, expect function or object with an "apply" method, received ' + typeof plugin);
        this.ctx.fiber.assertActive();
        let runtime = this._internal.get(callback);
        if (!runtime) {
          let name3 = plugin.name;
          if (name3 === "apply") name3 = void 0;
          runtime = {
            name: name3,
            callback,
            fibers: new DisposableList(),
            Config: plugin.Config
          };
          this._internal.set(callback, runtime);
        }
        const fiber = new Fiber(this.ctx, config, Inject.resolve(plugin.inject), runtime, getOuterStack);
        const wrapped = Object.create(fiber);
        wrapped.then = (onFulfilled, onRejected) => {
          return fiber.await().then(onFulfilled, onRejected);
        };
        return wrapped;
      }
    };
    Context = class Context2 {
      /** Symbol key under which a disposer exposes its {@link EffectMeta} diagnostics tree. */
      static effect = symbols.effect;
      /** Symbol key for a context's listener filter, consulted on every event dispatch. */
      static filter = symbols.filter;
      /** Symbol key of the isolation map (see the `Context[symbols.isolate]` property). */
      static isolate = symbols.isolate;
      /** Symbol key of the intercept map (see the `Context[symbols.intercept]` property). */
      static intercept = symbols.intercept;
      /**
      * Returns true for Cordis context proxies and context prototypes.
      *
      * Works across realms and across multiple copies of cordis, because the
      * brand is keyed by a global symbol rather than by `instanceof`.
      *
      * @param value — the value to test.
      * @returns `true` if `value` is a Cordis context, narrowing its type.
      */
      static is(value) {
        return !!value?.[Context2.is];
      }
      static {
        Context2.is[Symbol.toPrimitive] = () => Symbol.for("cordis.is");
        Context2.prototype[Context2.is] = true;
      }
      /** Create the root context and install the built-in services. */
      constructor() {
        this[symbols.isolate] = /* @__PURE__ */ Object.create(null);
        this[symbols.intercept] = /* @__PURE__ */ Object.create(null);
        const self = new Proxy(this, ReflectService.handler);
        this.root = self;
        this.baseUrl = void 0;
        this.fiber = new Fiber(self, {}, /* @__PURE__ */ Object.create(null), null, () => []);
        this.reflect = new ReflectService(self);
        this.registry = new RegistryService(self);
        this.events = new EventsService(self);
        this.logger = new LoggerService(self);
        this.fiber._disposables.clear();
        return self;
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return `Context <${this.fiber.name}>`;
      }
      /**
      * Create a child context with extra metadata on top of the current scope.
      *
      * The child prototypally inherits every property of this context; own
      * properties of `meta` shadow the inherited ones. The parent is not mutated.
      *
      * @param meta — own properties (including symbol keys) to define on the child.
      * @returns a child context inheriting from this one.
      */
      extend(meta = {}) {
        const shadow = Reflect.getOwnPropertyDescriptor(this, symbols.shadow)?.value;
        const self = Object.create(getTraceable(this, this));
        for (const prop of Reflect.ownKeys(meta)) Object.defineProperty(self, prop, Reflect.getOwnPropertyDescriptor(meta, prop));
        if (!shadow) return self;
        return Object.assign(Object.create(self), { [symbols.shadow]: shadow });
      }
      /**
      * Create a child context with an independent service scope for `name`.
      *
      * Below the returned context, reads and writes of the service `name`
      * resolve against the new label instead of the parent's, so a different
      * implementation can be provided without affecting the parent scope.
      * Passing the same `label` to two `isolate()` calls joins their scopes.
      *
      * @param name — the service name to isolate.
      * @param label — scope label to join; defaults to a fresh unique symbol.
      * @returns a child context whose `name` service resolves in the new scope.
      */
      isolate(name3, label) {
        const shadow = Object.create(this[symbols.isolate]);
        shadow[name3] = label ?? Symbol(name3);
        return this.extend({ [symbols.isolate]: shadow });
      }
      intercept(name3, config) {
        const intercept = Object.create(this[symbols.intercept]);
        intercept[name3] = config;
        return this.extend({ [symbols.intercept]: intercept });
      }
    };
    Service = class Service2 {
      ctx;
      /** Symbol key of an instance method run after construction (class plugins). */
      static init = symbols.init;
      /** Symbol key of the availability predicate passed to `ctx.provide()`. */
      static check = symbols.check;
      /** Symbol key of the phantom intercept-config type parameter. */
      static config = symbols.config;
      /** Symbol key of the call body making a service callable (e.g. `ctx.logger()`). */
      static invoke = symbols.invoke;
      /** Symbol key of the helper deriving an extended service instance. */
      static extend = symbols.extend;
      /** Symbol key of the tracker metadata used for context tracing. */
      static tracker = symbols.tracker;
      /** Symbol key of the intercept-config resolution helper below. */
      static resolveConfig = symbols.resolveConfig;
      /** The service name this instance is registered under. */
      name;
      /**
      * Register this instance as `name` in the current context.
      *
      * Calls `ctx.reflect.provide(name, this, this[Service.check])`, so the
      * service is unregistered automatically when the owning fiber unloads.
      * Services with a `[Service.invoke]` body return a callable instance.
      *
      * @param ctx — the context to register in (stored as `this.ctx`).
      * @param name — the service name; defaults to the static `provide` field.
      */
      constructor(ctx, name3) {
        this.ctx = ctx;
        name3 ??= this.constructor["provide"];
        let self = this;
        const tracker = {
          associate: name3,
          property: "ctx"
        };
        if (self[symbols.invoke]) self = createCallable(name3, joinPrototype(Object.getPrototypeOf(this), Function.prototype), tracker);
        self.ctx = ctx;
        self.name = name3;
        defineProperty(self, symbols.tracker, tracker);
        self.ctx.reflect.provide(name3, self, this[symbols.check]);
        return self;
      }
      [symbols.filter](ctx) {
        return ctx[symbols.isolate][this.name] === this.ctx[symbols.isolate][this.name];
      }
      [symbols.extend](props) {
        let self;
        if (this[Service2.invoke]) self = createCallable(this.name, this, this[symbols.tracker]);
        else self = Object.create(this);
        return Object.assign(self, props);
      }
      /**
      * Merge intercept config from ancestors with optional base and head values.
      *
      * Entries added closer to the root apply first; `base` is prepended and
      * `head` appended. Uses `Config.merge` when the service declares one,
      * otherwise a shallow `Object.assign`.
      *
      * @param base — lowest-precedence config merged before all intercepts.
      * @param head — highest-precedence config merged after all intercepts.
      * @returns the merged config.
      */
      [symbols.resolveConfig](base, head) {
        let intercept = this.ctx[Context.intercept];
        const configs = [];
        while (this.name in intercept) {
          if (Object.hasOwn(intercept, this.name)) configs.unshift(intercept[this.name]);
          intercept = Object.getPrototypeOf(intercept);
        }
        if (base) configs.unshift(base);
        if (head) configs.push(head);
        if (this["Config"]?.merge) return this["Config"].merge(...configs);
        else return Object.assign({}, ...configs);
      }
      static [Symbol.hasInstance](instance) {
        if (!instance) return false;
        let constructor = instance.constructor;
        while (constructor) {
          constructor = constructor.prototype?.constructor;
          if (constructor === this) return true;
          constructor &&= Object.getPrototypeOf(constructor);
        }
        return false;
      }
    };
  }
});

// ../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-typert-protocol/lib/index.js
function isTypertRemoteSegment(value) {
  return value !== "." && value !== ".." && TYPERT_REMOTE_SEGMENT_PATTERN.test(value);
}
function bindTypertRemote(service, serviceKey, options = {}) {
  validateName("service key", serviceKey);
  const namespace = options.namespace ?? serviceKey;
  validateName("namespace", namespace);
  const ctx = Reflect.get(service, "ctx");
  if (ctx instanceof Context) provideInvocationAccessor(ctx);
  return Object.freeze({
    service,
    serviceKey,
    namespace
  });
}
function provideInvocationAccessor(ctx) {
  if (Object.hasOwn(ctx.root.reflect.props, "invocation")) return;
  ctx.root.accessor("invocation", { get: () => void 0 });
}
function Remote(methodExportOrOptions, context) {
  if (typeof methodExportOrOptions === "string") {
    validateName("Remote export name", methodExportOrOptions);
    return remoteDecorator({ kind: "direct" }, void 0, methodExportOrOptions);
  }
  if (typeof methodExportOrOptions === "object") {
    if (remoteOptionMode(methodExportOrOptions) !== "stream" || Reflect.ownKeys(methodExportOrOptions).length !== 1) throw new TypeError('typert-protocol: Remote options must contain exactly mode: "stream"');
    return remoteDecorator({ kind: "direct" }, "stream");
  }
  if (context === void 0) throw new TypeError("typert-protocol: Remote decorator context is missing");
  addMarkerInitializer(context, { kind: "direct" });
}
function remoteOptionMode(options) {
  return Reflect.get(options, "mode");
}
function remoteDecorator(invocation, mode, exportName) {
  return function(_method, context) {
    addMarkerInitializer(context, invocation, mode, exportName);
  };
}
function readRemoteMethodDescriptor(prototype) {
  const property = Object.getOwnPropertyDescriptor(prototype, REMOTE_METHOD_DESCRIPTOR);
  if (property === void 0) return void 0;
  const descriptor = property.value;
  if (descriptor === null || typeof descriptor !== "object") throw new TypeError("typert-protocol: Remote method descriptor must be an object");
  const version2 = Reflect.get(descriptor, "version");
  if (version2 !== 1) throw new TypeError(`typert-protocol: unsupported Remote method descriptor version ${String(version2)}`);
  const methods = Reflect.get(descriptor, "methods");
  if (!Array.isArray(methods)) throw new TypeError("typert-protocol: Remote method descriptor methods must be an array");
  return descriptor;
}
function addMarkerInitializer(context, invocation, mode, exportName) {
  if (context.private || context.static || typeof context.name !== "string") throw new TypeError("typert-protocol: Remote decorators require a public instance method with a string name");
  const method = context.name;
  context.addInitializer(function() {
    const prototype = Object.getPrototypeOf(this);
    if (prototype === null) throw new TypeError(`typert-protocol: cannot mark Remote method "${method}" on an object without a prototype`);
    mark(prototype, method, invocation, mode, exportName);
  });
}
function mark(prototype, method, invocation, mode, exportName) {
  const descriptor = readRemoteMethodDescriptor(prototype);
  const marker = Object.freeze({
    method,
    ...exportName === void 0 || exportName === method ? {} : { exportName },
    ...mode === void 0 ? {} : { mode },
    invocation: Object.freeze(invocation)
  });
  const current = descriptor?.methods.find((candidate) => candidate.method === method);
  if (current !== void 0) {
    if (current.exportName === marker.exportName && current.mode === marker.mode && sameInvocation(current.invocation, invocation)) return;
    throw new Error(`typert-protocol: Remote method "${method}" has conflicting invocation markers`);
  }
  Object.defineProperty(prototype, REMOTE_METHOD_DESCRIPTOR, {
    configurable: true,
    value: Object.freeze({
      version: 1,
      methods: Object.freeze([...descriptor?.methods ?? [], marker])
    })
  });
}
function sameInvocation(left, right) {
  if (left.kind === "direct") return right.kind === "direct";
  if (right.kind === "direct") return false;
  return left.context === right.context;
}
function validateName(subject, value) {
  if (!isTypertRemoteSegment(value)) throw new TypeError(`typert-protocol: ${subject} must contain only RPC endpoint segment characters`);
}
var RemoteError, TYPERT_OWNED_VALUE, TYPERT_REMOTE_SEGMENT_PATTERN, REMOTE_METHOD_DESCRIPTOR, TypertRemoteService;
var init_lib3 = __esm({
  "../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-typert-protocol/lib/index.js"() {
    init_lib2();
    RemoteError = class extends Error {
      code;
      details;
      /** Structural marker: cross-realm/bundle identification never uses instanceof. */
      isDSHRemoteError = true;
      /**
      * @param code - stable failure code declared in {@link RemoteErrorDetailsMap}.
      * @param message - human diagnostic carried across the wire.
      * @param details - structured payload typed by the code.
      * @param options - standard Error options (`cause` survives in-process only).
      */
      constructor(code, message, details, options) {
        super(message, options);
        this.code = code;
        this.details = details;
        this.name = "RemoteError";
      }
    };
    TYPERT_OWNED_VALUE = Symbol.for("dsh.typert.owned-value");
    TYPERT_REMOTE_SEGMENT_PATTERN = /^[A-Za-z0-9_$.-]+$/;
    REMOTE_METHOD_DESCRIPTOR = "@deepseek-ai/dsh-typert-protocol/remote-methods";
    TypertRemoteService = class extends Service {
      /** Visible binding consumed by the Gateway's source-mode discovery. */
      typertRemote;
      /**
      * Register the Service and bind the same key to Typert Gateway.
      * @param ctx - owning Cordis Context.
      * @param serviceKey - exact Cordis service key and default wire namespace.
      * @param options - optional distinct wire namespace.
      */
      constructor(ctx, serviceKey, options = {}) {
        super(ctx, serviceKey);
        this.typertRemote = bindTypertRemote(this, this.name, options);
      }
    };
  }
});

// ../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-util-values/lib/index.js
function assertNever(value, context) {
  const rendered = JSON.stringify(value) ?? String(value);
  throw new Error(`unreachable variant${context ? ` in ${context}` : ""}: ${rendered}`);
}
function hasIntrinsicConstructor(prototype, name3) {
  const constructor = Object.getOwnPropertyDescriptor(prototype, "constructor")?.value;
  if (typeof constructor !== "function") return false;
  try {
    return constructor.name === name3 && constructor.prototype === prototype && Function.prototype.toString.call(constructor) === Function.prototype.toString.call(name3 === "Array" ? Array : Object);
  } catch {
    return false;
  }
}
function isIntrinsicObjectPrototype(value) {
  return Object.getPrototypeOf(value) === null && hasIntrinsicConstructor(value, "Object");
}
function hasPlainArrayPrototype(value) {
  const prototype = Object.getPrototypeOf(value);
  if (!Array.isArray(prototype) || !hasIntrinsicConstructor(prototype, "Array")) return false;
  const objectPrototype = Object.getPrototypeOf(prototype);
  return typeof objectPrototype === "object" && objectPrototype !== null && isIntrinsicObjectPrototype(objectPrototype);
}
function hasPlainObjectPrototype(value) {
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || typeof prototype === "object" && isIntrinsicObjectPrototype(prototype);
}
function enumerableStringKeys(value) {
  const keys2 = Reflect.ownKeys(value);
  if (keys2.some((key) => typeof key !== "string" || !Object.prototype.propertyIsEnumerable.call(value, key))) return void 0;
  return keys2;
}
function walkJsonValue(value, detach) {
  const ancestors = /* @__PURE__ */ new Set();
  let root;
  const assign = (destination, item) => {
    if (destination === void 0) return;
    if (destination.kind === "root") root = item;
    else if (destination.kind === "array") destination.target[destination.index] = item;
    else Object.defineProperty(destination.target, destination.key, {
      value: item,
      enumerable: true,
      configurable: true,
      writable: true
    });
  };
  const tasks = [{
    kind: "visit",
    value,
    ...detach ? { destination: { kind: "root" } } : {}
  }];
  for (let task = tasks.pop(); task !== void 0; task = tasks.pop()) {
    if (task.kind === "leave") {
      ancestors.delete(task.source);
      continue;
    }
    if (task.kind === "array-item") {
      if (!Object.prototype.hasOwnProperty.call(task.source, task.index)) return void 0;
      tasks.push({
        kind: "visit",
        value: task.source[task.index],
        ...task.target === void 0 ? {} : { destination: {
          kind: "array",
          target: task.target,
          index: task.index
        } }
      });
      continue;
    }
    if (task.kind === "object-property") {
      tasks.push({
        kind: "visit",
        value: task.source[task.key],
        ...task.target === void 0 ? {} : { destination: {
          kind: "object",
          target: task.target,
          key: task.key
        } }
      });
      continue;
    }
    const current = task.value;
    if (current === null) {
      assign(task.destination, null);
      continue;
    }
    if (typeof current === "boolean" || typeof current === "string") {
      assign(task.destination, current);
      continue;
    }
    if (typeof current === "number") {
      if (!Number.isFinite(current) || Object.is(current, -0)) return void 0;
      assign(task.destination, current);
      continue;
    }
    if (typeof current !== "object") return void 0;
    if (ancestors.has(current)) return void 0;
    if (Array.isArray(current)) {
      if (!hasPlainArrayPrototype(current)) return void 0;
      const length = current.length;
      if (Reflect.ownKeys(current).length !== length + 1) return void 0;
      const target2 = detach ? [] : void 0;
      if (target2 !== void 0) assign(task.destination, target2);
      ancestors.add(current);
      tasks.push({
        kind: "leave",
        source: current
      });
      for (let index = length - 1; index >= 0; index--) tasks.push({
        kind: "array-item",
        source: current,
        index,
        ...target2 === void 0 ? {} : { target: target2 }
      });
      continue;
    }
    if (!hasPlainObjectPrototype(current)) return void 0;
    const keys2 = enumerableStringKeys(current);
    if (keys2 === void 0) return void 0;
    const target = detach ? {} : void 0;
    if (target !== void 0) assign(task.destination, target);
    ancestors.add(current);
    tasks.push({
      kind: "leave",
      source: current
    });
    for (let index = keys2.length - 1; index >= 0; index--) {
      const key = keys2[index];
      if (key === void 0) return void 0;
      tasks.push({
        kind: "object-property",
        source: current,
        key,
        ...target === void 0 ? {} : { target }
      });
    }
  }
  return detach ? root : true;
}
function snapshotJsonValue(value) {
  return walkJsonValue(value, true);
}
function isJsonValue(value) {
  return walkJsonValue(value, false) === true;
}
function deepFreeze(value) {
  const seen = /* @__PURE__ */ new WeakSet();
  const pending = [{
    kind: "visit",
    node: value
  }];
  while (pending.length > 0) {
    const task = pending.pop();
    if (task === void 0) continue;
    if (task.kind === "property") {
      pending.push({
        kind: "visit",
        node: task.source[task.key]
      });
      continue;
    }
    const node = task.node;
    if (node === null || typeof node !== "object") continue;
    if (node instanceof AbortSignal) continue;
    if (seen.has(node)) continue;
    seen.add(node);
    Object.freeze(node);
    const keys2 = Object.keys(node);
    for (let index = keys2.length - 1; index >= 0; index--) {
      const key = keys2[index];
      if (key === void 0) continue;
      pending.push({
        kind: "property",
        source: node,
        key
      });
    }
  }
  return value;
}
var init_lib4 = __esm({
  "../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-util-values/lib/index.js"() {
  }
});

// ../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-util-crypto/lib/index.js
function randomUUID() {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const hex = Array.from(bytes, (byte, index) => {
    return (index === 6 ? byte & 15 | 64 : index === 8 ? byte & 63 | 128 : byte).toString(16).padStart(2, "0");
  }).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
var init_lib5 = __esm({
  "../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-util-crypto/lib/index.js"() {
  }
});

// ../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-brand/lib/index.js
function brandString(value) {
  return value;
}
var init_lib6 = __esm({
  "../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-brand/lib/index.js"() {
  }
});

// ../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-timeout/lib/index.js
var MAX_TIMER_DELAY_MS;
var init_lib7 = __esm({
  "../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-timeout/lib/index.js"() {
    MAX_TIMER_DELAY_MS = 2147483647;
  }
});

// ../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-llm/lib/index.js
var lib_exports = {};
__export(lib_exports, {
  ACCOUNT_QUOTA_EXCEEDED_CODE: () => ACCOUNT_QUOTA_EXCEEDED_CODE,
  APP_IDENTITY: () => APP_IDENTITY,
  AssistantStreamAccumulator: () => AssistantStreamAccumulator,
  BlockAssembler: () => BlockAssembler,
  CONTEXT_SUMMARY_MAX_CHARS: () => CONTEXT_SUMMARY_MAX_CHARS,
  CONTEXT_WINDOW_EXCEEDED_CODE: () => CONTEXT_WINDOW_EXCEEDED_CODE,
  EMPTY_RESPONSE_CODE: () => EMPTY_RESPONSE_CODE,
  HarnessError: () => HarnessError,
  IMAGE_OFFLOAD_REQUIRED_CODE: () => IMAGE_OFFLOAD_REQUIRED_CODE,
  INVALID_CREDENTIAL_CODE: () => INVALID_CREDENTIAL_CODE,
  LlmAdapter: () => LlmAdapter,
  LlmAttemptId: () => LlmAttemptId,
  LlmError: () => LlmError,
  LlmRuntime: () => LlmRuntime,
  MessageId: () => MessageId,
  ProviderRequestId: () => ProviderRequestId,
  QUOTA_EXCEEDED_CODE: () => QUOTA_EXCEEDED_CODE,
  ReasoningEffortId: () => ReasoningEffortId,
  RetryPolicySchema: () => RetryPolicySchema,
  ToolCallId: () => ToolCallId,
  assembleAssistantStream: () => assembleAssistantStream,
  assertUsableApiKey: () => assertUsableApiKey,
  assistantStreamChunks: () => assistantStreamChunks,
  assistantStreamFirstTokenTime: () => assistantStreamFirstTokenTime,
  assistantStreamHasVisibleContent: () => assistantStreamHasVisibleContent,
  assistantStreamHasVisibleText: () => assistantStreamHasVisibleText,
  attributionHeaders: () => attributionHeaders,
  boundContextSummary: () => boundContextSummary,
  callConfigEquals: () => callConfigEquals,
  chunkHasVisibleText: () => chunkHasVisibleText,
  contentHasFile: () => contentHasFile,
  contentHasImage: () => contentHasImage,
  createAssistantMessage: () => createAssistantMessage,
  createDeveloperMessage: () => createDeveloperMessage,
  createMessage: () => createMessage,
  createSystemMessage: () => createSystemMessage,
  createToolResultMessage: () => createToolResultMessage,
  createUserMessage: () => createUserMessage,
  default: () => LlmRuntime,
  errorChain: () => errorChain,
  expandAssistantStream: () => expandAssistantStream,
  fileHandleText: () => fileHandleText,
  freezeMessage: () => freezeMessage,
  isAgentLoopRequest: () => isAgentLoopRequest,
  isContextWindowExceededError: () => isContextWindowExceededError,
  isHarnessError: () => isHarnessError,
  isQuotaExceededError: () => isQuotaExceededError,
  isTokenDelta: () => isTokenDelta,
  isVisibleChunk: () => isVisibleChunk,
  joinAssistantStreamText: () => joinAssistantStreamText,
  lastAssistantStreamChunk: () => lastAssistantStreamChunk,
  markAgentLoopRequest: () => markAgentLoopRequest,
  normalizeApiKey: () => normalizeApiKey,
  offloadedImageText: () => offloadedImageText,
  projectFilesToText: () => projectFilesToText,
  projectImagesForTextModel: () => projectImagesForTextModel,
  projectOffloadedImages: () => projectOffloadedImages,
  projectToolUpdates: () => projectToolUpdates,
  requestImageHandleText: () => requestImageHandleText,
  requiredImageOffload: () => requiredImageOffload,
  resolveImageAttachmentAccess: () => resolveImageAttachmentAccess,
  resolveRetryPolicy: () => resolveRetryPolicy,
  runFirstTokenTime: () => runFirstTokenTime,
  runFirstVisibleTime: () => runFirstVisibleTime,
  textOnlyImageText: () => textOnlyImageText,
  userAgent: () => userAgent
});
import { createRequire } from "node:module";
import z from "@deepseek-ai/schemastery";
function boundContextSummary(summary) {
  return summary.length <= 120 ? summary : `${summary.slice(0, 119)}\u2026`;
}
function freezeMessage(message) {
  return deepFreeze(structuredClone(message));
}
function createMessage(input) {
  return deepFreeze(structuredClone({
    ...input,
    id: brandString(randomUUID())
  }));
}
function createDeveloperMessage(input) {
  return createMessage({
    ...input,
    role: "developer"
  });
}
function createUserMessage(input) {
  return createMessage({
    ...input,
    role: "user"
  });
}
function createAssistantMessage(input) {
  return createMessage({
    role: "assistant",
    content: input.content,
    source: {
      kind: "model",
      ...input.source
    }
  });
}
function createSystemMessage(text) {
  return createMessage({
    role: "system",
    content: text.length === 0 ? [] : [{
      type: "text",
      text
    }],
    source: { kind: "system-prompt" }
  });
}
function createToolResultMessage(input) {
  return createMessage({
    role: "tool",
    source: {
      kind: "tool",
      callId: input.callId
    },
    toolCallId: input.callId,
    content: input.content,
    isError: input.isError
  });
}
function isContextWindowExceededError(detail) {
  return STRUCTURED_CONTEXT_OVERFLOW.test(detail) || /\b(?:maximum|max)(?:\s+(?:allowed|supported))?\s+context\s+(?:length|window)\b/i.test(detail) || TOO_LARGE_FOR_CONTEXT.test(detail) || /\b(?:input|prompt|request)\s+(?:is\s+)?too\s+(?:long|large)\s+for\s+(?:this|the)\s+model\b/i.test(detail) || EXCEEDS_MODEL_CONTEXT.test(detail);
}
function isQuotaExceededError(detail) {
  return /\binsufficient[\s_-]+(?:quota|balance|credits?)\b/i.test(detail) || /\b(?:quota|usage[\s_-]+limit)[\s_-]+(?:exceeded|exhausted|reached)\b/i.test(detail) || /\bexceed(?:ed|s)?[\s_-]+(?:(?:your|the)[\s_-]+)?(?:current[\s_-]+)?quota\b/i.test(detail) || /\b(?:balance|credits?)[\s_-]+(?:exhausted|depleted)\b/i.test(detail) || /\bout[\s_-]+of[\s_-]+(?:credits?|budget)\b/i.test(detail);
}
function errorChain(value) {
  const path = /* @__PURE__ */ new Set();
  const render = (current) => {
    if (path.has(current)) return "<circular cause>";
    path.add(current);
    try {
      if (!(current instanceof Error)) {
        if (typeof current === "object" && current !== null) {
          const descriptor = Object.getOwnPropertyDescriptor(current, "message");
          if (descriptor !== void 0 && "value" in descriptor && typeof descriptor.value === "string") return descriptor.value;
        }
        return String(current);
      }
      const message = current.message === "" ? current.name : current.message;
      const members = current instanceof AggregateError && current.errors.length > 0 ? ` [${current.errors.map(render).join("; ")}]` : "";
      const causeText = current.cause === void 0 || current.cause === null ? "" : render(current.cause);
      return `${message}${members}${causeText === "" || causeText === message ? "" : `: ${causeText}`}`;
    } catch {
      return "<unrenderable value>";
    } finally {
      path.delete(current);
    }
  };
  return render(value);
}
function isHarnessError(value) {
  return value instanceof HarnessError;
}
function validateKeys(value, allowed, path) {
  for (const key of Object.keys(value)) if (!allowed.has(key)) throw new Error(`${path}: unknown key "${key}"`);
}
function resolveBackoff(config, path) {
  if (config !== void 0) validateKeys(config, BACKOFF_KEYS, path);
  const initialDelayMs = config?.initialDelayMs ?? DEFAULT_INITIAL_DELAY_MS;
  const maxDelayMs = config?.maxDelayMs ?? DEFAULT_MAX_DELAY_MS;
  const jitterRatio = config?.jitterRatio ?? DEFAULT_JITTER_RATIO;
  if (!Number.isFinite(initialDelayMs) || initialDelayMs <= 0 || initialDelayMs > MAX_TIMER_DELAY_MS) throw new Error(`${path}.initialDelayMs must be a positive finite number no greater than ${MAX_TIMER_DELAY_MS}`);
  if (!Number.isFinite(maxDelayMs) || maxDelayMs <= 0 || maxDelayMs > MAX_TIMER_DELAY_MS) throw new Error(`${path}.maxDelayMs must be a positive finite number no greater than ${MAX_TIMER_DELAY_MS}`);
  if (initialDelayMs > maxDelayMs) throw new Error(`${path}.initialDelayMs must be less than or equal to maxDelayMs`);
  if (!Number.isFinite(jitterRatio) || jitterRatio < 0 || jitterRatio > 1) throw new Error(`${path}.jitterRatio must be between 0 and 1`);
  return Object.freeze({
    initialDelayMs,
    maxDelayMs,
    jitterRatio
  });
}
function resolveRetryPolicy(config, path) {
  if (config === void 0) return Object.freeze({
    mode: "normal",
    maxRetries: DEFAULT_MAX_RETRIES,
    retryableCodes: DEFAULT_RETRYABLE_CODES,
    ...resolveBackoff(void 0, `${path}.backoff`)
  });
  switch (config.mode) {
    case "normal": {
      validateKeys(config, NORMAL_POLICY_KEYS, path);
      const maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
      const retryableCodes = config.retryableCodes ?? [...DEFAULT_RETRYABLE_CODES];
      if (!Number.isSafeInteger(maxRetries) || maxRetries < 0) throw new Error(`${path}.maxRetries must be a non-negative safe integer`);
      if (retryableCodes.length === 0) throw new Error(`${path}.retryableCodes must not be empty`);
      if (retryableCodes.some((code) => typeof code !== "string" || code.length === 0)) throw new Error(`${path}.retryableCodes must contain only non-empty strings`);
      if (new Set(retryableCodes).size !== retryableCodes.length) throw new Error(`${path}.retryableCodes must not contain duplicates`);
      return Object.freeze({
        mode: "normal",
        maxRetries,
        retryableCodes: Object.freeze([...retryableCodes]),
        ...resolveBackoff(config.backoff, `${path}.backoff`)
      });
    }
    case "always":
      validateKeys(config, ALWAYS_POLICY_KEYS, path);
      return Object.freeze({
        mode: "always",
        ...resolveBackoff(config.backoff, `${path}.backoff`)
      });
    default:
      throw new Error(`${path}.mode must be "normal" or "always"`);
  }
}
function callConfigEquals(a, b) {
  if (a.provider !== b.provider || a.model !== b.model || a.reasoningEffort !== b.reasoningEffort || a.temperature !== b.temperature || a.maxTokens !== b.maxTokens) return false;
  if (a.stop === void 0 || b.stop === void 0) return a.stop === b.stop;
  return a.stop.length === b.stop.length && a.stop.every((s, i) => s === b.stop?.[i]);
}
function markAgentLoopRequest(request) {
  AGENT_LOOP_REQUESTS.add(request);
  return request;
}
function isAgentLoopRequest(request) {
  return AGENT_LOOP_REQUESTS.has(request);
}
function normalizeLlmFailure(value) {
  const error = value instanceof Error ? value : new HarnessError(thrownMessage(value), "UNKNOWN", { cause: value });
  const carried = ownFailureSnapshot(error);
  if (carried !== void 0 && carried.code === ownErrorCode(error)) return carried;
  return Object.freeze({
    message: errorMessage(error),
    code: harnessErrorCode(error)
  });
}
function thrownMessage(value) {
  try {
    const message = String(value);
    return message.length > 0 ? message : "LLM adapter failed";
  } catch (_hostileThrownValue) {
    return "LLM adapter failed";
  }
}
function ownErrorCode(error) {
  try {
    const descriptor = Object.getOwnPropertyDescriptor(error, "code");
    return descriptor !== void 0 && "value" in descriptor ? descriptor.value : void 0;
  } catch (_sdkPropertyTrap) {
    return;
  }
}
function ownFailureSnapshot(error) {
  try {
    const descriptor = Object.getOwnPropertyDescriptor(error, "failure");
    return descriptor !== void 0 && "value" in descriptor ? failureSnapshot(descriptor.value) : void 0;
  } catch (_sdkPropertyTrap) {
    return;
  }
}
function failureSnapshot(value) {
  if (typeof value !== "object" || value === null) return void 0;
  try {
    const candidate = value;
    const message = candidate.message;
    const code = candidate.code;
    const status = candidate.status;
    const providerRetryAfterMs = candidate.providerRetryAfterMs;
    const requestId = candidate.requestId;
    const offloadImages = candidate.offloadImages;
    if (typeof message !== "string" || message.length === 0 || typeof code !== "string" || code.length === 0 || status !== void 0 && (!Number.isInteger(status) || status < 100 || status > 599) || providerRetryAfterMs !== void 0 && (!Number.isFinite(providerRetryAfterMs) || providerRetryAfterMs <= 0) || requestId !== void 0 && (typeof requestId !== "string" || requestId.length === 0) || offloadImages !== void 0 && (!Number.isSafeInteger(offloadImages) || offloadImages <= 0)) return void 0;
    return Object.freeze({
      message,
      code,
      ...status === void 0 ? {} : { status },
      ...providerRetryAfterMs === void 0 ? {} : { providerRetryAfterMs },
      ...requestId === void 0 ? {} : { requestId },
      ...offloadImages === void 0 ? {} : { offloadImages }
    });
  } catch (_sdkFailureGetter) {
    return;
  }
}
function errorMessage(error) {
  try {
    const message = error.message;
    if (typeof message === "string" && message.length > 0) return message;
  } catch (_sdkMessageGetter) {
  }
  return "LLM adapter failed";
}
function harnessErrorCode(error) {
  return error instanceof HarnessError ? error.code : "UNKNOWN";
}
function normalizeApiKey(raw) {
  const value = raw.trim();
  if (value.length === 0) return {
    ok: false,
    reason: "empty"
  };
  if (!LEGAL_API_KEY.test(value)) return {
    ok: false,
    reason: "illegalCharacters"
  };
  return {
    ok: true,
    value
  };
}
function resolveImageAttachmentAccess(attachments, mapHostPath, ref) {
  const hostPath = attachments.imageHostPath(ref);
  if (hostPath === void 0) return void 0;
  const readonlyPath = mapHostPath(hostPath);
  return readonlyPath === void 0 ? void 0 : { readonlyPath };
}
function quoted(value) {
  return JSON.stringify(value);
}
function imageIdentity(ref) {
  return ref.name === void 0 ? String(ref.attachmentId) : `${quoted(ref.name)} (${ref.attachmentId})`;
}
function extension(mediaType) {
  switch (mediaType) {
    case "image/png":
      return ".png";
    case "image/jpeg":
      return ".jpg";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return assertNever(mediaType, "image extension");
  }
}
function normalizedAccessText(ref, access) {
  return ` Normalized copy (read-only; may be resized or re-encoded): ${quoted(access.readonlyPath)} (${ref.width}x${ref.height}px, ${ref.mediaType}). Source dimensions, format, and byte size may differ. Copy to a writable path ending in ${extension(ref.mediaType)} before editing.`;
}
function textOnlyImageText(ref) {
  return `[image omitted because this model accepts text only; attachment sha256:${String(ref.attachmentId).slice(7, 15)}]`;
}
function requestImageHandleText(ref, version2, access) {
  const preview = `Image ${imageIdentity(ref)}; request preview ${version2.width}x${version2.height}px.`;
  return access === void 0 ? `${preview} It may be resized or re-encoded; source dimensions, format, and byte size may differ.` : preview + normalizedAccessText(ref, access);
}
function offloadedImageText(ref, access) {
  const identity = `image omitted to fit request image limits; ${imageIdentity(ref)}.`;
  if (access === void 0) return `[${identity} No local normalized image path is available; ask the user to attach it again if needed.]`;
  return `[${identity}${normalizedAccessText(ref, access)}]`;
}
function contentHasImage(content) {
  return content.some((block) => block.type === "image");
}
function contentHasFile(content) {
  for (const block of content) if (block.type === "file") return true;
  return false;
}
function fileHandleText(ref, readonlyPath) {
  const digest = String(ref.attachmentId).slice(7, 15);
  const identity = `File ${quoted(ref.name)} (${ref.bytes} bytes, sha256:${digest})`;
  if (readonlyPath === void 0) return `[${identity} was uploaded, but the current execution environment cannot access a readable path. Report that limitation if its contents are needed; do not claim to have read it.]`;
  return `[${identity}: verbatim read-only copy saved at ${quoted(readonlyPath)}. Read that path with your file tools when its contents are needed; copy it to a writable location before modifying it. When delegating file work, include this saved path in the delegation prompt; only subagents sharing this execution environment can read it.]`;
}
function replaceFilesWithHandles(blocks, resolvePath) {
  let next;
  for (const [index, block] of blocks.entries()) {
    if (block.type === "file") {
      next ??= blocks.slice(0, index);
      next.push({
        type: "text",
        text: fileHandleText(block.attachment, resolvePath(block.attachment))
      });
      continue;
    }
    next?.push(block);
  }
  return next ?? blocks;
}
function projectFilesToText(messages, resolvePath) {
  if (!messages.some((message) => contentHasFile(message.content))) return messages;
  return messages.map((message) => {
    const content = replaceFilesWithHandles(message.content, resolvePath);
    return content === message.content ? message : {
      ...message,
      content
    };
  });
}
function base64Length(bytes) {
  return Math.ceil(bytes / 3) * 4;
}
function visitImageBlocks(content, visit) {
  for (const block of content) if (block.type === "image") visit(block);
}
function replaceOffloadedImages(blocks, placeholder) {
  let next;
  for (const [index, block] of blocks.entries()) {
    if (block.type === "image" && block.offloaded === true) {
      next ??= blocks.slice(0, index);
      next.push({
        type: "text",
        text: placeholder(block.attachment)
      });
      continue;
    }
    next?.push(block);
  }
  return next ?? blocks;
}
function projectOffloadedImages(messages, placeholder) {
  return messages.map((message) => {
    const content = replaceOffloadedImages(message.content, placeholder);
    return content === message.content ? message : {
      ...message,
      content
    };
  });
}
function offloadedImagePrefixCount(lengths, budget) {
  const total = lengths.reduce((sum, bytes) => sum + bytes, 0);
  const excessCount = budget.maxImages === void 0 ? 0 : Math.max(0, lengths.length - budget.maxImages);
  const excessBytes = budget.maxBytes === void 0 ? 0 : Math.max(0, total - budget.maxBytes);
  if (excessCount === 0 && excessBytes === 0) return 0;
  const countQuantum = budget.countQuantum ?? 1;
  const byteQuantum = budget.byteQuantum ?? 1;
  const removeCount = excessCount === 0 ? 0 : Math.ceil(excessCount / countQuantum) * countQuantum;
  const removeBytes = excessBytes === 0 ? 0 : Math.ceil(excessBytes / byteQuantum) * byteQuantum;
  let count = 0;
  let removedBytes = 0;
  for (const imageBytes of lengths) {
    if (count >= removeCount && (removeBytes === 0 || (byteQuantum === 1 ? removedBytes >= removeBytes : removedBytes > removeBytes))) break;
    removedBytes += imageBytes;
    count += 1;
  }
  return count;
}
function requiredImageOffload(messages, budget, versionBytes) {
  const lengths = [];
  for (const message of messages) visitImageBlocks(message.content, (block) => {
    if (block.offloaded === true) return;
    const bytes = versionBytes(block);
    lengths.push(budget.representation === "base64" ? base64Length(bytes) : bytes);
  });
  return offloadedImagePrefixCount(lengths, budget);
}
function replaceImagesForTextModel(blocks) {
  let next;
  for (const [index, block] of blocks.entries()) {
    if (block.type === "image") {
      next ??= blocks.slice(0, index);
      next.push({
        type: "text",
        text: textOnlyImageText(block.attachment)
      });
      continue;
    }
    next?.push(block);
  }
  return next ?? blocks;
}
function projectImagesForTextModel(messages) {
  if (!messages.some((message) => contentHasImage(message.content))) return messages;
  return messages.map((message) => {
    const content = replaceImagesForTextModel(message.content);
    return content === message.content ? message : {
      ...message,
      content
    };
  });
}
function withoutDeveloperMessages(messages) {
  const retained = messages.filter((message) => message.role !== "developer");
  return retained.length === messages.length ? messages : retained;
}
function toolDeclarations(tools, mode, history) {
  const declarations = new Map(history.tools.map((tool) => [tool.name, tool]));
  for (const update of history.updates) for (const tool of update.additions) if (!declarations.has(tool.name)) declarations.set(tool.name, {
    ...tool,
    deferLoading: true
  });
  switch (mode) {
    case "in-history":
      return declarations;
    case "addition-only": {
      const activeNames = new Set(tools?.map((tool) => tool.name));
      for (const name3 of declarations.keys()) if (!activeNames.has(name3)) declarations.delete(name3);
      return declarations;
    }
    /* v8 ignore next 2 -- closed-union exhaustiveness guard */
    default:
      return assertNever(mode);
  }
}
function projectToolUpdates(messages, tools, toolUpdate, history) {
  if (toolUpdate === void 0) {
    let immediateTools = tools;
    if (tools?.some((tool) => tool.deferLoading === true)) immediateTools = tools.map(({ deferLoading: _loading, ...tool }) => tool);
    return {
      messages: withoutDeveloperMessages(messages),
      tools: immediateTools
    };
  }
  if (history === void 0) return {
    messages: withoutDeveloperMessages(messages),
    tools
  };
  const messageIds = new Set(messages.flatMap((message) => message.role === "developer" ? [message.id] : []));
  if (history.updates.some((update) => !messageIds.has(update.messageId))) return {
    messages: withoutDeveloperMessages(messages),
    tools
  };
  const declarations = toolDeclarations(tools, toolUpdate, history);
  const updateIds = new Set(history.updates.map((update) => update.messageId));
  const offered = new Set(history.tools.filter((tool) => !tool.deferLoading).map((tool) => tool.name));
  const projectedMessages = [];
  for (const message of messages) {
    if (message.role !== "developer") {
      projectedMessages.push(message);
      continue;
    }
    if (!updateIds.has(message.id)) continue;
    const content = message.content.filter((block) => {
      switch (block.type) {
        case "tool-addition":
          if (!declarations.has(block.toolName) || offered.has(block.toolName)) return false;
          offered.add(block.toolName);
          return true;
        case "tool-removal":
          if (toolUpdate !== "in-history") return false;
          return offered.delete(block.toolName);
        default:
          return true;
      }
    });
    if (content.length === 0) continue;
    if (content.length === message.content.length) projectedMessages.push(message);
    else projectedMessages.push({
      ...message,
      content
    });
  }
  return {
    messages: projectedMessages.length === messages.length && projectedMessages.every((message, index) => message === messages[index]) ? messages : projectedMessages,
    tools: [...declarations.values()]
  };
}
function userAgent(identity = APP_IDENTITY) {
  return `${identity.product}/${identity.version} (+${identity.url})`;
}
function attributionHeaders(identity = APP_IDENTITY) {
  return { "user-agent": userAgent(identity) };
}
function MessageId(id) {
  return brandString(id);
}
function ToolCallId(id) {
  return brandString(id);
}
function ProviderRequestId(id) {
  return brandString(id);
}
function LlmAttemptId(id) {
  return brandString(id);
}
function ReasoningEffortId(id) {
  return brandString(id);
}
function safeTime(value) {
  if (!Number.isSafeInteger(value)) throw new TypeError(`Assistant stream time must be a safe integer, got ${String(value)}`);
  return value;
}
function safeIndex(value, label) {
  if (!Number.isSafeInteger(value) || value < 0 || Object.is(value, -0)) throw new TypeError(`${label} index must be a non-negative safe integer`);
  return value;
}
function snapshotChunk(chunk) {
  const snapshot = snapshotJsonValue(chunk);
  if (snapshot === void 0) throw new TypeError("Assistant stream chunk must be losslessly JSON-serializable");
  return snapshot;
}
function safeGap(previous, next) {
  const gap = next - previous;
  return Number.isSafeInteger(gap) && previous + gap === next ? gap : void 0;
}
function expandAssistantStream(stream) {
  const chunks = [];
  for (const candidate of stream) {
    const record = validateRecord(candidate);
    if (record.type === "chunk") {
      chunks.push({
        time: record.time,
        chunk: record.chunk
      });
      continue;
    }
    const members = record.type === "tool-call-chunks" ? record.args : record.texts;
    let time = record.time0;
    for (let index = 0; index < members.length; index += 1) {
      if (index > 0) time += record.dt[index - 1];
      let chunk;
      if (record.type === "text-chunks") chunk = {
        type: "text-delta",
        index: record.index,
        text: members[index]
      };
      else if (record.type === "reasoning-chunks") chunk = {
        type: "reasoning-delta",
        index: record.index,
        text: members[index]
      };
      else chunk = {
        type: "tool-call-delta",
        index: record.index,
        id: record.id,
        ...Object.hasOwn(record, "name") ? { name: record.name } : {},
        argumentsDelta: members[index]
      };
      chunks.push({
        time,
        chunk
      });
    }
  }
  return chunks;
}
function hasNonWhitespace(text) {
  return /\S/.test(text);
}
function blockIsVisible(block) {
  if (block.type === "tool-call") return false;
  if (block.type === "text" || block.type === "reasoning") return hasNonWhitespace(block.text);
  return true;
}
function isTokenDelta(chunk) {
  switch (chunk.type) {
    case "text-delta":
    case "reasoning-delta":
      return chunk.text !== "";
    case "tool-call-delta":
      return chunk.argumentsDelta !== "" || chunk.name !== void 0;
    default:
      return false;
  }
}
function isVisibleChunk(chunk) {
  switch (chunk.type) {
    case "text-delta":
    case "reasoning-delta":
      return hasNonWhitespace(chunk.text);
    case "block-start":
      return chunk.blockType !== "text" && chunk.blockType !== "reasoning" && chunk.blockType !== "tool-call";
    case "block-end":
      return blockIsVisible(chunk.block);
    default:
      return false;
  }
}
function chunkHasVisibleText(chunk) {
  if (chunk.type === "text-delta") return hasNonWhitespace(chunk.text);
  return chunk.type === "block-end" && chunk.block.type === "text" && hasNonWhitespace(chunk.block.text);
}
function firstRunMemberTime(run, predicate) {
  const fragments = run.type === "tool-call-chunks" ? run.args : run.texts;
  let time = run.time0;
  for (let index = 0; index < fragments.length; index += 1) {
    if (index > 0) time += run.dt[index - 1];
    if (predicate(fragments[index])) return time;
  }
}
function runFirstTokenTime(run) {
  if (run.type === "tool-call-chunks" && run.name !== void 0) return run.time0;
  return firstRunMemberTime(run, (fragment) => fragment !== "");
}
function runFirstVisibleTime(run) {
  return run.type === "tool-call-chunks" ? void 0 : firstRunMemberTime(run, hasNonWhitespace);
}
function assistantStreamFirstTokenTime(stream) {
  for (const record of stream) {
    const time = record.type === "chunk" ? isTokenDelta(record.chunk) ? record.time : void 0 : runFirstTokenTime(record);
    if (time !== void 0) return time;
  }
}
function assistantStreamHasVisibleContent(stream) {
  return stream.some((record) => record.type === "chunk" ? isVisibleChunk(record.chunk) : runFirstVisibleTime(record) !== void 0);
}
function assistantStreamHasVisibleText(stream) {
  return stream.some((record) => record.type === "text-chunks" ? record.texts.some(hasNonWhitespace) : record.type === "chunk" && chunkHasVisibleText(record.chunk));
}
function lastAssistantStreamChunk(stream, type) {
  for (let index = stream.length - 1; index >= 0; index -= 1) {
    const record = stream[index];
    if (record.type === "chunk" && record.chunk.type === type) return record.chunk;
  }
}
function assistantStreamChunks(stream, type) {
  const chunks = [];
  for (const record of stream) if (record.type === "chunk" && record.chunk.type === type) chunks.push(record.chunk);
  return chunks;
}
function joinAssistantStreamText(stream) {
  const parts = [];
  for (const record of stream) if (record.type === "text-chunks") parts.push(record.texts.join(""));
  else if (record.type === "chunk" && record.chunk.type === "text-delta") parts.push(record.chunk.text);
  return parts.join("");
}
function assembleAssistantStream(stream, assembler = new BlockAssembler()) {
  for (const record of stream) switch (record.type) {
    case "chunk":
      assembler.push(record.chunk);
      break;
    case "text-chunks":
      assembler.push({
        type: "text-delta",
        index: record.index,
        text: record.texts.join("")
      });
      break;
    case "reasoning-chunks":
      assembler.push({
        type: "reasoning-delta",
        index: record.index,
        text: record.texts.join("")
      });
      break;
    case "tool-call-chunks":
      assembler.push({
        type: "tool-call-delta",
        index: record.index,
        id: record.id,
        ...record.name === void 0 ? {} : { name: record.name },
        argumentsDelta: record.args.join("")
      });
      break;
    default:
      assertNever(record, "assembleAssistantStream");
  }
  return assembler;
}
function validateRecord(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new TypeError("Assistant stream record must be an object");
  const record = value;
  switch (record.type) {
    case "text-chunks":
    case "reasoning-chunks": {
      exactKeys(record, [
        "type",
        "time0",
        "index",
        "dt",
        "texts"
      ], record.type);
      const texts = stringArray(record.texts, `${record.type} texts`);
      if (texts.length === 0) throw new TypeError(`${record.type} texts must be non-empty`);
      validateRun(record, texts.length, record.type);
      return record;
    }
    case "tool-call-chunks": {
      exactKeys(record, Object.hasOwn(record, "name") ? [
        "type",
        "time0",
        "index",
        "dt",
        "id",
        "name",
        "args"
      ] : [
        "type",
        "time0",
        "index",
        "dt",
        "id",
        "args"
      ], record.type);
      const args = stringArray(record.args, "tool-call-chunks args");
      if (args.length === 0) throw new TypeError("tool-call-chunks args must be non-empty");
      if (typeof record.id !== "string" || record.id.length === 0) throw new TypeError("tool-call-chunks id must be a non-empty string");
      if (record.name !== void 0 && (typeof record.name !== "string" || record.name.length === 0)) throw new TypeError("tool-call-chunks name must be a non-empty string");
      validateRun(record, args.length, record.type);
      return record;
    }
    case "chunk": {
      exactKeys(record, [
        "type",
        "time",
        "chunk"
      ], "chunk");
      const time = safeTime(record.time);
      if (typeof record.chunk !== "object" || record.chunk === null || Array.isArray(record.chunk)) throw new TypeError("Assistant stream raw chunk must be a lossless JSON object");
      let chunk;
      try {
        chunk = snapshotChunk(record.chunk);
      } catch (error) {
        throw new TypeError("Assistant stream raw chunk must be a lossless JSON object", { cause: error });
      }
      return deepFreeze({
        type: "chunk",
        time,
        chunk
      });
    }
    default:
      throw new TypeError(`Unsupported Assistant stream record ${JSON.stringify(record.type)}`);
  }
}
function validateRun(record, members, label) {
  safeTime(record.time0);
  safeIndex(record.index, label);
  if (!Array.isArray(record.dt) || record.dt.some((value) => !Number.isSafeInteger(value))) throw new TypeError(`${label} dt must contain safe integers`);
  if (record.dt.length !== members - 1) throw new TypeError(`${label} dt length must be one less than its members`);
  let time = record.time0;
  for (const gap of record.dt) {
    time += gap;
    if (!Number.isSafeInteger(time)) throw new TypeError(`${label} member times must stay safe integers`);
  }
}
function stringArray(value, label) {
  if (!Array.isArray(value) || value.some((member) => typeof member !== "string")) throw new TypeError(`${label} must be a string array`);
  return value;
}
function exactKeys(record, keys2, label) {
  if (Object.keys(record).length !== keys2.length || !keys2.every((key) => Object.hasOwn(record, key))) throw new TypeError(`${label} Assistant stream record must contain exactly ${keys2.join(", ")}`);
}
function assertUsableApiKey(raw, pkg, ref) {
  const checked = normalizeApiKey(raw);
  if (checked.ok) return checked.value;
  throw new LlmError(checked.reason === "empty" ? `${pkg}: the API key resolved from ${ref} is blank; set ${ref} to the raw key (the web Models page writes it) or export it in the launching environment` : `${pkg}: the API key resolved from ${ref} contains characters no HTTP header can carry; set ${ref} to the raw key alone (the web Models page writes it)`, INVALID_CREDENTIAL_CODE);
}
function adapterFailureChunk(error, signal) {
  const failure = normalizeLlmFailure(error);
  return {
    type: "finish",
    reason: signal?.aborted || failure.code === "ABORTED" ? {
      kind: "aborted",
      failure
    } : {
      kind: "error",
      failure
    }
  };
}
var CONTEXT_SUMMARY_MAX_CHARS, HarnessError, CONTEXT_WINDOW_EXCEEDED_CODE, QUOTA_EXCEEDED_CODE, ACCOUNT_QUOTA_EXCEEDED_CODE, EMPTY_RESPONSE_CODE, INVALID_CREDENTIAL_CODE, STRUCTURED_CONTEXT_OVERFLOW, TOO_LARGE_FOR_CONTEXT, EXCEEDS_MODEL_CONTEXT, IMAGE_OFFLOAD_REQUIRED_CODE, DEFAULT_MAX_RETRIES, DEFAULT_INITIAL_DELAY_MS, DEFAULT_MAX_DELAY_MS, DEFAULT_JITTER_RATIO, DEFAULT_RETRYABLE_CODES, backoffSchema, normalPolicySchema, alwaysPolicySchema, RetryPolicySchema, NORMAL_POLICY_KEYS, ALWAYS_POLICY_KEYS, BACKOFF_KEYS, AGENT_LOOP_REQUESTS, LEGAL_API_KEY, version, APP_IDENTITY, BlockAssembler, AssistantStreamAccumulator, __runInitializers, __esDecorate, LlmError, LlmAdapter, LlmRuntime;
var init_lib8 = __esm({
  "../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-llm/lib/index.js"() {
    init_lib3();
    init_lib4();
    init_lib5();
    init_lib6();
    init_lib7();
    CONTEXT_SUMMARY_MAX_CHARS = 120;
    HarnessError = class extends Error {
      /** Stable machine-routable failure class (e.g. `RATE_LIMIT`); route on this, never by parsing `message`. */
      code;
      constructor(message, code, options) {
        super(message, options);
        this.code = code;
        this.name = new.target.name;
      }
    };
    CONTEXT_WINDOW_EXCEEDED_CODE = "CONTEXT_WINDOW_EXCEEDED";
    QUOTA_EXCEEDED_CODE = "QUOTA";
    ACCOUNT_QUOTA_EXCEEDED_CODE = "ACCOUNT_QUOTA";
    EMPTY_RESPONSE_CODE = "EMPTY_RESPONSE";
    INVALID_CREDENTIAL_CODE = "INVALID_CREDENTIAL";
    STRUCTURED_CONTEXT_OVERFLOW = new RegExp(String.raw`(?:^|[^a-z0-9])context[\s_-](?:length|window)[\s_-]` + String.raw`(?:exceed(?:ed|s)?|overflow(?:ed)?|limit[\s_-]exceeded)(?:$|[^a-z0-9])`, "i");
    TOO_LARGE_FOR_CONTEXT = new RegExp(String.raw`\b(?:request|prompt|input|messages?)\s+(?:is\s+|are\s+)?` + String.raw`too\s+(?:large|long)\s+for\s+(?:(?:this|the)\s+)?` + String.raw`(?:model(?:'s)?\s+)?context(?:\s+window)?\b`, "i");
    EXCEEDS_MODEL_CONTEXT = new RegExp(String.raw`\b(?:input|prompt|request|messages?)\b.{0,40}` + String.raw`\b(?:exceed(?:s|ed)?|overflows?|is\s+larger\s+than)\b.{0,40}` + String.raw`\b(?:the\s+)?(?:model(?:'s)?\s+)?context(?:\s+(?:length|window))?\b`, "i");
    IMAGE_OFFLOAD_REQUIRED_CODE = "IMAGE_OFFLOAD_REQUIRED";
    DEFAULT_MAX_RETRIES = 5;
    DEFAULT_INITIAL_DELAY_MS = 500;
    DEFAULT_MAX_DELAY_MS = 1e4;
    DEFAULT_JITTER_RATIO = 0.1;
    DEFAULT_RETRYABLE_CODES = Object.freeze([
      EMPTY_RESPONSE_CODE,
      "RATE_LIMIT",
      "SERVER",
      "TIMEOUT",
      "TRANSPORT"
    ]);
    backoffSchema = z.object({
      initialDelayMs: z.number().max(MAX_TIMER_DELAY_MS).default(DEFAULT_INITIAL_DELAY_MS),
      maxDelayMs: z.number().max(MAX_TIMER_DELAY_MS).default(DEFAULT_MAX_DELAY_MS),
      jitterRatio: z.number().min(0).max(1).default(DEFAULT_JITTER_RATIO)
    });
    normalPolicySchema = z.object({
      mode: z.const("normal").required(),
      maxRetries: z.number().step(1).min(0).max(Number.MAX_SAFE_INTEGER).default(DEFAULT_MAX_RETRIES),
      retryableCodes: z.array(z.string()).default([...DEFAULT_RETRYABLE_CODES]),
      backoff: backoffSchema
    });
    alwaysPolicySchema = z.object({
      mode: z.const("always").required(),
      backoff: backoffSchema
    });
    RetryPolicySchema = z.union([normalPolicySchema, alwaysPolicySchema]);
    NORMAL_POLICY_KEYS = /* @__PURE__ */ new Set([
      "mode",
      "maxRetries",
      "retryableCodes",
      "backoff"
    ]);
    ALWAYS_POLICY_KEYS = /* @__PURE__ */ new Set([
      "mode",
      "maxRetries",
      "retryableCodes",
      "backoff"
    ]);
    BACKOFF_KEYS = /* @__PURE__ */ new Set([
      "initialDelayMs",
      "maxDelayMs",
      "jitterRatio"
    ]);
    AGENT_LOOP_REQUESTS = /* @__PURE__ */ new WeakSet();
    LEGAL_API_KEY = /^[\x21-\x7E]+$/;
    ({ version } = createRequire(import.meta.url)("../package.json"));
    APP_IDENTITY = {
      product: "deepseek-harness",
      version,
      url: "https://github.com/deepseek-ai/deepseek-harness"
    };
    BlockAssembler = class {
      partials = /* @__PURE__ */ new Map();
      order = [];
      _usage;
      _finish;
      _replayState;
      /**
      * Feed one chunk into the assembly state.
      * @param chunk - the next raw chunk, in stream order.
      */
      push(chunk) {
        switch (chunk.type) {
          case "block-start":
            if (!this.partials.has(chunk.index)) {
              this.order.push(chunk.index);
              this.partials.set(chunk.index, {
                blockType: chunk.blockType,
                text: "",
                toolCallArguments: ""
              });
            }
            return;
          case "text-delta":
          case "reasoning-delta": {
            const partial = this.ensure(chunk.index, chunk.type === "text-delta" ? "text" : "reasoning");
            if (partial.block) return;
            partial.text += chunk.text;
            return;
          }
          case "tool-call-delta": {
            const partial = this.ensure(chunk.index, "tool-call");
            if (partial.block) return;
            partial.toolCallId = chunk.id;
            if (chunk.name) partial.toolCallName = chunk.name;
            partial.toolCallArguments += chunk.argumentsDelta;
            return;
          }
          case "block-end": {
            const partial = this.ensure(chunk.index, chunk.block.type);
            if (partial.block) return;
            partial.block = chunk.block;
            return;
          }
          case "usage":
            this._usage = chunk.usage;
            return;
          case "finish":
            this._finish = chunk.reason;
            this._replayState = chunk.replayState;
            return;
          default:
            return assertNever(chunk, "BlockAssembler.push");
        }
      }
      ensure(index, blockType) {
        let partial = this.partials.get(index);
        if (!partial) {
          partial = {
            blockType,
            text: "",
            toolCallArguments: ""
          };
          this.partials.set(index, partial);
          this.order.push(index);
        }
        return partial;
      }
      assemble(partial, index) {
        if (partial.block) return partial.block;
        switch (partial.blockType) {
          case "text":
            return {
              type: "text",
              text: partial.text
            };
          case "reasoning":
            return {
              type: "reasoning",
              text: partial.text
            };
          case "tool-call":
            return {
              type: "tool-call",
              id: partial.toolCallId ?? brandString(`call-${index}`),
              name: partial.toolCallName ?? "",
              arguments: partial.toolCallArguments
            };
          default:
            throw new Error(`cannot assemble incomplete block of type "${partial.blockType}"`);
        }
      }
      /** Invariant accessor: every index in `order` has a partial. */
      mustGet(index) {
        const partial = this.partials.get(index);
        if (!partial) throw new Error(`BlockAssembler invariant violated: no partial for index ${index}`);
        return partial;
      }
      /**
      * The one shared keep/drop decision over all seen blocks: max-token
      * truncation drops tool calls that cannot be executed safely. Emitted blocks
      * and replay metadata both derive from this result, so they cannot disagree.
      */
      assembled() {
        const all = this.order.map((index) => this.assemble(this.mustGet(index), index));
        const kept = this.finish.kind === "max-tokens" ? all.map((block) => block.type !== "tool-call") : void 0;
        const blocks = kept === void 0 ? all : all.filter((_, position) => kept[position]);
        const envelope = this._replayState;
        if (envelope?.blocks === void 0) return {
          blocks,
          replay: envelope
        };
        if (envelope.blocks.length !== all.length) return {
          blocks,
          replay: void 0
        };
        return {
          blocks,
          replay: kept === void 0 || blocks.length === all.length ? envelope : {
            response: envelope.response,
            blocks: envelope.blocks.filter((_, position) => kept[position])
          }
        };
      }
      /**
      * Assemble all blocks seen so far, in stream order.
      * @returns one block per seen index, except that max-token truncation drops
      *   tool calls that cannot be executed safely; an open block assembles from
      *   its accumulated deltas (an unknown block type never closed by `block-end` throws).
      */
      blocks() {
        return this.assembled().blocks;
      }
      /**
      * Assemble the prefix an interrupted stream can safely finalize: closed and
      * open text/reasoning blocks with non-whitespace content, in stream order.
      * Tool calls are omitted because interruption precedes dispatch; retaining
      * one would require a fabricated result. Open unknown blocks are also omitted.
      * @returns the kept blocks; empty when nothing streamed before the interruption.
      */
      interruptedBlocks() {
        return this.order.map((index) => {
          const partial = this.mustGet(index);
          const type = partial.block?.type ?? partial.blockType;
          if (type !== "text" && type !== "reasoning") return void 0;
          return this.assemble(partial, index);
        }).filter((block) => (block?.type === "text" || block?.type === "reasoning") && block.text.trim() !== "");
      }
      /** Usage from the `usage` chunk; undefined until one arrives. */
      get usage() {
        return this._usage;
      }
      /** Finish reason from the `finish` chunk; `{kind: 'stop'}` when the stream ended without one. */
      get finish() {
        return this._finish ?? { kind: "stop" };
      }
      /**
      * Replay metadata from the terminal finish chunk, if any, with per-block
      * entries pruned in step with {@link blocks}. Undefined when the envelope's
      * entries do not align with the emitted blocks.
      */
      get replayState() {
        return this.assembled().replay;
      }
      /**
      * The assembled assistant message.
      * @param source - provider/model attribution (without the `kind` tag) for the assembled message.
      * @returns a frozen assistant-role message over `blocks()` (same open-block assembly rules).
      */
      message(source) {
        return createAssistantMessage({
          content: this.blocks(),
          source
        });
      }
    };
    AssistantStreamAccumulator = class {
      records = [];
      /**
      * Add one timed chunk to the compact attempt stream.
      * @param value - model chunk and its original Session timestamp.
      * @returns a detached immutable copy for assembly and live publication.
      */
      push(value) {
        const time = safeTime(value.time);
        const chunk = snapshotChunk(value.chunk);
        const timed = deepFreeze({
          time,
          chunk
        });
        const previous = this.records.at(-1);
        switch (chunk.type) {
          case "text-delta":
          case "reasoning-delta": {
            safeIndex(chunk.index, chunk.type);
            if (typeof chunk.text !== "string") throw new TypeError(`${chunk.type} text must be a string`);
            const type = chunk.type === "text-delta" ? "text-chunks" : "reasoning-chunks";
            const gap = previous !== void 0 && previous.type === type ? safeGap(previous.lastTime, time) : void 0;
            if (previous !== void 0 && previous.type === type && previous.index === chunk.index && gap !== void 0) {
              previous.dt.push(gap);
              previous.texts.push(chunk.text);
              previous.lastTime = time;
            } else this.records.push({
              type,
              time0: time,
              index: chunk.index,
              dt: [],
              texts: [chunk.text],
              lastTime: time
            });
            return timed;
          }
          case "tool-call-delta": {
            safeIndex(chunk.index, chunk.type);
            if (typeof chunk.id !== "string") throw new TypeError("tool-call-delta id must be a string");
            if (Object.hasOwn(chunk, "name") && typeof chunk.name !== "string") throw new TypeError("tool-call-delta name must be a string");
            if (typeof chunk.argumentsDelta !== "string") throw new TypeError("tool-call-delta argumentsDelta must be a string");
            if (chunk.id.length === 0 || chunk.name === "") {
              this.records.push({
                type: "chunk",
                time,
                chunk
              });
              return timed;
            }
            const gap = previous?.type === "tool-call-chunks" ? safeGap(previous.lastTime, time) : void 0;
            const sameName = previous?.type === "tool-call-chunks" && Object.hasOwn(previous, "name") === Object.hasOwn(chunk, "name") && previous.name === chunk.name;
            if (previous?.type === "tool-call-chunks" && previous.index === chunk.index && previous.id === chunk.id && sameName && gap !== void 0) {
              previous.dt.push(gap);
              previous.args.push(chunk.argumentsDelta);
              previous.lastTime = time;
            } else this.records.push({
              type: "tool-call-chunks",
              time0: time,
              index: chunk.index,
              dt: [],
              id: chunk.id,
              ...Object.hasOwn(chunk, "name") ? { name: chunk.name } : {},
              args: [chunk.argumentsDelta],
              lastTime: time
            });
            return timed;
          }
          case "block-start":
          case "block-end":
          case "usage":
          case "finish":
            this.records.push({
              type: "chunk",
              time,
              chunk
            });
            return timed;
          default:
            return assertNever(chunk, "AssistantStreamAccumulator.push");
        }
      }
      /**
      * Return the current compact attempt stream.
      * @returns a detached immutable record list suitable for a durable event.
      */
      snapshot() {
        return deepFreeze(this.records.map((record) => {
          if (record.type === "chunk") return { ...record };
          const { lastTime: _lastTime, ...durable } = record;
          if (durable.type === "tool-call-chunks") return {
            ...durable,
            dt: [...durable.dt],
            args: [...durable.args]
          };
          return {
            ...durable,
            dt: [...durable.dt],
            texts: [...durable.texts]
          };
        }));
      }
    };
    __runInitializers = function(thisArg, initializers, value) {
      var useValue = arguments.length > 2;
      for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
      return useValue ? value : void 0;
    };
    __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
      function accept(f) {
        if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
        return f;
      }
      var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
      var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
      var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
      var _, done = false;
      for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function(f) {
          if (done) throw new TypeError("Cannot add initializers after decoration has completed");
          extraInitializers.push(accept(f || null));
        };
        var result = (0, decorators[i])(kind === "accessor" ? {
          get: descriptor.get,
          set: descriptor.set
        } : descriptor[key], context);
        if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
        } else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
        else descriptor[key] = _;
      }
      if (target) Object.defineProperty(target, contextIn.name, descriptor);
      done = true;
    };
    LlmError = class extends HarnessError {
      /** Serializable facts retained beside this live Error. */
      failure;
      /**
      * @param message - non-empty human-readable failure summary.
      * @param code - non-empty stable provider-neutral machine code.
      * @param options - optional cause and validated serializable provider facts.
      */
      constructor(message, code, options) {
        if (typeof message !== "string" || message.length === 0) throw new Error("LlmError message must be a non-empty string");
        if (typeof code !== "string" || code.length === 0) throw new Error("LlmError code must be a non-empty string");
        if (options?.status !== void 0 && (!Number.isInteger(options.status) || options.status < 100 || options.status > 599)) throw new Error("LlmError status must be an integer from 100 through 599");
        if (options?.providerRetryAfterMs !== void 0 && (!Number.isFinite(options.providerRetryAfterMs) || options.providerRetryAfterMs <= 0)) throw new Error("LlmError providerRetryAfterMs must be a positive finite number");
        if (options?.requestId !== void 0 && (typeof options.requestId !== "string" || options.requestId.length === 0)) throw new Error("LlmError requestId must be a non-empty string");
        super(message, code, options);
        this.name = "LlmError";
        this.failure = Object.freeze({
          message,
          code,
          ...options?.status === void 0 ? {} : { status: options.status },
          ...options?.providerRetryAfterMs === void 0 ? {} : { providerRetryAfterMs: options.providerRetryAfterMs },
          ...options?.requestId === void 0 ? {} : { requestId: options.requestId },
          ...options?.offloadImages === void 0 ? {} : { offloadImages: options.offloadImages }
        });
      }
    };
    LlmAdapter = class {
      /**
      * Describe one provider route owned by this adapter.
      * @param provider - a route passed to `registerAdapter()` for this instance.
      * @returns detached display metadata whose id must equal `provider`.
      */
      providerInfo(provider) {
        return {
          id: provider,
          name: provider
        };
      }
      /**
      * Return the provider-owned retry policy captured with this route.
      * @param _provider - a route passed to `registerAdapter()` for this instance.
      * @returns a resolved policy, or `undefined` to use the normal defaults.
      */
      providerRetryPolicy(_provider) {
      }
      /**
      * Resolve provider-side request-image pricing for one exact model route.
      * The default declares none, so consumers fall back to their own neutral
      * estimate. Implementations must answer synchronously without I/O; the
      * token meter resolves this per measurement.
      * @param _provider - a route passed to `registerAdapter()` for this instance.
      * @param _model - exact model id passed to {@link GenerateOptions.model}.
      * @returns route-owned image pricing, or `undefined` when the route declares none.
      */
      imageRequestPricing(_provider, _model) {
      }
      /**
      * List models this adapter can currently advertise for one owned provider.
      * Core routing accepts unlisted model ids; catalog-driven entry points such
      * as the GUI may require membership. Adapters used there must advertise
      * their available models; the base empty catalog offers no GUI selection.
      * @param _provider - one provider route owned by this adapter.
      * @returns discoverable models in adapter-preferred order.
      */
      listModels(_provider) {
        return Promise.resolve([]);
      }
      /**
      * Resolve all metadata available for one exact model. This query is
      * independent of the advisory catalog and does not validate request routing.
      * @param provider - one provider route owned by this adapter.
      * @param model - exact model id passed to {@link GenerateOptions.model}.
      * @param _signal - cancellation for this exact-model lookup; asynchronous
      *   implementations must settle promptly after it aborts.
      * @returns provider/model identity plus any context, call-default, and reasoning metadata.
      */
      resolveModel(provider, model, _signal) {
        return Promise.resolve({
          provider,
          id: model,
          name: model
        });
      }
      /**
      * Bind exact model metadata and the eventual request dispatch to one adapter generation.
      * Dynamic adapters override this so settings changes between preparation and
      * dispatch cannot combine one generation's capabilities with another's endpoint.
      * @param provider - registered provider route.
      * @param model - exact model id.
      * @param signal - cancellation for model resolution.
      * @returns model metadata and a one-generation stream entry point.
      */
      async prepareCall(provider, model, signal) {
        return {
          model: await this.resolveModel(provider, model, signal),
          stream: (options) => this.stream(options)
        };
      }
    };
    LlmRuntime = (() => {
      let _classSuper = TypertRemoteService;
      let _instanceExtraInitializers = [];
      let _listProviders_decorators;
      let _listConfigurableProviders_decorators;
      let _remoteDiscoverModels_decorators;
      return class LlmRuntime extends _classSuper {
        static {
          const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
          _listProviders_decorators = [Remote];
          _listConfigurableProviders_decorators = [Remote];
          _remoteDiscoverModels_decorators = [Remote("discoverModels")];
          __esDecorate(this, null, _listProviders_decorators, {
            kind: "method",
            name: "listProviders",
            static: false,
            private: false,
            access: {
              has: (obj) => "listProviders" in obj,
              get: (obj) => obj.listProviders
            },
            metadata: _metadata
          }, null, _instanceExtraInitializers);
          __esDecorate(this, null, _listConfigurableProviders_decorators, {
            kind: "method",
            name: "listConfigurableProviders",
            static: false,
            private: false,
            access: {
              has: (obj) => "listConfigurableProviders" in obj,
              get: (obj) => obj.listConfigurableProviders
            },
            metadata: _metadata
          }, null, _instanceExtraInitializers);
          __esDecorate(this, null, _remoteDiscoverModels_decorators, {
            kind: "method",
            name: "remoteDiscoverModels",
            static: false,
            private: false,
            access: {
              has: (obj) => "remoteDiscoverModels" in obj,
              get: (obj) => obj.remoteDiscoverModels
            },
            metadata: _metadata
          }, null, _instanceExtraInitializers);
          if (_metadata) Object.defineProperty(this, Symbol.metadata, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: _metadata
          });
        }
        adapters = (__runInitializers(this, _instanceExtraInitializers), /* @__PURE__ */ new Map());
        directory = /* @__PURE__ */ new Map();
        discoveries = /* @__PURE__ */ new Map();
        constructor(ctx) {
          super(ctx, "llm");
        }
        /** Notify topology observers without letting one broken listener veto the commit. */
        emitAdaptersUpdated() {
          let invariantFailure;
          for (const listener of this.ctx.events.dispatch("emit", ["llm/adapters-updated"])) try {
            const returned = listener();
            if (returned != null && typeof returned.then === "function") Promise.resolve(returned).then(void 0, (error) => {
              this.warnAdaptersListenerFailure(error);
            });
          } catch (error) {
            if (error?.code === "INVARIANT") {
              invariantFailure ??= error;
              continue;
            }
            this.warnAdaptersListenerFailure(error);
          }
          if (invariantFailure !== void 0) throw invariantFailure;
        }
        /** Contained-listener diagnostic shared by the sync and async failure paths. */
        warnAdaptersListenerFailure(error) {
          this.ctx.logger.warn("llm: an llm/adapters-updated listener failed");
          this.ctx.logger.warn(error);
        }
        /**
        * Register an adapter for the given provider routes. Throws `LlmError` with code
        * `DUPLICATE_ADAPTER` if any provider already has an adapter (all-or-nothing).
        * Disposed with the fiber.
        * @param providers - every provider route this adapter should serve.
        * @param adapter - the adapter that streams calls for those providers.
        * @returns the disposer, carrying {@link AdapterRegistrationHandle.replace}.
        */
        registerAdapter(providers, adapter) {
          const owned = /* @__PURE__ */ new Set();
          let released = false;
          const dispose = this.ctx.effect(function* () {
            if (providers.length === 0) throw new LlmError("an adapter must register at least one provider", "INVALID_ADAPTER");
            this.commitRoutes(owned, this.prepareRoutes(providers, adapter, owned));
            yield () => {
              released = true;
              for (const provider of owned) this.adapters.delete(provider);
              owned.clear();
              this.emitAdaptersUpdated();
            };
          }.bind(this), "llm.registerAdapter()");
          const handle = (() => void dispose());
          handle.replace = (next) => {
            if (released) throw new LlmError("a disposed adapter registration cannot replace its routes", "REGISTRATION_DISPOSED");
            this.commitRoutes(owned, this.prepareRoutes(next, adapter, owned));
          };
          return handle;
        }
        /**
        * Validate one candidate route set for `adapter`, treating routes this
        * registration already holds as available. Nothing is mutated: a rejected
        * candidate leaves the registry exactly as it was.
        */
        prepareRoutes(providers, adapter, owned) {
          const unique = /* @__PURE__ */ new Set();
          const registrations = [];
          for (const provider of providers) {
            if (provider.length === 0) throw new LlmError("adapter provider names must be non-empty", "INVALID_ADAPTER");
            if (unique.has(provider) || this.adapters.has(provider) && !owned.has(provider)) throw new LlmError(`an adapter for provider "${provider}" is already registered`, "DUPLICATE_ADAPTER");
            const info = adapter.providerInfo(provider);
            if (typeof info.id !== "string" || info.id !== provider || typeof info.name !== "string" || info.name.length === 0) throw new LlmError(`adapter metadata for provider "${provider}" must preserve its id and have a non-empty name`, "INVALID_ADAPTER");
            unique.add(provider);
            const retryPolicy = adapter.providerRetryPolicy(provider) ?? resolveRetryPolicy(void 0, `llm: provider "${provider}" retryPolicy`);
            registrations.push({
              adapter,
              provider: {
                id: info.id,
                name: info.name
              },
              retryPolicy
            });
          }
          return registrations;
        }
        /**
        * Swap this registration's routes for the prepared ones in one synchronous
        * section, so no observer can see the registry between the release and the
        * re-registration. The route set's one mutation point is also where
        * `llm/adapters-updated` is published, so a `replace` announces itself
        * exactly like a first registration.
        */
        commitRoutes(owned, registrations) {
          for (const provider of owned) this.adapters.delete(provider);
          owned.clear();
          for (const registration of registrations) {
            this.adapters.set(registration.provider.id, registration);
            owned.add(registration.provider.id);
          }
          this.emitAdaptersUpdated();
        }
        /**
        * Describe provider routes with a registered adapter.
        * @returns detached provider metadata in registration order.
        */
        listProviders() {
          return [...this.adapters.values()].map(({ provider }) => ({ ...provider }));
        }
        /**
        * Declare provider routes an adapter plugin can activate through
        * configuration. Registration is all-or-nothing: an empty list, invalid
        * entry, or a provider already declared by any registration throws
        * `LlmError` without registering the rest. Disposed with the fiber.
        * @param entries - every configurable provider this plugin owns.
        * @returns a handle that withdraws all of them, and can atomically replace them.
        */
        registerConfigurableProviders(entries) {
          let held = [];
          let disposed = false;
          const commit = (candidates) => {
            const detached = [];
            const own = new Set(held.map((entry) => entry.provider));
            for (const entry of candidates) {
              if (entry.provider.length === 0 || entry.displayName.length === 0 || entry.settingsNs.length === 0) throw new LlmError("configurable providers need a non-empty provider, displayName, and settingsNs", "INVALID_DIRECTORY");
              if (entry.settingsPath.some((segment) => segment.length === 0)) throw new LlmError(`configurable provider "${entry.provider}" has an empty settingsPath segment`, "INVALID_DIRECTORY");
              if (this.directory.has(entry.provider) && !own.has(entry.provider) || detached.some((seen) => seen.provider === entry.provider)) throw new LlmError(`configurable provider "${entry.provider}" is already declared`, "DUPLICATE_DIRECTORY");
              detached.push({
                ...entry,
                settingsPath: [...entry.settingsPath]
              });
            }
            for (const entry of held) this.directory.delete(entry.provider);
            for (const entry of detached) this.directory.set(entry.provider, entry);
            held = detached;
            this.emitAdaptersUpdated();
          };
          const dispose = this.ctx.effect(function* () {
            if (entries.length === 0) throw new LlmError("a configurable-provider registration must declare at least one provider", "INVALID_DIRECTORY");
            commit(entries);
            yield () => {
              disposed = true;
              for (const entry of held) this.directory.delete(entry.provider);
              held = [];
              this.emitAdaptersUpdated();
            };
          }.bind(this), "llm.registerConfigurableProviders()");
          const handle = (() => void dispose());
          handle.replace = (next) => {
            if (disposed) throw new LlmError("this configurable-provider registration was disposed", "REGISTRATION_DISPOSED");
            commit(next);
          };
          return handle;
        }
        /**
        * List every declared configurable provider, registered or dormant.
        * @returns detached directory entries in declaration order.
        */
        listConfigurableProviders() {
          return [...this.directory.values()].map((entry) => ({
            ...entry,
            settingsPath: [...entry.settingsPath]
          }));
        }
        /**
        * Offer to interrogate provider endpoints on behalf of the settings
        * namespace this plugin owns. The namespace is the key because that is what
        * a configuration surface already holds from the configurable-provider
        * directory, and because a provider being *added* has no route to name yet.
        * Disposed with the fiber.
        * @param settingsNs - the namespace whose profiles this discovery serves.
        * @param discover - interrogates one endpoint and must honor the supplied signal.
        * @returns the disposer that withdraws the offer.
        */
        registerModelDiscovery(settingsNs, discover) {
          const dispose = this.ctx.effect(function* () {
            if (settingsNs.length === 0) throw new LlmError("model discovery needs a non-empty settings namespace", "INVALID_DISCOVERY");
            if (this.discoveries.has(settingsNs)) throw new LlmError(`model discovery for "${settingsNs}" is already registered`, "DUPLICATE_DISCOVERY");
            this.discoveries.set(settingsNs, discover);
            yield () => {
              this.discoveries.delete(settingsNs);
            };
          }.bind(this), "llm.registerModelDiscovery()");
          return () => void dispose();
        }
        /**
        * Interrogate one provider endpoint for the models it advertises. The
        * request describes a draft, not a stored route, so nothing here reads or
        * writes settings or credentials — the caller owns both, and the reply is
        * candidate metadata a surface may offer for adoption.
        * @param settingsNs - namespace whose registered discovery serves this draft.
        * @param request - the endpoint, protocol, and one-shot credential to use.
        * @param signal - caller cancellation.
        * @returns the advertised models, deduplicated in endpoint order.
        */
        async discoverModels(settingsNs, request, signal) {
          const discover = this.discoveries.get(settingsNs);
          if (discover === void 0) throw new LlmError(`no model discovery is registered for "${settingsNs}"`, "NO_DISCOVERY");
          if ((request.provider ?? "").length === 0 && (request.baseURL ?? "").length === 0) throw new LlmError("model discovery needs a provider route or a baseURL", "INVALID_DISCOVERY");
          const discovered = signal === void 0 ? await discover(request) : await discover(request, signal);
          const seen = /* @__PURE__ */ new Set();
          const models = [];
          for (const model of discovered) {
            if (typeof model.id !== "string" || model.id.length === 0 || seen.has(model.id)) continue;
            seen.add(model.id);
            models.push({
              id: model.id,
              ...model.name === void 0 ? {} : { name: model.name },
              ...model.contextWindow === void 0 ? {} : { contextWindow: model.contextWindow },
              ...model.maxTokens === void 0 ? {} : { maxTokens: model.maxTokens },
              ...model.inputModalities === void 0 ? {} : { inputModalities: [...model.inputModalities] }
            });
          }
          return models;
        }
        /**
        * Remote adapter for one draft provider interrogation.
        * @param settingsNs - namespace whose registered discovery serves this draft.
        * @param request - endpoint, protocol, and one-shot credential to use.
        * @param signal - caller cancellation supplied by the Remote carrier.
        * @returns advertised models in endpoint order.
        * @throws RemoteError with `llm/model-discovery-rejected` when discovery refuses or fails.
        */
        async remoteDiscoverModels(settingsNs, request, signal) {
          try {
            return await this.discoverModels(settingsNs, request, signal);
          } catch (error) {
            throw new RemoteError("llm/model-discovery-rejected", error instanceof Error ? error.message : String(error), {
              settingsNs,
              ...request.baseURL === void 0 ? {} : { baseURL: request.baseURL }
            }, { cause: error });
          }
        }
        /**
        * Resolve the retry policy captured when one provider route was registered.
        * @param provider - registered provider route to inspect.
        * @returns the provider-owned policy, with normal defaults already resolved.
        */
        providerRetryPolicy(provider) {
          return this.registration(provider).retryPolicy;
        }
        /**
        * Resolve provider-side request-image pricing for one exact route, or
        * `undefined` when the provider is unregistered or declares none. Unknown
        * providers degrade to `undefined` rather than throwing because callers
        * price durable history whose route may no longer be mounted.
        * @param provider - provider route named by a request header.
        * @param model - exact model id named by the same header.
        * @returns the owning adapter's image pricing for the route, when declared.
        */
        imageRequestPricing(provider, model) {
          return this.adapters.get(provider)?.adapter.imageRequestPricing(provider, model);
        }
        /**
        * Resolve the exact text one durable file occurrence contributes to every
        * provider request in the current execution environment.
        * @param ref - durable verbatim file reference from model history.
        * @returns the same deterministic handle text used at adapter dispatch.
        */
        fileRequestText(ref) {
          return fileHandleText(ref, this.fileReadPath(ref));
        }
        /** Detach typed adapter-owned modality metadata. */
        detachedModalities(modalities) {
          return modalities === void 0 ? void 0 : [...modalities];
        }
        /**
        * Discover models advertised by one registered provider. Catalog membership
        * does not constrain core routing. Catalog-driven entry points may restrict
        * selection and submission to the advertised models.
        * @param provider - registered provider route to inspect.
        * @returns detached model metadata in adapter-preferred order.
        */
        async listModels(provider) {
          const models = await this.registration(provider).adapter.listModels(provider);
          const seen = /* @__PURE__ */ new Set();
          return models.map((model) => {
            if (typeof model.provider !== "string" || model.provider !== provider || typeof model.id !== "string" || model.id.length === 0 || typeof model.name !== "string" || model.name.length === 0 || model.description !== void 0 && typeof model.description !== "string" || seen.has(model.id)) throw new LlmError(`adapter returned invalid or duplicate model metadata for provider "${provider}"`, "INVALID_CATALOG");
            seen.add(model.id);
            const inputModalities = this.detachedModalities(model.inputModalities);
            return {
              provider: model.provider,
              id: model.id,
              name: model.name,
              ...model.description === void 0 ? {} : { description: model.description },
              ...inputModalities === void 0 ? {} : { inputModalities }
            };
          });
        }
        /**
        * Resolve and validate all metadata from the adapter that owns one exact
        * route. The result is detached from adapter-owned objects; catalog
        * membership remains advisory and does not control request routing.
        * @param provider - registered provider route to inspect.
        * @param model - exact model id passed to the adapter.
        * @param signal - optional cancellation for adapter-owned asynchronous lookup.
        * @returns exact model identity plus available context and reasoning metadata.
        */
        async resolveModelInfo(provider, model, signal) {
          return this.resolveModelInfoFor(this.registration(provider), model, signal);
        }
        async resolveModelInfoFor(registration, model, signal) {
          const resolved = await registration.adapter.resolveModel(registration.provider.id, model, signal);
          return this.normalizeModelInfo(registration, model, resolved);
        }
        /** Validate and detach one adapter-returned exact model result. */
        normalizeModelInfo(registration, model, resolved) {
          const provider = registration.provider.id;
          if (typeof resolved.provider !== "string" || resolved.provider !== provider || typeof resolved.id !== "string" || resolved.id !== model || typeof resolved.name !== "string" || resolved.name.length === 0 || resolved.description !== void 0 && typeof resolved.description !== "string") throw new LlmError(`adapter returned invalid exact model metadata for provider "${provider}" model "${model}"`, "INVALID_MODEL_INFO");
          const context = resolved.context;
          if (context !== void 0 && (!Number.isInteger(context.contextWindow) || context.contextWindow <= 0)) throw new LlmError(`adapter returned invalid context metadata for provider "${provider}" model "${model}"`, "INVALID_MODEL_CONTEXT");
          const inputModalities = this.detachedModalities(resolved.inputModalities);
          const systemPromptUpdate = resolved.systemPromptUpdate;
          if (systemPromptUpdate !== void 0 && systemPromptUpdate !== "in-history") throw new LlmError(`adapter returned invalid system prompt update mode for provider "${provider}" model "${model}"`, "INVALID_MODEL_INFO");
          const toolUpdate = resolved.toolUpdate;
          if (toolUpdate !== void 0 && toolUpdate !== "in-history" && toolUpdate !== "addition-only") throw new LlmError(`adapter returned invalid tool update mode for provider "${provider}" model "${model}"`, "INVALID_MODEL_INFO");
          const defaultMaxTokens = resolved.defaultMaxTokens;
          if (defaultMaxTokens !== void 0 && (!Number.isSafeInteger(defaultMaxTokens) || defaultMaxTokens <= 0)) throw new LlmError(`adapter returned invalid default maxTokens for provider "${provider}" model "${model}"`, "INVALID_MODEL_MAX_TOKENS");
          const info = {
            provider,
            id: model,
            name: resolved.name,
            ...resolved.description === void 0 ? {} : { description: resolved.description },
            ...inputModalities === void 0 ? {} : { inputModalities },
            ...context === void 0 ? {} : { context: { contextWindow: context.contextWindow } },
            ...defaultMaxTokens === void 0 ? {} : { defaultMaxTokens },
            ...resolved.systemPromptUpdate === void 0 ? {} : { systemPromptUpdate: resolved.systemPromptUpdate },
            ...resolved.toolUpdate === void 0 ? {} : { toolUpdate: resolved.toolUpdate }
          };
          const reasoning = resolved.reasoning;
          if (reasoning === void 0) return info;
          if (reasoning.efforts.length === 0) throw new LlmError(`adapter returned invalid reasoning metadata for provider "${provider}" model "${model}"`, "INVALID_MODEL_REASONING");
          const seen = /* @__PURE__ */ new Set();
          const efforts = reasoning.efforts.map((effort) => {
            if (typeof effort.id !== "string" || effort.id.length === 0 || typeof effort.name !== "string" || effort.name.length === 0 || effort.description !== void 0 && typeof effort.description !== "string" || seen.has(effort.id)) throw new LlmError(`adapter returned invalid or duplicate reasoning effort metadata for provider "${provider}" model "${model}"`, "INVALID_MODEL_REASONING");
            seen.add(effort.id);
            return {
              id: effort.id,
              name: effort.name,
              ...effort.description === void 0 ? {} : { description: effort.description }
            };
          });
          if (reasoning.defaultEffort !== void 0 && !seen.has(reasoning.defaultEffort)) throw new LlmError(`adapter returned an unknown default reasoning effort for provider "${provider}" model "${model}"`, "INVALID_MODEL_REASONING");
          return {
            ...info,
            reasoning: {
              efforts,
              ...reasoning.defaultEffort === void 0 ? {} : { defaultEffort: reasoning.defaultEffort }
            }
          };
        }
        /**
        * Validate a conversation call config against its exact model capability and
        * materialize adapter-configured defaults. Unsupported explicit efforts
        * reject before provider I/O; no clamping or aliasing is performed. This
        * standalone query does not bind a later dispatch; use {@link prepareCall}
        * when logging and streaming must share one adapter registration.
        * @param config - provider/model route and optional request controls.
        * @param signal - optional cancellation for adapter-owned capability lookup.
        * @returns a detached config only when a default must be materialized.
        */
        async resolveCallConfig(config, signal) {
          return (await this.resolveCallFor(this.registration(config.provider), config, signal)).config;
        }
        async resolveCallFor(registration, config, signal) {
          const info = await this.resolveModelInfoFor(registration, config.model, signal);
          return this.resolveCallWithInfo(config, info);
        }
        /** Validate request controls against one already-bound exact model result. */
        resolveCallWithInfo(config, info) {
          const defaulted = config.maxTokens === void 0 && info.defaultMaxTokens !== void 0 ? {
            ...config,
            maxTokens: info.defaultMaxTokens
          } : config;
          const reasoning = info.reasoning;
          const requested = defaulted.reasoningEffort;
          let resolvedConfig = defaulted;
          if (reasoning === void 0) {
            if (requested !== void 0) throw new LlmError(`provider "${config.provider}" model "${config.model}" does not support reasoning effort "${requested}"`, "UNSUPPORTED_REASONING_EFFORT");
          } else {
            const effective = requested ?? reasoning.defaultEffort;
            if (effective !== void 0) {
              if (!reasoning.efforts.some((effort) => effort.id === effective)) throw new LlmError(`provider "${config.provider}" model "${config.model}" does not support reasoning effort "${effective}"`, "UNSUPPORTED_REASONING_EFFORT");
              if (requested !== effective) resolvedConfig = {
                ...defaulted,
                reasoningEffort: effective
              };
            }
          }
          return {
            config: resolvedConfig,
            ...info.context === void 0 ? {} : { context: info.context },
            modelInfo: info
          };
        }
        /**
        * Resolve one call under its current adapter registration. The returned
        * one-shot handle keeps that registration across header logging and dispatch,
        * so HMR cannot combine one adapter's capability result with another adapter.
        * @param config - provider/model route and optional request controls.
        * @param signal - optional cancellation for adapter-owned capability lookup.
        * @returns a prepared config and its registration-bound stream entry point.
        */
        async prepareCall(config, signal) {
          const registration = this.registration(config.provider);
          const adapterCall = await registration.adapter.prepareCall(config.provider, config.model, signal);
          const modelInfo = this.normalizeModelInfo(registration, config.model, adapterCall.model);
          const resolved = this.resolveCallWithInfo(config, modelInfo);
          const resolvedConfig = deepFreeze(structuredClone(resolved.config));
          const context = resolved.context === void 0 ? void 0 : deepFreeze(structuredClone(resolved.context));
          const adapterDefaults = deepFreeze({
            ...config.reasoningEffort === void 0 && resolvedConfig.reasoningEffort !== void 0 ? { reasoningEffort: true } : {},
            ...config.maxTokens === void 0 && resolvedConfig.maxTokens !== void 0 ? { maxTokens: true } : {}
          });
          let dispatched = false;
          return Object.freeze({
            config: resolvedConfig,
            retryPolicy: registration.retryPolicy,
            adapterDefaults,
            ...context === void 0 ? {} : { context },
            ...modelInfo.inputModalities === void 0 ? {} : { inputModalities: Object.freeze([...modelInfo.inputModalities]) },
            ...modelInfo.systemPromptUpdate === void 0 ? {} : { systemPromptUpdate: modelInfo.systemPromptUpdate },
            ...modelInfo.toolUpdate === void 0 ? {} : { toolUpdate: modelInfo.toolUpdate },
            stream: (options) => {
              if (dispatched) throw new LlmError("a prepared LLM call can only be dispatched once", "INVALID_PREPARED_CALL");
              if (!callConfigEquals(options, resolvedConfig)) throw new LlmError("prepared LLM call config changed before adapter dispatch", "INVALID_PREPARED_CALL");
              dispatched = true;
              return this.streamWithRegistration(options, {
                registration,
                config: resolvedConfig,
                modelInfo,
                dispatch: (options2) => adapterCall.stream(options2)
              });
            }
          });
        }
        registration(provider) {
          const registration = this.adapters.get(provider);
          if (!registration) throw new LlmError(`no adapter registered for provider "${provider}"`, "NO_ADAPTER");
          return registration;
        }
        /** Remove replay state whose historical route is owned by another adapter. */
        forAdapter(options, adapter) {
          const messages = options.messages.map((message) => {
            if (message.role !== "assistant") return message;
            const source = message.source;
            if (source.replayState === void 0) return message;
            if (this.adapters.get(source.provider)?.adapter === adapter) return message;
            return freezeMessage({
              ...message,
              source: {
                kind: "model",
                provider: source.provider,
                model: source.model
              }
            });
          });
          if (messages.every((message, index) => message === options.messages[index])) return options;
          const filtered = {
            ...options,
            messages
          };
          return Object.isFrozen(options) ? deepFreeze(filtered) : filtered;
        }
        /**
        * Resolve the current execution-world read path of one durable file
        * reference through the mounted attachment and filesystem providers.
        */
        fileReadPath(ref) {
          let hostPath;
          try {
            hostPath = this.ctx.get("attachments")?.fileHostPath(ref);
          } catch {
            return;
          }
          if (hostPath === void 0) return void 0;
          return this.ctx.get("fs")?.processPathFromHostPath(hostPath);
        }
        /**
        * Final adapter boundary. Adapter selection, dispatch, iterator construction,
        * and iteration failures become one terminal failure chunk. Middleware and
        * downstream consumer failures remain thrown plugin or consumer errors.
        */
        async *adapterStream(options, prepared) {
          let iterator;
          try {
            const registration = prepared?.registration ?? this.registration(options.provider);
            const adapter = registration.adapter;
            let modelInfo;
            let resolvedConfig;
            let dispatch;
            if (prepared === void 0) {
              const adapterCall = await adapter.prepareCall(options.provider, options.model, options.signal);
              modelInfo = this.normalizeModelInfo(registration, options.model, adapterCall.model);
              resolvedConfig = this.resolveCallWithInfo(options, modelInfo).config;
              dispatch = (options2) => adapterCall.stream(options2);
            } else {
              modelInfo = prepared.modelInfo;
              resolvedConfig = prepared.config;
              dispatch = prepared.dispatch;
            }
            if (prepared !== void 0 && !callConfigEquals(options, resolvedConfig)) throw new LlmError("prepared LLM call config changed before adapter dispatch", "INVALID_PREPARED_CALL");
            const resolvedOptions = callConfigEquals(options, resolvedConfig) ? options : Object.isFrozen(options) ? deepFreeze({
              ...options,
              ...resolvedConfig
            }) : {
              ...options,
              ...resolvedConfig
            };
            let projectedMessages = resolvedOptions.messages;
            if (projectedMessages.some((message) => contentHasFile(message.content))) projectedMessages = projectFilesToText(projectedMessages, (ref) => this.fileReadPath(ref));
            if (modelInfo.inputModalities !== void 0 && !modelInfo.inputModalities.includes("image") && projectedMessages.some((message) => contentHasImage(message.content))) projectedMessages = projectImagesForTextModel(projectedMessages);
            const projectedTools = projectToolUpdates(projectedMessages, resolvedOptions.tools, modelInfo.toolUpdate, resolvedOptions.toolHistory);
            projectedMessages = projectedTools.messages;
            let projectedOptions = resolvedOptions;
            if (projectedMessages !== resolvedOptions.messages || projectedTools.tools !== resolvedOptions.tools) {
              projectedOptions = {
                ...resolvedOptions,
                messages: projectedMessages,
                ...projectedTools.tools === void 0 ? {} : { tools: projectedTools.tools }
              };
              if (Object.isFrozen(resolvedOptions)) deepFreeze(projectedOptions);
            }
            iterator = dispatch(this.forAdapter(projectedOptions, adapter))[Symbol.asyncIterator]();
          } catch (error) {
            yield adapterFailureChunk(error, options.signal);
            return;
          }
          let completed = false;
          try {
            while (true) {
              let item;
              try {
                const next = await iterator.next();
                item = next.done ? { done: true } : {
                  done: false,
                  value: next.value
                };
              } catch (error) {
                completed = true;
                yield adapterFailureChunk(error, options.signal);
                return;
              }
              if (item.done) {
                completed = true;
                return;
              }
              yield item.value;
            }
          } finally {
            if (!completed) {
              const close = iterator.return?.bind(iterator);
              if (close) await close();
            }
          }
        }
        /**
        * Stream one model call as raw chunks (token-level deltas). Replay state is
        * retained only when the same adapter instance owns its historical provider
        * and the target provider. Final adapter selection remains fixed through
        * asynchronous exact-model resolution and dispatch. Adapter selection,
        * dispatch, and iteration failures become terminal `error` or `aborted`
        * finish chunks; middleware, nested-call, cleanup, and consumer failures
        * remain thrown.
        * @param options - the full request; `options.provider` selects the adapter.
        * @returns the chunk stream, possibly wrapped by `llm/stream` listeners.
        */
        stream(options) {
          return this.streamWithRegistration(options);
        }
        streamWithRegistration(options, prepared) {
          return this.ctx.waterfall(this, "llm/stream", options, () => this.adapterStream(options, prepared));
        }
      };
    })();
  }
});

// host-020.js
import z4 from "@deepseek-ai/schemastery";

// index.js
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire as createRequire2 } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import z3 from "@deepseek-ai/schemastery";

// ../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-tools/lib/index.js
init_lib2();
import z2 from "@deepseek-ai/schemastery";

// ../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-scope/lib/index.js
init_lib2();
var NamedEntries = class {
  duplicateError;
  data = /* @__PURE__ */ new Map();
  constructor(duplicateError) {
    this.duplicateError = duplicateError;
  }
  /**
  * Insert one unique name.
  * @param name - name unique within this table.
  * @param value - borrowed value to retain.
  * @returns an idempotent undo that removes only this insertion.
  */
  insert(name3, value) {
    const data = this.data;
    if (data.has(name3)) throw this.duplicateError(name3);
    data.set(name3, value);
    let active = true;
    return () => {
      if (!active) return;
      active = false;
      data.delete(name3);
      if (data.size === 0 && this.data === data) this.data = /* @__PURE__ */ new Map();
    };
  }
  /**
  * Read one named value.
  * @param name - name to resolve.
  * @returns the retained value, or `undefined` when absent.
  */
  get(name3) {
    return this.data.get(name3);
  }
  /**
  * Test one name for membership.
  * @param name - name to test.
  * @returns whether the table contains that name.
  */
  has(name3) {
    return this.data.has(name3);
  }
  /**
  * Iterate live names in insertion order.
  * @returns the native live key iterator.
  */
  keys() {
    return this.data.keys();
  }
  /**
  * Iterate live entries in insertion order.
  * @returns the native live entry iterator.
  */
  entries() {
    return this.data.entries();
  }
  /**
  * Iterate live values in insertion order.
  * @returns the native live value iterator.
  */
  values() {
    return this.data.values();
  }
  /**
  * Test whether this table has no entries.
  * @returns whether the table is empty.
  */
  isEmpty() {
    return this.data.size === 0;
  }
};
var AnonymousEntries = class {
  data = /* @__PURE__ */ new Map();
  /**
  * Append one independently owned value.
  * @param value - borrowed value to retain.
  * @returns an idempotent undo for this exact append.
  */
  append(value) {
    const data = this.data;
    const key = Symbol();
    data.set(key, value);
    let active = true;
    return () => {
      if (!active) return;
      active = false;
      data.delete(key);
      if (data.size === 0 && this.data === data) this.data = /* @__PURE__ */ new Map();
    };
  }
  /**
  * Iterate live values in insertion order.
  * @returns the native live value iterator.
  */
  values() {
    return this.data.values();
  }
  /**
  * Test whether this table has no entries.
  * @returns whether the table is empty.
  */
  isEmpty() {
    return this.data.size === 0;
  }
};
var ScopedLayers = class {
  createLayer;
  onChange;
  /** The eagerly constructed context-global layer. */
  global;
  scoped = /* @__PURE__ */ new Map();
  constructor(createLayer, onChange) {
    this.createLayer = createLayer;
    this.onChange = onChange;
    this.global = createLayer(void 0);
  }
  /**
  * Read an existing exact-scope overlay. Deliberately chain-blind: callers
  * addressing one scope's OWN contributions (its restrictions, its guards)
  * must not silently pick up an ancestor's — use {@link chainLayers} where
  * inheritance is the point.
  * @param scope - exact scope key; `undefined` denotes no overlay.
  * @returns the existing scoped layer, or `undefined` without creating one.
  */
  peek(scope) {
    if (scope === void 0) return void 0;
    return this.scoped.get(scope);
  }
  /**
  * Existing overlays along the scope's parent chain ({@link scopeChainOf}),
  * farthest ancestor first and the exact scope last, so a caller layering
  * them in order gives the nearest scope the final word.
  * @param scope - viewing scope, or `undefined` for no overlays.
  * @returns the existing layers, nearest last; absent overlays are skipped.
  */
  chainLayers(scope) {
    const layers = [];
    for (const key of scopeChainOf(scope).reverse()) {
      const layer = this.scoped.get(key);
      if (layer !== void 0) layers.push(layer);
    }
    return layers;
  }
  /**
  * Materialize global named entries followed by scope-chain shadows,
  * farthest ancestor first, so the nearest scope's entry wins a name.
  * @param scope - viewing scope, or `undefined` for the global view.
  * @param pick - select the named table from a layer.
  * @returns an insertion-ordered effective map.
  */
  merge(scope, pick) {
    const merged = new Map(pick(this.global).entries());
    for (const layer of this.chainLayers(scope)) for (const [name3, value] of pick(layer).entries()) merged.set(name3, value);
    return merged;
  }
  /**
  * Attach one synchronous layer mutation to its registration context.
  * @param ctx - context that determines both scope visibility and effect ownership.
  * @param action - atomic mutation returning its synchronous undo.
  * @param options - Cordis effect label and optional change notification.
  * @returns the exact disposer returned by `ctx.effect()`.
  */
  effect(ctx, action, options) {
    const scope = scopeOf(ctx);
    const notify = options.notify ?? true;
    return ctx.effect(function* () {
      let layer;
      let created = false;
      if (scope === void 0) layer = this.global;
      else {
        const existing = this.scoped.get(scope);
        if (existing === void 0) {
          layer = this.createLayer(scope);
          this.scoped.set(scope, layer);
          created = true;
        } else layer = existing;
      }
      let undo;
      try {
        undo = action(layer);
      } catch (error) {
        if (scope !== void 0 && created && layer.isEmpty()) this.scoped.delete(scope);
        throw error;
      }
      yield () => {
        undo();
        if (scope !== void 0 && layer.isEmpty()) this.scoped.delete(scope);
        if (notify) this.onChange();
      };
      if (notify) this.onChange();
    }.bind(this), options.label);
  }
};
var kScope = Symbol("dsh.scope");
var carrierKeys = /* @__PURE__ */ new WeakMap();
var scopeParents = /* @__PURE__ */ new WeakMap();
function scopeChainOf(key) {
  const chain = [];
  for (let cursor = key; cursor !== void 0; cursor = scopeParents.get(cursor)) chain.push(cursor);
  return chain;
}
function scopeOf(ctx) {
  return ctx[kScope];
}
function scopeTarget(base, key) {
  const baseFilter = base[Context.filter];
  const carrier = { [Context.filter](ctx) {
    if (baseFilter !== void 0 && !baseFilter.call(base, ctx)) return false;
    const tag = scopeOf(ctx);
    if (tag === void 0) return true;
    for (let cursor = key; cursor !== void 0; cursor = scopeParents.get(cursor)) if (cursor === tag) return true;
    return false;
  } };
  carrierKeys.set(carrier, key);
  return carrier;
}

// ../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-tools/lib/index.js
init_lib8();
init_lib4();
init_lib6();

// ../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-sandbox/lib/index.js
init_lib8();
init_lib4();
var WIDER_MODES = {
  "read-only": ["workspace-write", "danger-full-access"],
  "workspace-write": ["danger-full-access"]
};
var ESCALATION_TARGETS = ["workspace-write", "danger-full-access"];
function validateEscalationArgs(sandboxPermissions, justification) {
  if (sandboxPermissions !== void 0 && justification === void 0) throw new Error("invalid escalation: sandbox_permissions requires a justification");
  if (justification !== void 0 && sandboxPermissions === void 0) throw new Error("invalid escalation: justification is only valid together with sandbox_permissions");
  if (justification !== void 0 && justification.trim().length === 0) throw new Error("invalid justification: expected a non-empty sentence");
}
async function approveEscalation(request, approval) {
  const { requestedMode: mode, effectiveMode, justification, subject } = request;
  if (mode === effectiveMode) return effectiveMode;
  if (!(WIDER_MODES[effectiveMode] ?? []).includes(mode)) throw new Error(`sandbox escalation to "${mode}" is not strictly wider than this call's current "${effectiveMode}" mode`);
  if (approval.approver === void 0) throw new Error(`sandbox escalation to "${mode}" requires approval, but no approval service is composed`);
  if (approval.agent === void 0) throw new Error(`sandbox escalation to "${mode}" requires approval, but the call has no agent to route it through`);
  const outcome = await approval.approver.request({
    agent: approval.agent,
    toolName: approval.toolName,
    callId: approval.callId,
    reason: `escalate sandbox to ${mode}: ${justification}`,
    displayReason: {
      en: `Allow this operation with ${mode} permissions: ${justification}`,
      zh: `\u5141\u8BB8\u672C\u6B21\u64CD\u4F5C\u4F7F\u7528 ${mode} \u6743\u9650\uFF1A${justification}`
    },
    ...approval.signal ? { signal: approval.signal } : {}
  });
  switch (outcome) {
    case "allowed-once":
      return mode;
    case "rejected":
      throw new Error(`the user rejected escalating this ${subject} to "${mode}"; it stays denied, so stop and explain instead of working around it`);
    case "cancelled":
      throw new Error(`approval for escalating to "${mode}" was cancelled`);
    case "unavailable":
      throw new Error(`sandbox escalation to "${mode}" requires approval, but no approval channel is available`);
    default:
      return assertNever(outcome, "EscalationOutcome");
  }
}

// ../../.dsh-releases/v015-rc2-t4x7mz4n/runtime/node_modules/@deepseek-ai/dsh-tools/lib/index.js
var JsonSchemaError = class extends HarnessError {
  /** Individual schema violations in walk order. */
  violations;
  constructor(violations) {
    super(`unsupported JSON schema: ${violations.join("; ")}`, "UNSUPPORTED_SCHEMA");
    this.name = "JsonSchemaError";
    this.violations = violations;
  }
};
var CONSTRAINT_KEYWORDS = /* @__PURE__ */ new Set([
  "type",
  "oneOf",
  "properties",
  "required",
  "additionalProperties",
  "items",
  "enum",
  "const"
]);
var ANNOTATION_KEYWORDS = /* @__PURE__ */ new Set([
  "description",
  "title",
  "default",
  "examples"
]);
var SCHEMA_TYPES = [
  "object",
  "array",
  "string",
  "number",
  "integer",
  "boolean",
  "null"
];
function hasIntrinsicConstructor2(prototype, name3) {
  const constructor = Object.getOwnPropertyDescriptor(prototype, "constructor")?.value;
  if (typeof constructor !== "function") return false;
  try {
    return constructor.name === name3 && constructor.prototype === prototype && Function.prototype.toString.call(constructor) === `function ${name3}() { [native code] }`;
  } catch {
    return false;
  }
}
function isIntrinsicObjectPrototype2(value) {
  return Object.getPrototypeOf(value) === null && hasIntrinsicConstructor2(value, "Object");
}
function isPlainJsonRecord(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  try {
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || typeof prototype === "object" && isIntrinsicObjectPrototype2(prototype);
  } catch {
    return false;
  }
}
function hasPlainArrayPrototype2(value) {
  const prototype = Object.getPrototypeOf(value);
  if (!Array.isArray(prototype) || !hasIntrinsicConstructor2(prototype, "Array")) return false;
  const objectPrototype = Object.getPrototypeOf(prototype);
  return typeof objectPrototype === "object" && objectPrototype !== null && isIntrinsicObjectPrototype2(objectPrototype);
}
function hasOnlyEnumerableStringKeys(value) {
  try {
    return Reflect.ownKeys(value).every((key) => typeof key === "string" && Object.prototype.propertyIsEnumerable.call(value, key));
  } catch {
    return false;
  }
}
function isJsonSchemaRecord(value) {
  return isPlainJsonRecord(value) && hasOnlyEnumerableStringKeys(value);
}
function isPlainJsonArray(value) {
  if (!Array.isArray(value)) return false;
  try {
    if (!hasPlainArrayPrototype2(value) || Reflect.ownKeys(value).length !== value.length + 1) return false;
    for (let index = 0; index < value.length; index++) if (!Object.hasOwn(value, index)) return false;
    return true;
  } catch {
    return false;
  }
}
function isJsonNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && !Object.is(value, -0);
}
function scalarMatches(type, value) {
  switch (type) {
    case "string":
      return typeof value === "string";
    case "number":
      return isJsonNumber(value);
    case "integer":
      return isJsonNumber(value) && Number.isInteger(value);
    case "boolean":
      return typeof value === "boolean";
    case "null":
      return value === null;
    /* v8 ignore next -- JsonSchemaScalarType is closed; this retains compile-time exhaustiveness. */
    default:
      return assertNever(type, "JsonSchemaType");
  }
}
var ONE_OF_SIBLING_KEYWORDS = [
  "properties",
  "required",
  "additionalProperties",
  "items",
  "enum",
  "const"
];
function checkObjectSchemaTail(node, path, properties, violations) {
  const hasRequired = Object.hasOwn(node, "required");
  const required = hasRequired ? node.required : void 0;
  if (hasRequired) if (!isPlainJsonArray(required) || required.some((entry) => typeof entry !== "string")) violations.push(`${path}.required must be an array of strings`);
  else {
    const declared = isJsonSchemaRecord(properties) ? properties : {};
    for (const key of required) if (!Object.hasOwn(declared, key)) violations.push(`${path}.required names "${key}" which is not in properties`);
  }
  if (Object.hasOwn(node, "additionalProperties") && typeof node.additionalProperties !== "boolean") violations.push(`${path}.additionalProperties must be a boolean`);
}
function checkSchemaNode(root, rootPath, violations, seen) {
  const tasks = [{
    kind: "enter",
    node: root,
    path: rootPath
  }];
  for (let task = tasks.pop(); task !== void 0; task = tasks.pop()) {
    if (task.kind === "leave") {
      seen.delete(task.node);
      continue;
    }
    if (task.kind === "one-of-tail") {
      for (const key of ONE_OF_SIBLING_KEYWORDS) if (Object.hasOwn(task.node, key)) violations.push(`${task.path}.${key} is not supported beside oneOf`);
      continue;
    }
    if (task.kind === "object-tail") {
      checkObjectSchemaTail(task.node, task.path, task.properties, violations);
      continue;
    }
    const { node, path } = task;
    if (!isJsonSchemaRecord(node)) {
      violations.push(`${path} must be a schema object`);
      continue;
    }
    if (seen.has(node)) {
      violations.push(`${path} is circular`);
      continue;
    }
    seen.add(node);
    tasks.push({
      kind: "leave",
      node
    });
    for (const key of Object.keys(node)) {
      if (CONSTRAINT_KEYWORDS.has(key)) continue;
      if (ANNOTATION_KEYWORDS.has(key)) {
        try {
          if (!isJsonValue(node[key])) violations.push(`${path}.${key} annotation must be lossless JSON data`);
        } catch {
          violations.push(`${path}.${key} annotation must be lossless JSON data`);
        }
        continue;
      }
      violations.push(`${path}.${key} is not a supported keyword (subset: type/oneOf/properties/required/additionalProperties/items/enum/const + annotations)`);
    }
    if (Object.hasOwn(node, "description") && typeof node.description !== "string") violations.push(`${path}.description must be a string`);
    if (Object.hasOwn(node, "title") && typeof node.title !== "string") violations.push(`${path}.title must be a string`);
    const hasType = Object.hasOwn(node, "type");
    const hasOneOf = Object.hasOwn(node, "oneOf");
    if (hasType && hasOneOf) {
      violations.push(`${path} cannot declare both type and oneOf`);
      continue;
    }
    if (!hasType && !hasOneOf) {
      for (const key of ONE_OF_SIBLING_KEYWORDS) if (Object.hasOwn(node, key)) violations.push(`${path}.${key} requires type or oneOf`);
      continue;
    }
    if (hasOneOf) {
      const oneOf = node.oneOf;
      tasks.push({
        kind: "one-of-tail",
        node,
        path
      });
      if (!isPlainJsonArray(oneOf) || oneOf.length < 2) violations.push(`${path}.oneOf must be an array of at least two schemas`);
      else for (let index = oneOf.length - 1; index >= 0; index--) tasks.push({
        kind: "enter",
        node: oneOf[index],
        path: `${path}.oneOf[${index}]`
      });
      continue;
    }
    const type = node.type;
    if (typeof type !== "string" || !SCHEMA_TYPES.includes(type)) {
      violations.push(Array.isArray(type) ? `${path}.type must be a single type string (type arrays are not supported)` : `${path}.type must be one of ${SCHEMA_TYPES.join("/")}`);
      continue;
    }
    const schemaType = type;
    for (const [key, types] of Object.entries({
      properties: ["object"],
      required: ["object"],
      additionalProperties: ["object"],
      items: ["array"],
      enum: [
        "string",
        "number",
        "integer",
        "boolean",
        "null"
      ],
      const: [
        "string",
        "number",
        "integer",
        "boolean",
        "null"
      ]
    })) if (Object.hasOwn(node, key) && !types.includes(schemaType)) violations.push(`${path}.${key} is not supported on type "${schemaType}"`);
    switch (schemaType) {
      case "object": {
        const properties = Object.hasOwn(node, "properties") ? node.properties : void 0;
        tasks.push({
          kind: "object-tail",
          node,
          path,
          properties
        });
        if (Object.hasOwn(node, "properties")) if (!isJsonSchemaRecord(properties)) violations.push(`${path}.properties must be an object of schemas`);
        else {
          const entries = Object.entries(properties);
          for (let index = entries.length - 1; index >= 0; index--) {
            const entry = entries[index];
            if (entry === void 0) continue;
            tasks.push({
              kind: "enter",
              node: entry[1],
              path: `${path}.properties.${entry[0]}`
            });
          }
        }
        break;
      }
      case "array":
        if (Object.hasOwn(node, "items")) tasks.push({
          kind: "enter",
          node: node.items,
          path: `${path}.items`
        });
        break;
      case "string":
      case "number":
      case "integer":
      case "boolean":
      case "null": {
        const hasEnum = Object.hasOwn(node, "enum");
        const allowed = hasEnum ? node.enum : void 0;
        const enumValid = isPlainJsonArray(allowed) && allowed.length > 0 && allowed.every((entry) => scalarMatches(schemaType, entry));
        if (hasEnum && !enumValid) violations.push(`${path}.enum must be a non-empty array of ${schemaType} values`);
        const hasConst = Object.hasOwn(node, "const");
        const declaredConst = hasConst ? node.const : void 0;
        const constValid = scalarMatches(schemaType, declaredConst);
        if (hasConst) {
          if (!constValid) violations.push(`${path}.const must be a ${schemaType} value`);
          else if (enumValid && !allowed.includes(declaredConst)) violations.push(`${path}.const must be one of ${path}.enum when both are declared`);
        }
        break;
      }
      /* v8 ignore next -- schemaType was narrowed from the closed SCHEMA_TYPES table above. */
      default:
        assertNever(schemaType, "JsonSchemaType");
    }
  }
}
function assertSupportedJsonSchema(schema) {
  const violations = [];
  checkSchemaNode(schema, "schema", violations, /* @__PURE__ */ new Set());
  if (violations.length > 0) throw new JsonSchemaError(violations);
}
function safelyIsJsonValue(value) {
  try {
    return isJsonValue(value);
  } catch {
    return false;
  }
}
function diagnosticPath(path) {
  return path === "" ? "arguments" : path;
}
function propertyPath(path, key) {
  return path === "" ? key : `${path}.${key}`;
}
function losslessValueViolation(path) {
  return [`"${diagnosticPath(path)}" must be a lossless JSON value`];
}
function appendViolations(target, source) {
  for (const violation of source) target.push(violation);
}
function valueFrame(node, value, path) {
  return {
    node,
    value,
    path,
    catches: false,
    phase: "start",
    children: [],
    childIndex: 0,
    violations: [],
    tailViolations: [],
    matches: 0
  };
}
function checkScalarValue(node, value, path) {
  const allowed = Object.hasOwn(node, "enum") ? node.enum : void 0;
  if (allowed !== void 0 && !allowed.includes(value)) return [`"${diagnosticPath(path)}" must be one of ${JSON.stringify(allowed)}`];
  if (Object.hasOwn(node, "const") && value !== node.const) return [`"${diagnosticPath(path)}" must be ${JSON.stringify(node.const)}`];
  return [];
}
function checkValue(schema, value, path) {
  const frames = [valueFrame(schema, value, path)];
  let rootResult;
  const receive = (result) => {
    const parent = frames.at(-1);
    if (parent === void 0) {
      rootResult = result;
      return;
    }
    if (parent.kind === "oneOf") {
      if (result.length === 0) parent.matches++;
    } else appendViolations(parent.violations, result);
  };
  const finish = (result) => {
    frames.pop();
    receive(result);
  };
  while (frames.length > 0) {
    const frame = frames.at(-1);
    if (frame === void 0) break;
    try {
      if (frame.phase === "children") {
        if (frame.childIndex < frame.children.length) {
          const child = frame.children[frame.childIndex];
          if (child === void 0) throw new Error("missing schema-value child frame");
          frame.childIndex++;
          frames.push(valueFrame(child.node, child.value, child.path));
          continue;
        }
        if (frame.kind === "oneOf") {
          finish(frame.matches === 1 ? [] : [`"${diagnosticPath(frame.path)}" must match exactly one oneOf branch (matched ${frame.matches})`]);
          continue;
        }
        appendViolations(frame.violations, frame.tailViolations);
        if (frame.violations.length > 0) finish(frame.violations);
        else if (frame.kind === "object") finish(safelyIsJsonValue(frame.value) ? [] : [`"${diagnosticPath(frame.path)}" must be a lossless JSON object`]);
        else finish(safelyIsJsonValue(frame.value) ? [] : [`"${diagnosticPath(frame.path)}" must be a dense lossless JSON array`]);
        continue;
      }
      const nodeType = Object.hasOwn(frame.node, "type") ? frame.node.type : void 0;
      frame.catches = !(nodeType !== void 0 && !SCHEMA_TYPES.includes(nodeType));
      const oneOf = Object.hasOwn(frame.node, "oneOf") ? frame.node.oneOf : void 0;
      if (oneOf !== void 0) {
        frame.kind = "oneOf";
        frame.children = Array.from(oneOf, (branch) => ({
          node: branch,
          value: frame.value,
          path: frame.path
        }));
        frame.childIndex = 0;
        frame.matches = 0;
        frame.phase = "children";
        continue;
      }
      if (nodeType === void 0) {
        finish(safelyIsJsonValue(frame.value) ? [] : losslessValueViolation(frame.path));
        continue;
      }
      switch (nodeType) {
        case "object": {
          if (!isPlainJsonRecord(frame.value)) {
            finish([`"${diagnosticPath(frame.path)}" must be an object`]);
            break;
          }
          const properties = Object.hasOwn(frame.node, "properties") ? frame.node.properties ?? {} : {};
          const violations = [];
          const required = Object.hasOwn(frame.node, "required") ? frame.node.required ?? [] : [];
          for (const key of required) if (!Object.hasOwn(frame.value, key) || frame.value[key] === void 0) violations.push(`missing required property "${propertyPath(frame.path, key)}"`);
          const children = [];
          for (const [key, child] of Object.entries(properties)) {
            if (!Object.hasOwn(frame.value, key) || frame.value[key] === void 0) continue;
            children.push({
              node: child,
              value: frame.value[key],
              path: propertyPath(frame.path, key)
            });
          }
          const tailViolations = [];
          if (Object.hasOwn(frame.node, "additionalProperties") && frame.node.additionalProperties === false) {
            for (const key of Object.keys(frame.value)) if (!Object.hasOwn(properties, key)) tailViolations.push(`"${propertyPath(frame.path, key)}" is not a declared property (additionalProperties: false)`);
          }
          frame.kind = "object";
          frame.children = children;
          frame.childIndex = 0;
          frame.violations = violations;
          frame.tailViolations = tailViolations;
          frame.phase = "children";
          break;
        }
        case "array": {
          if (!Array.isArray(frame.value)) {
            finish([`"${diagnosticPath(frame.path)}" must be an array`]);
            break;
          }
          const items = Object.hasOwn(frame.node, "items") ? frame.node.items : void 0;
          const children = items === void 0 ? [] : frame.value.flatMap((entry, index) => [{
            node: items,
            value: entry,
            path: `${frame.path}[${index}]`
          }]);
          frame.kind = "array";
          frame.children = children;
          frame.childIndex = 0;
          frame.violations = [];
          frame.phase = "children";
          break;
        }
        case "string":
          finish(typeof frame.value === "string" ? checkScalarValue(frame.node, frame.value, frame.path) : [`"${diagnosticPath(frame.path)}" must be a string`]);
          break;
        case "number":
          finish(typeof frame.value !== "number" ? [`"${diagnosticPath(frame.path)}" must be a number`] : !isJsonNumber(frame.value) ? [`"${diagnosticPath(frame.path)}" must be a finite JSON number`] : checkScalarValue(frame.node, frame.value, frame.path));
          break;
        case "integer":
          finish(!isJsonNumber(frame.value) || !Number.isInteger(frame.value) ? [`"${diagnosticPath(frame.path)}" must be an integer`] : checkScalarValue(frame.node, frame.value, frame.path));
          break;
        case "boolean":
          finish(typeof frame.value === "boolean" ? checkScalarValue(frame.node, frame.value, frame.path) : [`"${diagnosticPath(frame.path)}" must be a boolean`]);
          break;
        case "null":
          finish(frame.value === null ? checkScalarValue(frame.node, frame.value, frame.path) : [`"${diagnosticPath(frame.path)}" must be null`]);
          break;
        default:
          finish(assertNever(nodeType, "JsonSchemaType"));
      }
    } catch (error) {
      let failed = frames.pop();
      while (failed !== void 0 && !failed.catches) failed = frames.pop();
      if (failed === void 0) throw error;
      receive(losslessValueViolation(failed.path));
    }
  }
  return rootResult ?? losslessValueViolation(path);
}
function validateJsonSchemaValue(schema, value, path = "value") {
  return checkValue(schema, value, path);
}
var ANNOTATION_KEYS = [
  "description",
  "title",
  "default",
  "examples"
];
function authorError(message) {
  throw new JsonSchemaError([message]);
}
function copyAnnotations(source, target) {
  if (Object.hasOwn(source, "description")) target.description = source.description;
  if (Object.hasOwn(source, "title")) target.title = source.title;
  if (Object.hasOwn(source, "default")) target.default = source.default;
  if (Object.hasOwn(source, "examples")) target.examples = source.examples;
}
function assertAuthorKeys(source, path, allowed) {
  for (const key of Object.keys(source)) if (!allowed.includes(key)) authorError(`${path}.${key} is not supported by the value schema DSL`);
}
function assignCompiledNode(destination, node) {
  switch (destination.kind) {
    case "root":
      destination.holder.value = node;
      break;
    case "property":
      Object.defineProperty(destination.target, destination.key, {
        value: node,
        enumerable: true,
        configurable: true,
        writable: true
      });
      break;
    case "item":
      destination.target.items = node;
      break;
    case "one-of":
      destination.target[destination.index] = node;
      break;
  }
}
function assignCompiledPropertyMap(destination, compiled) {
  if (destination.kind === "root") destination.holder.value = compiled;
  else destination.target.properties = compiled.properties;
}
function runSchemaCompiler(initial) {
  const seen = /* @__PURE__ */ new Set();
  const tasks = [initial];
  for (let task = tasks.pop(); task !== void 0; task = tasks.pop()) {
    if (task.kind === "leave") {
      seen.delete(task.input);
      continue;
    }
    if (task.kind === "property-map-tail") {
      if (task.required.length > 0) {
        task.compiled.required = task.required;
        if (task.destination.kind === "object") task.destination.target.required = task.required;
      }
      continue;
    }
    if (task.kind === "property") {
      if (!isJsonSchemaRecord(task.property)) authorError(`${task.path} must be a value schema object`);
      if (Object.hasOwn(task.property, "required") && task.property.required !== true) authorError(`${task.path}.required must be true when present`);
      if (Object.hasOwn(task.property, "required") && task.property.required === true) task.required.push(task.key);
      tasks.push({
        kind: "value",
        input: task.property,
        path: task.path,
        allowRequired: true,
        destination: {
          kind: "property",
          target: task.properties,
          key: task.key
        }
      });
      continue;
    }
    if (task.kind === "property-map") {
      if (!isJsonSchemaRecord(task.input)) authorError(`${task.path} must be an object of value schemas`);
      if (seen.has(task.input)) authorError(`${task.path} is circular`);
      seen.add(task.input);
      const compiled = { properties: {} };
      const required = [];
      assignCompiledPropertyMap(task.destination, compiled);
      tasks.push({
        kind: "leave",
        input: task.input
      });
      tasks.push({
        kind: "property-map-tail",
        compiled,
        required,
        destination: task.destination
      });
      const entries = Object.entries(task.input);
      for (let index = entries.length - 1; index >= 0; index--) {
        const entry = entries[index];
        if (entry === void 0) continue;
        tasks.push({
          kind: "property",
          property: entry[1],
          path: `${task.path}.${entry[0]}`,
          key: entry[0],
          properties: compiled.properties,
          required
        });
      }
      continue;
    }
    const { input, path } = task;
    if (!isJsonSchemaRecord(input)) authorError(`${path} must be a value schema object`);
    if (seen.has(input)) authorError(`${path} is circular`);
    seen.add(input);
    const authorKeys = [...ANNOTATION_KEYS, ...task.allowRequired ? ["required"] : []];
    const node = {};
    assignCompiledNode(task.destination, node);
    tasks.push({
      kind: "leave",
      input
    });
    if (Object.hasOwn(input, "oneOf")) {
      assertAuthorKeys(input, path, [
        ...authorKeys,
        "oneOf",
        "type"
      ]);
      if (Object.hasOwn(input, "type")) authorError(`${path} cannot declare both type and oneOf`);
      if (!isPlainJsonArray(input.oneOf)) authorError(`${path}.oneOf must be an array of at least two value schemas`);
      const branches = [];
      node.oneOf = branches;
      copyAnnotations(input, node);
      for (let index = input.oneOf.length - 1; index >= 0; index--) tasks.push({
        kind: "value",
        input: input.oneOf[index],
        path: `${path}.oneOf[${index}]`,
        allowRequired: false,
        destination: {
          kind: "one-of",
          target: branches,
          index
        }
      });
      continue;
    }
    const inputType = Object.hasOwn(input, "type") ? input.type : void 0;
    switch (inputType) {
      case "json":
        assertAuthorKeys(input, path, [...authorKeys, "type"]);
        copyAnnotations(input, node);
        break;
      case "object":
        assertAuthorKeys(input, path, [
          ...authorKeys,
          "type",
          "properties",
          "additionalProperties"
        ]);
        if (!Object.hasOwn(input, "additionalProperties") || typeof input.additionalProperties !== "boolean") authorError(`${path}.additionalProperties must be explicitly true or false`);
        node.type = "object";
        copyAnnotations(input, node);
        node.additionalProperties = input.additionalProperties;
        if (Object.hasOwn(input, "properties")) tasks.push({
          kind: "property-map",
          input: input.properties,
          path: `${path}.properties`,
          destination: {
            kind: "object",
            target: node
          }
        });
        break;
      case "array":
        assertAuthorKeys(input, path, [
          ...authorKeys,
          "type",
          "items"
        ]);
        node.type = "array";
        copyAnnotations(input, node);
        if (Object.hasOwn(input, "items")) tasks.push({
          kind: "value",
          input: input.items,
          path: `${path}.items`,
          allowRequired: false,
          destination: {
            kind: "item",
            target: node
          }
        });
        break;
      case "string":
      case "number":
      case "integer":
      case "boolean":
      case "null":
        assertAuthorKeys(input, path, [
          ...authorKeys,
          "type",
          "enum",
          "const"
        ]);
        node.type = inputType;
        copyAnnotations(input, node);
        if (Object.hasOwn(input, "enum")) {
          if (!isPlainJsonArray(input.enum)) authorError(`${path}.enum must be a non-empty array of scalar values`);
          node.enum = Array.from(input.enum, (entry) => entry);
        }
        if (Object.hasOwn(input, "const")) node.const = input.const;
        break;
      default:
        authorError(`${path}.type must be string/number/integer/boolean/null/array/object/json, or use oneOf`);
    }
  }
}
function compilePropertyMap(input, path) {
  const holder = {};
  runSchemaCompiler({
    kind: "property-map",
    input,
    path,
    destination: {
      kind: "root",
      holder
    }
  });
  return holder.value ?? authorError(`${path} did not compile`);
}
function compileValueSchema(input, path) {
  const holder = {};
  runSchemaCompiler({
    kind: "value",
    input,
    path,
    allowRequired: false,
    destination: {
      kind: "root",
      holder
    }
  });
  return holder.value ?? authorError(`${path} did not compile`);
}
function valueSchemaSpecToJsonSchema(spec) {
  const schema = compileValueSchema(spec, "schema");
  assertSupportedJsonSchema(schema);
  return schema;
}
function parameterSchemaSpecToJsonSchema(spec) {
  const compiled = compilePropertyMap(spec, "parameters");
  const schema = {
    type: "object",
    properties: compiled.properties,
    ...compiled.required === void 0 ? {} : { required: compiled.required }
  };
  assertSupportedJsonSchema(schema);
  return schema;
}
var ToolArgsError = class extends HarnessError {
  /** Individual violations in schema-walk order. */
  violations;
  constructor(violations) {
    super(`invalid arguments: ${violations.join("; ")}`, "INVALID_ARGS");
    this.name = "ToolArgsError";
    this.violations = violations;
  }
};
function defineTool(options) {
  const userExecute = options.execute;
  const userFinalizeContent = options.finalizeContent;
  const userProjectContent = options.projectContent;
  const userRender = options.output.render;
  const userPresentationMeta = options.output.presentationMeta;
  const userPresentCall = options.presentCall;
  const userPresentResult = options.presentResult;
  const userIsConcurrencySafe = options.isConcurrencySafe;
  if (options.timeoutMs !== void 0 && (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0)) throw new Error(`defineTool(${options.name}): timeoutMs must be a positive finite number`);
  const parameters = parameterSchemaSpecToJsonSchema(options.parameters);
  const outputSchema = valueSchemaSpecToJsonSchema(options.output.schema);
  const validate = (args) => validateJsonSchemaValue(parameters, args, "");
  const tool = {
    name: options.name,
    description: options.description,
    parameters,
    output: {
      schema: outputSchema,
      render(args, value) {
        return userRender(args, value);
      },
      ...userPresentationMeta !== void 0 ? { presentationMeta(args, value) {
        return userPresentationMeta(args, value);
      } } : {}
    },
    ...options.deferLoading === true ? { deferLoading: options.deferLoading } : {},
    ...options.timeoutMs !== void 0 ? { timeoutMs: options.timeoutMs } : {},
    async execute(args, exec) {
      const violations = validate(args);
      if (violations.length > 0) throw new ToolArgsError(violations);
      return userExecute(args, exec);
    }
  };
  if (userProjectContent) tool.projectContent = (exec, result) => userProjectContent(exec, result);
  if (userFinalizeContent) tool.finalizeContent = (exec, result) => userFinalizeContent(exec, result);
  if (userPresentCall) tool.presentCall = (args) => {
    if (validate(args).length > 0) return void 0;
    return userPresentCall(args);
  };
  if (userPresentResult) tool.presentResult = (args, result) => {
    if (validate(args).length > 0) return void 0;
    return userPresentResult(args, result);
  };
  if (userIsConcurrencySafe) tool.isConcurrencySafe = (args) => {
    if (validate(args).length > 0) return false;
    return userIsConcurrencySafe(args);
  };
  return tool;
}
var RUN_CODE_NAME = "run_code";
var TYPESCRIPT_FLAVOR = {
  description: "Execute a TypeScript program against the available tools. Takes two required arguments: `code`, the BODY of an async function (erasable syntax only; top-level `await` and `return` work), and `description`, a short summary of what the program does. Call tools as `await tools.name(args)` per the declarations in the system prompt. Only what you print or return is program output \u2014 curate it. Image-bearing subtool results are attached after the run.",
  codeDescription: "The program: the body of an async TypeScript function."
};
var RUN_CODE_FLAVORS = {
  typescript: TYPESCRIPT_FLAVOR,
  python: {
    description: "Execute a Python program against the available tools. Takes two required arguments: `code`, the BODY of an async function (top-level `await` and `return` work), and `description`, a short summary of what the program does. Call tools as `await tools.name(args)` per the declarations in the system prompt. Use `print(...)` and/or `return <value>` for program output \u2014 curate it. Image-bearing subtool results are attached after the run.",
    codeDescription: "The program: the body of an async Python function."
  }
};
var RUN_CODE_DESCRIPTION_PARAM_DESCRIPTION = 'Clear, concise description of what this program does in active voice, 5-10 words (shown in the UI). Examples: "Count TODO markers across packages"; "Read failing test and its fixture"; "Rename config key in every cordis.yml".';
var RUN_CODE_CONTROLS = {
  timeoutMs: {
    type: "number",
    description: "Positive elapsed-time budget in milliseconds, capped by the deployment maximum."
  },
  sandbox_permissions: {
    type: "string",
    enum: [...ESCALATION_TARGETS],
    description: "Wider sandbox mode for this complete program execution; requires justification and approval."
  },
  justification: {
    type: "string",
    description: "Reason this complete program needs wider access, shown to the user for approval. Use the language of the user\u2019s current request."
  }
};
function controlParameters(runtime) {
  if (runtime === void 0) return RUN_CODE_CONTROLS;
  return {
    ...runtime.timeout === void 0 ? {} : { timeoutMs: {
      ...RUN_CODE_CONTROLS.timeoutMs,
      description: `Positive elapsed-time budget in milliseconds, including nested tool and approval waits. Default ${runtime.timeout.defaultMs}; capped at ${runtime.timeout.maxMs}. Zero does not disable the deadline.`
    } },
    ...runtime.sandboxMode === void 0 ? {} : {
      sandbox_permissions: RUN_CODE_CONTROLS.sandbox_permissions,
      justification: RUN_CODE_CONTROLS.justification
    }
  };
}
function escalationGuidance(runtime) {
  return runtime?.sandboxMode === void 0 ? "" : " A sandbox escalation approves this complete program for one execution only. Nested tools retain their own policies and approvals. Request wider access only after evidence of a denial. Earlier effects may already have completed: inspect them before explicitly retrying. Programs are never replayed automatically.";
}
function resolveFlavor(peekRuntime) {
  const runtime = peekRuntime();
  if (runtime === void 0) return TYPESCRIPT_FLAVOR;
  const flavor = RUN_CODE_FLAVORS[runtime.language];
  if (!Object.hasOwn(RUN_CODE_FLAVORS, runtime.language) || flavor === void 0) {
    const known = Object.keys(RUN_CODE_FLAVORS).map((name3) => JSON.stringify(name3)).join(", ");
    throw new Error(`dsh-tools: no run_code schema flavor registered for runtime language ${JSON.stringify(runtime.language)} (known: ${known})`);
  }
  return flavor;
}
var CodeRunFailedError = class extends HarnessError {
  constructor(message) {
    super(message, "CODE_RUN_FAILED");
    this.name = "CodeRunFailedError";
  }
};
function jsonNormalizeArgs(value) {
  let snapshot;
  try {
    snapshot = snapshotJsonValue(value);
  } catch (error) {
    throw new Error(`tool arguments must be lossless JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (snapshot === void 0) throw new Error("tool arguments must be lossless JSON (call the tool with an arguments object, e.g. `{}`)");
  const logged = snapshotJsonValue(snapshot);
  if (logged === void 0) throw new Error("tool arguments could not be detached for durable logging");
  return {
    dispatched: snapshot,
    logged
  };
}
var JSON_INDENT = "  ";
var MAX_JSON_INDENT_CHARS = 10;
function renderJsonValue(value) {
  const chunks = [];
  const tasks = [{
    kind: "value",
    value,
    depth: 0,
    compact: false
  }];
  for (let task = tasks.pop(); task !== void 0; task = tasks.pop()) {
    if (task.kind === "text") {
      chunks.push(task.text);
      continue;
    }
    const current = task.value;
    if (current === null || typeof current === "boolean" || typeof current === "number") {
      chunks.push(String(current));
      continue;
    }
    if (typeof current === "string") {
      chunks.push(JSON.stringify(current));
      continue;
    }
    const compact = task.compact || (task.depth + 1) * 2 > MAX_JSON_INDENT_CHARS;
    const childDepth = task.depth + 1;
    if (Array.isArray(current)) {
      chunks.push("[");
      if (current.length === 0) {
        chunks.push("]");
        continue;
      }
      tasks.push({
        kind: "text",
        text: compact ? "]" : `
${JSON_INDENT.repeat(task.depth)}]`
      });
      for (let index = current.length - 1; index >= 0; index--) {
        const item = current[index];
        if (item === void 0) throw new Error("cannot render a sparse JSON array");
        tasks.push({
          kind: "value",
          value: item,
          depth: childDepth,
          compact
        });
        tasks.push({
          kind: "text",
          text: compact ? index === 0 ? "" : "," : `${index === 0 ? "\n" : ",\n"}${JSON_INDENT.repeat(childDepth)}`
        });
      }
      continue;
    }
    const keys2 = Object.keys(current);
    chunks.push("{");
    if (keys2.length === 0) {
      chunks.push("}");
      continue;
    }
    tasks.push({
      kind: "text",
      text: compact ? "}" : `
${JSON_INDENT.repeat(task.depth)}}`
    });
    for (let index = keys2.length - 1; index >= 0; index--) {
      const key = keys2[index];
      if (key === void 0) throw new Error("cannot render a missing JSON object key");
      const item = current[key];
      if (item === void 0) throw new Error("cannot render an undefined JSON object property");
      tasks.push({
        kind: "value",
        value: item,
        depth: childDepth,
        compact
      });
      tasks.push({
        kind: "text",
        text: compact ? `${index === 0 ? "" : ","}${JSON.stringify(key)}:` : `${index === 0 ? "\n" : ",\n"}${JSON_INDENT.repeat(childDepth)}${JSON.stringify(key)}: `
      });
    }
  }
  return chunks.join("");
}
function renderValue(value) {
  return typeof value === "string" ? value : renderJsonValue(value);
}
function createRunCodeTool(registry, options) {
  const { requireRuntime, peekRuntime, maxParallel, shapeDispatchLog } = options;
  const definition = defineTool({
    name: RUN_CODE_NAME,
    description: TYPESCRIPT_FLAVOR.description,
    parameters: {
      code: {
        type: "string",
        required: true,
        description: TYPESCRIPT_FLAVOR.codeDescription
      },
      description: {
        type: "string",
        required: true,
        description: RUN_CODE_DESCRIPTION_PARAM_DESCRIPTION
      },
      ...RUN_CODE_CONTROLS
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          logs: {
            type: "array",
            required: true,
            items: { type: "string" }
          },
          result: { type: "json" },
          sandbox: {
            type: "object",
            additionalProperties: false,
            properties: {
              mode: {
                type: "string",
                required: true,
                enum: [
                  "read-only",
                  "workspace-write",
                  "danger-full-access"
                ]
              },
              denied: {
                type: "boolean",
                required: true
              },
              enforcement: {
                type: "string",
                enum: ["full", "partial"]
              }
            }
          }
        }
      },
      render: (_args, value) => {
        const rendered = value.result === void 0 ? "" : renderValue(value.result);
        const parts = [value.logs.join("\n"), rendered].filter((part) => part.length > 0);
        if (value.sandbox?.enforcement === "partial") parts.push("File sandbox enforcement is partial on this host.");
        if (value.sandbox?.denied) parts.push(`The ${value.sandbox.mode} file sandbox denied an operation.${escalationGuidance(peekRuntime())}`);
        return [{
          type: "text",
          text: parts.length > 0 ? parts.join("\n") : "(run_code completed with no output)"
        }];
      }
    },
    async execute(args, exec) {
      if (args.description.trim().length === 0) throw new Error("invalid description: expected a non-empty string");
      const runtime = requireRuntime();
      validateEscalationArgs(args.sandbox_permissions, args.justification);
      if (args.timeoutMs !== void 0 && runtime.timeout === void 0) throw new Error("timeoutMs is not available for this PTC runtime");
      if (args.timeoutMs !== void 0 && (!Number.isFinite(args.timeoutMs) || args.timeoutMs <= 0)) throw new Error("invalid timeoutMs: expected a positive finite number");
      const standingPolicy = runtime.sandboxMode === void 0 ? void 0 : options.resolveSandboxPolicy(exec);
      let policy = standingPolicy;
      if (args.sandbox_permissions !== void 0 && args.justification !== void 0) {
        if (standingPolicy === void 0) throw new Error("sandbox_permissions is not available for this PTC runtime");
        const approvedMode = await approveEscalation({
          requestedMode: args.sandbox_permissions,
          justification: args.justification,
          effectiveMode: standingPolicy.mode,
          subject: "program"
        }, {
          approver: options.peekApprover(),
          agent: exec.agent,
          callId: exec.callId,
          toolName: RUN_CODE_NAME,
          signal: exec.signal
        });
        policy = {
          ...standingPolicy,
          mode: approvedMode
        };
      }
      exec.signal.throwIfAborted();
      const runController = new AbortController();
      const onOuterAbort = () => {
        runController.abort(exec.signal.reason);
      };
      exec.signal.addEventListener("abort", onOuterAbort, { once: true });
      let dispatches = 0;
      const pendingQueue = [];
      const inFlight = /* @__PURE__ */ new Set();
      const logWork = /* @__PURE__ */ new Set();
      const commitQueue = [];
      let exclusiveActive = false;
      let driving = false;
      let driverRun = Promise.resolve();
      let wake;
      const wakeup = () => {
        const release = wake;
        wake = void 0;
        release?.();
      };
      const drive = () => {
        if (driving) return driverRun;
        driving = true;
        driverRun = (async () => {
          try {
            for (; ; ) {
              const signal = new Promise((resolve) => {
                wake = resolve;
              });
              const commitHead = commitQueue[0];
              if (commitHead !== void 0 && commitHead.settled) {
                commitQueue.shift();
                await commitHead.commit();
                if (commitHead.mode === "exclusive") exclusiveActive = false;
                continue;
              }
              const head = pendingQueue[0];
              if (head !== void 0) {
                if (runController.signal.aborted) {
                  pendingQueue.shift();
                  head.abandon();
                  continue;
                }
                const mode = head.classify();
                if (!exclusiveActive && (mode === "exclusive" ? inFlight.size === 0 : inFlight.size < maxParallel)) {
                  if (mode === "exclusive") exclusiveActive = true;
                  head.mode = mode;
                  pendingQueue.shift();
                  commitQueue.push(head);
                  await head.start();
                  const flight = head.flight.finally(() => {
                    inFlight.delete(flight);
                    wakeup();
                  });
                  inFlight.add(flight);
                  continue;
                }
              }
              if (pendingQueue.length === 0 && commitQueue.length === 0 && inFlight.size === 0) return;
              await signal;
            }
          } finally {
            driving = false;
            wake = void 0;
          }
        })();
        return driverRun;
      };
      const drainDispatches = async () => {
        await drive();
        while (logWork.size > 0) await Promise.allSettled([...logWork]);
      };
      const runOver = () => runController.signal.aborted;
      const binding = (schema) => async (rawArgs) => {
        const { name: name3 } = schema;
        if (runOver()) throw new Error(`run_code run is over (${String(runController.signal.reason)}); ${name3} not dispatched`);
        const normalized = jsonNormalizeArgs(rawArgs);
        const n = ++dispatches;
        const subCallId = brandString(`${String(exec.callId)}:ptc:${n}`);
        const input = {
          callId: subCallId,
          rootCallId: exec.rootCallId,
          name: name3,
          schema,
          arguments: normalized.dispatched,
          ...exec.agent ? { agent: exec.agent } : {},
          parent: exec.token,
          signal: runController.signal
        };
        const scheduler = registry[TOOL_RUNTIME_SCHEDULER];
        const outcome = await new Promise((resolve, reject) => {
          let parked;
          const settle = (result) => {
            resolve(result.isError ? {
              isError: true,
              message: result.error.message
            } : {
              isError: false,
              value: result.value
            });
            const agent = exec.agent;
            if (agent === void 0) return;
            const task = (async () => {
              const logged = await shapeDispatchLog({
                exec,
                agent,
                subCallId,
                name: name3,
                isError: result.isError,
                content: result.content
              });
              agent.session.append("tool/ptc-dispatch", {
                rootCallId: exec.rootCallId,
                parentCallId: exec.callId,
                subCallId,
                name: name3,
                arguments: normalized.logged,
                isError: result.isError,
                ...result.error?.info === void 0 ? {} : { error: result.error.info },
                content: logged
              });
            })().finally(() => {
              logWork.delete(task);
            });
            logWork.add(task);
          };
          pendingQueue.push({
            flight: Promise.resolve(),
            settled: false,
            classify: () => registry.executionMode(input).kind,
            abandon: () => {
              reject(/* @__PURE__ */ new Error(`run_code run is over (${String(runController.signal.reason)}); ${name3} tool call abandoned`));
            },
            async start() {
              exec.agent?.session.append("tool/ptc-dispatch-start", {
                rootCallId: exec.rootCallId,
                parentCallId: exec.callId,
                subCallId,
                name: name3,
                arguments: normalized.logged
              });
              const prepared = await scheduler.prepare(input);
              if (prepared.kind === "dispatch") {
                this.flight = scheduler.dispatch(prepared.exec).then((dispatchOutcome) => {
                  parked = {
                    kind: dispatchOutcome.kind,
                    exec: prepared.exec,
                    result: dispatchOutcome.result
                  };
                  this.settled = true;
                });
                return;
              }
              parked = {
                kind: prepared.kind,
                exec: prepared.exec,
                result: prepared.result
              };
              this.settled = true;
            },
            async commit() {
              if (parked === void 0) return;
              const result = parked.kind === "post-result" ? await scheduler.finalize(parked.exec, parked.result) : scheduler.finish(parked.exec, parked.result);
              if (!result.isError && result.content.some((block) => block.type === "image")) exec.deferContext(createUserMessage({
                content: result.content,
                source: { kind: "ptc-mode" }
              }));
              for (const context of result.additionalContexts ?? []) exec.deferContext(context);
              if (result.concludesTurn) exec.concludeTurn();
              settle(result);
              while (logWork.size > maxParallel) await Promise.race(logWork);
            }
          });
          wakeup();
          drive();
        });
        if (runOver()) throw new Error(`run_code run is over (${String(runController.signal.reason)}); ${name3} result discarded`);
        if (outcome.isError) throw new Error(outcome.message);
        return outcome.value;
      };
      const functions = /* @__PURE__ */ Object.create(null);
      for (const schema of registry.schemas(exec.agent)) {
        if (schema.name === "run_code") continue;
        Object.defineProperty(functions, schema.name, {
          enumerable: true,
          value: binding(deepFreeze(schema))
        });
      }
      try {
        let result;
        try {
          result = await runtime.run(runtime.resolve({
            program: args.code,
            bindings: [{
              global: "tools",
              functions,
              errorClass: {
                name: "ToolCallError",
                memberNameProperty: "toolName"
              }
            }],
            signal: runController.signal,
            ...exec.agent?.session.header.cwd !== void 0 ? { cwd: exec.agent.session.header.cwd } : {},
            ...policy !== void 0 ? { sandboxPolicy: policy } : {},
            ...args.timeoutMs !== void 0 ? { timeoutMs: args.timeoutMs } : {}
          }));
        } finally {
          runController.abort("run_code settled");
          await drainDispatches();
        }
        if (result.error) {
          const logsText = result.logs.length > 0 ? `
Captured output:
${result.logs.join("\n")}` : "";
          const sandboxText = result.sandbox === void 0 ? "" : `
File sandbox: ${result.sandbox.mode}${result.sandbox.enforcement === void 0 ? "" : `; enforcement: ${result.sandbox.enforcement}`}${result.sandbox.denied ? "; operation denied" : ""}.`;
          throw new CodeRunFailedError(`code run failed (${result.error.kind}): ${result.error.message}${logsText}${sandboxText}${result.sandbox?.denied ? escalationGuidance(runtime) : ""}`);
        }
        return {
          logs: result.logs,
          ...result.sandbox === void 0 ? {} : { sandbox: result.sandbox },
          ...result.value !== void 0 ? { result: result.value } : {}
        };
      } finally {
        exec.signal.removeEventListener("abort", onOuterAbort);
      }
    },
    presentCall: (args) => ({
      card: "generic",
      title: args.description,
      kind: "execute",
      rawInput: args.code
    })
  });
  Object.defineProperty(definition, "description", {
    enumerable: true,
    get: () => {
      const runtime = peekRuntime();
      const instructions = runtime?.executionInstructions;
      return resolveFlavor(peekRuntime).description + (instructions ? ` ${instructions}` : "") + (runtime === void 0 ? "" : " The working directory is the Session's current directory.") + escalationGuidance(runtime);
    }
  });
  Object.defineProperty(definition, "parameters", {
    enumerable: true,
    get: () => parameterSchemaSpecToJsonSchema({
      code: {
        type: "string",
        required: true,
        description: resolveFlavor(peekRuntime).codeDescription
      },
      description: {
        type: "string",
        required: true,
        description: RUN_CODE_DESCRIPTION_PARAM_DESCRIPTION
      },
      ...controlParameters(peekRuntime())
    })
  });
  return definition;
}
var IDENTIFIER$1 = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
function renderKey(name3) {
  return IDENTIFIER$1.test(name3) ? name3 : JSON.stringify(name3);
}
function pad$1(indent) {
  return "  ".repeat(indent);
}
function docLines$1(description, indent) {
  if (typeof description !== "string" || description.length === 0) return [];
  const collapsed = description.replace(/\s+/g, " ").trim();
  return [`${pad$1(indent)}/** ${collapsed.replaceAll("*/", String.raw`*\/`)} */`];
}
function renderScalar(value) {
  return JSON.stringify(value);
}
function renderConstrainedScalar$1(node, type) {
  const broad = type === "integer" ? "number" : type;
  if (Object.hasOwn(node, "const")) return renderScalar(node.const);
  if (Object.hasOwn(node, "enum")) return node.enum.map(renderScalar).join(" | ");
  return broad;
}
function typeDocumentFrom(parts) {
  return {
    parts,
    containsUnionOrIntersection: parts.some((part) => typeof part === "string" ? part.includes("|") || part.includes("&") : part.containsUnionOrIntersection)
  };
}
function typeDocument(...parts) {
  return typeDocumentFrom(parts);
}
function flattenTypeDocument(document) {
  const chunks = [];
  const tasks = [document];
  for (let task = tasks.pop(); task !== void 0; task = tasks.pop()) {
    if (typeof task === "string") {
      chunks.push(task);
      continue;
    }
    for (let index = task.parts.length - 1; index >= 0; index--) {
      const part = task.parts[index];
      if (part !== void 0) tasks.push(part);
    }
  }
  return chunks.join("");
}
function schemaRenderFrame(node, indent) {
  return {
    node,
    indent,
    phase: "start",
    children: [],
    childIndex: 0,
    childDocuments: [],
    entries: []
  };
}
function renderSupportedSchema(schema, indent) {
  const frames = [schemaRenderFrame(schema, indent)];
  let rootDocument;
  const finish = (document) => {
    frames.pop();
    const parent = frames.at(-1);
    if (parent === void 0) rootDocument = document;
    else parent.childDocuments.push(document);
  };
  while (frames.length > 0) {
    const frame = frames.at(-1);
    if (frame === void 0) break;
    if (frame.phase === "children") {
      if (frame.childIndex < frame.children.length) {
        const child = frame.children[frame.childIndex];
        if (child === void 0) throw new Error("missing schema render child");
        frame.childIndex++;
        frames.push(schemaRenderFrame(child.node, child.indent));
        continue;
      }
      if (frame.kind === "oneOf") {
        const parts2 = [];
        for (let index = 0; index < frame.childDocuments.length; index++) {
          if (index > 0) parts2.push(" | ");
          const child = frame.childDocuments[index];
          if (child !== void 0) parts2.push(child);
        }
        finish(typeDocumentFrom(parts2));
        continue;
      }
      if (frame.kind === "array") {
        const child = frame.childDocuments[0];
        if (child === void 0) throw new Error("missing array item type");
        finish(child.containsUnionOrIntersection ? typeDocument("(", child, ")[]") : typeDocument(child, "[]"));
        continue;
      }
      const required = new Set(frame.node.required);
      const parts = ["{"];
      for (let index = 0; index < frame.entries.length; index++) {
        const entry = frame.entries[index];
        const child = frame.childDocuments[index];
        if (entry === void 0 || child === void 0) throw new Error("missing object property type");
        const [name3, prop] = entry;
        for (const line of docLines$1(prop.description, frame.indent + 1)) parts.push("\n", line);
        parts.push("\n", `${pad$1(frame.indent + 1)}${renderKey(name3)}${required.has(name3) ? "" : "?"}: `, child, ";");
      }
      parts.push("\n", `${pad$1(frame.indent)}}`);
      const declared = typeDocumentFrom(parts);
      finish(frame.node.additionalProperties === false ? declared : typeDocument(declared, " & Record<string, JsonValue>"));
      continue;
    }
    const node = frame.node;
    if (node.oneOf !== void 0) {
      frame.kind = "oneOf";
      frame.children = Array.from(node.oneOf, (child) => ({
        node: child,
        indent: frame.indent
      }));
      frame.childIndex = 0;
      frame.childDocuments = [];
      frame.phase = "children";
      continue;
    }
    if (node.type === void 0) {
      finish(typeDocument("JsonValue"));
      continue;
    }
    switch (node.type) {
      case "string":
      case "number":
      case "integer":
      case "boolean":
      case "null":
        finish(typeDocument(renderConstrainedScalar$1(node, node.type)));
        break;
      case "array":
        if (node.items === void 0) finish(typeDocument("JsonValue[]"));
        else {
          frame.kind = "array";
          frame.children = [{
            node: node.items,
            indent: frame.indent
          }];
          frame.childIndex = 0;
          frame.childDocuments = [];
          frame.phase = "children";
        }
        break;
      case "object": {
        const open = node.additionalProperties !== false;
        const entries = Object.entries(node.properties ?? {});
        if (entries.length === 0) finish(typeDocument(open ? "Record<string, JsonValue>" : "Record<string, never>"));
        else {
          frame.kind = "object";
          frame.entries = entries;
          frame.children = entries.map(([, child]) => ({
            node: child,
            indent: frame.indent + 1
          }));
          frame.childIndex = 0;
          frame.childDocuments = [];
          frame.phase = "children";
        }
        break;
      }
      /* v8 ignore next -- assertSupportedJsonSchema narrowed this closed type union. */
      default:
        finish(typeDocument("unknown"));
    }
  }
  return rootDocument ?? typeDocument("unknown");
}
function jsonSchemaToTs(schema, indent = 0) {
  try {
    assertSupportedJsonSchema(schema);
    return flattenTypeDocument(renderSupportedSchema(schema, indent));
  } catch {
    return "unknown";
  }
}
var SDK_INSTRUCTIONS$1 = `## Writing code for run_code

\`run_code\` takes two required arguments: \`code\` \u2014 the body of an async TypeScript function (erasable syntax only \u2014 no \`enum\` or namespaces; type annotations are advisory, the code runs type-stripped) \u2014 and \`description\`, a short summary of what the program does. The declarations below are SDK bindings for this program. A declaration does not make its name a directly callable tool; only names supplied as separate tool schemas may be called directly.`;
var SDK_PROGRAM_INSTRUCTIONS = `Inside the program:

- Call tools as \`await tools.name(args)\` \u2014 quoted access for exotic names: \`tools["my-tool"](args)\`. Every call resolves to the tool's typed canonical JSON value. Tool arguments must be lossless JSON.
- A FAILED tool call rejects with \`ToolCallError\`, whose \`toolName\` identifies the failed tool and whose \`message\` is human-readable \u2014 \`try/catch\` it to handle and continue.
- Independent read-only calls MAY overlap under \`Promise.all\` (safe calls run concurrently; mutating calls run alone, in submission order). Sequence dependent work with \`await\`.
- Emit results with \`return\` and/or \`console.log(...)\`. Only what you print or return is program output. A successful tool result containing an image is attached after the run so you can inspect it on the next step; every other intermediate result stays out of the conversation, so extract just what you need.

Program-only SDK bindings:`;
function acceptsExampleString(schema, value) {
  return schema?.type === "string" && (schema.const === void 0 || schema.const === value) && (schema.enum === void 0 || schema.enum.includes(value));
}
function renderBashExample(schemas) {
  const bash = schemas.find((schema) => schema.name === "bash");
  if (bash === void 0) return "";
  const parameters = bash.parameters;
  if (parameters.type !== "object") return "";
  const required = parameters.required ?? [];
  if (required.some((name3) => name3 !== "command" && name3 !== "description")) return "";
  if (!acceptsExampleString(parameters.properties?.command, "pwd")) return "";
  const needsDescription = required.includes("description");
  if (needsDescription && !acceptsExampleString(parameters.properties?.description, "Show current directory")) return "";
  return ` When no separate \`bash\` schema is supplied, invoke a declared \`bash\` binding inside \`run_code\`:

\`run_code({ code: "return await tools.bash({ command: 'pwd'${needsDescription ? ", description: 'Show current directory'" : ""} })", description: "Show current directory" })\``;
}
function renderToolsSdk(schemas) {
  const sorted = [...schemas].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  const argsMembers = [];
  const outputMembers = [];
  for (const schema of sorted) {
    argsMembers.push(...docLines$1(schema.description, 1));
    argsMembers.push(`${pad$1(1)}${renderKey(schema.name)}: ${jsonSchemaToTs(schema.parameters, 1)};`);
    outputMembers.push(`${pad$1(1)}${renderKey(schema.name)}: ${jsonSchemaToTs(schema.output, 1)};`);
  }
  const declaration = [
    `interface ToolArgsMap {${argsMembers.length > 0 ? `
${argsMembers.join("\n")}
` : ""}}`,
    `interface ToolOutputMap {${outputMembers.length > 0 ? `
${outputMembers.join("\n")}
` : ""}}`,
    "type ToolName = keyof ToolOutputMap",
    [
      "declare class ToolCallError extends Error {",
      '  readonly name: "ToolCallError";',
      "  readonly toolName: ToolName;",
      "}"
    ].join("\n"),
    [
      "declare const tools: {",
      "  [K in ToolName]: (args: ToolArgsMap[K]) => Promise<ToolOutputMap[K]>;",
      "}"
    ].join("\n")
  ].join("\n\n");
  return `${SDK_INSTRUCTIONS$1}${renderBashExample(sorted)}

${SDK_PROGRAM_INSTRUCTIONS}

\`\`\`ts
type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

${declaration}
\`\`\``;
}
var IDENTIFIER = /^[\p{XID_Start}_]\p{XID_Continue}*$/u;
function isBareIdentifier(name3) {
  return IDENTIFIER.test(name3) && name3.normalize("NFKC") === name3;
}
var RESERVED = /* @__PURE__ */ new Set([
  "False",
  "None",
  "True",
  "and",
  "as",
  "assert",
  "async",
  "await",
  "break",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "nonlocal",
  "not",
  "or",
  "pass",
  "raise",
  "return",
  "try",
  "while",
  "with",
  "yield",
  "__debug__"
]);
var TYPING_ORDER = [
  "Any",
  "Literal",
  "NotRequired",
  "Protocol",
  "TypedDict"
];
function pad(indent) {
  return "    ".repeat(indent);
}
var UNPRINTABLE = /[\u0000-\u0008\u000e-\u001f\u007f-\u009f]/g;
var LONE_SURROGATE = /[\ud800-\udfff]/gu;
function describe(schema) {
  const description = schema.description;
  if (typeof description !== "string") return void 0;
  const collapsed = description.replace(/\s+/g, " ").replace(UNPRINTABLE, (char) => `\\x${char.charCodeAt(0).toString(16).padStart(2, "0")}`).replace(LONE_SURROGATE, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`).trim();
  return collapsed.length === 0 ? void 0 : collapsed;
}
function docLines(description, indent) {
  const collapsed = describe({ description });
  if (collapsed === void 0) return [];
  const escaped = collapsed.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
  return [`${pad(indent)}"""${escaped}"""`];
}
function camelCase(raw) {
  const joined = raw.split(/[^\p{XID_Continue}]+|_+/u).filter((part) => part.length > 0).map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join("").normalize("NFKC");
  return (/^\p{XID_Start}/u.test(joined) ? joined : `Tool${joined}`).normalize("NFKC");
}
var MAX_CLASS_NAME_BASE = 120;
var MAX_LIST_NESTING = 180;
function capClassNameBase(base) {
  if (base.length <= MAX_CLASS_NAME_BASE) return base;
  const capped = base.slice(0, MAX_CLASS_NAME_BASE);
  return /[\uD800-\uDBFF]$/.test(capped) ? capped.slice(0, -1) : capped;
}
function allocateClassName(base, state) {
  const capped = capClassNameBase(base);
  let name3 = capped;
  if (state.usedClassNames.has(name3)) {
    let n = state.nextClassCounter.get(capped) ?? 2;
    while (state.usedClassNames.has(`${capped}${n}`)) n++;
    name3 = `${capped}${n}`;
    state.nextClassCounter.set(capped, n + 1);
  }
  state.usedClassNames.add(name3);
  return name3;
}
function childClassName(base, segment) {
  return capClassNameBase(`${base}${segment}`.normalize("NFKC"));
}
function pyScalar(value) {
  if (value === true) return "True";
  if (value === false) return "False";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" && Number.isInteger(value) && !Number.isSafeInteger(value)) return BigInt(value).toString();
  return String(value);
}
function renderConstrainedScalar(node, broad, state) {
  if (node.const !== void 0) {
    state.typing.add("Literal");
    return `Literal[${pyScalar(node.const)}]`;
  }
  if (node.enum !== void 0) {
    state.typing.add("Literal");
    return `Literal[${node.enum.map(pyScalar).join(", ")}]`;
  }
  return broad;
}
function renderType(schema, className, state) {
  const newFrame = (schema2, className2, listDepth) => ({
    schema: schema2,
    className: className2,
    phase: "start",
    listDepth,
    children: [],
    childIndex: 0,
    childTypes: [],
    entries: []
  });
  try {
    assertSupportedJsonSchema(schema);
    const frames = [newFrame(schema, className, 0)];
    let result;
    const finish = (type) => {
      frames.pop();
      const parent = frames.at(-1);
      if (parent === void 0) result = type;
      else parent.childTypes.push(type);
    };
    while (frames.length > 0) {
      const frame = frames.at(-1);
      if (frame === void 0) break;
      if (frame.phase === "children") {
        if (frame.childIndex < frame.children.length) {
          const child = frame.children[frame.childIndex];
          if (child === void 0) throw new Error("missing python render child");
          frame.childIndex++;
          frames.push(newFrame(child.schema, child.className, child.listDepth));
          continue;
        }
        if (frame.kind === "oneOf") {
          let union = "";
          for (const [index, childType] of frame.childTypes.entries()) union = index === 0 ? childType : `${union} | ${childType}`;
          finish(union);
          continue;
        }
        if (frame.kind === "array") {
          finish(`list[${frame.childTypes[0] ?? "Any"}]`);
          continue;
        }
        const node2 = frame.node;
        const name3 = frame.allocated;
        if (node2 === void 0 || name3 === void 0) throw new Error("missing typeddict frame state");
        const required = new Set(node2.required);
        const lines = [`class ${name3}(TypedDict):`];
        for (let index = 0; index < frame.entries.length; index++) {
          const entry = frame.entries[index];
          const fieldType = frame.childTypes[index];
          if (entry === void 0 || fieldType === void 0) throw new Error("missing typeddict field type");
          const [field, fieldSchema] = entry;
          const description = describe(fieldSchema);
          if (description !== void 0) lines.push(`${pad(1)}# ${description}`);
          if (required.has(field)) lines.push(`${pad(1)}${field}: ${fieldType}`);
          else {
            state.typing.add("NotRequired");
            lines.push(`${pad(1)}${field}: NotRequired[${fieldType}]`);
          }
        }
        if (node2.additionalProperties !== false) lines.push(`${pad(1)}# Additional keys beyond those declared are allowed.`);
        if (lines.length === 1) lines.push(`${pad(1)}pass`);
        state.classes.push(lines.join("\n"));
        finish(name3);
        continue;
      }
      frame.phase = "children";
      const node = frame.schema;
      if (node.oneOf !== void 0) {
        frame.kind = "oneOf";
        frame.children = node.oneOf.map((branch, index) => ({
          schema: branch,
          className: childClassName(frame.className, `${index + 1}`),
          listDepth: frame.listDepth
        }));
        continue;
      }
      if (node.type === void 0) {
        state.typing.add("Any");
        finish("Any");
        continue;
      }
      switch (node.type) {
        case "string":
          finish(renderConstrainedScalar(node, "str", state));
          break;
        case "number":
          finish(renderConstrainedScalar(node, "float", state));
          break;
        case "integer":
          finish(renderConstrainedScalar(node, "int", state));
          break;
        case "boolean":
          finish(renderConstrainedScalar(node, "bool", state));
          break;
        case "null":
          finish("None");
          break;
        case "array":
          if (node.items === void 0) {
            state.typing.add("Any");
            finish("list[Any]");
            break;
          }
          if (frame.listDepth >= MAX_LIST_NESTING) {
            state.typing.add("Any");
            finish("Any");
            break;
          }
          frame.kind = "array";
          frame.children = [{
            schema: node.items,
            className: frame.className,
            listDepth: frame.listDepth + 1
          }];
          break;
        case "object": {
          const entries = Object.entries(node.properties ?? {});
          if (className === "" || !entries.every(([name3]) => isBareIdentifier(name3) && !RESERVED.has(name3) && !(name3.startsWith("__") && !name3.endsWith("__")))) {
            state.typing.add("Any");
            finish("dict[str, Any]");
            break;
          }
          if (entries.length === 0 && node.additionalProperties !== false) {
            state.typing.add("Any");
            finish("dict[str, Any]");
            break;
          }
          frame.kind = "typeddict";
          frame.node = node;
          frame.allocated = allocateClassName(frame.className, state);
          state.typing.add("TypedDict");
          frame.entries = entries;
          frame.children = entries.map(([field, child]) => ({
            schema: child,
            className: childClassName(frame.allocated ?? "", camelCase(field)),
            listDepth: 1
          }));
          break;
        }
        /* v8 ignore next 4 -- assertSupportedJsonSchema narrowed this closed type union. */
        default:
          state.typing.add("Any");
          finish("Any");
      }
    }
    return result ?? "Any";
  } catch {
    state.typing.add("Any");
    return "Any";
  }
}
var SDK_INSTRUCTIONS = `## Writing code for run_code

\`run_code\` takes two required arguments: \`code\` \u2014 the body of an async Python function (top-level \`await\` and \`return\` both work) \u2014 and \`description\`, a short summary of what the program does. At run time exactly two of the names declared below are bound: \`tools\` and \`ToolCallError\`. Everything else is a STATIC STUB describing argument and return types \u2014 in particular the \`TypedDict\` classes do NOT exist at run time, so build arguments as plain \`dict\`/\`list\` JSON values: \`await tools.name({"field": 1})\`, never \`FooArgs(field=1)\`, which raises \`NameError\`. Inside the program:

- Call tools as \`await tools.name(args)\` \u2014 subscript access for exotic, reserved, or underscore-leading names: \`await tools["my-tool"](args)\`. Every call resolves to the tool's typed canonical JSON value (each method's return type below). Tool arguments must be lossless JSON.
- A FAILED tool call raises \`ToolCallError\`, whose \`toolName\` identifies the failed tool and whose message is human-readable \u2014 wrap in \`try/except\` to handle and continue.
- Independent read-only calls MAY overlap under \`asyncio.gather\` (safe calls run concurrently; mutating calls run alone, in submission order). Sequence dependent work with \`await\`.
- Emit the run's answer with \`print(...)\` and/or a top-level \`return <value>\`; the returned value must be lossless JSON. Only what you print and return is program output. A successful tool result containing an image is attached after the run so you can inspect it on the next step; every other intermediate result stays out of the conversation, so extract just what you need.

The available tools:`;
function renderToolsSdkPy(schemas) {
  const sorted = [...schemas].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  const state = {
    classes: [],
    usedClassNames: /* @__PURE__ */ new Set(),
    nextClassCounter: /* @__PURE__ */ new Map(),
    typing: /* @__PURE__ */ new Set(["Protocol"])
  };
  const members = [];
  let statements = 0;
  for (const schema of sorted) {
    const argType = renderType(schema.parameters, `${camelCase(schema.name)}Args`, state);
    const outputType = renderType(schema.output, `${camelCase(schema.name)}Output`, state);
    if (isBareIdentifier(schema.name) && !RESERVED.has(schema.name) && !schema.name.startsWith("_")) {
      const doc = docLines(schema.description, 2);
      members.push(doc.length > 0 ? `${pad(1)}async def ${schema.name}(self, args: ${argType}) -> ${outputType}:` : `${pad(1)}async def ${schema.name}(self, args: ${argType}) -> ${outputType}: ...`);
      members.push(...doc);
      statements += 1;
    } else {
      members.push(`${pad(1)}# tools[${JSON.stringify(schema.name)}](args: ${argType}) -> ${outputType}`);
      const description = describe(schema);
      if (description !== void 0) members.push(`${pad(1)}#   ${description}`);
    }
  }
  const body = (statements > 0 ? members : [`${pad(1)}pass`, ...members]).join("\n");
  const imports = TYPING_ORDER.filter((symbol) => state.typing.has(symbol));
  const classBlock = state.classes.length > 0 ? `${state.classes.join("\n\n")}

` : "";
  return `${SDK_INSTRUCTIONS}

\`\`\`python
${`from typing import ${imports.join(", ")}

class ToolCallError(Exception):
    toolName: str

${classBlock}class Tools(Protocol):
${body}

tools: Tools`}
\`\`\``;
}
var PTC_ONLY_INSTRUCTION = `\`${RUN_CODE_NAME}\` is the only tool you can call directly \u2014 a tool call naming any other tool fails. Reach every tool the SDK declares below from inside the program.`;
var SDK_RENDERERS = {
  typescript: renderToolsSdk,
  python: renderToolsSdkPy
};
var TOOL_RUNTIME_SCHEDULER = Symbol("@deepseek-ai/dsh-tools.scheduler");
var TOOL_ABORTED = "ABORTED";
var TOOL_ABORTED_BEFORE_DISPATCH = "ABORTED_BEFORE_DISPATCH";
var ToolNotFoundError = class extends HarnessError {
  /**
  * @param toolName - the name the caller asked for.
  * @param reachableFrom - how the model reaches this tool instead, when the
  *   name IS visible and only the presentation denies calling it directly.
  *   Omitted for a name that is registered nowhere.
  */
  constructor(toolName, reachableFrom) {
    super(reachableFrom === void 0 ? `unknown tool "${toolName}"` : `unknown tool "${toolName}": ${reachableFrom}`, "UNKNOWN_TOOL");
    this.name = "ToolNotFoundError";
  }
};
var ToolOutputError = class extends HarnessError {
  /** Schema/value violations in validation order. */
  violations;
  constructor(toolName, violations) {
    super(`tool "${toolName}" returned invalid output: ${violations.join("; ")}`, "INVALID_TOOL_OUTPUT");
    this.name = "ToolOutputError";
    this.violations = violations;
  }
};
function projectionError(toolName, projector, error) {
  return new ToolOutputError(toolName, [`output.${projector} failed: ${errorMessage2(error)}`]);
}
function snapshotProjection(toolName, projector, candidate) {
  try {
    const detached = snapshotJsonValue(candidate);
    if (detached === void 0) throw new ToolOutputError(toolName, [`output.${projector} returned non-lossless JSON`]);
    return detached;
  } catch (error) {
    if (error instanceof ToolOutputError) throw error;
    throw projectionError(toolName, projector, error);
  }
}
function snapshotToolValue(toolName, candidate) {
  try {
    const detached = snapshotJsonValue(candidate);
    if (detached === void 0) throw new ToolOutputError(toolName, ["value is not lossless JSON"]);
    return detached;
  } catch (error) {
    if (error instanceof ToolOutputError) throw error;
    throw new ToolOutputError(toolName, [`value snapshot failed: ${errorMessage2(error)}`]);
  }
}
function errorMessage2(error) {
  try {
    if (error instanceof Error) return error.message;
    if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") return error.message;
    return String(error);
  } catch {
    return "<unprintable thrown value>";
  }
}
function failureMessageFromContent(content) {
  const text = content.map((block) => block.type === "text" ? block.text : `[${block.type} content]`).join("\n");
  return text.length > 0 ? text : "tool result blocked by post-execute policy";
}
function materializePresentation(candidate) {
  const detached = snapshotJsonValue(candidate);
  if (detached === void 0) throw new TypeError("tool result must be losslessly JSON-serializable");
  return deepFreeze(detached);
}
function errorInfo(error) {
  try {
    return error instanceof HarnessError ? {
      name: error.name,
      code: error.code
    } : void 0;
  } catch {
    return;
  }
}
var ToolLayer = class {
  tools;
  restrictions = new AnonymousEntries();
  guards = new AnonymousEntries();
  /**
  * Presentation this scope's agent declared for itself, shadowing the
  * deployment default. One cell rather than an entry table: two answers to
  * "which form does the model see" is a contradiction, not a merge.
  */
  mode;
  constructor(scope) {
    this.tools = new NamedEntries((name3) => /* @__PURE__ */ new Error(scope === void 0 ? `tool "${name3}" is already registered (for a per-agent variant, register through that agent's \`agent.ctx\` instead)` : `tool "${name3}" is already registered in this scope`));
  }
  /** Whether every contribution table in this aggregate layer is empty. */
  isEmpty() {
    return this.tools.isEmpty() && this.restrictions.isEmpty() && this.guards.isEmpty() && this.mode === void 0;
  }
  /** Whether every compiled restriction in this layer admits a global tool name. */
  admits(name3) {
    for (const filter of this.restrictions.values()) if (filter.allow !== void 0 && !filter.allow.has(name3) || filter.deny !== void 0 && filter.deny.has(name3)) return false;
    return true;
  }
  /** First monotonic denial from this layer's live guard registrations. */
  guardReason(exec) {
    for (const guard of this.guards.values()) {
      const reason = guard(exec);
      if (reason !== void 0) return reason;
    }
  }
};
function resolveMaxParallelSubCalls(value) {
  const maxParallelSubCalls = value ?? 10;
  if (!Number.isInteger(maxParallelSubCalls) || maxParallelSubCalls < 1) throw new Error("maxParallelSubCalls must be a positive integer");
  return maxParallelSubCalls;
}
var ToolRuntime = class extends Service {
  static inject = ["systemPrompt"];
  static Config = z2.object({
    mode: z2.union([
      "native",
      "ptc",
      "both"
    ]).default("native"),
    maxParallelSubCalls: z2.natural().min(1).default(10)
  });
  /** Internal staged view consumed by `dsh-agent-loop`'s parallel scheduler. */
  [TOOL_RUNTIME_SCHEDULER] = {
    prepare: (exec) => this.prepareScheduledExecution(exec),
    dispatch: (exec) => this.dispatchScheduledExecution(exec),
    finalize: (exec, result) => this.finalizeScheduledExecution(exec, result),
    finish: (exec, result) => this.finishScheduledExecution(exec, result)
  };
  /** Context deferred by a running tool body, keyed by its scheduler-owned execution. */
  deferredContexts = /* @__PURE__ */ new WeakMap();
  /** Executions whose tool body declared the current turn complete. */
  concludingExecutions = /* @__PURE__ */ new WeakSet();
  /** Original caller cancellation, kept outside the wrapper-mutable execution object. */
  cancellationStates = /* @__PURE__ */ new WeakMap();
  /** Definition-owned final content transform snapshotted before policy begins. */
  contentFinalizers = /* @__PURE__ */ new WeakMap();
  /** Execution-prepared content installed before post-execute policy. */
  contentProjectors = /* @__PURE__ */ new WeakMap();
  layers = new ScopedLayers((scope) => new ToolLayer(scope), () => {
    this.ctx.emit("tools/change");
  });
  /** Presentation for scopes that declare none; {@link presentAs} shadows it per scope. */
  defaultMode;
  maxParallelSubCalls;
  /**
  * Reserved presentation transport, kept outside the filterable registration
  * layers. Built on first need rather than at construction: which agents run
  * a PTC mode is no longer known when the service is constructed, and the
  * transport is stateless beyond its closures over `this`.
  */
  ptcTransport;
  constructor(ctx, config = {}) {
    super(ctx, "tools");
    this.defaultMode = config.mode ?? "native";
    this.maxParallelSubCalls = resolveMaxParallelSubCalls(config.maxParallelSubCalls);
    ctx.systemPrompt.tools((context) => this.wireSchemas(context.scope));
    if (this.defaultMode !== "native") {
      ctx.systemPrompt.section(this.collapseSection());
      ctx.systemPrompt.section(this.sdkSection());
    }
  }
  /**
  * The prompt statement of the `ptc` executor collapse, registered wherever
  * {@link sdkSection} is and rendering empty outside an effective `ptc`.
  *
  * Every tool contributes its own guidance section naming its tool, none of
  * them qualify how that tool is reached, and they all render before the SDK.
  * Without this the model reads a catalog of tools it is told to use and no
  * statement that only `run_code` may be called, so it emits a native call,
  * receives `UNKNOWN_TOOL` for a tool the prompt just declared, and concludes
  * the deployment is inconsistent. Its order places the rule before that
  * guidance rather than after it.
  *
  * `both` renders empty: native calls do execute there, so the rule is false.
  * @returns the section registration.
  */
  collapseSection() {
    return {
      name: "tools:ptc-only",
      order: this.ctx.systemPrompt.getSectionOrder("PTC_ONLY"),
      text: (context) => this.modeFor(context.scope) === "ptc" ? PTC_ONLY_INSTRUCTION : ""
    };
  }
  /**
  * The generated-SDK prompt section, registered globally by a PTC mode
  * deployment and per scope by {@link presentAs}.
  *
  * The body regenerates from the CALLING scope, and renders empty for an
  * agent presenting natively — an agent that opted out under a PTC mode
  * deployment still sees the global registration, and an empty section is
  * dropped from the rendered prompt.
  * @returns the section registration.
  */
  sdkSection() {
    return {
      name: "tools:sdk",
      order: this.ctx.systemPrompt.getSectionOrder("TOOLS_SDK"),
      interpolate: false,
      text: (context) => {
        const mode = this.modeFor(context.scope);
        if (mode === "native") return "";
        const runtime = this.requirePtcRuntime(mode);
        const render = SDK_RENDERERS[runtime.language];
        if (render === void 0) throw new Error(`dsh-tools: no SDK renderer for ${runtime.language}`);
        return render(this.sdkSchemas(context.scope));
      }
    };
  }
  /**
  * The presentation one scope's agent sees: its own declaration, else the
  * deployment default.
  * @param scope - the calling agent, or undefined for the global view.
  * @returns the resolved presentation mode.
  */
  modeFor(scope) {
    const layers = this.layers.chainLayers(scope);
    for (let index = layers.length - 1; index >= 0; index -= 1) {
      const mode = layers[index]?.mode;
      if (mode !== void 0) return mode;
    }
    return this.defaultMode;
  }
  /**
  * The reserved `run_code` transport, built on first need.
  *
  * It never enters the global layer: per-agent restrictions must not remove
  * it, and a scoped registration must not shadow it. The visibility resolver
  * appends it after resolving the filterable global/scoped capability layers,
  * and only for scopes whose mode actually presents it.
  * @returns the shared transport definition.
  */
  requirePtcTransport() {
    this.ptcTransport ??= createRunCodeTool(this, {
      requireRuntime: () => this.requirePtcRuntime(this.defaultMode),
      peekApprover: () => this.ctx.get("approval"),
      resolveSandboxPolicy: (exec) => {
        const policy = this.ctx.get("sandboxPolicy");
        if (policy === void 0) throw new Error("dsh-tools: confined PTC runtime requires sandboxPolicy");
        return policy.resolve(exec.agent === void 0 ? {} : { session: exec.agent.session });
      },
      peekRuntime: () => this.ctx.get("ptcRuntime"),
      maxParallel: this.maxParallelSubCalls,
      shapeDispatchLog: (dispatch) => this.shapeDispatchLog(dispatch)
    });
    return this.ptcTransport;
  }
  /**
  * Present the calling scope's tools in `mode` instead of the deployment
  * default. Nearest scope on the chain wins, so a preset's standing
  * declaration covers every agent joined under it.
  *
  * Scoped only, and one declaration per scope: this is how an agent preset
  * composes PTC mode agents beside native ones in the same process, and a
  * process-global override would be the `mode` config field instead.
  * @param mode - the presentation the covered agents' models see.
  * @returns the exact disposer that restores the deployment default.
  */
  presentAs(mode) {
    const ctx = this.ctx;
    if (scopeOf(ctx) === void 0) throw new Error("tools.presentAs() requires a scoped context (agent.ctx): a context-global presentation is the `mode` config field on the tools row");
    return ctx.effect(function* () {
      yield this.layers.effect(ctx, (layer) => {
        if (layer.mode !== void 0) throw new Error(`tools.presentAs("${mode}") conflicts with "${layer.mode}" already declared for this scope; one composition selects one presentation`);
        layer.mode = mode;
        return () => {
          layer.mode = void 0;
        };
      }, { label: "tools.presentAs()" });
      if (mode !== "native") {
        yield ctx.systemPrompt.section(this.collapseSection());
        yield ctx.systemPrompt.section(this.sdkSection());
      }
    }.bind(this), "tools.presentAs()");
  }
  /**
  * Build one scope's wire schemas and names for prompt-order validation.
  * Restrictions do not make known tools invalid, but a mode collapse does.
  */
  wireSchemas(scope) {
    const view = this.view(scope);
    const mode = this.modeFor(scope);
    if (mode === "native") return {
      schemas: [...view.visible.values()].map((definition) => this.schemaOf(definition, false)),
      knownNames: [...view.knownNames]
    };
    this.requirePtcRuntime(mode);
    const schemas = [...view.visible.values()].map((definition) => this.schemaOf(definition, false));
    if (mode === "ptc") return {
      schemas: schemas.filter((schema) => schema.name === RUN_CODE_NAME),
      knownNames: [RUN_CODE_NAME]
    };
    return {
      schemas,
      knownNames: [...view.knownNames, RUN_CODE_NAME]
    };
  }
  /**
  * Resolve the PTC runtime or throw the actionable misconfiguration error.
  * Read at use time (assembly / run_code execution), NOT via static
  * `inject`: an inject entry would hold `ctx.tools` — and every tool plugin
  * behind it — hostage to a PTC runtime existing even under `mode:
  * 'native'`.
  *
  * Assembly and `run_code` execution read separately, so the language is not
  * bound to a request. Harmless while one published backend exists — both
  * reads return the same flavor — but a reload that swapped in a second
  * language between them would hand a program written against one SDK to the
  * other. Binding it is deferred until a second backend ships (the first
  * point it is testable).
  */
  requirePtcRuntime(mode) {
    const runtime = this.ctx.get("ptcRuntime");
    if (!runtime) throw new Error(`dsh-tools: mode "${mode}" requires a PTC runtime \u2014 load a ctx.ptcRuntime implementation (e.g. @deepseek-ai/dsh-ptc-runtime-node) or set tools mode to "native"`);
    if (!Object.hasOwn(SDK_RENDERERS, runtime.language)) {
      const known = Object.keys(SDK_RENDERERS).map((name3) => JSON.stringify(name3)).join(", ");
      throw new Error(`dsh-tools: no SDK renderer registered for runtime language ${JSON.stringify(runtime.language)} (known: ${known})`);
    }
    return runtime;
  }
  /**
  * Register globally or in the calling agent scope. Scoped tools shadow
  * globals; duplicates within one layer and the reserved `run_code` name fail.
  * @param definition - tool schema, execution, and optional finalization/presentation callbacks.
  * @returns the exact disposer that unregisters the tool.
  */
  register(definition) {
    const name3 = definition.name;
    const output = definition.output;
    if (output === void 0 || typeof output !== "object" || typeof output.render !== "function" || output.presentationMeta !== void 0 && typeof output.presentationMeta !== "function") throw new TypeError(`tool "${name3}" must declare output { schema, render, presentationMeta? }`);
    assertSupportedJsonSchema(output.schema);
    const timeoutMs = definition.timeoutMs;
    if (timeoutMs !== void 0 && (!Number.isFinite(timeoutMs) || timeoutMs <= 0)) throw new TypeError(`tool "${name3}" timeoutMs must be a positive finite number`);
    if (name3 === "run_code") throw new Error(`tool name "${RUN_CODE_NAME}" is reserved for the PTC mode presentation transport and cannot be registered or shadowed`);
    return this.layers.effect(this.ctx, (layer) => layer.tools.insert(name3, definition), { label: "tools.register()" });
  }
  /**
  * Restrict global tools for the calling agent scope. Empty filters, unknown
  * names, scope-local names, and reserved transport names fail. Restrictions
  * intersect; scoped registrations remain visible.
  * @param filter - global-tool mask: `allow` (keep only) and/or `deny` (remove).
  * @returns the exact disposer that lifts this restriction.
  */
  restrict(filter) {
    const scope = scopeOf(this.ctx);
    if (scope === void 0) throw new Error("tools.restrict() requires a scoped context (agent.ctx): a context-global restriction would mask every agent \u2014 deny the tool for the intended agent instead");
    const allow = filter.allow;
    const deny = filter.deny;
    if (allow === void 0 && deny === void 0) throw new Error("tools.restrict({}) is a no-op: pass `allow` and/or `deny` (an empty filter is almost always a materialized-empty-config bug)");
    const compiled = {
      ...allow !== void 0 ? { allow: new Set(allow) } : {},
      ...deny !== void 0 ? { deny: new Set(deny) } : {}
    };
    if ([...allow ?? [], ...deny ?? []].includes("run_code")) throw new Error(`tools.restrict() cannot name reserved PTC mode presentation transport "${RUN_CODE_NAME}"; restrict end-capability tools instead`);
    const known = this.view(scope).restrictableNames;
    const unknown = [...allow ?? [], ...deny ?? []].filter((name3) => !known.has(name3));
    if (unknown.length > 0) throw new Error(`tools.restrict() names unknown global tool${unknown.length > 1 ? "s" : ""} ${unknown.map((n) => `"${n}"`).join(", ")}; known global tools: ${[...known].sort().join(", ") || "(none)"}`);
    return this.layers.effect(this.ctx, (layer) => layer.restrictions.append(compiled), { label: "tools.restrict()" });
  }
  /**
  * Register a monotonic guard after the extensible `tools/pre-execute`
  * waterfall. A plain-context guard applies globally; one registered through
  * `agent.ctx` applies only to that agent. Any matching guard may deny by
  * returning a reason, while no guard can force-allow a call another guard
  * denied. The exact effect disposer is returned for ordered ownership and
  * HMR cleanup.
  * @param guard - synchronous check; a returned string denies the execution.
  * @returns the exact disposer that unregisters the guard.
  */
  guard(guard) {
    return this.layers.effect(this.ctx, (layer) => layer.guards.append(guard), {
      label: "tools.guard()",
      notify: false
    });
  }
  /** First monotonic denial from the global then the scope chain's guard layers, farthest first. */
  guardReason(exec) {
    const globalReason = this.layers.global.guardReason(exec);
    if (globalReason !== void 0) return globalReason;
    if (exec.agent === void 0) return void 0;
    for (const layer of this.layers.chainLayers(exec.agent)) {
      const reason = layer.guardReason(exec);
      if (reason !== void 0) return reason;
    }
  }
  /**
  * Resolve every registry fact one scope needs in one layer traversal. The
  * visible map applies restrictions to the INHERITED surface, then the
  * scope's own registrations and the reserved presentation transport; the
  * other sets retain the pre-restriction facts needed by restriction and
  * prompt-order validation.
  *
  * A restriction filters what a scope inherits — the global layer and every
  * ancestor layer on its chain — and never what its OWN layer registers.
  * That exemption is what a per-child capability filter has to keep intact:
  * the delegation runtime registers a child's structured-output tool into the
  * child's own layer, and a filter naming the capabilities the child may use
  * must not strip the machinery it answers through.
  *
  * Reading the exempt set as "the global layer" instead of "not mine" held
  * only while every model-facing tool sat in the host composition. Once
  * presets moved them onto the agent plane they became an ANCESTOR
  * contribution, so a child's filter silently stopped constraining anything
  * it was given.
  * @param scope - the viewing scope (the agent), or undefined for the global view.
  * @returns the complete derived view for that scope.
  */
  view(scope) {
    const layers = this.layers.chainLayers(scope);
    const own = this.layers.peek(scope);
    const inherited = new Map(this.layers.global.tools.entries());
    for (const layer of layers) {
      if (layer === own) continue;
      for (const [name3, definition] of layer.tools.entries()) inherited.set(name3, definition);
    }
    const visible = /* @__PURE__ */ new Map();
    const knownNames = /* @__PURE__ */ new Set();
    const restrictableNames = /* @__PURE__ */ new Set();
    for (const [name3, definition] of inherited) {
      knownNames.add(name3);
      restrictableNames.add(name3);
      if (layers.every((layer) => layer.admits(name3))) visible.set(name3, definition);
    }
    if (own !== void 0) for (const [name3, definition] of own.tools.entries()) {
      knownNames.add(name3);
      visible.set(name3, definition);
    }
    if (this.modeFor(scope) !== "native") visible.set(RUN_CODE_NAME, this.requirePtcTransport());
    return {
      visible,
      knownNames,
      restrictableNames
    };
  }
  /**
  * Look up a tool as one scope sees it (scoped
  * shadows global; a restricted-away global reads as absent). Presenters pass
  * the calling agent so the rendered card matches the definition that
  * actually executed.
  * @param name - the tool name as registered.
  * @param scope - the viewing scope (the agent); omitted = the global view.
  * @returns the definition the scope resolves, or undefined when none is visible.
  */
  get(name3, scope) {
    return this.view(scope).visible.get(name3);
  }
  /**
  * Resolve the definition that MAY EXECUTE for a call, applying the mode
  * collapse at the operation boundary that owns it. The registry view
  * (`get`) is presentation-agnostic; here a MODEL-DIRECT call under `ptc`
  * may only name the reserved `run_code` transport, while a nested
  * sub-dispatch (a `parent` token set — the `run_code` SDK calling a tool
  * it bound) may call any visible tool. Denial surfaces as `UNKNOWN_TOOL`
  * through the executor, matching an absent definition.
  * @param name - the tool name as registered.
  * @param scope - the viewing scope (the agent); omitted = the global view.
  * @param nested - whether the call is a transport sub-dispatch, not a model-direct call.
  * @returns the definition that may run, or undefined when the call must be rejected.
  */
  resolveExecution(name3, scope, nested) {
    const tool = this.get(name3, scope);
    if (tool === void 0) return void 0;
    if (this.collapses(name3, scope, nested)) return void 0;
    return tool;
  }
  /**
  * Project visible definitions onto the allowlisted model-facing schema fields,
  * excluding execution and presentation callbacks.
  * @param scope - the viewing scope (the agent); omitted = the global view.
  * @returns one deep-cloned schema per visible tool.
  */
  schemas(scope) {
    return [...this.view(scope).visible.values()].map((definition) => this.schemaOf(definition, true));
  }
  /** Project visible callable tools onto the generated PTC mode SDK contract. */
  sdkSchemas(scope) {
    return [...this.view(scope).visible.values()].filter((definition) => definition.name !== RUN_CODE_NAME).map((definition) => {
      const output = snapshotJsonValue(definition.output.schema);
      if (output === void 0) throw new Error(`tool "${definition.name}" output schema must be lossless JSON before SDK projection`);
      return {
        ...this.schemaOf(definition, true),
        output
      };
    });
  }
  /** Project one definition onto the model-facing schema fields. */
  schemaOf(definition, detachParameters) {
    const { name: name3, description, parameters, deferLoading } = definition;
    const detached = detachParameters ? snapshotJsonValue(parameters) : parameters;
    if (detached === void 0) throw new Error(`tool "${name3}" parameters must be lossless JSON before schema projection`);
    return {
      name: name3,
      description,
      parameters: detached,
      ...deferLoading === true ? { deferLoading } : {}
    };
  }
  /**
  * Classify a pending call through the caller's visible tool definition. Only
  * an exact `true` is parallel; unknown, hidden, undeclared, invalid, or
  * throwing classifiers are exclusive.
  * @param exec - call name, parsed arguments, and optional agent scope.
  * @returns the fail-closed scheduling mode.
  */
  executionMode(exec) {
    const tool = this.resolveExecution(exec.name, exec.agent, exec.parent !== void 0);
    if (!tool?.isConcurrencySafe) return { kind: "exclusive" };
    try {
      return tool.isConcurrencySafe(exec.arguments) === true ? { kind: "parallel" } : { kind: "exclusive" };
    } catch {
      return { kind: "exclusive" };
    }
  }
  /**
  * Run the `tools/ptc-dispatch-log` waterfall over one settled sub-dispatch
  * and return the content the bridge should log on `tool/ptc-dispatch`.
  * Contained: when a listener throws, the method logs the original settled
  * content; that failure must not fail the dispatch or omit the settle event. Private:
  * the ONE consumer is the `run_code` bridge this registry constructs, which
  * receives it as a capability parameter (the `requireRuntime` idiom) — the
  * waterfall, not this invoker, is the public extension point.
  */
  async shapeDispatchLog(dispatch) {
    try {
      return await this.ctx.waterfall(scopeTarget(this, dispatch.agent), "tools/ptc-dispatch-log", dispatch, () => Promise.resolve(dispatch.content));
    } catch (error) {
      this.ctx.logger.warn(`tools: ptc-dispatch-log listener failed for ${dispatch.name}: ${errorMessage2(error)}; logging the original settled content`);
      return dispatch.content;
    }
  }
  /**
  * Whether the `ptc` mode collapse denies a model-direct call: only the
  * reserved `run_code` transport may be named. Nested sub-dispatches (a
  * `parent` token set) bypass the collapse. One home for the
  * security-relevant predicate, shared by {@link resolveExecution} and
  * {@link createExecution} so the two can never drift apart.
  *
  * Resolved through {@link modeFor}, NOT `defaultMode`: an agent given `ptc`
  * by an agent preset under a native deployment is the composition
  * `dsh-agent-tool-presentation` exists for, and reading the deployment default would
  * leave exactly that agent uncollapsed — announcing one surface while
  * executing another, which is the bypass this collapse closes.
  * @param name - the tool name as registered.
  * @param scope - the viewing scope whose effective presentation mode applies.
  * @param nested - whether the call is a transport sub-dispatch, not a model-direct call.
  */
  collapses(name3, scope, nested) {
    return !nested && this.modeFor(scope) === "ptc" && name3 !== "run_code";
  }
  /**
  * Execute through pre-policy, guards, around-dispatch, post-policy,
  * definition-owned content finalization, and final notification. Tool and
  * listener failures resolve as materialized error results; an invisible tool
  * reports `UNKNOWN_TOOL`. The returned outcome is the same lossless, frozen
  * snapshot final observers receive. Cancellation
  * arriving after entry and before final result materialization skips a
  * not-yet-started body with `ABORTED_BEFORE_DISPATCH` or replaces a
  * successful started outcome with `ABORTED`; already-started work is still
  * drained and may retain a tool-owned structured error.
  * @param exec - the typed same-process call input. The registry assigns its
  *   correlation token before policy begins.
  * @returns the materialized final result.
  */
  async execute(exec) {
    return this.prepareExecution(exec, (prepared) => this.completeScheduledExecution(prepared));
  }
  async completeScheduledExecution(prepared) {
    switch (prepared.kind) {
      case "dispatch": {
        const dispatched = await this.dispatchScheduledExecution(prepared.exec);
        return dispatched.kind === "post-result" ? await this.finalizeScheduledExecution(prepared.exec, dispatched.result) : this.finishScheduledExecution(prepared.exec, dispatched.result);
      }
      case "post-result":
        return await this.finalizeScheduledExecution(prepared.exec, prepared.result);
      case "final-result":
        return this.finishScheduledExecution(prepared.exec, prepared.result);
      /* v8 ignore next -- closed-union exhaustiveness guard */
      default:
        return assertNever(prepared, "scheduled tool preparation");
    }
  }
  createExecution(exec) {
    const deferredContexts = [];
    const token = createExecutionToken();
    const callId = exec.callId;
    const rootCallId = exec.rootCallId ?? callId;
    const name3 = exec.name;
    const agent = exec.agent;
    const parent = exec.parent;
    const signal = exec.signal;
    const visible = this.get(name3, agent);
    const collapsed = visible !== void 0 && this.collapses(name3, agent, parent !== void 0);
    const concludingExecutions = this.concludingExecutions;
    const base = {
      token,
      callId,
      rootCallId,
      name: name3,
      signal,
      ...agent !== void 0 ? { agent } : {},
      ...parent !== void 0 ? { parent } : {},
      ...exec.schema !== void 0 ? { schema: exec.schema } : {},
      deferContext(context) {
        deferredContexts.push(context);
      },
      concludeTurn() {
        concludingExecutions.add(this);
      }
    };
    const capturedFinalizer = visible?.finalizeContent?.bind(visible);
    const capturedProjector = visible?.projectContent?.bind(visible);
    const finalizerFor = () => collapsed && !signal.aborted ? void 0 : capturedFinalizer;
    try {
      const detached = snapshotJsonValue(exec.arguments);
      if (detached === void 0) throw new TypeError("tool execution arguments must be losslessly JSON-serializable");
      const execution = {
        ...base,
        arguments: deepFreeze(detached)
      };
      this.deferredContexts.set(execution, deferredContexts);
      this.contentFinalizers.set(execution, finalizerFor());
      if (!collapsed) this.contentProjectors.set(execution, capturedProjector);
      this.cancellationStates.set(execution, {
        callerSignal: signal,
        bodyInvoked: false
      });
      if (collapsed) {
        if (signal.aborted) return {
          kind: "final-result",
          exec: execution,
          result: toolAbortedBeforeDispatchResult()
        };
        return {
          kind: "final-result",
          exec: execution,
          result: toolErrorResult(new ToolNotFoundError(name3, `only \`${RUN_CODE_NAME}\` is callable directly \u2014 call \`${name3}\` from inside a \`${RUN_CODE_NAME}\` program instead`))
        };
      }
      return {
        kind: "ready",
        exec: execution
      };
    } catch (error) {
      const execution = {
        ...base,
        arguments: void 0
      };
      this.contentFinalizers.set(execution, finalizerFor());
      return {
        kind: "final-result",
        exec: execution,
        result: toolErrorResult(error)
      };
    }
  }
  /**
  * Run the ordered pre-execute and monotonic guard stages for the scheduler.
  * @param input - the caller-supplied execution input.
  * @returns the prepared execution plus the next scheduler stage.
  * @internal
  */
  async prepareScheduledExecution(input) {
    return this.prepareExecution(input, (prepared) => prepared);
  }
  async prepareExecution(input, next) {
    const created = this.createExecution(input);
    if (created.kind !== "ready") return next(created);
    const exec = created.exec;
    if (this.callerCancelled(exec)) return next({
      kind: "final-result",
      exec,
      result: toolAbortedBeforeDispatchResult()
    });
    try {
      const carrier = scopeTarget(this, exec.agent);
      const gate = await this.ctx.waterfall(carrier, "tools/pre-execute", exec, () => Promise.resolve({ kind: "allow" }));
      const askResolution = gate.kind === "ask" ? await this.serviceAsk(exec, gate) : {
        decision: gate,
        approvalCancelled: false
      };
      const { decision } = askResolution;
      if (this.callerCancelled(exec) && askResolution.approvalCancelled) return await next({
        kind: "post-result",
        exec,
        result: toolAbortedBeforeDispatchResult()
      });
      if (decision.kind === "cancel") return await next({
        kind: "post-result",
        exec,
        result: toolAbortedBeforeDispatchResult()
      });
      const denialReason = decision.kind === "allow" ? this.guardReason(exec) : decision.reason;
      const denialInfo = decision.kind === "deny" ? decision.info : void 0;
      if (denialReason !== void 0) return await next({
        kind: "post-result",
        exec,
        result: this.materializeFinalResult({
          content: [{
            type: "text",
            text: `Error: ${denialReason}`
          }],
          isError: true,
          error: {
            message: denialReason,
            ...denialInfo === void 0 ? {} : { info: denialInfo }
          }
        })
      });
      if (this.callerCancelled(exec)) return await next({
        kind: "post-result",
        exec,
        result: toolAbortedBeforeDispatchResult()
      });
      return await next({
        kind: "dispatch",
        exec
      });
    } catch (error) {
      return next({
        kind: "final-result",
        exec,
        result: toolErrorResult(error)
      });
    }
  }
  /** Whether the original caller signal is currently aborted. */
  callerCancelled(exec) {
    const state = this.cancellationStates.get(exec);
    if (state === void 0) throw new Error("tool registry scheduler invariant violated: missing cancellation state");
    return state.callerSignal.aborted;
  }
  /** Canonical cancellation outcome selected by whether the tool body started. */
  cancellationResult(exec, prior) {
    const state = this.cancellationStates.get(exec);
    if (state === void 0) throw new Error("tool registry scheduler invariant violated: missing cancellation state");
    return state.bodyInvoked ? toolAbortedResult(prior) : toolAbortedBeforeDispatchResult(prior);
  }
  /**
  * Dispatch the registered body with the original caller signal fused back
  * into any around-wrapper replacement. Cancellation never abandons the body:
  * a started promise reaches quiescence before its outcome becomes `ABORTED`.
  */
  async dispatchToolBody(exec) {
    const state = this.cancellationStates.get(exec);
    if (state === void 0) throw new Error("tool registry scheduler invariant violated: missing cancellation state");
    const wrapperSignal = exec.signal;
    const fused = fuseToolSignals(state.callerSignal, wrapperSignal);
    const signal = fused.signal;
    if (isAborted(signal)) {
      fused.dispose();
      return toolAbortedBeforeDispatchResult();
    }
    exec.signal = signal;
    try {
      const tool = this.resolveExecution(exec.name, exec.agent, exec.parent !== void 0);
      if (!tool) throw new ToolNotFoundError(exec.name);
      state.bodyInvoked = true;
      const returned = await tool.execute(exec.arguments, exec);
      const result = this.createSuccessResult(exec, tool, returned);
      return isAborted(signal) ? toolAbortedResult(result) : result;
    } catch (error) {
      return toolErrorResult(error);
    } finally {
      fused.dispose();
      exec.signal = wrapperSignal;
    }
  }
  /**
  * Run around-dispatch and the tool body. Tool and unknown-tool failures still
  * receive post-execute; pipeline failures are already final.
  * @param exec - the prepared execution.
  * @returns whether the result still needs post-execute.
  * @internal
  */
  async dispatchScheduledExecution(exec) {
    try {
      const mutableExec = exec;
      const carrier = scopeTarget(this, exec.agent);
      const result = await this.ctx.waterfall(carrier, "tools/execute", mutableExec, () => this.dispatchToolBody(mutableExec));
      const normalized = this.normalizeDispatchResult(exec, result);
      const deferredContexts = this.deferredContexts.get(exec);
      if (deferredContexts === void 0) throw new Error("tool registry scheduler invariant violated: unprepared execution");
      const resultWithDeferredContexts = deferredContexts.length === 0 ? normalized : this.markCanonical(exec, {
        ...normalized,
        additionalContexts: [...deferredContexts, ...normalized.additionalContexts ?? []]
      });
      return {
        kind: "post-result",
        result: this.callerCancelled(exec) && !resultWithDeferredContexts.isError ? this.cancellationResult(exec, resultWithDeferredContexts) : resultWithDeferredContexts
      };
    } catch (error) {
      return {
        kind: "final-result",
        result: toolErrorResult(error)
      };
    }
  }
  /**
  * Run ordered post-execute, then apply definition-owned content finalization,
  * materialize, and notify the final outcome.
  * @param exec - the prepared execution.
  * @param result - dispatch/pre result that still needs post-execute.
  * @returns the materialized final result.
  * @internal
  */
  async finalizeScheduledExecution(exec, result) {
    try {
      const project = this.contentProjectors.get(exec);
      this.contentProjectors.delete(exec);
      const content = project?.(exec, result);
      const projected = content === void 0 ? result : this.markCanonical(exec, this.materializeFinalResult({
        ...result,
        content
      }));
      const postResult = await this.postExecute(exec, projected);
      return this.finishScheduledExecution(exec, this.callerCancelled(exec) && !postResult.isError ? this.cancellationResult(exec, postResult) : postResult);
    } catch (error) {
      return this.finishScheduledExecution(exec, toolErrorResult(error));
    }
  }
  /**
  * Materialize the candidate, apply definition-owned content finalization,
  * then materialize and notify the authoritative result.
  * @param exec - the prepared execution.
  * @param result - final result.
  * @returns the materialized final result.
  * @internal
  */
  finishScheduledExecution(exec, result) {
    let materializedResult;
    try {
      materializedResult = this.materializeFinalResult(result);
    } catch (error) {
      materializedResult = this.materializeFinalResult(toolErrorResult(error));
    }
    let finalResult;
    try {
      finalResult = this.materializeFinalResult(this.applyFinalContent(exec, materializedResult));
    } catch (error) {
      finalResult = this.materializeFinalResult(toolErrorResult(error));
    }
    this.notifyResult(exec, finalResult);
    return finalResult;
  }
  /** Apply the snapshotted tool-owned content transform without exposing other result fields. */
  applyFinalContent(exec, result) {
    const finalizeContent = this.contentFinalizers.get(exec);
    if (finalizeContent === void 0) return result;
    const content = finalizeContent(exec, result);
    return content === void 0 ? result : {
      ...result,
      content
    };
  }
  /** Notify observers without exposing a mutation or error channel into the outcome. */
  notifyResult(exec, result) {
    Object.freeze(exec);
    const { name: toolName, callId } = exec;
    const reportFailure = (error) => {
      this.ctx.logger.warn(`tool "${toolName}" (${callId}): tools/result observer failed: ${errorMessage2(error)}`);
    };
    const callbacks = this.ctx.events.dispatch("emit", [
      scopeTarget(this, exec.agent),
      "tools/result",
      exec,
      result
    ]);
    for (const callback of callbacks) try {
      const returned = callback(exec, result);
      Promise.resolve(returned).catch(reportFailure);
    } catch (error) {
      reportFailure(error);
    }
  }
  /**
  * Resolve an `ask` decision to allow/deny through the approval seam. The
  * seam is consumed opportunistically with `ctx.get('approval')` — a
  * deployment that composes no ApprovalService keeps the historical degrade
  * to deny, and an unmount mid-session degrades the same way on the next ask.
  * An agent-less execution also degrades: without an agent there is no
  * session to audit to and no UI to route to. Otherwise the outcome maps
  * one-to-one — `allowed-once` proceeds; the three non-grants deny with
  * distinct reasons so the model can tell a human "no" from an absent
  * approval channel.
  */
  async serviceAsk(exec, ask) {
    const approval = this.ctx.get("approval");
    if (approval === void 0) return {
      decision: {
        kind: "deny",
        reason: ask.reason ?? `tool "${exec.name}" requires approval (not yet supported)`
      },
      approvalCancelled: false
    };
    if (exec.agent === void 0) return {
      decision: {
        kind: "deny",
        reason: `tool "${exec.name}" requires approval, but the call has no agent to route it through`
      },
      approvalCancelled: false
    };
    const outcome = await approval.request({
      agent: exec.agent,
      toolName: exec.name,
      callId: exec.callId,
      ...ask.reason !== void 0 ? { reason: ask.reason } : {},
      ...ask.displayReason !== void 0 ? { displayReason: ask.displayReason } : {},
      signal: exec.signal
    });
    switch (outcome) {
      case "allowed-once":
        return {
          decision: { kind: "allow" },
          approvalCancelled: false
        };
      case "rejected":
        return {
          decision: {
            kind: "deny",
            reason: `the user rejected tool "${exec.name}"`
          },
          approvalCancelled: false
        };
      case "cancelled":
        return {
          decision: {
            kind: "deny",
            reason: `approval for tool "${exec.name}" was cancelled`
          },
          approvalCancelled: true
        };
      case "unavailable":
        return {
          decision: {
            kind: "deny",
            reason: `tool "${exec.name}" requires approval, but no approval channel is available`
          },
          approvalCancelled: false
        };
      default:
        return assertNever(outcome, "ApprovalOutcome");
    }
  }
  /**
  * Run the `tools/post-execute` waterfall over a dispatched `result` and apply
  * its {@link PostToolDecision}: `accept` keeps the call successful (replacing
  * `content` when given), `block` turns it into an `isError` whose content is
  * the corrective `feedback`. Either decision may attach `additionalContexts`,
  * which are ferried on the returned result for the loop's active-batch FIFO.
  * Context deferred by the tool body survives an accepted result but is
  * discarded when the outer call is blocked; a block exposes only context the
  * blocking decision explicitly supplied.
  * Runs inside `execute`'s outer try/catch (a throwing listener → isError).
  */
  async postExecute(exec, result) {
    const decision = await this.ctx.waterfall(scopeTarget(this, exec.agent), "tools/post-execute", exec, result, () => Promise.resolve({ kind: "accept" }));
    const decisionContexts = decision.additionalContexts ?? [];
    if (decision.kind === "block") {
      const message = failureMessageFromContent(decision.feedback);
      return this.markCanonical(exec, {
        content: decision.feedback,
        isError: true,
        error: { message },
        ...decisionContexts.length > 0 ? { additionalContexts: decisionContexts } : {}
      });
    }
    if (Object.hasOwn(decision, "content") && Object.hasOwn(decision, "value")) throw new TypeError("tools/post-execute accept decision cannot replace both value and content");
    const additionalContexts = [...result.additionalContexts ?? [], ...decisionContexts];
    if (Object.hasOwn(decision, "value")) {
      if (result.isError) throw new TypeError("tools/post-execute cannot replace the value of a failed result");
      const tool = this.resolveExecution(exec.name, exec.agent, exec.parent !== void 0);
      if (tool === void 0) throw new ToolNotFoundError(exec.name);
      const replaced = this.createSuccessResult(exec, tool, decision.value);
      return this.markCanonical(exec, {
        ...replaced,
        ...additionalContexts.length > 0 ? { additionalContexts } : {}
      });
    }
    return this.markCanonical(exec, {
      ...result,
      ...decision.content !== void 0 ? { content: decision.content } : {},
      ...additionalContexts.length > 0 ? { additionalContexts } : {}
    });
  }
  /** Registry-normalized results and the exact dispatch that validated each value. */
  canonicalResults = /* @__PURE__ */ new WeakMap();
  /** Mark one registry-normalized result as canonical only for its owning dispatch. */
  markCanonical(exec, result) {
    this.canonicalResults.set(result, exec.token);
    return result;
  }
  /** Snapshot, validate, render, and optionally project one successful body value. */
  createSuccessResult(exec, tool, candidate) {
    const detached = snapshotToolValue(tool.name, candidate);
    const violations = validateJsonSchemaValue(tool.output.schema, detached, "value");
    if (violations.length > 0) throw new ToolOutputError(tool.name, violations);
    const value = deepFreeze(detached);
    let rendered;
    try {
      rendered = tool.output.render(exec.arguments, value);
    } catch (error) {
      throw projectionError(tool.name, "render", error);
    }
    const content = snapshotProjection(tool.name, "render", rendered);
    let meta;
    if (exec.parent === void 0 && tool.output.presentationMeta !== void 0) {
      let projected;
      try {
        projected = tool.output.presentationMeta(exec.arguments, value);
      } catch (error) {
        throw projectionError(tool.name, "presentationMeta", error);
      }
      meta = snapshotProjection(tool.name, "presentationMeta", projected);
    }
    const concludesTurn = this.concludingExecutions.has(exec);
    return this.markCanonical(exec, this.materializeFinalResult({
      isError: false,
      value,
      content,
      ...meta !== void 0 ? { meta } : {},
      ...concludesTurn ? { concludesTurn: true } : {}
    }));
  }
  /** Normalize an around-dispatch wrapper's authored result through the owning output contract. */
  normalizeDispatchResult(exec, result) {
    if (this.canonicalResults.get(result) === exec.token) return result;
    if (result.isError) return this.markCanonical(exec, {
      isError: true,
      error: result.error,
      content: result.content,
      ...result.meta !== void 0 ? { meta: result.meta } : {},
      ...result.additionalContexts !== void 0 ? { additionalContexts: result.additionalContexts } : {}
    });
    const tool = this.resolveExecution(exec.name, exec.agent, exec.parent !== void 0);
    if (tool === void 0) throw new ToolNotFoundError(exec.name);
    const normalized = this.createSuccessResult(exec, tool, result.value);
    return this.markCanonical(exec, {
      ...normalized,
      ...result.additionalContexts !== void 0 ? { additionalContexts: result.additionalContexts } : {}
    });
  }
  /** Materialize the authoritative commit outcome once, immediately before `tools/result`. */
  materializeFinalResult(result) {
    const presentation = {
      content: result.content,
      ...result.meta !== void 0 ? { meta: result.meta } : {},
      ...result.additionalContexts !== void 0 ? { additionalContexts: result.additionalContexts } : {}
    };
    if (result.isError) return materializePresentation({
      isError: true,
      error: result.error,
      ...presentation
    });
    return deepFreeze({
      ...materializePresentation({
        isError: false,
        ...presentation,
        ...result.concludesTurn === true ? { concludesTurn: true } : {}
      }),
      value: result.value
    });
  }
};
function createExecutionToken() {
  return Symbol("dsh.tool.execution");
}
function toolErrorResult(error) {
  const info = errorInfo(error);
  const message = errorMessage2(error);
  return {
    content: [{
      type: "text",
      text: `Error: ${message}`
    }],
    isError: true,
    error: {
      message,
      ...info ? { info } : {}
    }
  };
}
function isAborted(signal) {
  return signal.aborted;
}
function fuseToolSignals(caller, wrapper) {
  if (caller === wrapper) return {
    signal: caller,
    dispose() {
    }
  };
  const controller = new AbortController();
  let listening = false;
  const dispose = () => {
    if (!listening) return;
    listening = false;
    caller.removeEventListener("abort", abortFromCaller);
    wrapper.removeEventListener("abort", abortFromWrapper);
  };
  const abortFrom = (source) => {
    const reason = source.reason;
    controller.abort(reason);
    dispose();
  };
  const abortFromCaller = () => {
    abortFrom(caller);
  };
  const abortFromWrapper = () => {
    abortFrom(wrapper);
  };
  if (wrapper.aborted) abortFromWrapper();
  else if (caller.aborted) abortFromCaller();
  else {
    listening = true;
    caller.addEventListener("abort", abortFromCaller, { once: true });
    wrapper.addEventListener("abort", abortFromWrapper, { once: true });
  }
  return {
    signal: controller.signal,
    dispose
  };
}
function toolAbortedResult(prior) {
  const additionalContexts = prior?.additionalContexts ?? [];
  return {
    content: [{
      type: "text",
      text: "Error: tool call aborted"
    }],
    isError: true,
    error: {
      message: "tool call aborted",
      info: {
        name: "AbortError",
        code: TOOL_ABORTED
      }
    },
    ...additionalContexts.length > 0 ? { additionalContexts } : {}
  };
}
function toolAbortedBeforeDispatchResult(prior) {
  const additionalContexts = prior?.additionalContexts ?? [];
  return {
    content: [{
      type: "text",
      text: "Error: tool call aborted before dispatch"
    }],
    isError: true,
    error: {
      message: "tool call aborted before dispatch",
      info: {
        name: "AbortError",
        code: TOOL_ABORTED_BEFORE_DISPATCH
      }
    },
    ...additionalContexts.length > 0 ? { additionalContexts } : {}
  };
}

// jev.js
var SYSTEM_ONE_URL = "https://api.typesafe.ai/v1/systemone";
var DEFAULT_JEV_MODEL = "jev-latest";
var TOKEN_PIECES = /[A-Za-z]+|\d+|[^\sA-Za-z\d]+/g;
var TOKEN_ESTIMATE_CONSTANTS = {
  wordShort: 0.9,
  wordFree: 6,
  wordSlope: 0.16,
  digitDiv: 1.8,
  cjkWeight: 1,
  symSingle: 1,
  symRunSlope: 0.65
};
function estimateTokens(text) {
  const c = TOKEN_ESTIMATE_CONSTANTS;
  const source = String(text);
  if (source.length === 0) return 0;
  let total = 0;
  for (const match of source.matchAll(TOKEN_PIECES)) {
    const piece = match[0];
    const code = piece.charCodeAt(0);
    if (code >= 48 && code <= 57) {
      total += piece.length / c.digitDiv;
      continue;
    }
    if (code >= 65 && code <= 90 || code >= 97 && code <= 122) {
      total += piece.length <= c.wordFree ? c.wordShort : c.wordShort + (piece.length - c.wordFree) * c.wordSlope;
      continue;
    }
    let cjk = 0;
    for (const ch of piece) {
      const cc = ch.charCodeAt(0);
      if (cc >= 19968 && cc <= 40959) cjk += 1;
    }
    if (cjk === piece.length) {
      total += piece.length * c.cjkWeight;
      continue;
    }
    total += Math.max(c.symSingle, piece.length * c.symRunSlope);
  }
  return Math.max(1, Math.ceil(total));
}
var JevError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "JevError";
    this.status = options?.status ?? null;
    this.retryable = options?.retryable ?? false;
  }
};
function sleep(ms, signal) {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => {
    const timer = setTimeout(done, ms);
    function done() {
      clearTimeout(timer);
      signal?.removeEventListener("abort", done);
      resolve();
    }
    signal?.addEventListener("abort", done, { once: true });
  });
}
function isRetryableStatus(status) {
  return status === 429 || status >= 500 && status <= 599;
}
var JevClient = class {
  /**
   * @param {object} params
   * @param {string} params.apiKey - TypeSafe key；空则不发起请求（插件退化为不干预）
   * @param {string} [params.model]
   * @param {string} [params.baseUrl]
   * @param {number} [params.timeoutMs]
   * @param {number} [params.maxRetries] - 单次 ask 内最多重试几次（默认 2，即最多 3 次尝试）
   * @param {number} [params.retryBaseMs] - 退避基数（指数退避，默认 300ms）
   * @param {typeof fetch} [params.fetchImpl]
   */
  constructor({
    apiKey,
    model = DEFAULT_JEV_MODEL,
    baseUrl = SYSTEM_ONE_URL,
    timeoutMs = 6e4,
    maxRetries = 2,
    retryBaseMs = 300,
    fetchImpl
  } = {}) {
    this.apiKey = typeof apiKey === "string" ? apiKey.trim() : "";
    this.model = model;
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
    this.maxRetries = Number.isFinite(maxRetries) && maxRetries >= 0 ? Math.floor(maxRetries) : 2;
    this.retryBaseMs = Number.isFinite(retryBaseMs) && retryBaseMs >= 0 ? retryBaseMs : 300;
    this.fetchImpl = fetchImpl ?? globalThis.fetch;
    this.requests = 0;
    this.retries = 0;
    this.lastRetries = 0;
    this.usage = { input_tokens: 0, output_tokens: 0 };
    this.lastError = "";
  }
  get ready() {
    return this.apiKey.length > 0 && typeof this.fetchImpl === "function";
  }
  /**
   * 单次 HTTP 尝试（不含重试）。把上一次的 AbortController 完整回收后再抛错。
   * @returns {Promise<object>} 解析后的响应体
   */
  async #attempt(state, questions, ids, options) {
    const payload = {
      model: this.model,
      state,
      questions: Object.fromEntries(ids.map((id) => [id, { type: "noul", instructions: questions[id] }]))
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const onAbort = () => controller.abort();
    options.signal?.addEventListener("abort", onAbort, { once: true });
    try {
      const response = await this.fetchImpl(this.baseUrl, {
        method: "POST",
        headers: {
          authorization: `Bearer ${this.apiKey}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      const text = await response.text();
      if (!response.ok) {
        throw new JevError(`Jev \u8BF7\u6C42\u5931\u8D25 (${response.status}): ${text.slice(0, 200)}`, {
          status: response.status,
          retryable: isRetryableStatus(response.status)
        });
      }
      return JSON.parse(text);
    } catch (error) {
      if (error instanceof JevError) throw error;
      if (options.signal?.aborted) {
        throw new JevError("\u5224\u5B9A\u5DF2\u88AB\u4E2D\u65AD\uFF08signal \u5DF2 abort\uFF09", { retryable: false });
      }
      const timedOut = controller.signal.aborted;
      throw new JevError(
        timedOut ? `Jev \u8BF7\u6C42\u8D85\u65F6\uFF08${this.timeoutMs}ms\uFF09` : `Jev \u8BF7\u6C42\u7F51\u7EDC\u5F02\u5E38\uFF1A${error?.message ?? String(error)}`,
        { retryable: true }
      );
    } finally {
      clearTimeout(timer);
      options.signal?.removeEventListener("abort", onAbort);
    }
  }
  /**
   * 一次请求问完一批 noul 问题。
   *
   * 重试语义（issue #34）：旧实现单次失败就丢掉**整轮判定**——一次网络抖动
   * 会让本次 pass 的所有候选都没有概率，两层随即静默不动。
   * 现在对可重试失败做指数退避重试（默认 2 次，共 3 次尝试），
   * 且每次尝试都重新检查外部 signal（用户中断后不再重试）。
   *
   * @param {string} state 会话状态文本
   * @param {Record<string,string>} questions 问题 id → 待判定陈述
   * @param {{signal?:AbortSignal}} [options] 外部中断信号（issue #9：此前判定请求
   *   不接收 agent 的 signal，宿主/用户中断后请求继续占连接、可能继续计费）
   * @returns {Promise<Record<string, number>>} 问题 id → P(陈述成立)
   */
  async ask(state, questions, options = {}) {
    const ids = Object.keys(questions);
    if (!this.ready || ids.length === 0) return {};
    if (options.signal?.aborted) throw new JevError("\u5224\u5B9A\u5DF2\u88AB\u4E2D\u65AD\uFF08signal \u5DF2 abort\uFF09");
    this.lastRetries = 0;
    this.lastError = "";
    let lastError = null;
    for (let attempt = 0; attempt <= this.maxRetries; attempt += 1) {
      if (options.signal?.aborted) throw new JevError("\u5224\u5B9A\u5DF2\u88AB\u4E2D\u65AD\uFF08signal \u5DF2 abort\uFF09");
      this.requests += 1;
      try {
        const body = await this.#attempt(state, questions, ids, options);
        const usage = body?.usage ?? {};
        this.usage.input_tokens += Number(usage.input_tokens ?? 0);
        this.usage.output_tokens += Number(usage.output_tokens ?? 0);
        const answers = body?.answers;
        if (answers == null || typeof answers !== "object") throw new JevError("Jev \u54CD\u5E94\u7F3A\u5C11 answers");
        const out = {};
        for (const id of ids) {
          const value = answers[id]?.noul;
          if (typeof value !== "number" || !Number.isFinite(value)) continue;
          out[id] = value;
        }
        return out;
      } catch (error) {
        lastError = error;
        const retryable = error instanceof JevError ? error.retryable : true;
        if (!retryable || attempt === this.maxRetries || options.signal?.aborted) break;
        this.retries += 1;
        this.lastRetries += 1;
        await sleep(this.retryBaseMs * 2 ** attempt, options.signal);
      }
    }
    this.lastError = lastError?.message ?? String(lastError);
    throw lastError ?? new JevError("Jev \u8BF7\u6C42\u5931\u8D25\uFF08\u672A\u77E5\u539F\u56E0\uFF09");
  }
  /**
   * 把问题按 state 占用切成能装进单次请求的批。
   * @param {string} state
   * @param {Record<string,string>} questions
   * @param {{maxRequestTokens:number, overheadTokens:number}} limits
   * @returns {Array<Record<string,string>>}
   */
  batch(state, questions, limits) {
    const stateTokens = estimateTokens(state);
    const budget = limits.maxRequestTokens - stateTokens - (limits.overheadTokens ?? 40);
    const batches = [];
    let current = {};
    let currentTokens = 0;
    for (const [id, text] of Object.entries(questions)) {
      const cost = estimateTokens(JSON.stringify({ [id]: { type: "noul", instructions: text } }));
      if (Object.keys(current).length > 0 && currentTokens + cost > budget) {
        batches.push(current);
        current = {};
        currentTokens = 0;
      }
      if (Object.keys(current).length === 0 && cost > budget) continue;
      current[id] = text;
      currentTokens += cost;
    }
    if (Object.keys(current).length > 0) batches.push(current);
    return batches;
  }
};

// prune.js
var JEV_PRUNE_MARKER = "\n[\u2026 Jev \u5224\u5B9A\u8BE5\u5DE5\u5177\u7ED3\u679C\u5DF2\u8FC7\u671F\uFF0C\u4E2D\u95F4\u5185\u5BB9\u5DF2\u88C1\u526A\uFF1B\u539F\u59CB\u4E8B\u4EF6\u4ECD\u5728\u4F1A\u8BDD\u65E5\u5FD7\u4E2D\uFF0C\u53EF\u91CD\u8DD1\u5DE5\u5177 \u2026]\n";
function countChars(blocks) {
  if (!Array.isArray(blocks)) return 0;
  let chars = 0;
  for (const block of blocks) {
    if (block?.type === "text" && typeof block.text === "string") chars += Array.from(block.text).length;
  }
  return chars;
}
function normalizeToolName(name3) {
  return String(name3 ?? "").trim().toLowerCase().replace(/[_-]/g, "");
}
function isToolIn(list, name3) {
  const needle = normalizeToolName(name3);
  if (needle.length === 0) return false;
  return (list ?? []).some((item) => normalizeToolName(item) === needle);
}
function cachedVerdictForEvent(cache, event) {
  if (cache == null || event == null) return null;
  const direct = cache.get(event.seq);
  if (direct != null) return direct;
  for (const seq of event.sourceEventSeqs ?? []) {
    const inherited = cache.get(seq);
    if (inherited != null) return inherited;
  }
  return null;
}
function sliceWithBudget(blocks, headChars, tailChars, marker, minGain = 40) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;
  const totalChars = countChars(blocks);
  const overhead = Array.from(marker).length;
  if (totalChars - (headChars + tailChars) < Math.max(minGain, overhead)) return null;
  const removedStart = headChars;
  const removedEnd = totalChars - tailChars;
  const out = [];
  let consumed = 0;
  let markerInserted = false;
  for (const block of blocks) {
    if (block?.type !== "text" || typeof block.text !== "string") {
      out.push(block);
      continue;
    }
    const points = Array.from(block.text);
    const blockStart = consumed;
    const blockEnd = blockStart + points.length;
    const headEnd = Math.min(points.length, Math.max(0, removedStart - blockStart));
    const tailStart = Math.min(points.length, Math.max(0, removedEnd - blockStart));
    const intersects = blockStart < removedEnd && blockEnd > removedStart;
    const useMarker = intersects && !markerInserted ? marker : "";
    if (useMarker.length > 0) markerInserted = true;
    const text = points.slice(0, headEnd).join("") + useMarker + points.slice(tailStart).join("");
    if (text.length > 0) out.push({ ...block, text });
    consumed = blockEnd;
  }
  if (!markerInserted) return null;
  const after = countChars(out);
  if (after >= totalChars) return null;
  return out;
}
function parseLimit(raw) {
  const text = String(raw).trim();
  if (text.endsWith("%")) {
    const value2 = Number(text.slice(0, -1));
    if (!Number.isFinite(value2) || value2 <= 0 || value2 > 100) throw new Error(`invalid limit ${raw}`);
    return { kind: "ratio", value: value2 / 100 };
  }
  const value = Number(text);
  if (!Number.isFinite(value) || value <= 0) throw new Error(`invalid limit ${raw}`);
  return { kind: "tokens", value };
}
function decideAction({ inTail, tool, neverPruneTools, verdict, charsBefore, minCharsToPrune }) {
  if (inTail) return "keep";
  if (isToolIn(neverPruneTools, tool)) return "keep";
  if (verdict == null) return "fallback";
  if (verdict.keep) return "keep";
  if (charsBefore < minCharsToPrune) return "keep";
  return "prune";
}
function planTrims(nodes, cfg = {}) {
  if ((cfg.keepMode ?? "absolute") !== "budget") return null;
  const keepCeiling = cfg.keepThreshold ?? 0.5;
  const floor = cfg.keepFloorThreshold ?? 0.2;
  const minCandidates = cfg.minCandidatesForBudget ?? 4;
  const minGain = cfg.minGainChars ?? 40;
  const ratio = Math.min(1, Math.max(0, Number(cfg.pressureRatio) || 0));
  const eligible = nodes.filter((n) => !n.inTail && !n.blacklisted && !n.alreadyPruned && n.verdict != null && n.gain >= minGain && n.chars >= (cfg.minCharsToPrune ?? 400));
  const ceilingProtected = eligible.filter((n) => typeof n.prob === "number" && n.prob >= keepCeiling);
  const pool = eligible.filter((n) => typeof n.prob === "number" && n.prob < keepCeiling);
  if (pool.length === 0) {
    return { mode: "budget", selected: [], budget: 0, spent: 0, poolSize: 0, keptByCeiling: ceilingProtected.length, ratio, note: "\u65E0\u53EF\u88C1\u5019\u9009\uFF08\u5168\u90E8\u843D\u5728\u4FDD\u62A4\u4E0A\u9650\u4E4B\u4E0A\u6216\u4E0D\u53EF\u88C1\uFF09" };
  }
  if (pool.length < minCandidates) {
    const selected2 = pool.filter((n) => n.prob < floor).map((n) => n.seq);
    const spent2 = pool.filter((n) => n.prob < floor).reduce((s, n) => s + n.gain, 0);
    return {
      mode: "floor",
      selected: selected2,
      budget: 0,
      spent: spent2,
      poolSize: pool.length,
      keptByCeiling: ceilingProtected.length,
      ratio,
      note: `\u5019\u9009\u4EC5 ${pool.length} \u6761\uFF08< ${minCandidates}\uFF09\u2192 \u964D\u7EA7\u7EDD\u5BF9\u4E0B\u9650\uFF1A\u53EA\u88C1 prob < ${floor} \u7684 ${selected2.length} \u6761`
    };
  }
  const totalGain = pool.reduce((s, n) => s + n.gain, 0);
  const budget = ratio * totalGain;
  if (!(budget > 0)) {
    return { mode: "budget", selected: [], budget: 0, spent: 0, poolSize: pool.length, keptByCeiling: ceilingProtected.length, ratio, note: `\u538B\u529B\u7F3A\u53E3\u4E3A 0\uFF08ratio=${ratio}\uFF09\u2192 \u4E0D\u88C1` };
  }
  const sorted = [...pool].sort((a, b) => a.prob - b.prob || a.seq - b.seq);
  const selected = [];
  let spent = 0;
  for (const node of sorted) {
    if (spent >= budget) break;
    selected.push(node.seq);
    spent += node.gain;
  }
  return {
    mode: "budget",
    selected,
    budget,
    spent,
    poolSize: pool.length,
    keptByCeiling: ceilingProtected.length,
    ratio,
    note: `\u538B\u529B\u5206\u4F4D ${(ratio * 100).toFixed(1)}%\uFF08\u9884\u7B97 ${Math.round(budget)} \u5B57\u7B26\uFF09\u2192 \u4ECE ${pool.length} \u6761\u5019\u9009\u4E2D\u6309\u6982\u7387\u5347\u5E8F\u88C1 ${selected.length} \u6761\uFF0C\u7701 ${spent}`
  };
}
function pruneSessionWithJev({ pruner, session, cache, cfg, stats, freeze, toolNameOf: toolNameOf2, callIdOf: callIdOf2 }) {
  const surface = [...session.surface.nodes];
  const lastAllowed = surface.length - 1 - cfg.preserveRecent;
  const pruned = [];
  let charsRemoved = 0;
  const nodes = [];
  for (let index = 0; index < surface.length; index += 1) {
    const seq = surface[index];
    const event = session.eventAt(seq);
    if (event?.type !== "tool/result") continue;
    const original = session.deriveEventMessage(event);
    const result = original?.content?.[0];
    const wrapped = result?.type === "tool-result";
    const blocks = wrapped ? result.content : original?.content;
    if (!Array.isArray(blocks)) continue;
    const chars = countChars(blocks);
    const marker = Array.from(cfg.marker ?? JEV_PRUNE_MARKER).length;
    const gain = chars - (cfg.headChars + cfg.tailChars) - marker;
    const tool = toolNameOf2(event);
    const verdict = cachedVerdictForEvent(cache, event);
    const alreadyPruned = Array.isArray(blocks) && blocks.some(
      (block) => typeof block?.text === "string" && block.text.includes(cfg.marker ?? JEV_PRUNE_MARKER)
    );
    nodes.push({
      seq,
      index,
      event,
      original,
      result,
      wrapped,
      blocks,
      chars,
      gain,
      tool,
      verdict,
      alreadyPruned,
      inTail: index > lastAllowed,
      blacklisted: isToolIn(cfg.neverPruneTools, tool),
      prob: typeof verdict?.prob === "number" ? verdict.prob : null,
      effectProb: typeof verdict?.effectProb === "number" ? verdict.effectProb : null
    });
  }
  const plan = planTrims(nodes, cfg);
  const planned = plan != null ? new Set(plan.selected) : null;
  const decisions = [];
  for (const node of nodes) {
    const { seq, index, event, original, result, blocks, chars, tool, verdict } = node;
    const charsBefore = chars;
    let action;
    let reason;
    if (node.inTail) {
      action = "keep";
      reason = "tail";
    } else if (node.blacklisted) {
      action = "keep";
      reason = "blacklist";
    } else if (node.alreadyPruned) {
      action = "keep";
      reason = "already-pruned";
    } else if (planned != null) {
      if (verdict == null) {
        action = "fallback";
        reason = "no-verdict-fallback";
      } else if (charsBefore < (cfg.minCharsToPrune ?? 400)) {
        action = "keep";
        reason = "too-short";
      } else if (node.gain < (cfg.minGainChars ?? 40)) {
        action = "keep";
        reason = "no-gain";
      } else if (planned.has(seq)) {
        action = "prune";
        reason = `selected(${plan.mode})`;
      } else if (typeof node.prob === "number" && node.prob >= (cfg.keepThreshold ?? 0.5)) {
        action = "keep";
        reason = "keep-ceiling";
      } else {
        action = "keep";
        reason = "budget-exhausted";
      }
    } else {
      action = decideAction({
        inTail: index > lastAllowed,
        tool,
        neverPruneTools: cfg.neverPruneTools,
        verdict,
        charsBefore,
        minCharsToPrune: cfg.minCharsToPrune
      });
      reason = action === "keep" ? index > lastAllowed ? "tail" : isToolIn(cfg.neverPruneTools, tool) ? "blacklist" : verdict?.keep ? "verdict-keep" : "short-or-unknown" : action === "fallback" ? "no-verdict-fallback" : "verdict-prune";
    }
    if (cfg.earlyPrune && action === "fallback") {
      action = "keep";
      reason = "no-verdict";
    }
    if (action === "keep") {
      if (index > lastAllowed) stats.keptByTail += 1;
      else if (isToolIn(cfg.neverPruneTools, tool)) stats.keptByBlacklist += 1;
      else if (node.alreadyPruned) {
      } else if (verdict?.keep) stats.keptByJev += 1;
      else if (planned != null) stats.keptByBudget = (stats.keptByBudget ?? 0) + 1;
    }
    let content = null;
    if (action === "prune") {
      content = sliceWithBudget(blocks, cfg.headChars, cfg.tailChars, cfg.marker ?? JEV_PRUNE_MARKER);
      if (content != null) stats.prunedByJev += 1;
    } else if (action === "fallback") {
      content = pruner.pruneContent(blocks);
      if (content != null) stats.prunedByVolume += 1;
    }
    if (content == null) {
      decisions.push({ seq, tool, chars: charsBefore, gain: node.gain, prob: node.prob, effectProb: node.effectProb, action, reason, applied: false });
      continue;
    }
    const charsAfter = countChars(content);
    if (charsAfter >= charsBefore) {
      decisions.push({ seq, tool, chars: charsBefore, gain: node.gain, prob: node.prob, effectProb: node.effectProb, action, reason: `${reason}/no-shrink`, applied: false });
      continue;
    }
    decisions.push({ seq, tool, chars: charsBefore, charsAfter, gain: charsBefore - charsAfter, prob: node.prob, effectProb: node.effectProb, action, reason, applied: true });
    if (cfg.dryRun) {
      charsRemoved += charsBefore - charsAfter;
      continue;
    }
    const message = freeze({ ...original, content: node.wrapped ? [{ ...result, content }] : content });
    appendShadowPrice({ pruner, session, seq, original });
    const replacement = session.append(
      "tool/result",
      { ...event.data, message },
      { surfaceOp: { op: "replace", startSeq: seq, endSeq: seq }, sourceEventSeqs: [seq] }
    );
    pruned.push({
      originalSeq: seq,
      replacementSeq: replacement?.seq ?? null,
      callId: callIdOf2(event),
      charsBefore,
      charsAfter
    });
    charsRemoved += charsBefore - charsAfter;
  }
  stats.savedChars += charsRemoved;
  if (plan != null) stats.lastBudget = plan;
  return { pruned, charsRemoved, plan, decisions };
}
function appendShadowPrice({ pruner, session, seq, original }) {
  let tokens = 0;
  try {
    tokens = pruner.ctx?.tokenMeter?.estimateMessage?.(original) ?? 0;
  } catch {
    tokens = 0;
  }
  session.append("compaction/prune", {
    shadowedRange: { start: seq, end: seq },
    shadowedSeqs: [seq],
    shadowedTokenCount: tokens
  });
}

// receipt.js
var RECEIPT_MARKER = "[\u5DF2\u538B\u7F29 \xB7 \u786E\u5B9A\u6027\u56DE\u6267]";
var DSH_READONLY_TOOLS = [
  "read",
  "view",
  "cat",
  "glob",
  "grep",
  "list",
  "ls",
  "search",
  "find",
  "tree",
  "stat",
  "fetch",
  "websearch",
  "web_search",
  "getcontent",
  "getchilditem",
  "getitem",
  "selectstring",
  "testpath",
  "measureobject",
  "resolvepath"
];
var DEFAULT_COMPACT_TOOLS = [...DSH_READONLY_TOOLS];
var DEFAULT_MIN_CANDIDATES_FOR_RELATIVE = 4;
var DEFAULT_FLOOR_THRESHOLD = 0.2;
var DEFAULT_MIN_CANDIDATES_FOR_FLOOR = 2;
function resultEvidenceText(eventAt, startSeq) {
  const pending = [startSeq];
  const seen = /* @__PURE__ */ new Set();
  const texts = [];
  while (pending.length > 0) {
    const seq = pending.pop();
    if (seen.has(seq)) continue;
    seen.add(seq);
    const event = eventAt(seq);
    if (event == null) continue;
    if (event.type === "tool/result") texts.push(resultText(event));
    for (const sourceSeq of event.sourceEventSeqs ?? []) pending.push(sourceSeq);
  }
  return texts.join("\n");
}
var DEFAULT_NEVER_COMPACT_TOOLS = [
  "Edit",
  "Write",
  "MultiEdit",
  "ApplyPatch",
  "NotebookEdit",
  "str_replace_editor",
  "str_replace_based_edit_tool",
  "apply_patch"
];
var DEFAULT_NEVER_PRUNE_TOOLS = ["Write", "NotebookEdit"];
var DEFAULT_EVIDENCE_PATTERNS = [
  "error",
  "exception",
  "traceback",
  "stack trace",
  "assertion",
  "failed",
  "fail:",
  "panic",
  "unexpected",
  "mismatch",
  "todo",
  "fixme",
  "bug"
];
function eventDelta(event) {
  if (event?.type === "assistant/message") {
    const content = event.data?.message?.content;
    if (!Array.isArray(content)) return 0;
    return content.filter((block) => block?.type === "tool-call").length;
  }
  if (event?.type === "tool/result") return -1;
  return 0;
}
function computeCuts(surface, eventAt) {
  const cuts = [{ balanced: true, inProgress: 0 }];
  let inProgress = 0;
  for (const seq of surface) {
    const event = eventAt(seq);
    if (event == null || event.seq !== seq) {
      throw new Error(`tool-pairing: surface seq ${seq} \u6CA1\u6709\u5BF9\u5E94\u7684\u4F1A\u8BDD\u4E8B\u4EF6\uFF08surface \u635F\u574F\uFF09`);
    }
    inProgress += eventDelta(event);
    if (inProgress < 0) {
      throw new Error(`tool-pairing: surface seq ${seq} \u7684 tool/result \u6CA1\u6709\u5BF9\u5E94\u7684 tool-call\uFF08surface \u635F\u574F\uFF09`);
    }
    cuts.push({ balanced: inProgress === 0, inProgress });
  }
  return cuts;
}
function balancedBefore(cuts, index) {
  return cuts[index]?.balanced === true;
}
function balancedAfter(cuts, index) {
  return cuts[index + 1]?.balanced === true;
}
function toolCallsOf(event) {
  if (event?.type !== "assistant/message") return [];
  const content = event.data?.message?.content;
  if (!Array.isArray(content)) return [];
  return content.filter((block) => block?.type === "tool-call");
}
function toolCallIdOf(block) {
  return block?.id ?? block?.callId ?? block?.toolCallId ?? null;
}
function resultCallIdOf(event) {
  return event?.data?.message?.source?.callId ?? event?.data?.callId ?? null;
}
function assistantBlockChars(event) {
  const content = event.data?.message?.content;
  if (!Array.isArray(content)) return { text: 0, reasoning: 0 };
  let text = 0;
  let reasoning = 0;
  for (const block of content) {
    if (typeof block?.text !== "string") continue;
    const chars = Array.from(block.text).length;
    if (block.type === "text") text += chars;
    else if (block.type === "reasoning") reasoning += chars;
  }
  return { text, reasoning };
}
var ARG_PRIORITY = ["command", "file_path", "notebook_path", "pattern", "query", "path", "url", "glob"];
var ARG_IGNORED = /* @__PURE__ */ new Set(["content", "old_string", "new_string", "prompt", "description"]);
var ARG_SECONDARY_MAX_CHARS = 40;
function renderCallArgs(block, maxChars = 120) {
  let args = block?.arguments;
  if (typeof args === "string") {
    try {
      args = JSON.parse(args);
    } catch {
      return clip(args, maxChars);
    }
  }
  if (args == null) return "";
  if (typeof args !== "object") return clip(String(args), maxChars);
  const parts = [];
  const used = /* @__PURE__ */ new Set();
  for (const key of ARG_PRIORITY) {
    if (args[key] == null) continue;
    parts.push(String(args[key]));
    used.add(key);
    if (parts.length >= 3) break;
  }
  if (parts.length < 3) {
    for (const [key, value] of Object.entries(args)) {
      if (used.has(key) || ARG_IGNORED.has(key) || value == null) continue;
      const text = String(value);
      if (text.length > ARG_SECONDARY_MAX_CHARS) continue;
      parts.push(`${key}=${text}`);
      if (parts.length >= 3) break;
    }
  }
  if (parts.length === 0) {
    return clip(JSON.stringify(args), maxChars);
  }
  return clip(parts.join(" "), maxChars);
}
function clip(text, maxChars) {
  const value = String(text ?? "").replace(/\s+/g, " ").trim();
  const points = Array.from(value);
  if (points.length <= maxChars) return value;
  return `${points.slice(0, maxChars).join("")}\u2026`;
}
function scanEvidence(text, patterns) {
  const haystack = String(text ?? "");
  const matches = [];
  for (const pattern of patterns ?? []) {
    const needle = String(pattern).toLowerCase();
    if (needle.length === 0) continue;
    const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const atSegmentStart = new RegExp(`(?<=^|[^A-Za-z0-9])${escaped}`, "i");
    const camelFirst = escaped.charAt(0).toUpperCase() + escaped.slice(1);
    const atCamelBoundary = new RegExp(`(?<=[a-z])${camelFirst}`);
    if (atSegmentStart.test(haystack) || atCamelBoundary.test(haystack)) matches.push(needle);
  }
  return { hit: matches.length > 0, matches };
}
function computeEligibleSeqs(verdicts, {
  quantile,
  minCandidates,
  // ⚠️ 必须引用导出常量，不能写字面量。此前这里是硬编码的 `3` / `0.2`，
  // 于是改 DEFAULT_MIN_CANDIDATES_FOR_FLOOR 时**这个函数的默认值不会跟着变** ——
  // 插件实体走 resolveConfig（读常量，行为会变），而直接调本函数的地方（含 check.js）
  // 吃的是旧字面量，两边悄悄分叉。实测：常量改成 2 后 check.js 仍全绿，
  // 因为它绕开了配置路径，测的是另一个数。
  minCandidatesForAbsolute = DEFAULT_MIN_CANDIDATES_FOR_FLOOR,
  floorThreshold = DEFAULT_FLOOR_THRESHOLD,
  onNote
} = {}) {
  if (!Number.isFinite(quantile) || quantile < 0 || quantile > 1) {
    throw new Error(`compactQuantile \u975E\u6CD5\uFF1A${quantile}\uFF08\u5FC5\u987B\u662F 0~1 \u7684\u6709\u9650\u6570\u503C\uFF1B\u914D\u7F6E\u7559\u7A7A/\u89E3\u6790\u6210 null \u90FD\u4F1A\u8D70\u5230\u8FD9\u91CC\uFF09`);
  }
  if (quantile === 0) {
    onNote?.("compactQuantile=0 \u2192 \u76F8\u5BF9\u5206\u4F4D\u9009\u62E9\u5DF2\u663E\u5F0F\u5173\u95ED");
    return /* @__PURE__ */ new Set();
  }
  const usable = (verdicts ?? []).filter(
    // 必须用 Number.isFinite：typeof NaN === 'number'，用 typeof 会让 NaN 混进总体，
    // 而排序比较 (a-b) 返回 NaN 时被 V8 当作"相等"不换位 → NaN 项按**数组位置**
    // 混进尾部，可能被选中做整对移出。口径与上面的 quantile 校验统一。
    (v) => Number.isFinite(v?.prob) && Number.isFinite(v?.effectProb)
  );
  if (usable.length === 0) return /* @__PURE__ */ new Set();
  if (usable.length < Math.max(2, minCandidates ?? 4)) {
    if (usable.length < Math.max(1, minCandidatesForAbsolute)) {
      onNote?.(`\u603B\u4F53\u4EC5 ${usable.length} \u6761\uFF0C\u4F4E\u4E8E\u7EDD\u5BF9\u4E0B\u9650\u6A21\u5F0F\u7684\u6700\u4F4E\u6837\u672C ${minCandidatesForAbsolute} \u2192 \u4E0D\u505A\u6574\u5BF9\u79FB\u51FA`);
      return /* @__PURE__ */ new Set();
    }
    const floor2 = usable.filter((v) => v.prob < floorThreshold && v.effectProb < floorThreshold);
    onNote?.(`\u603B\u4F53\u4EC5 ${usable.length} \u6761\uFF08< ${minCandidates}\uFF09\u2192 \u964D\u7EA7\u4E3A\u7EDD\u5BF9\u4E0B\u9650\u6A21\u5F0F\uFF1A\u8981\u6C42\u4E24\u8F74\u540C\u65F6 < ${floorThreshold}\uFF0C\u547D\u4E2D ${floor2.length}/${usable.length} \u6761`);
    return new Set(floor2.map((v) => v.seq));
  }
  const take = Math.max(1, Math.floor(usable.length * quantile));
  const tailOf = (key) => new Set(
    [...usable].sort((a, b) => a[key] - b[key] || a.seq - b.seq).slice(0, take).map((v) => v.seq)
  );
  const byResult = tailOf("prob");
  const byEffect = tailOf("effectProb");
  const intersection = new Set([...byResult].filter((seq) => byEffect.has(seq)));
  if (intersection.size > 0) return intersection;
  const floor = usable.filter((v) => v.prob < floorThreshold && v.effectProb < floorThreshold);
  onNote?.(`\u4E24\u8F74\u5C3E\u90E8\u4EA4\u96C6\u4E3A\u7A7A \u2192 \u964D\u7EA7\u4E3A\u7EDD\u5BF9\u4E0B\u9650\u6A21\u5F0F\uFF1A\u8981\u6C42\u4E24\u8F74\u540C\u65F6 < ${floorThreshold}\uFF0C\u547D\u4E2D ${floor.length}/${usable.length} \u6761`);
  return new Set(floor.map((v) => v.seq));
}
function readStep(surface, eventAt, headIdx) {
  const headSeq = surface[headIdx];
  const head = eventAt(headSeq);
  const calls = toolCallsOf(head);
  if (calls.length === 0) return null;
  const resultIdx = [];
  for (let offset = 1; offset <= calls.length; offset += 1) {
    const idx = headIdx + offset;
    if (idx >= surface.length) return { headIdx, headSeq, head, calls, resultIdx, complete: false };
    if (eventAt(surface[idx])?.type !== "tool/result") {
      return { headIdx, headSeq, head, calls, resultIdx, complete: false };
    }
    resultIdx.push(idx);
  }
  const callIds = calls.map(toolCallIdOf);
  const resultIds = resultIdx.map((idx) => resultCallIdOf(eventAt(surface[idx])));
  const anyId = [...callIds, ...resultIds].some((id) => id != null);
  let pairedResultIdx = [...resultIdx];
  if (anyId) {
    if (callIds.some((id) => id == null) || resultIds.some((id) => id == null) || new Set(callIds).size !== callIds.length || new Set(resultIds).size !== resultIds.length) {
      return { headIdx, headSeq, head, calls, resultIdx, pairedResultIdx: [], complete: false };
    }
    const resultByCallId = new Map(resultIds.map((id, offset) => [id, resultIdx[offset]]));
    pairedResultIdx = callIds.map((id) => resultByCallId.get(id));
    if (pairedResultIdx.some((idx) => idx == null)) {
      return { headIdx, headSeq, head, calls, resultIdx, pairedResultIdx: [], complete: false };
    }
  }
  return { headIdx, headSeq, head, calls, resultIdx, pairedResultIdx, complete: true };
}
function selectReceiptRanges({ surface, eventAt, cache, dropVerdict, cfg }) {
  const stats = {
    scanned: 0,
    steps: 0,
    eligibleSteps: 0,
    skippedTail: 0,
    skippedTool: 0,
    /**
     * 被工具规则排除的**调用名统计**。
     *
     * 为什么必须记这个：第二层用的是**白名单**，一旦真实工具名与默认白名单对不上
     * （各宿主的命名风格差很多：Read / read / fs_read / Get-Content…），
     * 整个功能会**静默地永不触发**——第一层用黑名单所以一直没暴露这个问题。
     * 把名字如实统计出来并上报，才能一眼看出"是白名单没配上"而不是"模型判断不对"。
     */
    blockedToolNames: {},
    allowedToolNames: {},
    skippedToolUnknown: 0,
    skippedVerdict: 0,
    skippedGuard: 0,
    /** 用户可见文本过长的步骤数（text 轴） */
    skippedText: 0,
    /** 思考草稿过长的步骤数（reasoning 轴）——与 skippedText 分开计数，
     *  否则排查时无法区分"是结论在守"还是"是草稿在守"（issue #26） */
    skippedReasoning: 0,
    skippedIncomplete: 0,
    skippedShort: 0,
    /** 同一 assistant 批次里仅部分 result 合格时，安全降级为逐结果回执的批次数。 */
    partialSteps: 0,
    /** 逐结果回执实际选中的 tool/result 数。 */
    partialResults: 0,
    /** 已经是确定性回执的结果，防止低阈值配置下重复压缩。 */
    skippedReceipt: 0,
    guardHits: []
  };
  const cuts = computeCuts(surface, eventAt);
  const lastAllowed = surface.length - 1 - cfg.preserveRecent;
  const steps = [];
  let index = 0;
  while (index < surface.length) {
    stats.scanned += 1;
    const step = readStep(surface, eventAt, index);
    if (step == null) {
      index += 1;
      continue;
    }
    stats.steps += 1;
    steps.push(step);
    index = step.resultIdx.length > 0 ? step.resultIdx[step.resultIdx.length - 1] + 1 : index + 1;
  }
  const eligible = [];
  const partial = [];
  for (const step of steps) {
    const lastResultIdx = step.resultIdx[step.resultIdx.length - 1] ?? step.headIdx;
    const resultSeqs = (step.pairedResultIdx ?? step.resultIdx).map((idx) => surface[idx]);
    let reason = null;
    if (!step.complete) reason = "incomplete";
    else if (!balancedBefore(cuts, step.headIdx) || !balancedAfter(cuts, lastResultIdx)) reason = "incomplete";
    else {
      const { text, reasoning } = assistantBlockChars(step.head);
      if (text > cfg.maxStepTextChars) reason = "text";
      else if (reasoning > cfg.maxStepReasoningChars) reason = "reasoning";
    }
    let hits = [];
    const pairs = reason == null ? step.calls.map((call, offset) => {
      const resultIdx = (step.pairedResultIdx ?? step.resultIdx)[offset];
      const seq = surface[resultIdx];
      const event = eventAt(seq);
      let pairReason = null;
      if (resultIdx > lastAllowed) pairReason = "tail";
      else if (cfg.compactTools.length > 0 && !isToolIn(cfg.compactTools, call.name) || isToolIn(cfg.neverCompactTools, call.name)) pairReason = "tool";
      else if (resultText(event).includes(RECEIPT_MARKER)) pairReason = "receipt";
      else {
        const verdict = cachedVerdictForEvent(cache, event);
        if (verdict == null || !dropVerdict(seq, verdict)) pairReason = "verdict";
      }
      let pairHits = [];
      if (pairReason == null && cfg.evidenceGuard) {
        const scan = scanEvidence(resultEvidenceText(eventAt, seq), cfg.evidencePatterns);
        if (scan.hit) {
          pairHits = scan.matches;
          pairReason = "guard";
        }
      }
      return { call, resultIdx, seq, event, chars: resultCharsOf(event), reason: pairReason, hits: pairHits };
    }) : [];
    if (reason == null) {
      const selected = pairs.filter((pair) => pair.reason == null);
      const rejected = pairs.filter((pair) => pair.reason != null);
      if (selected.length === pairs.length && step.headIdx <= lastAllowed) {
      } else if (selected.length > 0) {
        const selectedInSurfaceOrder = [...selected].sort((a, b) => a.resultIdx - b.resultIdx);
        const selectedStep = {
          ...step,
          calls: selectedInSurfaceOrder.map((pair) => pair.call),
          resultIdx: selectedInSurfaceOrder.map((pair) => pair.resultIdx),
          resultSeqs: selectedInSurfaceOrder.map((pair) => pair.seq),
          pairs: selectedInSurfaceOrder,
          lastResultIdx: selectedInSurfaceOrder[selectedInSurfaceOrder.length - 1].resultIdx
        };
        const chars = selected.reduce((sum, pair) => sum + pair.chars, 0);
        partial.push({
          kind: "partial",
          startIdx: selectedInSurfaceOrder[0].resultIdx,
          endIdx: selectedInSurfaceOrder[selectedInSurfaceOrder.length - 1].resultIdx,
          start: selectedInSurfaceOrder[0].seq,
          end: selectedInSurfaceOrder[selectedInSurfaceOrder.length - 1].seq,
          steps: [selectedStep],
          chars
        });
        stats.eligibleSteps += 1;
        stats.partialSteps += 1;
        stats.partialResults += selected.length;
        for (const pair of selected) {
          const name3 = pair.call.name ?? "unknown";
          stats.allowedToolNames[name3] = (stats.allowedToolNames[name3] ?? 0) + 1;
        }
        for (const pair of rejected) {
          if (pair.reason === "tail") stats.skippedTail += 1;
          else if (pair.reason === "verdict") stats.skippedVerdict += 1;
          else if (pair.reason === "guard") {
            stats.skippedGuard += 1;
            stats.guardHits.push({ headSeq: step.headSeq, resultSeq: pair.seq, matches: pair.hits });
          } else if (pair.reason === "receipt") stats.skippedReceipt += 1;
          else if (pair.reason === "tool") {
            stats.skippedTool += 1;
            const name3 = pair.call.name ?? "unknown";
            if (name3 === "unknown" || name3 === "") stats.skippedToolUnknown += 1;
            stats.blockedToolNames[name3] = (stats.blockedToolNames[name3] ?? 0) + 1;
          }
        }
        continue;
      } else {
        reason = pairs[0]?.reason ?? (step.headIdx > lastAllowed ? "tail" : "verdict");
        hits = pairs.find((pair) => pair.reason === "guard")?.hits ?? [];
      }
    }
    if (reason != null) {
      if (reason === "tail") stats.skippedTail += 1;
      else if (reason === "tool") {
        stats.skippedTool += 1;
        const offending = cfg.compactTools.length > 0 ? step.calls.filter((call) => !isToolIn(cfg.compactTools, call.name)) : step.calls.filter((call) => isToolIn(cfg.neverCompactTools, call.name));
        for (const call of offending) {
          const name3 = call.name ?? "unknown";
          if (name3 === "unknown" || name3 === "") stats.skippedToolUnknown += 1;
          stats.blockedToolNames[name3] = (stats.blockedToolNames[name3] ?? 0) + 1;
        }
      } else if (reason === "verdict") stats.skippedVerdict += 1;
      else if (reason === "receipt") stats.skippedReceipt += 1;
      else if (reason === "guard") {
        stats.skippedGuard += 1;
        stats.guardHits.push({ headSeq: step.headSeq, matches: hits });
      } else if (reason === "text") stats.skippedText += 1;
      else if (reason === "reasoning") stats.skippedReasoning += 1;
      else stats.skippedIncomplete += 1;
      continue;
    }
    stats.eligibleSteps += 1;
    for (const call of step.calls) {
      const name3 = call.name ?? "unknown";
      stats.allowedToolNames[name3] = (stats.allowedToolNames[name3] ?? 0) + 1;
    }
    eligible.push({
      kind: "full",
      ...step,
      resultSeqs,
      lastResultIdx,
      resultChars: resultSeqs.reduce((sum, seq) => sum + resultCharsOf(eventAt(seq)), 0),
      tools: step.calls.map((call) => call.name ?? "unknown")
    });
  }
  const merged = [];
  for (const step of eligible) {
    const previous = merged[merged.length - 1];
    if (previous != null && previous.endIdx + 1 === step.headIdx) {
      previous.steps.push(step);
      previous.endIdx = step.lastResultIdx;
      previous.end = surface[step.lastResultIdx];
      previous.chars += step.resultChars;
      continue;
    }
    merged.push({
      kind: "full",
      startIdx: step.headIdx,
      endIdx: step.lastResultIdx,
      start: surface[step.headIdx],
      end: surface[step.lastResultIdx],
      steps: [step],
      chars: step.resultChars
    });
  }
  const ranges = [];
  for (const range of [...merged, ...partial].sort((a, b) => a.startIdx - b.startIdx)) {
    if (range.chars < cfg.compactMinChars) {
      stats.skippedShort += 1;
      continue;
    }
    ranges.push(range);
  }
  return { ranges, stats };
}
function resultText(event) {
  const content = event?.data?.message?.content;
  if (!Array.isArray(content)) return "";
  const block = content.find((item) => item?.type === "tool-result");
  const inner = block?.content;
  if (!Array.isArray(inner)) return "";
  return inner.filter((item) => item?.type === "text" && typeof item.text === "string").map((item) => item.text).join("\n");
}
function resultCharsOf(event) {
  const content = event?.data?.message?.content;
  if (!Array.isArray(content)) return 0;
  const block = content.find((item) => item?.type === "tool-result");
  return countChars(block?.content);
}
function assistantVisibleText(event, maxChars) {
  if (maxChars <= 0) return "";
  const content = event?.data?.message?.content;
  if (!Array.isArray(content)) return "";
  const parts = [];
  for (const block of content) {
    if (block?.type !== "text" || typeof block.text !== "string") continue;
    parts.push(block.text);
  }
  const text = parts.join(" ").replace(/\s+/g, " ").trim();
  if (text.length === 0) return "";
  const chars = Array.from(text);
  return chars.length > maxChars ? `${chars.slice(0, maxChars).join("")}\u2026` : text;
}
function renderReceipt(range, { eventAt, argChars = 120, textChars = 400 } = {}) {
  const lines = [];
  const count = range.steps.reduce((sum, step) => sum + step.calls.length, 0);
  lines.push(
    `${RECEIPT_MARKER} \u539F\u5386\u53F2 s${range.start}\u2013s${range.end} \u662F ${count} \u6B21\u5DE5\u5177\u8C03\u7528\uFF08\u5171\u7EA6 ${range.chars} \u5B57\u7B26\u8F93\u51FA\uFF09\uFF0C\u4E3A\u91CA\u653E\u4E0A\u4E0B\u6587\u5DF2\u79FB\u51FA\u3002\u4EE5\u4E0B\u4E3A\u4E8B\u5B9E\u6E05\u5355\uFF08\u5DE5\u5177\u540D/\u5165\u53C2/\u5B57\u7B26\u6570/seq \u7531\u4EE3\u7801\u7B97\u51FA\uFF1B\u6A21\u578B\u539F\u8BDD\u4EC5\u4F5C\u539F\u6587\u6458\u5F55\uFF0C\u63D2\u4EF6\u4E0D\u65B0\u589E\u63A8\u65AD\uFF09\uFF1A`
  );
  for (const step of range.steps) {
    const said = assistantVisibleText(step.head, textChars);
    if (said) lines.push(`\xB7 s${step.headSeq} \u6A21\u578B\u539F\u8BDD\uFF08\u539F\u6587\u6458\u5F55\uFF09\uFF1A${said}`);
    step.calls.forEach((call, offset) => {
      const seq = step.resultSeqs[offset] ?? step.headSeq;
      const args = renderCallArgs(call, argChars);
      const chars = resultCharsOf(eventAt(step.resultSeqs[offset]));
      lines.push(`\xB7 s${seq} ${call.name ?? "unknown"}${args ? `\uFF1A${args}` : ""} \u2192 ${chars} \u5B57\u7B26\u8F93\u51FA`);
    });
  }
  lines.push(
    `\u539F\u59CB\u4E8B\u4EF6\u4ECD\u5B8C\u6574\u4FDD\u5B58\u5728\u4F1A\u8BDD\u65E5\u5FD7\u4E2D\uFF08seqs ${range.start}\u2013${range.end}\uFF09\u3002\u9700\u8981\u5185\u5BB9\u65F6\u91CD\u8DD1\u76F8\u540C\u547D\u4EE4/\u8BFB\u53D6\u76F8\u540C\u6587\u4EF6\u5373\u53EF\uFF1B\u672C\u56DE\u6267\u4E0D\u542B\u5BF9\u5185\u5BB9\u7684\u89E3\u91CA\u3002`
  );
  return lines.join("\n");
}
function renderPartialResultReceipt(pair, { argChars = 120 } = {}) {
  const call = pair?.call ?? {};
  const seq = pair?.seq ?? pair?.event?.seq ?? "?";
  const chars = resultCharsOf(pair?.event);
  const args = renderCallArgs(call, argChars);
  return `${RECEIPT_MARKER} s${seq} ${call.name ?? "unknown"}${args ? `\uFF1A${args}` : ""} \u7684 ${chars} \u5B57\u7B26\u8F93\u51FA\u5DF2\u4ECE\u5F53\u524D\u4E0A\u4E0B\u6587\u79FB\u51FA\uFF1B\u539F\u59CB\u4E8B\u4EF6\u4ECD\u4FDD\u5B58\u5728\u4F1A\u8BDD\u65E5\u5FD7\u4E2D\uFF0C\u9700\u8981\u5185\u5BB9\u65F6\u8BF7\u91CD\u8DD1\u76F8\u540C\u547D\u4EE4\u6216\u91CD\u65B0\u8BFB\u53D6\u76F8\u540C\u6587\u4EF6\u3002\u672C\u56DE\u6267\u4E0D\u542B\u5BF9\u5185\u5BB9\u7684\u89E3\u91CA\u3002`;
}

// state.js
var STATE_CONTEXT = "\u4E00\u4E2A\u7F16\u7801\u52A9\u624B\u7684\u5BF9\u8BDD\u6B63\u88AB\u538B\u7F29\u4EE5\u91CA\u653E\u4E0A\u4E0B\u6587\u3002history \u662F\u5F53\u524D\u6A21\u578B\u53EF\u89C1\u7684\u5168\u90E8\u5386\u53F2\uFF08surface\uFF09\uFF0C\u6700\u8001\u5728\u524D\uFF1B\u5DE5\u5177\u8F93\u51FA\u5DF2\u88AB\u66FF\u6362\u4E3A\u7B80\u77ED\u7684 result \u6CE8\u8BB0\u3002\u6BCF\u4E2A\u95EE\u9898\u95EE\u7684\u662F\uFF1A\u67D0\u4E00\u6B21\u5DE5\u5177\u8C03\u7528\u7684\u8F93\u51FA\uFF0C\u662F\u5426\u4ECD\u9700\u9010\u5B57\u7559\u5728\u5386\u53F2\u91CC\u3002\u6CA1\u88AB\u4FDD\u7559\u7684\u5185\u5BB9\u4F1A\u88AB\u88C1\u526A\uFF0C\u4F46\u52A9\u624B\u603B\u662F\u53EF\u4EE5\u91CD\u65B0\u8FD0\u884C\u5DE5\u5177\u6216\u91CD\u65B0\u8BFB\u53D6\u6587\u4EF6\u3002";
function blockText(block) {
  if (block == null || typeof block !== "object") return "";
  if (typeof block.text === "string") return block.text;
  if (block.type === "tool-call") {
    const args = typeof block.arguments === "string" ? block.arguments : JSON.stringify(block.arguments ?? {});
    return `[\u5DE5\u5177\u8C03\u7528] ${block.name ?? block.tool ?? "?"} ${args}`;
  }
  return "";
}
function contentOf(event) {
  if (event == null || typeof event !== "object") return null;
  if (event.type === "user/message") return event.data?.content ?? null;
  if (event.type === "assistant/message" || event.type === "tool/result") return event.data?.message?.content ?? null;
  return null;
}
function eventText(event) {
  if (event?.type === "compaction/summary") {
    const summary = event.data?.summary;
    if (typeof summary === "string") return summary;
    if (Array.isArray(summary)) return summary.map(blockText).join("\n");
  }
  if (event?.type === "tool/result") {
    const blocks = resultContent(event);
    if (!Array.isArray(blocks)) return "";
    return blocks.map(blockText).join("\n");
  }
  const content = contentOf(event);
  if (!Array.isArray(content)) return "";
  return content.map(blockText).join("\n");
}
function isCheckpointEvent(event) {
  return event?.type === "user/message" && event.data?.source?.kind === "plugin" && event.data.source.plugin === "compact";
}
function callIdOf(event) {
  return event?.data?.message?.source?.callId ?? event?.data?.callId ?? null;
}
function toolNameOf(event, nameByCallId) {
  const source = event?.data?.message?.source;
  const direct = source?.name ?? source?.tool ?? source?.toolName ?? event?.data?.name ?? event?.data?.tool;
  if (typeof direct === "string" && direct.length > 0) return direct;
  const callId = callIdOf(event);
  if (callId != null && nameByCallId?.has(callId)) return nameByCallId.get(callId);
  return "unknown";
}
function sessionEvents(session) {
  if (Array.isArray(session?.events)) return session.events;
  for (const method of ["snapshotEvents", "ownEvents"]) {
    if (typeof session?.[method] === "function") {
      try {
        const result = session[method]();
        if (Array.isArray(result)) return result;
      } catch {
      }
    }
  }
  const surface = session?.surface?.nodes;
  if (Array.isArray(surface) && typeof session?.eventAt === "function") {
    const out = [];
    for (const seq of surface) {
      const event = session.eventAt(seq);
      if (event != null) out.push(event);
    }
    return out;
  }
  return [];
}
function buildToolNameIndex(events) {
  const index = /* @__PURE__ */ new Map();
  for (const event of events) {
    if (event?.type !== "tool/call") continue;
    const id = event.data?.callId ?? event.data?.id;
    const name3 = event.data?.name ?? event.data?.tool;
    if (id != null && typeof name3 === "string" && name3.length > 0) index.set(id, name3);
  }
  for (const event of events) {
    const content = contentOf(event);
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      if (block?.type !== "tool-call") continue;
      const id = block.id ?? block.callId ?? block.toolCallId;
      const name3 = block.name ?? block.tool ?? block.toolName;
      if (id == null || typeof name3 !== "string" || name3.length === 0) continue;
      if (!index.has(id)) index.set(id, name3);
    }
  }
  return index;
}
function resultContent(event) {
  const block = firstResultBlock(event);
  return block?.content ?? (event?.type === "tool/result" ? contentOf(event) : null);
}
function firstResultBlock(event) {
  const content = contentOf(event);
  if (!Array.isArray(content)) return null;
  return content.find((block) => block?.type === "tool-result") ?? null;
}
function resultChars(event) {
  const blocks = resultContent(event);
  if (!Array.isArray(blocks)) return 0;
  let chars = 0;
  for (const block of blocks) {
    if (block?.type === "text" && typeof block.text === "string") chars += Array.from(block.text).length;
  }
  return chars;
}
function looksPruned(event, marker) {
  const blocks = resultContent(event);
  if (!Array.isArray(blocks)) return false;
  return blocks.some((block) => typeof block?.text === "string" && block.text.includes(marker));
}
function resultExcerpt(event, budget = 240) {
  if (!(budget > 0)) return "";
  const blocks = resultContent(event);
  if (!Array.isArray(blocks)) return "";
  const text = blocks.filter((block) => block?.type === "text" && typeof block.text === "string").map((block) => block.text).join("\n");
  if (text.trim().length === 0) return "";
  const lines = text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
  if (lines.length === 0) return "";
  const clip2 = (line, max = 120) => {
    const points = Array.from(line);
    return points.length <= max ? line : points.slice(0, max).join("") + "\u2026";
  };
  const escaped = DEFAULT_EVIDENCE_PATTERNS.map((p) => String(p).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const evidenceRe = new RegExp(escaped.join("|"), "i");
  const allCapsRe = /\b[A-Z][A-Z0-9_]{4,}\b/;
  const assignRe = /[\w.$-]+\s*[=:]\s*\S+/;
  const pathRe = /[\w./\\-]+\.(js|ts|mjs|cjs|json|py|go|rs|java|rb|md|conf|ini|cfg|log|ya?ml|toml|sql)\b/i;
  const metaRe = /^<\/?[a-z][a-z0-9-]*>?$|^<type>[^<]*<\/type>$|^<\/?(path|type|content)>/i;
  const scored = lines.map((line, idx) => {
    let score = 0.5;
    if (metaRe.test(line)) score = 0.2;
    else if (evidenceRe.test(line)) score = 4;
    else if (allCapsRe.test(line)) score = 3.5;
    else if (assignRe.test(line)) score = 3;
    else if (pathRe.test(line)) score = 2;
    if (idx === 0) score = Math.max(score, 1);
    if (idx === 1) score = Math.max(score, 0.8);
    if (idx === Math.floor(lines.length / 2)) score = Math.max(score, 1.5);
    return { line, idx, score };
  });
  const byScore = scored.slice().sort((a, b) => b.score - a.score || a.idx - b.idx).slice(0, 4);
  const allocated = /* @__PURE__ */ new Map();
  let budgetLeft = budget;
  for (const entry of byScore) {
    if (budgetLeft <= 0) break;
    const sepLen = allocated.size > 0 ? 3 : 0;
    const avail = budgetLeft - sepLen;
    if (avail < 2) break;
    const clipped = clip2(entry.line);
    const points = Array.from(clipped);
    if (points.length <= avail) {
      allocated.set(entry.idx, clipped);
      budgetLeft = avail - points.length;
    } else {
      allocated.set(entry.idx, points.slice(0, avail - 1).join("") + "\u2026");
      budgetLeft = 0;
    }
  }
  const picked = [...allocated.entries()].sort((a, b) => a[0] - b[0]).map(([, t]) => t);
  if (picked.length === 0) return "";
  return picked.join(" | ");
}
function recentGoal(events, limit = 3, maxChars = 500) {
  const picked = [];
  for (const event of events) {
    if (event?.type !== "user/message") continue;
    if (isCheckpointEvent(event)) continue;
    if (event.data?.source?.kind !== "user" && event.data?.source?.kind != null) continue;
    const content = contentOf(event);
    if (!Array.isArray(content)) continue;
    const text = content.filter((b) => b?.type === "text").map((b) => b.text).join(" ").trim();
    if (text.length > 0) picked.push(text.slice(0, maxChars));
  }
  if (picked.length === 0) return "";
  return picked.slice(-limit).join("\n");
}
function selectCandidates({ surface, eventAt, events, preserveRecent, neverPruneTools, marker, nameByCallId, includePruned = false }) {
  const lastAllowed = surface.length - 1 - preserveRecent;
  const out = [];
  for (let index = 0; index <= lastAllowed; index += 1) {
    const seq = surface[index];
    const event = eventAt(seq);
    if (event?.type !== "tool/result") continue;
    if (!includePruned && looksPruned(event, marker)) continue;
    const tool = toolNameOf(event, nameByCallId);
    if (isToolIn(neverPruneTools, tool)) continue;
    out.push({ seq, index, chars: resultChars(event), callId: callIdOf(event), tool });
  }
  return out;
}
function questionsFor(candidates, wording = "goal") {
  const out = {};
  for (const candidate of candidates) {
    out[`result_s${candidate.seq}`] = phrase(candidate, wording);
    out[`effect_s${candidate.seq}`] = effectPhrase(candidate, wording);
  }
  return out;
}
function phrase(c, wording) {
  if (wording === "legacy") {
    return `\u7B2C s${c.seq} \u53F7\u5DE5\u5177\u7ED3\u679C\uFF08${c.tool}\uFF0C\u7EA6 ${c.chars} \u5B57\u7B26\uFF09\u5E94\u5F53\u9010\u5B57\u7559\u5728\u5386\u53F2\u91CC\uFF1A\u52A9\u624B\u63A5\u4E0B\u6765\u7684\u52A8\u4F5C\u4ECD\u7136\u9700\u8981\u5B83\u7684\u5185\u5BB9\uFF0C\u4E14\u91CD\u8DD1\u4E00\u6B21\u8BE5\u5DE5\u5177\u65E0\u6CD5\u66FF\u4EE3\u3002`;
  }
  if (wording === "contrast") {
    return `\u5728\u672C\u6B21\u4F1A\u8BDD\u7684\u6240\u6709\u5DE5\u5177\u7ED3\u679C\u4E2D\uFF0C\u7B2C s${c.seq} \u53F7\uFF08${c.tool}\uFF09\u5C5E\u4E8E"\u7ED3\u8BBA\u5DF2\u7ECF\u88AB\u522B\u5904\u8BB0\u5F55\u4E0B\u6765\u3001\u53EF\u4EE5\u5B89\u5168\u4E22\u5F03"\u7684\u90A3\u4E00\u7C7B\u3002`;
  }
  if (wording === "consequence") {
    return `\u7B2C s${c.seq} \u53F7\u5DE5\u5177\u7ED3\u679C\uFF08${c.tool}\uFF09\u88AB\u88C1\u6389\u540E\uFF0C\u52A9\u624B\u5728\u5B8C\u6210\u5F53\u524D\u4EFB\u52A1\u65F6\u4F1A\u7F3A\u5C11\u5FC5\u8981\u7684\u4FE1\u606F\uFF0C\u4E14\u65E0\u6CD5\u901A\u8FC7\u91CD\u8DD1\u8BE5\u5DE5\u5177\u5EC9\u4EF7\u5730\u62FF\u56DE\u6765\u3002`;
  }
  return `\u7B2C s${c.seq} \u53F7\u5DE5\u5177\u7ED3\u679C\uFF08${c.tool}\uFF09\uFF1A\u5728\u3010\u4EFB\u52A1\u76EE\u6807\u3011\u63A5\u4E0B\u6765\u8FD8\u8981\u8FDB\u884C\u7684\u6B65\u9AA4\u91CC\uFF0C\u52A9\u624B\u4ECD\u9700\u8981\u76F4\u63A5\u5F15\u7528\u5B83\u7684\u5185\u5BB9\uFF0C\u91CD\u8DD1\u8BE5\u5DE5\u5177\u4E0D\u80FD\u66FF\u4EE3\u3002`;
}
function effectPhrase(c, wording) {
  if (wording === "legacy" || wording === "contrast" || wording === "consequence") {
    return `\u7B2C s${c.seq} \u53F7\u5DE5\u5177\u8C03\u7528\uFF08${c.tool}\uFF09\uFF1A\u5B83\u6539\u53D8\u4E86\u4F1A\u8BDD\u4E4B\u5916\u7684\u6301\u4E45\u72B6\u6001\uFF08\u5199\u6587\u4EF6\u3001\u6539\u914D\u7F6E\u3001\u5B89\u88C5\u3001\u63D0\u4EA4\u3001\u5220\u9664\u3001\u5BF9\u5916\u53D1\u8D77\u64CD\u4F5C\u7B49\uFF09\uFF0C\u540E\u7EED\u6B65\u9AA4\u9700\u8981\u77E5\u9053\u5B83\u53D1\u751F\u8FC7\u3002`;
  }
  return `\u7B2C s${c.seq} \u53F7\u5DE5\u5177\u8C03\u7528\uFF08${c.tool}\uFF09\uFF1A\u5728\u3010\u4EFB\u52A1\u76EE\u6807\u3011\u63A5\u4E0B\u6765\u7684\u6B65\u9AA4\u91CC\uFF0C\u52A9\u624B\u4ECD\u9700\u8981\u77E5\u9053\u8FD9\u6B21\u8C03\u7528**\u53D1\u751F\u8FC7\u3001\u5E76\u6539\u53D8\u4E86\u4F1A\u8BDD\u4E4B\u5916\u7684\u72B6\u6001**\uFF08\u800C\u4E0D\u662F\u4EC5\u4EC5\u8BFB\u8FC7/\u770B\u8FC7\uFF09\u3002`;
}
function buildJevState({ surface, eventAt, goal, context = STATE_CONTEXT, options }) {
  const { textHead, textTail, maxStateTokens, inputChars } = options;
  const excerptBudget = Number.isFinite(options.resultExcerptChars) ? options.resultExcerptChars : 240;
  const minLines = Math.max(1, options.minHistoryLines ?? 8);
  const entries = [];
  for (const seq of surface) {
    const event = eventAt(seq);
    if (event == null) continue;
    const type = event.type;
    if (type === "tool/result") {
      const excerpt = resultExcerpt(event, excerptBudget);
      entries.push([`[s${seq}][tool_result] ok, ${resultChars(event)} chars${excerpt.length > 0 ? `\uFF1B\u6458\u5F55: ${excerpt}` : " (\u5185\u5BB9\u7701\u7565)"}`]);
      continue;
    }
    if (type === "compaction/summary") {
      entries.push([`[s${seq}][checkpoint] ${abridge(eventText(event), textHead, textTail)}`]);
      continue;
    }
    const content = contentOf(event);
    if (!Array.isArray(content)) continue;
    const lines = [];
    for (const block of content) {
      if (block?.type === "text" && typeof block.text === "string") {
        lines.push(`[s${seq}][${type === "user/message" ? "user" : "assistant"}] ${abridge(block.text, textHead, textTail)}`);
      } else if (block?.type === "reasoning" && typeof block.text === "string") {
        lines.push(`[s${seq}][reasoning] ~${Array.from(block.text).length} \u5B57\u7B26\u7684\u601D\u8003\u8FC7\u7A0B\uFF08\u672A\u5C55\u5F00\uFF09`);
      } else if (block?.type === "tool-call") {
        const args = typeof block.arguments === "string" ? block.arguments : JSON.stringify(block.arguments ?? {});
        lines.push(`[s${seq}][tool_call] ${block.name ?? "?"} ${args.slice(0, inputChars)}${args.length > inputChars ? "\u2026" : ""}`);
      }
    }
    if (lines.length > 0) entries.push(lines);
  }
  let header = `\u3010\u4E0A\u4E0B\u6587\u3011
${context}
`;
  if (goal && goal.length > 0) header += `
\u3010\u4EFB\u52A1\u76EE\u6807\u3011
${goal}
`;
  header += "\n\u3010history\u3011\n";
  const budget = maxStateTokens - estimateTokens(header);
  const all = entries.flatMap((lines) => lines);
  let omitted = 0;
  const tokens = all.map((line) => estimateTokens(line));
  let total = tokens.reduce((s, t) => s + t, 0);
  let start = 0;
  while (all.length - start > minLines && total > budget) {
    total -= tokens[start];
    start += 1;
    omitted += 1;
  }
  const kept = all.slice(start);
  const state = header + kept.join("\n");
  const stateTokens = estimateTokens(state);
  return { state, lines: kept.length, omitted, fitted: stateTokens <= maxStateTokens, stateTokens };
}
function abridge(text, head, tail) {
  const headChars = Number.isFinite(head) ? head : 400;
  const tailChars = Number.isFinite(tail) ? tail : 150;
  const points = Array.from(String(text ?? ""));
  if (points.length <= headChars + tailChars + 40) return points.join("");
  const omitted = points.length - headChars - tailChars;
  return `${points.slice(0, headChars).join("")}
\u2026 ${omitted} \u5B57\u7B26\u7701\u7565 \u2026
${points.slice(-tailChars).join("")}`;
}
function probeShapes(surface, eventAt, limit = 40) {
  const seen = /* @__PURE__ */ new Map();
  const rows = [];
  for (const seq of surface.slice(0, limit)) {
    const event = eventAt(seq);
    if (event == null) continue;
    const content = contentOf(event);
    const blocks = Array.isArray(content) ? content.map((b) => b?.type ?? typeof b) : [];
    const sourceKeys = event.data?.message?.source != null ? Object.keys(event.data.message.source) : [];
    const dataKeys = event.data != null ? Object.keys(event.data) : [];
    rows.push({ seq, type: event.type, blocks, dataKeys, sourceKeys });
    const key = `${event.type}|${blocks.join(",")}|${dataKeys.join(",")}|${sourceKeys.join(",")}`;
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  return { rows, summary: [...seen.entries()].map(([key, count]) => ({ key, count })) };
}
function probeToolNames({ surface, eventAt, events, limit = 12 }) {
  const nameByCallId = buildToolNameIndex(events ?? []);
  const rows = [];
  let unresolved = 0;
  for (const seq of surface.slice(0, limit)) {
    const event = eventAt(seq);
    if (event?.type !== "tool/result") continue;
    const callId = callIdOf(event);
    const name3 = toolNameOf(event, nameByCallId);
    if (name3 === "unknown") unresolved += 1;
    rows.push({ seq, callId, tool: name3 });
  }
  return {
    indexSize: nameByCallId.size,
    // 名字集合取自索引（同时含 tool/call 事件与 assistant 消息块两种来源）——
    // 这是用户配 compactTools 时真正需要的那份清单
    names: [...new Set(nameByCallId.values())].sort(),
    rows,
    unresolved,
    resolved: rows.length - unresolved
  };
}

// index.js
var TESTED_DSH_VERSION = "0.2.0-rc.1";
var TESTED_DSH_SERIES = "0.2";
function detectDshVersion() {
  const readVersionAt = (path) => {
    try {
      return JSON.parse(readFileSync(path, "utf8"))?.version ?? "unknown";
    } catch {
      return null;
    }
  };
  try {
    const require2 = createRequire2(import.meta.url);
    const found = readVersionAt(require2.resolve("@deepseek-ai/dsh/package.json"));
    if (found != null) return found;
  } catch {
  }
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const found = readVersionAt(join(here, "..", "@deepseek-ai", "dsh", "package.json"));
    if (found != null) return found;
  } catch {
  }
  return "unknown";
}
var dshVersion = detectDshVersion();
var dshVersionMatches = dshVersion === "unknown" ? null : dshVersion.split(".").slice(0, 2).join(".") === TESTED_DSH_SERIES;
var fallbackFreezeMessage = (message) => ({ ...message });
async function resolveFreezeMessage(loadModule = () => Promise.resolve().then(() => (init_lib8(), lib_exports))) {
  try {
    const mod = await loadModule();
    if (typeof mod?.freezeMessage === "function") return mod.freezeMessage;
  } catch {
  }
  return fallbackFreezeMessage;
}
var name = "jev-prune";
var DEFAULT_VOLUME_BUDGET_THRESHOLD_CHARS = 8192;
var DEFAULT_BUDGET_MIN_CHARS = 0;
var Config = z3.object({
  enabled: z3.boolean().default(true),
  /** TypeSafe key；留空则读环境变量 TYPESAFE_API_KEY */
  apiKey: z3.string().role("secret").default(""),
  credentialRef: z3.string().default("TYPESAFE_API_KEY"),
  proxyUrl: z3.string().default(""),
  earlyPrune: z3.boolean().default(false),
  earlyMinChars: z3.number().min(1).default(16e3),
  earlyMinSteps: z3.number().min(1).default(4),
  maxJudgeBatches: z3.number().min(1).default(1),
  model: z3.string().default("jev-latest"),
  baseUrl: z3.string().default("https://api.typesafe.ai/v1/systemone"),
  /** P(保留) ≥ 该值 → 不裁（budget 模式下这是**保护上限**：达到即不进候选池） */
  keepThreshold: z3.number().min(0).max(1).default(0.5),
  /** always 模式（judgeOn: 'always'）没有压力信号时的固定裁剪比例：裁掉候选池这个比例的字符增益（0.5 = 一半）。pressure 模式下由缺口自动算，与此无关。 */
  alwaysTrimRatio: z3.number().min(0).max(1).default(0.5),
  /**
   * 第一层裁决模式（P0-1）：
   *   · `budget`（默认）——"**裁多少**"由**压力缺口比例**决定（ratio = (used − threshold)/window，
   *     由 judgePass 每轮自动算并缓存；预算 = ratio × 候选池总字符增益），"**裁哪些**"由 Jev 概率
   *     **排序**决定（从最低开始裁，裁到省够预算即停）；`keepThreshold` 退居保护上限。
   *   · `absolute` —— 旧行为：逐节点 `prob >= keepThreshold` 判。
   * 为什么必须换：实测 Jev 概率是**窄带**（真实会话 42/42 条低于 0.5、P50=0.13），
   * 固定 0.5 会把所有判定过的结果都判成"可裁"；而纯相对分位又会"每轮必裁固定比例"
   * （不需要压缩时也在动刀，且比例与宿主需要腾多少空间无关）。两条路都不成立，
   * 所以拆成正交的两件事：省多少 = 压力缺口，裁哪些 = Jev 排序。
   */
  keepMode: z3.string().default("budget"),
  /** budget 模式小样本降级用的绝对下限（口径与第二层 floorThreshold 一致） */
  keepFloorThreshold: z3.number().min(0).max(1).default(0.2),
  /** budget 模式：候选少于此数则降级为绝对下限（小样本上排序没有意义） */
  minCandidatesForBudget: z3.number().min(1).default(4),
  /** @deprecated 已废弃：budget 模式改为压力分位（ratio 由 judgePass 自动算），不再错定体积规则。保留仅为向后兼容。 */
  volumeBudgetThresholdChars: z3.number().min(0).default(DEFAULT_VOLUME_BUDGET_THRESHOLD_CHARS),
  /** @deprecated 已废弃：同上，保留仅为向后兼容。 */
  budgetMinChars: z3.number().min(0).default(DEFAULT_BUDGET_MIN_CHARS),
  /** 值得动手的最小收益（与 sliceWithBudget 的 minGain 同口径；小于它不进候选池） */
  minGainChars: z3.number().min(0).default(40),
  /** 最近 N 个 surface 节点永不裁剪（含正在进行的工具调用） */
  preserveRecent: z3.number().min(0).default(4),
  /** 裁到多少字符就够：留头 + 标记 + 留尾 */
  headChars: z3.number().min(0).default(600),
  tailChars: z3.number().min(0).default(200),
  /** 小于该长度的结果即使 Jev 说过期也不裁（省不到东西、还丢信息） */
  minCharsToPrune: z3.number().min(0).default(400),
  /** 何时开始判定：pressure（上下文超软阈值才判）| always */
  judgeOn: z3.string().default("pressure"),
  softLimit: z3.string().default("55%"),
  /** state 预算（Jev 上限 32k） */
  maxStateTokens: z3.number().min(1).default(25e3),
  maxRequestTokens: z3.number().min(1).default(3e4),
  textHead: z3.number().min(0).default(400),
  textTail: z3.number().min(0).default(150),
  inputChars: z3.number().min(0).default(300),
  /**
   * state 里每个工具结果的**摘录预算**（字符，P0-2）。
   * 0 = 关闭（回到旧的 `ok, N chars (内容省略)`）。
   * 为什么需要：判断者此前只看得到体积、看不到内容——Claude 版的教训（256 条结果
   * 无一过阈值、与假评分器打平）说明盲判≈抛硬币；我们自己的 in-vivo 实测里
   * 42/42 判"过期"，被误判的正是后续修 bug 要用的那条结果。
   * 摘录内容 = 头 2 行 + 命中证据词的行（报错栈/失败断言**往往在中段**，恰是被掐掉的位置）。
   */
  resultExcerptChars: z3.number().min(0).default(240),
  judgeTimeoutMs: z3.number().min(1).default(6e4),
  /**
   * 单次 ask 内最多重试几次（issue #34）。只对可重试失败生效：
   * 网络异常 / 超时 / 429 / 5xx。4xx 与响应形状错误立刻放弃（重试没意义）。
   * 0 = 关闭重试（退化为旧行为）。
   */
  judgeMaxRetries: z3.number().min(0).default(2),
  /** 重试退避基数（ms）；实际等待为 base × 2^attempt。0 = 不等待（测试用） */
  judgeRetryBaseMs: z3.number().min(0).default(300),
  /** 只判定不裁剪，用来先观察行为 */
  dryRun: z3.boolean().default(false),
  /** 提问措辞：goal（默认，实测区分度最高）| legacy（上游原味，几乎无区分度）| contrast | consequence */
  wording: z3.string().default("goal"),
  /** state 历史最少保留的行数（避免为了塞进预算把上下文丢空） */
  minHistoryLines: z3.number().min(1).default(8),
  /** 结果永不裁剪的工具。比第二层的 neverCompactTools **窄**（见 receipt.js 的说明） */
  // 第一层只截断（可逆），所以默认只守"参数即内容"的写文件类工具；
  // 差异型编辑工具（Edit / ApplyPatch …）第一层可裁，第二层仍守。
  neverPruneTools: z3.array(z3.string()).default(DEFAULT_NEVER_PRUNE_TOOLS),
  // ---------------------------------------------------------------- 第二层：回执压缩
  /** 第二层总开关 */
  compactReceipts: z3.boolean().default(true),
  /** 何时做整对移出：pressure（到软阈值才做）| always | off */
  compactOn: z3.string().default("pressure"),
  /** 第二层的压力门（比第一层保守：整对删除比截断风险大） */
  compactSoftLimit: z3.string().default("70%"),
  /** 第二层独立的最近区保护；整对移出已有两轴判定，默认只保留最后 1 个节点。 */
  compactPreserveRecent: z3.number().min(0).default(1),
  /**
   * 门控模式：relative（默认）| absolute。
   * **Jev 必须用 relative** —— 实测它的两轴概率都落在 0.05~0.37 的窄带里，
   * 固定阈值 0.5 会把全部候选判成"可丢"（开发期实测，数据未随仓库提交；
   * 结论见 README 的设计说明。issue #13：此前出处写作 probe_effect.js，该文件不存在）。
   * absolute 只留给换判断后端（例如本地分类器）时用。
   */
  compactMode: z3.string().default("relative"),
  /** relative 模式：两轴各取尾部这个比例，**取交集** */
  compactQuantile: z3.number().min(0).max(1).default(0.34),
  /**
   * relative 模式需要的最小总体规模；小于它则**降级为绝对下限模式**（不是我原本设想的"直接不做"）。
   *
   * issue #27：只读工具在写/执行密集会话里往往只占极少数（实测只读 1/6 → 总体仅 2 条），
   * 而此前低于这个数就返回空集 → **第二层在绝大多数真实会话里静默不工作**，
   * 报错文案却说"需要 ≥4 个"，看着像"样本确实不够"而不像 bug。
   */
  minCandidatesForRelative: z3.number().min(2).default(DEFAULT_MIN_CANDIDATES_FOR_RELATIVE),
  /** 降级模式（总体 < minCandidatesForRelative）用的绝对下限，**明显严于** compactThreshold */
  floorThreshold: z3.number().min(0).max(1).default(DEFAULT_FLOOR_THRESHOLD),
  /** 降级模式仍要求的最低样本量；低于它连分布都谈不上，仍然不做 */
  minCandidatesForFloor: z3.number().min(1).default(DEFAULT_MIN_CANDIDATES_FOR_FLOOR),
  /** absolute 模式用的阈值 */
  compactThreshold: z3.number().min(0).max(1).default(0.5),
  /**
   * 允许整对移出的工具（白名单）。**默认 = `DSH_READONLY_TOOLS`（只读工具集），即默认就带白名单。**
   *
   * 为什么默认是"只读白名单"而不是空：白名单失效的后果是"功能静默死亡"（加载成功、
   * 接管成功、判定在跑，只是什么都不做），所以宁可让它默认就窄；黑名单只用来额外
   * 保护改写型调用。实测教训：最初把 Claude Code 风格的 PascalCase 名字当默认白名单，
   * 而真实 DSH 的工具名是 **`pwsh` / `read` / `glob`**（全小写、shell 叫 pwsh）——
   * **命中 0/11，第二层静默地永不触发**。
   * 比较时做归一化（小写 + 去掉 `_`/`-`），所以 `MultiEdit` 与 `multi_edit` 等价。
   * 想放宽就配成 `[]`（只受 neverCompactTools 约束）——那是显式 opt-in 的不安全模式，
   * shell 调用也会被整对移出。
   */
  compactTools: z3.array(z3.string()).default(DEFAULT_COMPACT_TOOLS),
  /** 永不整对移出的工具（改写型调用是承重信息） */
  neverCompactTools: z3.array(z3.string()).default(DEFAULT_NEVER_COMPACT_TOOLS),
  /** 证据守卫：结果里命中这些词就不整对移出（仍允许第一层截断） */
  evidenceGuard: z3.boolean().default(true),
  evidencePatterns: z3.array(z3.string()).default(DEFAULT_EVIDENCE_PATTERNS),
  /**
   * assistant 消息里**用户可见文本**（`text` 块）超过这个长度的步骤不整对移出——它在交代结论。
   * 默认值按真实会话标定：实测 DeepSeek 每步 text 仅 0~287 字符，1200 有充分余量。
   *
   * ⚠️ 这个阈值**不含 `reasoning`**（issue #26：此前两者累加，导致阈值被思考草稿主导）。
   * reasoning 有独立阈值 `maxStepReasoningChars`。
   */
  maxStepTextChars: z3.number().min(0).default(1200),
  /**
   * assistant 消息里**思考草稿**（`reasoning` 块）超过这个长度的步骤不整对移出。
   *
   * 为什么单独一个键、且默认值明显更宽：`detail` 级别的会话里 reasoning 天然很长
   * （实测 0~1207 字符，且会随任务复杂度溢出到数千），它是模型的草稿而不是承重结论。
   * 与 text 共用一个阈值时，reasoning 只要多写几百字就会把整层压缩静默关掉——
   * 这是"第二层用不到"的主因。取 4000 是给"确实想了很久、这步大概不平凡"留余地，
   * 同时让绝大多数正常步骤通过。想彻底关掉这道门就配成一个很大的数。
   */
  maxStepReasoningChars: z3.number().min(0).default(4e3),
  /** 一段范围至少要能省下这么多字符，才值得开一次压缩事务 */
  compactMinChars: z3.number().min(0).default(2e3),
  /** 回执必须是原内容 token 的这个比例以下才动手（服务端硬要求 <1.0，我们更严） */
  receiptMaxRatio: z3.number().min(0).max(1).default(0.5),
  /**
   * 一次 pass 最多做几次压缩事务（issue #35）。
   *
   * 旧默认值是 1：一次 pass 只回收一段，大上下文要靠**多轮 pre-step** 慢慢挤，
   * 而每一轮都要重新走压力门、重新判定、重新选段——收敛慢且多花 Jev 调用。
   * 单次 compactRegion 的成本是"一次摘要调用"（我们注入确定性回执，所以其实
   * 不含模型生成），排队做 3 段与做 1 段的边际成本很低，于是默认提到 3。
   *
   * 上限仍是可配的：想完全回到旧行为就设成 1。
   */
  maxCompactionsPerPass: z3.number().min(1).default(3),
  /** 回执里每行入参截断到多少字符 */
  receiptArgChars: z3.number().min(0).default(120),
  /** 回执里每步 assistant 可见文本的原文摘录上限；0 表示不写入 */
  receiptTextChars: z3.number().min(0).default(400),
  /**
   * 心跳文件路径。非空时，插件会在加载完成、每次判定 pass、每次裁剪后写一份 JSON 快照。
   * 用途有两个：①运维可观测（宿主会吞掉插件的 logger 输出，只能靠落盘看状态）
   * ②**验证接管是否真的发生**——这是唯一能从外部确证"插件在真实宿主里起作用"的手段。
   */
  heartbeatFile: z3.string().default(""),
  logLevel: z3.string().default("info")
});
var CONFIG_WARNINGS = "__configWarnings";
var CONFIG_RANGES = {
  earlyMinChars: [1, 1e9],
  earlyMinSteps: [1, 1e9],
  maxJudgeBatches: [1, 10],
  // 概率 / 比例：越界会让判据恒真或恒假
  keepThreshold: [0, 1],
  keepFloorThreshold: [0, 1],
  alwaysTrimRatio: [0, 1],
  compactQuantile: [0, 1],
  compactThreshold: [0, 1],
  floorThreshold: [0, 1],
  // receiptMaxRatio 不只是比例，它同时是"回执不得比原文大"的安全门：
  // >1 就等于允许"压缩后反而更占地方"，所以上界收在 1。
  // 注释里写的"服务端硬要求 <1.0，我们更严"指的是默认值 0.5，不是上界。
  receiptMaxRatio: [0, 1],
  // 非负（0 合法）
  preserveRecent: [0, 1e9],
  compactPreserveRecent: [0, 1e9],
  headChars: [0, 1e9],
  tailChars: [0, 1e9],
  textHead: [0, 1e9],
  textTail: [0, 1e9],
  minCharsToPrune: [0, 1e9],
  compactMinChars: [0, 1e9],
  receiptArgChars: [0, 1e9],
  receiptTextChars: [0, 1e9],
  inputChars: [0, 1e9],
  maxStepTextChars: [0, 1e9],
  maxStepReasoningChars: [0, 1e9],
  // P0-1 预算模式 / P0-2 摘录（0 合法：摘录 0 = 关闭；budgetMinChars 0 = 严格跟随体积规则）
  volumeBudgetThresholdChars: [0, 1e9],
  budgetMinChars: [0, 1e9],
  minGainChars: [0, 1e9],
  resultExcerptChars: [0, 1e9],
  // 计数类
  minHistoryLines: [1, 1e9],
  minCandidatesForRelative: [2, 1e9],
  minCandidatesForFloor: [1, 1e9],
  minCandidatesForBudget: [1, 1e9],
  maxCompactionsPerPass: [1, 1e9],
  // 预算 / 超时（正数）
  maxStateTokens: [1, 1e9],
  maxRequestTokens: [1, 1e9],
  judgeTimeoutMs: [1, 1e9],
  judgeMaxRetries: [0, 1e9],
  judgeRetryBaseMs: [0, 1e9]
};
function resolveKeepMode(raw, onWarn) {
  if (raw == null || raw === "") return "budget";
  if (raw === "budget" || raw === "absolute") return raw;
  onWarn?.(`\u914D\u7F6E keepMode=${JSON.stringify(String(raw))} \u4E0D\u5728 ['budget','absolute'] \u5185 \u2192 \u5DF2\u6539\u4E3A 'budget'\uFF08\u62FC\u9519\u7684\u6A21\u5F0F\u4F1A\u9759\u9ED8\u9000\u56DE\u65E7\u884C\u4E3A\uFF0C\u5FC5\u987B\u7559\u75D5\uFF09`);
  return "budget";
}
function clampConfigNumber(key, value, fallback, onWarn) {
  const [lo, hi] = CONFIG_RANGES[key] ?? [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY];
  const warn = (kind, got) => {
    onWarn?.(`\u914D\u7F6E ${key}=${got} \u975E\u6CD5\uFF08${kind}\uFF09\u2192 \u5DF2\u6539\u4E3A ${fallback}\uFF08\u5408\u6CD5\u533A\u95F4 ${lo}~${hi}\uFF09`);
    return fallback;
  };
  if (value == null || value === "") return [fallback, false];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return [warn("\u4E0D\u662F\u6709\u9650\u6570\u503C", JSON.stringify(value) ?? String(value)), true];
  }
  if (value < lo) return [warn(`\u4F4E\u4E8E\u4E0B\u9650 ${lo}`, value), true];
  if (value > hi) return [warn(`\u9AD8\u4E8E\u4E0A\u9650 ${hi}`, value), true];
  return [value, false];
}
function resolveConfig2(config = {}) {
  const warnings = [];
  if (config.volumeBudgetThresholdChars != null && config.volumeBudgetThresholdChars !== DEFAULT_VOLUME_BUDGET_THRESHOLD_CHARS) {
    warnings.push("\u914D\u7F6E volumeBudgetThresholdChars \u5DF2\u5E9F\u5F03\uFF08budget \u6A21\u5F0F\u6539\u4E3A\u538B\u529B\u5206\u4F4D\uFF0C\u7531 judgePass \u6BCF\u8F6E\u81EA\u52A8\u8BA1\u7B97\uFF09\uFF0C\u8BE5\u952E\u4E0D\u518D\u751F\u6548");
  }
  if (config.budgetMinChars != null && config.budgetMinChars !== DEFAULT_BUDGET_MIN_CHARS) {
    warnings.push("\u914D\u7F6E budgetMinChars \u5DF2\u5E9F\u5F03\uFF08\u540C\u4E0A\uFF09\uFF0C\u8BE5\u952E\u4E0D\u518D\u751F\u6548");
  }
  return {
    ...config,
    enabled: config.enabled ?? true,
    apiKey: config.apiKey ?? "",
    credentialRef: config.credentialRef ?? "TYPESAFE_API_KEY",
    proxyUrl: config.proxyUrl ?? "",
    earlyPrune: config.earlyPrune ?? false,
    earlyMinChars: clampConfigNumber("earlyMinChars", config.earlyMinChars, 16e3, (w) => warnings.push(w))[0],
    earlyMinSteps: Math.floor(clampConfigNumber("earlyMinSteps", config.earlyMinSteps, 4, (w) => warnings.push(w))[0]),
    maxJudgeBatches: Math.floor(clampConfigNumber("maxJudgeBatches", config.maxJudgeBatches, 1, (w) => warnings.push(w))[0]),
    model: config.model ?? "jev-latest",
    // 维护约定：Config schema 的每个 default 都必须在这里有对应兜底（本键此前遗漏；
    // 影响为零是因为 JevClient 的默认参数会在 undefined 时生效，但约定不该靠下游兜底）。
    baseUrl: config.baseUrl ?? "https://api.typesafe.ai/v1/systemone",
    preserveRecent: clampConfigNumber("preserveRecent", config.preserveRecent, 4, (w) => warnings.push(w))[0],
    keepThreshold: clampConfigNumber("keepThreshold", config.keepThreshold, 0.5, (w) => warnings.push(w))[0],
    alwaysTrimRatio: clampConfigNumber("alwaysTrimRatio", config.alwaysTrimRatio, 0.5, (w) => warnings.push(w))[0],
    keepMode: resolveKeepMode(config.keepMode, (w) => warnings.push(w)),
    keepFloorThreshold: clampConfigNumber("keepFloorThreshold", config.keepFloorThreshold, 0.2, (w) => warnings.push(w))[0],
    minCandidatesForBudget: clampConfigNumber("minCandidatesForBudget", config.minCandidatesForBudget, 4, (w) => warnings.push(w))[0],
    volumeBudgetThresholdChars: clampConfigNumber("volumeBudgetThresholdChars", config.volumeBudgetThresholdChars, DEFAULT_VOLUME_BUDGET_THRESHOLD_CHARS, (w) => warnings.push(w))[0],
    budgetMinChars: clampConfigNumber("budgetMinChars", config.budgetMinChars, DEFAULT_BUDGET_MIN_CHARS, (w) => warnings.push(w))[0],
    minGainChars: clampConfigNumber("minGainChars", config.minGainChars, 40, (w) => warnings.push(w))[0],
    resultExcerptChars: clampConfigNumber("resultExcerptChars", config.resultExcerptChars, 240, (w) => warnings.push(w))[0],
    headChars: clampConfigNumber("headChars", config.headChars, 600, (w) => warnings.push(w))[0],
    tailChars: clampConfigNumber("tailChars", config.tailChars, 200, (w) => warnings.push(w))[0],
    minCharsToPrune: clampConfigNumber("minCharsToPrune", config.minCharsToPrune, 400, (w) => warnings.push(w))[0],
    judgeOn: config.judgeOn ?? "pressure",
    softLimit: config.softLimit ?? "55%",
    neverPruneTools: config.neverPruneTools ?? DEFAULT_NEVER_PRUNE_TOOLS,
    compactReceipts: config.compactReceipts ?? true,
    compactOn: config.compactOn ?? "pressure",
    compactSoftLimit: config.compactSoftLimit ?? "70%",
    compactPreserveRecent: clampConfigNumber("compactPreserveRecent", config.compactPreserveRecent, 1, (w) => warnings.push(w))[0],
    compactMode: config.compactMode ?? "relative",
    compactQuantile: clampConfigNumber("compactQuantile", config.compactQuantile, 0.34, (w) => warnings.push(w))[0],
    minCandidatesForRelative: clampConfigNumber("minCandidatesForRelative", config.minCandidatesForRelative, DEFAULT_MIN_CANDIDATES_FOR_RELATIVE, (w) => warnings.push(w))[0],
    floorThreshold: clampConfigNumber("floorThreshold", config.floorThreshold, DEFAULT_FLOOR_THRESHOLD, (w) => warnings.push(w))[0],
    minCandidatesForFloor: clampConfigNumber("minCandidatesForFloor", config.minCandidatesForFloor, DEFAULT_MIN_CANDIDATES_FOR_FLOOR, (w) => warnings.push(w))[0],
    compactThreshold: clampConfigNumber("compactThreshold", config.compactThreshold, 0.5, (w) => warnings.push(w))[0],
    compactTools: config.compactTools ?? DEFAULT_COMPACT_TOOLS,
    neverCompactTools: config.neverCompactTools ?? DEFAULT_NEVER_COMPACT_TOOLS,
    evidenceGuard: config.evidenceGuard ?? true,
    evidencePatterns: config.evidencePatterns ?? DEFAULT_EVIDENCE_PATTERNS,
    maxStepTextChars: clampConfigNumber("maxStepTextChars", config.maxStepTextChars, 1200, (w) => warnings.push(w))[0],
    maxStepReasoningChars: clampConfigNumber("maxStepReasoningChars", config.maxStepReasoningChars, 4e3, (w) => warnings.push(w))[0],
    compactMinChars: clampConfigNumber("compactMinChars", config.compactMinChars, 2e3, (w) => warnings.push(w))[0],
    receiptMaxRatio: clampConfigNumber("receiptMaxRatio", config.receiptMaxRatio, 0.5, (w) => warnings.push(w))[0],
    maxCompactionsPerPass: clampConfigNumber("maxCompactionsPerPass", config.maxCompactionsPerPass, 3, (w) => warnings.push(w))[0],
    receiptArgChars: clampConfigNumber("receiptArgChars", config.receiptArgChars, 120, (w) => warnings.push(w))[0],
    receiptTextChars: clampConfigNumber("receiptTextChars", config.receiptTextChars, 400, (w) => warnings.push(w))[0],
    dryRun: config.dryRun ?? false,
    wording: config.wording ?? "goal",
    minHistoryLines: clampConfigNumber("minHistoryLines", config.minHistoryLines, 8, (w) => warnings.push(w))[0],
    // issue #4：这 6 个键此前只在 Config schema 里有 default，resolveConfig 漏了——
    // config 未经 schemastery 归一化时（冒烟测试的 PLUGIN_CFG、被 patch 直接注入的对象），
    // abridge 拿到 undefined → head+tail+40 是 NaN → 同一段文本输出两遍、state 带 "NaN"。
    // 维护约定：Config schema 的每个 default 都必须在这里有对应兜底。
    textHead: clampConfigNumber("textHead", config.textHead, 400, (w) => warnings.push(w))[0],
    textTail: clampConfigNumber("textTail", config.textTail, 150, (w) => warnings.push(w))[0],
    inputChars: clampConfigNumber("inputChars", config.inputChars, 300, (w) => warnings.push(w))[0],
    maxStateTokens: clampConfigNumber("maxStateTokens", config.maxStateTokens, 25e3, (w) => warnings.push(w))[0],
    maxRequestTokens: clampConfigNumber("maxRequestTokens", config.maxRequestTokens, 3e4, (w) => warnings.push(w))[0],
    judgeTimeoutMs: clampConfigNumber("judgeTimeoutMs", config.judgeTimeoutMs, 6e4, (w) => warnings.push(w))[0],
    judgeMaxRetries: clampConfigNumber("judgeMaxRetries", config.judgeMaxRetries, 2, (w) => warnings.push(w))[0],
    judgeRetryBaseMs: clampConfigNumber("judgeRetryBaseMs", config.judgeRetryBaseMs, 300, (w) => warnings.push(w))[0],
    heartbeatFile: config.heartbeatFile ?? "",
    logLevel: config.logLevel ?? "info",
    // 越界配置的**审计出口**（issue #28）：钳制是静默改写用户意图的动作，
    // 必须留下痕迹——否则用户配了 preserveRecent=-5 以为"更宽"，实际拿到的却是默认值，
    // 而他对"为什么和在文档里读到的行为不一样"完全没有线索。
    [CONFIG_WARNINGS]: warnings
  };
}
function isCompactableTool(tool, cfg) {
  if (isToolIn(cfg.neverCompactTools, tool)) return false;
  if (cfg.compactTools.length > 0 && !isToolIn(cfg.compactTools, tool)) return false;
  return true;
}
function apply(ctx, config, deps = {}) {
  const cfg = resolveConfig2(config);
  deps.onControl?.({
    update(patch) {
      Object.assign(cfg, resolveConfig2({ ...cfg, ...patch }));
      if (!deps.judge && Object.hasOwn(patch, "apiKey")) judge.apiKey = patch.apiKey || "";
    },
    status() {
      return { ...stats, enabled: cfg.enabled, dryRun: cfg.dryRun, judgeReady: judge.ready, model: cfg.model };
    }
  });
  if (dshVersionMatches === false) {
    ctx.logger?.info?.(`[jev-prune] DSH ${dshVersion} \u4E0E\u6D4B\u8BD5\u7248\u672C ${TESTED_DSH_VERSION} \u4E0D\u540C\u7CFB\u5217 \u2014\u2014 \u4E8B\u4EF6\u5B57\u6BB5\u53EF\u80FD\u5DF2\u6F02\u79FB\uFF0C\u5EFA\u8BAE\u5148\u8DD1 jev_probe_shapes \u6838\u5BF9`);
  }
  let freezeMessage2 = fallbackFreezeMessage;
  void resolveFreezeMessage(deps.loadFreezeModule).then((resolved) => {
    freezeMessage2 = resolved;
  });
  const envKey = typeof process !== "undefined" ? process.env?.TYPESAFE_API_KEY : void 0;
  let proxyDispatcher;
  let dispatcherUrl;
  const proxyFetch = async (url, options) => {
    const { ProxyAgent, fetch } = await import("undici");
    if (!cfg.proxyUrl) return fetch(url, options);
    if (dispatcherUrl !== cfg.proxyUrl) {
      await proxyDispatcher?.close();
      proxyDispatcher = new ProxyAgent(cfg.proxyUrl);
      dispatcherUrl = cfg.proxyUrl;
    }
    return fetch(url, { ...options, dispatcher: proxyDispatcher });
  };
  ctx.effect?.(() => () => proxyDispatcher?.close());
  const judge = deps.judge ?? new JevClient({
    apiKey: cfg.apiKey || envKey || "",
    model: cfg.model,
    baseUrl: cfg.baseUrl,
    timeoutMs: cfg.judgeTimeoutMs,
    maxRetries: cfg.judgeMaxRetries,
    retryBaseMs: cfg.judgeRetryBaseMs,
    fetchImpl: proxyFetch
  });
  const earlySteps = /* @__PURE__ */ new WeakMap();
  const decisions = /* @__PURE__ */ new WeakMap();
  const pressureRatios = /* @__PURE__ */ new WeakMap();
  const stats = {
    judged: 0,
    requests: 0,
    prunedByJev: 0,
    prunedByVolume: 0,
    savedChars: 0,
    // keep 的三个来源分开计数（issue #8）：keptByJev 此前混入了最近区/黑名单保护
    keptByJev: 0,
    keptByTail: 0,
    keptByBlacklist: 0,
    /**
     * P0-1：被**预算**（而不是判定）留下来的条数。
     * budget 模式下"Jev 说过期但预算已经用完"是常态——不单独计数的话，
     * 用户会看到"Jev 裁掉 0"却不知道为什么，也无法判断预算是不是太紧。
     */
    keptByBudget: 0,
    /** P0-1/P0-3：最近一次裁剪的预算分析（planTrims 的返回值），心跳里可见 */
    lastBudget: null,
    /** P0-3：最近若干条逐节点决策（含原因），让"为什么没裁/裁了"可复核 */
    decisions: [],
    skipped: 0,
    errors: 0,
    lastNote: "",
    /**
     * P0-1/P0-3 遥测：keep 概率的累计分布。
     * 为什么必须落盘：本插件历史上最大的问题都是"静默失效"，而这个分布是判断
     * "阈值与分布是否匹配"的唯一依据——真实会话实测 42/42 低于 0.5（P50=0.13），
     * 固定阈值等于"把每一轮判定都读成可裁"。没有这份数据，这个问题在运行时不可见。
     */
    probSum: 0,
    probCount: 0,
    keepAboveThreshold: 0,
    keepBelowThreshold: 0,
    /** P0-3：最近一次判定 pass 的门控快照（used/窗口/阈值/为什么跳过） */
    lastGate: null,
    /**
     * 判定批次失败次数（issue #34）。旧实现一处失败就冒泡、后续批次不再问，
     * 已经能拿到的概率被一起丢掉；现在逐批容错，失败批数如实上报，
     * 好判断"这轮少判了几批"而不是只看到一句笼统的失败。
     */
    judgeBatchFailures: 0,
    // 第二层
    compactions: 0,
    compactedSeqs: 0,
    compactedChars: 0,
    receiptSummaries: 0,
    /**
     * 回执因**竞态**没能注入的次数（issue #29）。
     *
     * 为什么必须单独计数：竞态的表现是"回执被别处的并发压缩抢走"，而结果看起来
     * 只是"这次压缩用了模型摘要"——与"我们没打算压缩它"完全无法区分。
     * 不复数上报的话，这个 bug 只能靠读代码发现。
     */
    receiptFenceMisses: 0,
    compactSkipped: 0,
    lastCompactNote: ""
  };
  const probSamples = [];
  function probSummary() {
    if (stats.probCount === 0) return null;
    const sorted = [...probSamples].sort((a, b) => a - b);
    const q = (p) => sorted.length === 0 ? null : sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
    return {
      n: stats.probCount,
      sampled: sorted.length,
      mean: Number((stats.probSum / stats.probCount).toFixed(4)),
      p10: q(0.1),
      p25: q(0.25),
      p50: q(0.5),
      p75: q(0.75),
      p90: q(0.9),
      aboveKeepThreshold: stats.keepAboveThreshold,
      belowKeepThreshold: stats.keepBelowThreshold,
      keepThreshold: cfg.keepThreshold,
      keepMode: cfg.keepMode
    };
  }
  const log = (level, message) => {
    if (cfg.logLevel === "silent") return;
    if (level === "debug" && cfg.logLevel !== "debug") return;
    const line = `[jev-prune] ${message}`;
    if (typeof ctx.logger?.info === "function") ctx.logger.info(line);
    else console.error(line);
  };
  const decisionsOf = (session) => {
    let map = decisions.get(session);
    if (map == null) {
      map = /* @__PURE__ */ new Map();
      decisions.set(session, map);
    }
    return map;
  };
  function describeEvents(session) {
    const raw = session?.events;
    const resolved = sessionEvents(session);
    const first = resolved?.[0];
    return {
      raw: {
        isArray: Array.isArray(raw),
        ctor: raw == null ? "null" : raw.constructor?.name ?? typeof raw
      },
      resolved: {
        isArray: Array.isArray(resolved),
        length: resolved.length,
        firstKind: first == null ? "null" : first.type ?? typeof first
      },
      hasEventAt: typeof session?.eventAt === "function"
    };
  }
  const bootedAt = (/* @__PURE__ */ new Date()).toISOString();
  let takeover = { attempted: false, installed: false, reason: "not yet" };
  let summaryHook = { attempted: false, installed: false, reason: "not yet" };
  const heartbeatState = {};
  function writeHeartbeat(extra = {}) {
    if (!cfg.heartbeatFile) return;
    try {
      Object.assign(heartbeatState, extra);
      const payload = {
        plugin: name,
        bootedAt,
        now: (/* @__PURE__ */ new Date()).toISOString(),
        pid: typeof process !== "undefined" ? process.pid : null,
        dshVersion: { version: dshVersion, testedAgainst: TESTED_DSH_VERSION, matchesTested: dshVersionMatches },
        judgeReady: judge.ready !== false,
        model: cfg.model,
        // 越界配置被钳制的记录（issue #28）。空数组 = 配置全部合法。
        // 落盘的原因是"钳制"本身就是一种静默行为差异，必须以可观测的方式留痕。
        configWarnings: cfg[CONFIG_WARNINGS] ?? [],
        keepThreshold: cfg.keepThreshold,
        // P0-1/P0-3：第一层的裁决模式与压力分位口径（判据落盘，否则"为什么没裁"不可复核）
        keep: {
          mode: cfg.keepMode,
          keepThreshold: cfg.keepThreshold,
          floor: cfg.keepFloorThreshold,
          minCandidates: cfg.minCandidatesForBudget
          // 压力缺口比例由 judgePass 每轮算好，裁剪时随 lastPrune.budget 一起落盘；
          // volumeBudgetThresholdChars / budgetMinChars 已废弃（保留仅为兼容），不再出现在这里。
        },
        stateExcerptChars: cfg.resultExcerptChars,
        preserveRecent: cfg.preserveRecent,
        wording: cfg.wording,
        compact: {
          enabled: cfg.compactReceipts,
          on: cfg.compactOn,
          mode: cfg.compactMode,
          quantile: cfg.compactQuantile,
          preserveRecent: cfg.compactPreserveRecent
        },
        takeover,
        summaryHook,
        stats,
        ...heartbeatState
      };
      writeFileSync(cfg.heartbeatFile, JSON.stringify(payload, null, 1), "utf8");
    } catch (error) {
      log("debug", `\u5FC3\u8DF3\u5199\u5165\u5931\u8D25\uFF1A${error?.message ?? String(error)}`);
    }
  }
  const windowCache = /* @__PURE__ */ new Map();
  async function resolveWindow(agent) {
    try {
      const header = agent.session?.requestHeader?.()?.config;
      const provider = header?.provider || agent.options?.provider;
      const model = header?.model || agent.options?.model;
      const llm = ctx.get("llm");
      if (llm == null || !provider || !model || typeof llm.resolveModelInfo !== "function") return null;
      const key = `${provider}\0${model}`;
      if (windowCache.has(key)) return windowCache.get(key);
      const info = await llm.resolveModelInfo(provider, model);
      const windowTokens = info?.context?.contextWindow ?? null;
      if (windowTokens != null) windowCache.set(key, windowTokens);
      return windowTokens;
    } catch {
      return null;
    }
  }
  async function judgePass(agent, signal) {
    const session = agent?.session;
    if (session == null) {
      stats.judgePassSkipped = (stats.judgePassSkipped ?? 0) + 1;
      stats.lastJudgeSkipReason = "\u6CA1\u6709\u6D3B\u52A8\u4F1A\u8BDD";
      return;
    }
    if (session.surface?.nodes == null || judge.ready === false) {
      pressureRatios.set(session, 0);
      stats.judgePassSkipped = (stats.judgePassSkipped ?? 0) + 1;
      stats.lastJudgeSkipReason = judge.ready === false ? "judge \u672A\u5C31\u7EEA" : "session.surface.nodes \u4E0D\u53EF\u7528";
      return;
    }
    const surface = [...session.surface.nodes];
    const eventAt = (seq) => session.eventAt(seq);
    const nameByCallId = buildToolNameIndex(sessionEvents(session));
    const candidateInput = {
      surface,
      eventAt,
      events: sessionEvents(session),
      marker: JEV_PRUNE_MARKER,
      nameByCallId
    };
    const layer1Candidates = selectCandidates({
      ...candidateInput,
      preserveRecent: cfg.preserveRecent,
      neverPruneTools: cfg.neverPruneTools
    });
    const candidatesBySeq = new Map(layer1Candidates.map((candidate) => [candidate.seq, candidate]));
    const layer2CandidateSeqs = /* @__PURE__ */ new Set();
    const layer2CanSelect = cfg.compactReceipts && (cfg.compactMode === "relative" ? cfg.compactQuantile > 0 : cfg.compactThreshold > 0);
    if (layer2CanSelect) {
      const layer2Candidates = selectCandidates({
        ...candidateInput,
        preserveRecent: cfg.compactPreserveRecent,
        // 第一层黑名单不属于第二层；第二层随后按自己的白名单 + 黑名单过滤。
        neverPruneTools: [],
        // decisions 是内存缓存，宿主重启/会话恢复后会丢失。第一层 replacement 虽然
        // 带裁剪标记，第二层仍需允许重新判定，否则这些旧节点永远无法进入回执压缩。
        includePruned: true
      }).filter((candidate) => isCompactableTool(candidate.tool, cfg));
      for (const candidate of layer2Candidates) {
        layer2CandidateSeqs.add(candidate.seq);
        candidatesBySeq.set(candidate.seq, candidate);
      }
    }
    const candidates = [...candidatesBySeq.values()].sort((a, b) => a.index - b.index);
    const cache = decisionsOf(session);
    const fresh = candidates.filter((candidate) => {
      const cached = cachedVerdictForEvent(cache, eventAt(candidate.seq));
      if (!Number.isFinite(cached?.prob)) return true;
      return layer2CandidateSeqs.has(candidate.seq) && !Number.isFinite(cached?.effectProb);
    });
    if (cfg.earlyPrune) {
      const elapsed = (earlySteps.get(session) ?? cfg.earlyMinSteps - 1) + 1;
      earlySteps.set(session, elapsed);
      if (elapsed < cfg.earlyMinSteps || fresh.reduce((n, c) => n + c.chars, 0) < cfg.earlyMinChars) return false;
      earlySteps.set(session, 0);
    }
    let pressureRatio = 0;
    if (cfg.judgeOn !== "always") {
      const meter = ctx.get("tokenMeter");
      let used = 0;
      let measured = false;
      try {
        if (typeof meter?.measure === "function") {
          const measuredTokens = meter.measure(session)?.totalTokens;
          if (typeof measuredTokens === "number" && Number.isFinite(measuredTokens)) {
            used = measuredTokens;
            measured = true;
          }
        }
      } catch {
        measured = false;
      }
      const windowTokens = await resolveWindow(agent);
      const limit = parseLimit(cfg.softLimit);
      const threshold = limit.kind === "ratio" ? windowTokens == null ? null : Math.floor(windowTokens * limit.value) : limit.value;
      stats.lastGate = {
        used,
        measured,
        windowTokens,
        limitRaw: cfg.softLimit,
        threshold,
        skip: false,
        reason: "",
        candidates: fresh.length
      };
      if (threshold == null) {
        pressureRatios.set(session, 0);
        stats.skipped += fresh.length;
        stats.lastGate = { ...stats.lastGate, skip: true, reason: "\u7A97\u53E3\u672A\u77E5\uFF08ratio \u6A21\u5F0F\u7B97\u4E0D\u51FA\u9608\u503C\uFF09" };
        stats.lastNote = "\u89E3\u6790\u4E0D\u51FA\u4E0A\u4E0B\u6587\u7A97\u53E3\uFF0C\u7B2C\u4E00\u5C42\u4FDD\u5B88\u8DF3\u8FC7\uFF08\u4E0E\u7B2C\u4E8C\u5C42\u540C\u5411\uFF09";
        log("info", stats.lastNote);
        return;
      }
      if (!measured) {
        stats.lastGate = { ...stats.lastGate, reason: "meter \u4E0D\u53EF\u7528\uFF0C\u672C\u6B21\u4E0D\u8BBE\u9632" };
        stats.lastNote = `\u62FF\u4E0D\u5230 token \u7528\u91CF\uFF08meter \u7F3A\u5931\u6216\u629B\u9519\uFF09\uFF0C\u538B\u529B\u95E8\u672C\u6B21\u4E0D\u8BBE\u9632\uFF08\u9608\u503C ${threshold}\uFF09`;
        log("warn", stats.lastNote);
      } else if (used < threshold) {
        pressureRatios.set(session, 0);
        stats.skipped += fresh.length;
        stats.lastGate = { ...stats.lastGate, skip: true, reason: `\u538B\u529B\u4E0D\u8DB3\uFF08${used} < ${threshold}\uFF09` };
        return;
      } else {
        pressureRatio = windowTokens != null && windowTokens > 0 ? Math.min(1, Math.max(0, (used - threshold) / windowTokens)) : 0;
      }
    } else {
      pressureRatio = cfg.alwaysTrimRatio;
    }
    pressureRatios.set(session, pressureRatio);
    if (fresh.length === 0) {
      stats.judgePassSkipped = (stats.judgePassSkipped ?? 0) + 1;
      stats.lastJudgeSkipReason = candidates.length === 0 ? `\u65E0\u5019\u9009\uFF08surface ${surface.length} \u8282\u70B9\uFF1A\u53EF\u80FD\u5168\u843D\u5728\u6700\u8FD1\u533A/\u9ED1\u540D\u5355/\u5DF2\u88C1\u526A\uFF09` : `\u5019\u9009\u5168\u90E8\u5DF2\u5224\u5B9A\uFF08\u5019\u9009 ${candidates.length}\uFF0C\u7F13\u5B58 ${cache.size}\uFF09`;
      return;
    }
    const goal = recentGoal(sessionEvents(session));
    const { state, fitted, stateTokens } = buildJevState({
      surface,
      eventAt,
      goal,
      context: STATE_CONTEXT,
      options: {
        textHead: cfg.textHead,
        textTail: cfg.textTail,
        maxStateTokens: cfg.maxStateTokens,
        inputChars: cfg.inputChars,
        minHistoryLines: cfg.minHistoryLines,
        // P0-2：结果摘录预算（0 = 关闭）。判断者能看到"里面是什么"再决定留不留。
        resultExcerptChars: cfg.resultExcerptChars
      }
    });
    if (!fitted) {
      log("info", `state \u2248 ${stateTokens} tokens \u4ECD\u8D85\u9884\u7B97 ${cfg.maxStateTokens}\uFF08\u884C\u6570\u5730\u677F ${cfg.minHistoryLines}\uFF09\uFF0C\u672C\u6279\u53EF\u80FD\u88AB\u670D\u52A1\u7AEF\u62D2\u7EDD`);
    }
    const questions = questionsFor(fresh, cfg.wording);
    for (const candidate of fresh) {
      const cached = cachedVerdictForEvent(cache, eventAt(candidate.seq));
      if (Number.isFinite(cached?.prob)) delete questions[`result_s${candidate.seq}`];
      if (!layer2CandidateSeqs.has(candidate.seq) || Number.isFinite(cached?.effectProb)) {
        delete questions[`effect_s${candidate.seq}`];
      }
    }
    if (cfg.earlyPrune && !fitted) return false;
    const allBatches = judge.batch(state, questions, {
      maxRequestTokens: cfg.maxRequestTokens,
      overheadTokens: 40
    });
    const batches = cfg.earlyPrune ? allBatches.slice(0, cfg.maxJudgeBatches) : allBatches;
    const bySeq = new Map(fresh.map((c) => [c.seq, c]));
    const freshSeqs = [...bySeq.keys()];
    const startRequests = judge.requests;
    let batchFailures = 0;
    let lastBatchError = null;
    let succeeded = 0;
    let incomplete = false;
    for (const batch of batches) {
      let answers;
      try {
        answers = await judge.ask(state, batch, { signal });
      } catch (error) {
        batchFailures += 1;
        lastBatchError = error;
        stats.judgeBatchFailures += 1;
        log("info", `\u5224\u5B9A\u6279\u6B21\u5931\u8D25\uFF08${batchFailures}/${batches.length}\uFF09\uFF1A${error?.message ?? String(error)}`);
        continue;
      }
      succeeded += 1;
      if (Object.keys(batch).some((id) => !Number.isFinite(answers[id]) || answers[id] < 0 || answers[id] > 1)) incomplete = true;
      const seqsInBatch = /* @__PURE__ */ new Set();
      for (const id of Object.keys(batch)) {
        const seq = Number(id.slice(id.indexOf("_s") + 2));
        if (Number.isFinite(seq)) seqsInBatch.add(seq);
      }
      for (const seq of seqsInBatch) {
        const candidate = bySeq.get(seq);
        if (candidate == null) continue;
        const prob = answers[`result_s${seq}`];
        const effectProb = answers[`effect_s${seq}`];
        const previous = cachedVerdictForEvent(cache, eventAt(candidate.seq));
        const merged = {
          keep: typeof prob === "number" ? prob >= cfg.keepThreshold : previous?.keep ?? (typeof effectProb === "number" ? effectProb >= cfg.keepThreshold : true),
          prob: typeof prob === "number" ? prob : previous?.prob ?? null,
          effectProb: typeof effectProb === "number" ? effectProb : previous?.effectProb ?? null,
          chars: candidate.chars,
          tool: candidate.tool
        };
        cache.set(seq, merged);
        for (const sourceSeq of eventAt(candidate.seq)?.sourceEventSeqs ?? []) {
          if (sourceSeq !== seq) cache.delete(sourceSeq);
        }
      }
    }
    for (const seq of freshSeqs) {
      const value = cachedVerdictForEvent(cache, eventAt(seq));
      const complete = Number.isFinite(value?.prob) && (!layer2CandidateSeqs.has(seq) || Number.isFinite(value?.effectProb));
      if (complete) {
        stats.judged += 1;
        if (typeof value.prob === "number") {
          stats.probSum += value.prob;
          stats.probCount += 1;
          if (value.prob >= cfg.keepThreshold) stats.keepAboveThreshold += 1;
          else stats.keepBelowThreshold += 1;
          probSamples.push(value.prob);
          if (probSamples.length > 500) probSamples.shift();
        }
      }
    }
    stats.requests += judge.requests - startRequests;
    if (batches.length > 0 && succeeded === 0) {
      throw lastBatchError ?? new Error("\u5168\u90E8\u5224\u5B9A\u6279\u6B21\u5931\u8D25");
    }
    stats.lastNote = `\u5224\u5B9A ${fresh.length} \u4E2A\u5019\u9009\uFF0Cstate \u2248 ${estimateTokens(state)} tokens` + (batchFailures > 0 ? `\uFF08${batchFailures}/${batches.length} \u6279\u5931\u8D25\uFF0C\u5DF2\u8DF3\u8FC7\uFF09` : "");
    log("debug", stats.lastNote);
    writeHeartbeat({
      lastJudgePass: {
        candidates: fresh.length,
        stateTokens: estimateTokens(state),
        nameIndexSize: nameByCallId.size,
        events: describeEvents(session),
        // 逐候选明细（seq/工具/概率）——viewer 画散点、排查"为什么裁这条"用
        rows: fresh.map((c) => {
          const v = cache.get(c.seq) ?? {};
          return { seq: c.seq, tool: c.tool, chars: c.chars, prob: v.prob ?? null, effectProb: v.effectProb ?? null };
        })
      },
      // P0-3：判定依据落盘（分布 + 门控快照），否则"阈值失配/门没开"在运行时不可见
      probSummary: probSummary(),
      // 原始样本（最近 200 个）——viewer 用它画直方图；分位数只能看形状不能看尾巴
      probSamples: probSamples.slice(-200),
      gate: stats.lastGate
    });
    return succeeded > 0 && batchFailures === 0 && !incomplete;
  }
  function pruneViaJev(pruner, session) {
    if (!cfg.enabled) return { pruned: [], charsRemoved: 0, plan: null, decisions: [] };
    const nameByCallId = buildToolNameIndex(sessionEvents(session));
    const out = pruneSessionWithJev({
      pruner,
      session,
      cache: decisions.get(session),
      cfg: { ...cfg, marker: JEV_PRUNE_MARKER, pressureRatio: pressureRatios.get(session) ?? 0 },
      stats,
      freeze: freezeMessage2,
      toolNameOf: (event) => toolNameOf(event, nameByCallId),
      callIdOf
    });
    stats.lastPrune = { dryRun: cfg.dryRun, pruned: out.pruned.length, charsRemoved: out.charsRemoved, seqs: out.pruned.map((p) => p.originalSeq) };
    writeHeartbeat({
      lastPrune: {
        dryRun: cfg.dryRun,
        nodes: session.surface?.nodes?.length ?? null,
        pruned: out.pruned.length,
        charsRemoved: out.charsRemoved,
        seqs: out.pruned.map((p) => p.originalSeq)
      },
      // P0-1/P0-3：预算分析与逐节点决策落盘——"裁了哪些、为什么、预算够不够"可复核
      budget: out.plan ?? null,
      decisions: out.decisions ?? []
    });
    if (Array.isArray(out.decisions) && out.decisions.length > 0) stats.decisions = out.decisions.slice(0, 50);
    return out;
  }
  function installPrunerOverride() {
    if (takeover.installed) return () => {
    };
    takeover = { attempted: true, installed: false, reason: "" };
    const pruner = ctx.get("toolResultPruner") ?? ctx.toolResultPruner;
    if (pruner == null || typeof pruner.pruneSession !== "function") {
      takeover.reason = pruner == null ? "ctx.toolResultPruner \u4E0D\u5B58\u5728 \u2014\u2014 \u9700\u52A0\u8F7D @deepseek-ai/dsh-compaction-tool-result-pruner" : "pruner.pruneSession \u4E0D\u662F\u51FD\u6570";
      log("info", `${takeover.reason}\uFF1B\u672C\u6B21\u4E0D\u4ECB\u5165\uFF08\u82E5\u670D\u52A1\u7A0D\u540E\u624D\u5C31\u7EEA\uFF0C\u4F1A\u5728\u4E0B\u4E00\u6B21 pre-step \u91CD\u8BD5\uFF09`);
      writeHeartbeat();
      return () => {
      };
    }
    const originalSession = pruner.pruneSession.bind(pruner);
    pruner.pruneSession = (session) => pruneViaJev(pruner, session);
    takeover = { attempted: true, installed: true, reason: "ok" };
    log("info", `\u5DF2\u63A5\u7BA1 ctx.toolResultPruner.pruneSession\uFF08keepThreshold=${cfg.keepThreshold}, preserveRecent=${cfg.preserveRecent}, dryRun=${cfg.dryRun}\uFF09`);
    for (const w of cfg[CONFIG_WARNINGS] ?? []) log("warn", w);
    writeHeartbeat();
    return () => {
      pruner.pruneSession = originalSession;
    };
  }
  let fenceCounter = 0;
  let activeFence = 0;
  const pendingReceipt = /* @__PURE__ */ new WeakMap();
  function summaryService() {
    return ctx.get?.("compaction") ?? ctx.compaction ?? null;
  }
  function installSummaryHook() {
    if (!cfg.compactReceipts) return () => {
    };
    if (summaryHook.installed) return () => {
    };
    summaryHook = { attempted: true, installed: false, reason: "" };
    const compaction = summaryService();
    if (compaction == null || typeof compaction.summarize !== "function") {
      summaryHook.reason = compaction == null ? "ctx.compaction \u4E0D\u5B58\u5728 \u2014\u2014 \u9700\u52A0\u8F7D @deepseek-ai/dsh-compaction-basic" : "compaction.summarize \u4E0D\u662F\u51FD\u6570\uFF08\u8BE5\u538B\u7F29\u540E\u7AEF\u4E0D\u66B4\u9732\u8FD9\u4E2A\u63A5\u5165\u70B9\uFF09";
      log("info", `${summaryHook.reason}\uFF1B\u7B2C\u4E8C\u5C42\u4E0D\u4ECB\u5165`);
      writeHeartbeat();
      return () => {
      };
    }
    const original = compaction.summarize.bind(compaction);
    compaction.summarize = async (input, agent, signal) => {
      const entry = pendingReceipt.get(agent?.session);
      if (entry != null && !entry.claimed && entry.fence === activeFence && Date.now() - entry.at < 5 * 60 * 1e3) {
        entry.claimed = true;
        stats.receiptSummaries += 1;
        return {
          summary: [{ type: "text", text: entry.text }],
          provider: "jev-receipt",
          model: "deterministic"
        };
      }
      if (entry != null && !entry.claimed && entry.fence !== activeFence) {
        stats.receiptFenceMisses += 1;
      }
      return original(input, agent, signal);
    };
    summaryHook = { attempted: true, installed: true, reason: "ok" };
    log("info", `\u5DF2\u63A5\u7BA1 ctx.compaction.summarize\uFF08\u56DE\u6267\u6A21\u5F0F\uFF1BcompactOn=${cfg.compactOn}, quantile=${cfg.compactQuantile}\uFF09`);
    writeHeartbeat();
    return () => {
      compaction.summarize = original;
    };
  }
  function spanTokens(agent, seqs) {
    const meter = ctx.get?.("tokenMeter");
    if (meter == null || typeof meter.measure !== "function") return null;
    try {
      const wanted = new Set(seqs);
      const nodes = meter.measure(agent.session)?.nodes ?? [];
      let total = 0;
      let seen = 0;
      for (const node of nodes) {
        if (!wanted.has(node.seq)) continue;
        total += node.tokens ?? node.heuristicTokens ?? 0;
        seen += 1;
      }
      return seen > 0 ? total : null;
    } catch {
      return null;
    }
  }
  function findCompactionRecord(session, { seq, start, end }) {
    const events = sessionEvents(session);
    if (seq != null) {
      const event = typeof session.eventAt === "function" ? session.eventAt(seq) : events.find((e) => e.seq === seq);
      if (event?.type === "compaction/summary") return event;
      if (isCheckpointEvent(event)) {
        const id = event.data?.source?.compactionId;
        return [...events].reverse().find((e) => e.type === "compaction/summary" && e.data?.compactionId === id) ?? null;
      }
    }
    return [...events].reverse().find((e) => e.type === "compaction/summary" && (start == null || e.data?.shadowedRange?.start === start) && (end == null || e.data?.shadowedRange?.end === end)) ?? null;
  }
  async function compactPass(agent, options = {}) {
    const force = options.force === true;
    const dryRun = options.dryRun ?? cfg.dryRun;
    const report = { blocked: "", verdicts: 0, eligible: [], considered: 0, selection: null, actions: [] };
    if (!cfg.compactReceipts) {
      report.blocked = "compactReceipts=false";
      return report;
    }
    if (cfg.compactOn === "off" && !force) {
      report.blocked = "compactOn=off";
      return report;
    }
    const session = agent?.session;
    if (session?.surface?.nodes == null) {
      report.blocked = "\u6CA1\u6709\u6D3B\u52A8\u4F1A\u8BDD";
      return report;
    }
    const compaction = summaryService();
    if (compaction == null || typeof compaction.compactRegion !== "function") {
      report.blocked = "ctx.compaction \u4E0D\u53EF\u7528\uFF08compactRegion \u7F3A\u5931\uFF09";
      return report;
    }
    if (!summaryHook.installed) {
      report.blocked = `summarize \u672A\u63A5\u7BA1\uFF08${summaryHook.reason || "\u672A\u5C1D\u8BD5"}\uFF09\u2014\u2014 \u4E0D\u505A\u7B2C\u4E8C\u5C42\uFF0C\u907F\u514D\u9000\u5316\u6210\u6A21\u578B\u6458\u8981`;
      return report;
    }
    if (judge.ready === false) {
      report.blocked = "\u672A\u914D\u7F6E TYPESAFE_API_KEY";
      return report;
    }
    if (!force && cfg.compactOn !== "always") {
      const meter = ctx.get?.("tokenMeter");
      let used = 0;
      let measured = false;
      try {
        if (typeof meter?.measure === "function") {
          const measuredTokens = meter.measure(session)?.totalTokens;
          if (typeof measuredTokens === "number" && Number.isFinite(measuredTokens)) {
            used = measuredTokens;
            measured = true;
          }
        }
      } catch {
        measured = false;
      }
      const limit = parseLimit(cfg.compactSoftLimit);
      const windowTokens = await resolveWindow(agent);
      const threshold = limit.kind === "ratio" ? windowTokens == null ? null : Math.floor(windowTokens * limit.value) : limit.value;
      if (threshold == null) {
        report.blocked = "\u89E3\u6790\u4E0D\u51FA\u4E0A\u4E0B\u6587\u7A97\u53E3\uFF0C\u4FDD\u5B88\u8DF3\u8FC7\u7B2C\u4E8C\u5C42";
        stats.compactSkipped += 1;
        return report;
      }
      if (!measured) {
        report.blocked = `\u62FF\u4E0D\u5230 token \u7528\u91CF\uFF08meter \u7F3A\u5931\u6216\u629B\u9519\uFF09\uFF0C\u538B\u529B\u95E8\u672C\u6B21\u4E0D\u8BBE\u9632\uFF08\u9608\u503C ${threshold}\uFF09`;
        log("warn", report.blocked);
      } else if (used < threshold) {
        report.blocked = `\u538B\u529B\u4E0D\u8DB3\uFF08${used} < ${threshold}\uFF09`;
        stats.compactSkipped += 1;
        return report;
      }
    }
    const cache = decisions.get(session);
    if (cache == null || cache.size === 0) {
      report.blocked = "\u8FD8\u6CA1\u6709\u4EFB\u4F55 Jev \u5224\u5B9A\uFF08\u5224\u5B9A\u5728 agent/pre-step \u91CC\u8DD1\uFF09";
      stats.compactSkipped += 1;
      return report;
    }
    const surface = [...session.surface.nodes];
    const verdicts = surface.flatMap((seq) => {
      const value = cachedVerdictForEvent(cache, session.eventAt(seq));
      return value != null && isCompactableTool(value.tool, cfg) ? [{ seq, ...value }] : [];
    });
    report.verdicts = verdicts.length;
    let eligibleSeqs;
    if (cfg.compactMode === "relative") {
      eligibleSeqs = computeEligibleSeqs(verdicts, {
        quantile: cfg.compactQuantile,
        minCandidates: cfg.minCandidatesForRelative,
        minCandidatesForAbsolute: cfg.minCandidatesForFloor,
        floorThreshold: cfg.floorThreshold,
        // 降级模式的说明必须能被看到：否则用户只会看到"交集为空"，
        // 又回到"分不清是样本不够还是功能坏了"的老问题（issue #27）
        onNote: (note) => {
          report.quantileNote = note;
        }
      });
    } else {
      eligibleSeqs = new Set(verdicts.filter((v) => typeof v.prob === "number" && v.prob < cfg.compactThreshold && typeof v.effectProb === "number" && v.effectProb < cfg.compactThreshold).map((v) => v.seq));
    }
    report.eligible = [...eligibleSeqs].sort((a, b) => a - b);
    if (eligibleSeqs.size === 0) {
      report.blocked = report.quantileNote ?? (cfg.compactMode === "relative" ? `\u4E24\u8F74\u5C3E\u90E8\u4EA4\u96C6\u4E3A\u7A7A\uFF08\u5019\u9009 ${verdicts.length} \u4E2A\uFF0C\u9700\u8981 \u2265${cfg.minCandidatesForRelative} \u4E2A\uFF09` : "\u6CA1\u6709\u540C\u65F6\u4F4E\u4E8E\u9608\u503C\u7684\u5019\u9009");
      stats.compactSkipped += 1;
      return report;
    }
    const eventAt = (seq) => session.eventAt(seq);
    const { ranges, stats: selection } = selectReceiptRanges({
      surface,
      eventAt,
      cache,
      dropVerdict: (seq) => eligibleSeqs.has(seq),
      cfg: { ...cfg, preserveRecent: cfg.compactPreserveRecent }
    });
    report.selection = selection;
    report.considered = ranges.length;
    if (ranges.length === 0) {
      report.blocked = "\u6CA1\u6709\u5408\u683C\u7684\u8FDE\u7EED\u53EA\u8BFB\u6B65\u9AA4\u6BB5\uFF08\u89C1 selection \u7684\u5404\u6761\u6392\u9664\u8BA1\u6570\uFF09";
      stats.compactSkipped += 1;
      return report;
    }
    let done = 0;
    for (const range of ranges) {
      if (done >= cfg.maxCompactionsPerPass) break;
      const isPartial = range.kind === "partial";
      const pairs = isPartial ? range.steps.flatMap((step) => step.pairs ?? []) : [];
      const spanSeqs = isPartial ? pairs.map((pair) => pair.seq) : surface.slice(range.startIdx, range.endIdx + 1);
      const partialReceipts = isPartial ? pairs.map((pair) => renderPartialResultReceipt(pair, { argChars: cfg.receiptArgChars })) : [];
      const receipt = isPartial ? partialReceipts.join("\n") : renderReceipt(range, {
        eventAt,
        argChars: cfg.receiptArgChars,
        textChars: cfg.receiptTextChars
      });
      const receiptTokens = estimateTokens(receipt);
      const shadowedTokens = spanTokens(agent, spanSeqs);
      const action = {
        start: range.start,
        end: range.end,
        nodes: spanSeqs.length,
        calls: range.steps.reduce((sum, step) => sum + step.calls.length, 0),
        resultChars: range.chars,
        receiptTokens,
        shadowedTokens,
        receipt,
        partial: isPartial
      };
      if (shadowedTokens != null && receiptTokens > shadowedTokens * cfg.receiptMaxRatio) {
        action.skipped = `\u56DE\u6267 ${receiptTokens} tokens \u76F8\u5BF9\u539F\u5185\u5BB9 ${shadowedTokens} \u592A\u5927\uFF08\u4E0A\u9650 ${(cfg.receiptMaxRatio * 100).toFixed(0)}%\uFF09`;
        report.actions.push(action);
        continue;
      }
      if (dryRun) {
        action.dryRun = true;
        report.actions.push(action);
        done += 1;
        continue;
      }
      if (isPartial) {
        let applied = 0;
        let appliedChars = 0;
        try {
          const meter = ctx.get?.("tokenMeter");
          for (let offset = 0; offset < pairs.length; offset += 1) {
            const pair = pairs[offset];
            const event = session.eventAt(pair.seq);
            if (event?.type !== "tool/result" || !session.surface.nodes.includes(pair.seq)) {
              throw new Error(`\u6279\u91CF\u6B65\u9AA4\u7684\u7ED3\u679C s${pair.seq} \u5728\u56DE\u6267\u66FF\u6362\u524D\u5DF2\u79BB\u5F00 surface`);
            }
            const original = event.data?.message;
            const blocks = original?.content;
            if (!Array.isArray(blocks)) throw new Error(`tool/result s${pair.seq} \u7F3A\u5C11 message.content`);
            const result = blocks.find((block) => block?.type === "tool-result");
            if (result == null) throw new Error(`tool/result s${pair.seq} \u7F3A\u5C11 tool-result block`);
            const text = partialReceipts[offset];
            const message = freezeMessage2({
              ...original,
              content: blocks.map((block) => block === result ? { ...result, content: [{ type: "text", text }] } : block)
            });
            const shadowedTokenCount = typeof meter?.estimateMessage === "function" ? meter.estimateMessage(original) : estimateTokens(JSON.stringify(original));
            session.append("compaction/prune", {
              shadowedRange: { start: pair.seq, end: pair.seq },
              shadowedSeqs: [pair.seq],
              shadowedTokenCount
            });
            session.append("tool/result", { ...event.data, message }, {
              surfaceOp: { op: "replace", startSeq: pair.seq, endSeq: pair.seq },
              sourceEventSeqs: [pair.seq]
            });
            cache.delete(pair.seq);
            for (const sourceSeq of event.sourceEventSeqs ?? []) cache.delete(sourceSeq);
            applied += 1;
            appliedChars += pair.chars;
          }
          done += 1;
          stats.compactions += 1;
          stats.compactedSeqs += applied;
          stats.compactedChars += appliedChars;
          stats.receiptSummaries += applied;
          action.ok = true;
          action.shadowedSeqs = applied;
          action.partialResults = applied;
          report.actions.push(action);
        } catch (error) {
          if (applied > 0) {
            done += 1;
            stats.compactions += 1;
            stats.compactedSeqs += applied;
            stats.compactedChars += appliedChars;
            stats.receiptSummaries += applied;
            action.nodes = applied;
            action.calls = applied;
            action.partialResults = applied;
            action.resultChars = appliedChars;
            action.shadowedSeqs = applied;
            action.ok = true;
            action.incomplete = true;
          }
          stats.errors += 1;
          action.error = error?.message ?? String(error);
          report.actions.push(action);
        }
        continue;
      }
      const fence = fenceCounter += 1;
      activeFence = fence;
      pendingReceipt.set(session, { text: receipt, at: Date.now(), fence, claimed: false });
      try {
        const result = await compaction.compactRegion(range.start, range.end, agent, options.signal);
        if (activeFence !== fence) {
          stats.receiptFenceMisses += 1;
          action.fenceLost = true;
        }
        done += 1;
        stats.compactions += 1;
        stats.compactedSeqs += result?.shadowedSeqs?.length ?? spanSeqs.length;
        stats.compactedChars += range.chars;
        action.ok = true;
        action.shadowedSeqs = result?.shadowedSeqs?.length ?? null;
        action.compactionId = String(result?.compactionId ?? "");
        report.actions.push(action);
        for (const seq of spanSeqs) {
          const event = session.eventAt(seq);
          cache.delete(seq);
          for (const sourceSeq of event?.sourceEventSeqs ?? []) cache.delete(sourceSeq);
        }
      } catch (error) {
        stats.errors += 1;
        action.error = error?.message ?? String(error);
        report.actions.push(action);
      } finally {
        const current = pendingReceipt.get(session);
        if (current?.fence === fence) pendingReceipt.delete(session);
        if (activeFence === fence) activeFence = 0;
      }
    }
    const okCount = report.actions.filter((a) => a.ok).length;
    const dry = report.actions.filter((a) => a.dryRun).length;
    stats.lastCompactNote = okCount > 0 ? `\u56DE\u6267\u538B\u7F29 ${okCount} \u6BB5\uFF1A\u5904\u7406 ${report.actions.reduce((sum, a) => sum + (a.nodes ?? 0), 0)} \u4E2A\u8282\u70B9\u3001\u7701\u7EA6 ${report.actions.reduce((sum, a) => sum + (a.resultChars ?? 0), 0)} \u5B57\u7B26` : dry > 0 ? `dry-run\uFF1A${dry} \u6BB5\u53EF\u538B\uFF08\u672A\u6267\u884C\uFF09` : report.blocked || "\u672A\u6267\u884C";
    log("debug", stats.lastCompactNote);
    writeHeartbeat({
      lastCompact: {
        blocked: report.blocked,
        eligible: report.eligible,
        // 分位总体太小而走降级时的说明；为空即正常走相对分位（issue #27 的可观测出口）
        quantileNote: report.quantileNote ?? null,
        selection: report.selection == null ? null : {
          skippedTail: report.selection.skippedTail,
          skippedTool: report.selection.skippedTool,
          skippedVerdict: report.selection.skippedVerdict,
          skippedGuard: report.selection.skippedGuard,
          skippedText: report.selection.skippedText,
          skippedReasoning: report.selection.skippedReasoning,
          skippedIncomplete: report.selection.skippedIncomplete,
          skippedShort: report.selection.skippedShort,
          skippedReceipt: report.selection.skippedReceipt,
          partialSteps: report.selection.partialSteps,
          partialResults: report.selection.partialResults,
          // 工具名如实落盘：这是"白名单没配上"唯一能自查的证据
          blockedToolNames: report.selection.blockedToolNames,
          allowedToolNames: report.selection.allowedToolNames
        },
        actions: report.actions.map((a) => ({
          start: a.start,
          end: a.end,
          ok: a.ok ?? null,
          dryRun: a.dryRun ?? null,
          calls: a.calls,
          resultChars: a.resultChars,
          receiptTokens: a.receiptTokens,
          shadowedTokens: a.shadowedTokens,
          partial: a.partial ?? false,
          partialResults: a.partialResults ?? null,
          incomplete: a.incomplete ?? false,
          error: a.error ?? null,
          skipped: a.skipped ?? null
        }))
      }
    });
    return report;
  }
  ctx.effect(() => installPrunerOverride());
  ctx.effect(() => installSummaryHook());
  ctx.on("agent/pre-step", async ({ agent, signal }, next) => {
    stats.preStepEvents = (stats.preStepEvents ?? 0) + 1;
    if (!cfg.enabled) return next();
    judge.model = cfg.model;
    judge.timeoutMs = cfg.judgeTimeoutMs;
    if (!deps.judge && cfg.apiKey) judge.apiKey = cfg.apiKey;
    if (!takeover.installed) installPrunerOverride();
    if (!summaryHook.installed) installSummaryHook();
    if (!deps.judge && !cfg.apiKey && cfg.credentialRef) {
      try {
        judge.apiKey = (await ctx.get("credentials")?.resolve(cfg.credentialRef))?.value || envKey || "";
      } catch {
        judge.apiKey = "";
      }
    }
    if (judge.ready === false) {
      stats.errors += 1;
      stats.lastNote = "\u672A\u914D\u7F6E TYPESAFE_API_KEY\uFF0C\u8DF3\u8FC7\u5224\u5B9A";
      writeHeartbeat();
      return next();
    }
    try {
      const judged = await judgePass(agent, signal);
      if (cfg.earlyPrune && judged && !signal?.aborted) {
        pruneViaJev(ctx.get("toolResultPruner") ?? ctx.toolResultPruner, agent.session);
      }
    } catch (error) {
      stats.errors += 1;
      stats.lastNote = `\u5224\u5B9A\u5931\u8D25\uFF1A${error?.message ?? String(error)}`;
      log("info", stats.lastNote);
    }
    writeHeartbeat();
    return next();
  }, { prepend: true, global: true });
  ctx.on("agent/pre-step", async ({ agent, signal }, next) => {
    try {
      const report = await compactPass(agent, { signal });
      if (report?.blocked) {
        stats.lastCompactNote = report.blocked;
        if (report.quantileNote) stats.lastCompactNote += `\uFF08${report.quantileNote}\uFF09`;
        if (report.selection) {
          const sel = report.selection;
          const parts = [];
          for (const [k, label] of [["skippedTail", "tail"], ["skippedTool", "tool"], ["skippedVerdict", "verdict"], ["skippedIncomplete", "incomplete"], ["skippedGuard", "guard"], ["skippedText", "text"], ["skippedReasoning", "reasoning"], ["skippedShort", "short"]]) {
            if (sel[k]) parts.push(`${label}:${sel[k]}`);
          }
          if (sel.eligibleSteps) parts.push(`eligible:${sel.eligibleSteps}`);
          if (parts.length) stats.lastCompactNote += ` [${parts.join(" ")}]`;
        }
      }
    } catch (error) {
      stats.errors += 1;
      stats.lastCompactNote = `\u56DE\u6267\u538B\u7F29\u5931\u8D25\uFF1A${error?.message ?? String(error)}`;
      log("info", stats.lastCompactNote);
    }
    writeHeartbeat();
    return next();
  });
  function renderStatus(agent) {
    const session = agent?.session;
    const cache = session != null ? decisions.get(session) ?? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Map();
    const meter = ctx.get("tokenMeter");
    const used = session != null && typeof meter?.measure === "function" ? meter.measure(session)?.totalTokens ?? 0 : 0;
    const nameProbe = session?.surface?.nodes != null ? probeToolNames({
      surface: [...session.surface.nodes],
      eventAt: (seq) => session.eventAt(seq),
      events: sessionEvents(session),
      limit: 6
    }) : { indexSize: 0, resolved: 0, unresolved: 0, names: [] };
    const lines = [
      `jev-prune  usage: ${used} tokens   model=${cfg.model}   ready=${judge.ready !== false}`,
      `DSH \u7248\u672C: ${dshVersion}\uFF08\u9488\u5BF9 ${TESTED_DSH_VERSION} \u6D4B\u8BD5\uFF09` + (dshVersionMatches === false ? "  \u26A0\uFE0F \u7248\u672C\u7CFB\u5217\u4E0D\u5339\u914D\u2014\u2014\u4E8B\u4EF6\u5B57\u6BB5\u53EF\u80FD\u5DF2\u53D8\uFF0C\u8BF7\u5148\u8DD1\u4E00\u6B21 jev_probe_shapes \u6838\u5BF9" : ""),
      `\u7B2C\u4E00\u5C42 \u6A21\u5F0F=${cfg.keepMode}${cfg.keepMode === "budget" ? `\uFF08\u538B\u529B\u5206\u4F4D\uFF1A\u88C1\u6389\u6C60\u5B50\u603B\u589E\u76CA\u7684\u300C\u538B\u529B\u7F3A\u53E3\u6BD4\u4F8B\u300D\uFF0C\u7531 judgePass \u6BCF\u8F6E\u81EA\u52A8\u8BA1\u7B97\uFF1B\u4FDD\u62A4\u4E0A\u9650 prob\u2265${cfg.keepThreshold}\uFF09` : `\uFF08\u7EDD\u5BF9\u9608\u503C keep\u2265${cfg.keepThreshold}\uFF09`}   preserveRecent=${cfg.preserveRecent}   minChars=${cfg.minCharsToPrune}   \u6458\u5F55=${cfg.resultExcerptChars}\u5B57\u7B26`,
      // 越界配置被钳制时必须显式列出：否则"我配了却没生效"会被误当成插件 bug（issue #28）
      ...cfg[CONFIG_WARNINGS]?.length > 0 ? [
        `\u26A0\uFE0F \u914D\u7F6E\u4FEE\u6B63 ${cfg[CONFIG_WARNINGS].length} \u5904\uFF08\u8D8A\u754C\u503C\u5DF2\u88AB\u94B3\u5236\uFF0C\u5B9E\u9645\u751F\u6548\u503C\u89C1\u4E0A\uFF09\uFF1A`,
        ...cfg[CONFIG_WARNINGS].map((w) => `    \xB7 ${w}`)
      ] : [],
      `\u7B2C\u4E00\u5C42\uFF1A\u5224\u5B9A ${stats.judged} \u6B21 / \u8BF7\u6C42 ${stats.requests} \u6B21   Jev \u4FDD\u7559 ${stats.keptByJev} / Jev \u88C1\u6389 ${stats.prunedByJev} / \u6309\u4F53\u79EF\u515C\u5E95\u88C1 ${stats.prunedByVolume}\uFF08\u6700\u8FD1\u533A\u4FDD\u62A4 ${stats.keptByTail} / \u9ED1\u540D\u5355\u4FDD\u62A4 ${stats.keptByBlacklist} / \u9884\u7B97\u7528\u5C3D\u4FDD\u7559 ${stats.keptByBudget} \u4E0D\u8BA1\u5165 Jev\uFF09`,
      // P0-3：概率分布 + 门控快照。这两行是"阈值是否失配 / 门为什么没开"的唯一现场证据，
      // 过去缺失导致 P0-1/P0-1b 只能在外部用探针挖出来。
      probSummary() == null ? "\u7B2C\u4E00\u5C42\uFF1Akeep \u6982\u7387\u5206\u5E03\uFF08\u6682\u65E0\u6837\u672C\uFF09" : `\u7B2C\u4E00\u5C42\uFF1Akeep \u6982\u7387 P10/P50/P90 = ${probSummary().p10}/${probSummary().p50}/${probSummary().p90}\uFF08\u6837\u672C ${probSummary().n}\uFF0C\u9AD8\u4E8E\u9608\u503C ${probSummary().aboveKeepThreshold} / \u4F4E\u4E8E ${probSummary().belowKeepThreshold}\uFF09` + (probSummary().n >= 10 && probSummary().aboveKeepThreshold === 0 && cfg.keepMode === "absolute" ? "   \u26A0\uFE0F \u5168\u90E8\u4F4E\u4E8E\u9608\u503C\u2014\u2014\u7EDD\u5BF9\u9608\u503C\u4E0E Jev \u7A84\u5E26\u5931\u914D\uFF0C\u5EFA\u8BAE\u4FDD\u6301 keepMode=budget" : ""),
      stats.lastGate == null ? "\u7B2C\u4E00\u5C42\u95E8\u63A7\uFF1A\u5C1A\u672A\u8BC4\u4F30" : `\u7B2C\u4E00\u5C42\u95E8\u63A7\uFF1Aused=${stats.lastGate.used}\uFF08measured=${stats.lastGate.measured}\uFF09 / \u7A97\u53E3=${stats.lastGate.windowTokens ?? "\u672A\u77E5"} / \u9608\u503C=${stats.lastGate.threshold ?? "\u7B97\u4E0D\u51FA"}   ${stats.lastGate.skip ? `\u672C\u6B21\u8DF3\u8FC7\uFF1A${stats.lastGate.reason}` : "\u5DF2\u653E\u884C"}`,
      stats.lastBudget == null ? "\u7B2C\u4E00\u5C42\u9884\u7B97\uFF1A\u5C1A\u672A\u88C1\u526A" : `\u7B2C\u4E00\u5C42\u9884\u7B97\uFF1A${stats.lastBudget.note}`,
      // 口径：stats.skipped 累加的是**候选个数**（`+= fresh.length`），不是事件次数。
      // 这里的量词必须写"个"，否则 7 个候选被同一道门挡下会显示成"跳过 7 次"，
      // 与旁边同为计数的 `errors N 次`、以及事件计数的 `judgePassSkipped` 混淆。
      `\u7B2C\u4E00\u5C42\uFF1A\u7D2F\u8BA1\u7701\u4E0B ${stats.savedChars} \u5B57\u7B26   \u538B\u529B\u95E8\u63A7\u8DF3\u8FC7\u5019\u9009 ${stats.skipped} \u4E2A   \u9519\u8BEF ${stats.errors} \u6B21`,
      // P0-3 记下的"为什么一次都没判定"此前只落进心跳 JSON，人类可读的这份报告里没有——
      // 而 judged=0 时它恰恰是唯一有价值的一行：不引用它，「门没开 / 没有候选 /
      // session 形态不对」三者完全不可区分，只能靠猜。仅在"零判定且确实跳过过"时出现。
      ...(stats.judged ?? 0) === 0 && (stats.judgePassSkipped ?? 0) > 0 ? [`\u5224\u5B9A pass\uFF1A\u5DF2\u8DF3\u8FC7 ${stats.judgePassSkipped} \u6B21\uFF1B\u6700\u8FD1\u539F\u56E0\uFF1A${stats.lastJudgeSkipReason ?? "\uFF08\u672A\u8BB0\u5F55\uFF09"}`] : [],
      // 批次失败与重试计数只在异常时出现（issue #34）：常态下不该占版面。
      // 口径修正（PR #28 review）：这里要的是"最近一次 pass 重试了几次"（lastRetries），
      // 而不是 client 从建起来到现在的累计量——后者一旦抖动过就永久 >0，
      // 会让这一行在之后每一份报告里都出现，且数字只增不减。
      ...stats.judgeBatchFailures > 0 || judge.lastRetries > 0 ? [`\u5224\u5B9A\u8BF7\u6C42\uFF1A\u91CD\u8BD5 ${judge.lastRetries ?? 0} \u6B21   \u5931\u8D25\u6279\u6B21 ${stats.judgeBatchFailures} \u4E2A` + (judge.lastError ? `   \u6700\u8FD1\u9519\u8BEF\uFF1A${judge.lastError}` : "")] : [],
      // 累计重试只在真的发生过时出现，且与上面区分开，避免把历史当成现状
      ...judge.retries > 0 && judge.lastRetries === 0 ? [`\u5224\u5B9A\u8BF7\u6C42\uFF1A\u672C pass \u65E0\u91CD\u8BD5\uFF08\u672C\u4F1A\u8BDD\u7D2F\u8BA1\u91CD\u8BD5 ${judge.retries} \u6B21\u3001\u7D2F\u8BA1\u8BF7\u6C42 ${judge.requests} \u6B21\uFF09`] : [],
      `\u7B2C\u4E8C\u5C42\uFF1Asummarize=${summaryHook.installed ? "\u5DF2\u63A5\u7BA1" : `\u672A\u63A5\u7BA1(${summaryHook.reason || "\u672A\u5C1D\u8BD5"})`}   compactOn=${cfg.compactOn}   preserveRecent=${cfg.compactPreserveRecent}   ${cfg.compactMode}${cfg.compactMode === "relative" ? `(quantile=${cfg.compactQuantile})` : `(<${cfg.compactThreshold})`}`,
      `\u7B2C\u4E8C\u5C42\uFF1A\u56DE\u6267\u538B\u7F29 ${stats.compactions} \u6BB5 / \u5904\u7406 ${stats.compactedSeqs} \u8282\u70B9 / \u7701\u7EA6 ${stats.compactedChars} \u5B57\u7B26   \u56DE\u6267\u6458\u8981\u88AB\u6D88\u8D39 ${stats.receiptSummaries} \u6B21   \u538B\u529B\u8DF3\u8FC7 ${stats.compactSkipped} \u6B21` + (stats.receiptFenceMisses > 0 ? `   \u26A0\uFE0F \u56DE\u6267\u56E0\u5E76\u53D1\u538B\u7F29\u88AB\u62A2 ${stats.receiptFenceMisses} \u6B21\uFF08\u5DF2\u9000\u56DE\u6A21\u578B\u6458\u8981\uFF0C\u672A\u6C61\u67D3\u4ED6\u4EBA\u533A\u95F4\uFF09` : ""),
      `\u5DE5\u5177\u540D\uFF1A\u7D22\u5F15 ${nameProbe.indexSize} \u6761\uFF0C\u89E3\u6790\u6210\u529F ${nameProbe.resolved} / \u5931\u8D25 ${nameProbe.unresolved}   compactTools=${cfg.compactTools.length === 0 ? "[]\uFF08\u53EA\u7528\u9ED1\u540D\u5355\uFF09" : JSON.stringify(cfg.compactTools)}`,
      `\u672C\u4F1A\u8BDD\u5DE5\u5177\u540D\uFF1A${nameProbe.names.length > 0 ? nameProbe.names.join(", ") : "\uFF08\u65E0\uFF09"}`,
      `session.events \u5F62\u6001\uFF1A${JSON.stringify(describeEvents(session))}`,
      "",
      "\u5DF2\u7F13\u5B58\u5224\u5B9A\uFF08seq  tool  P(\u4FDD\u7559)  P(\u526F\u4F5C\u7528)  \u5B57\u7B26\uFF09:"
    ];
    const rows = [...cache.entries()].sort((a, b) => a[0] - b[0]);
    if (rows.length === 0) lines.push("  (\u7A7A \u2014\u2014 \u672A\u5230\u8F6F\u9608\u503C\u6216\u8FD8\u6CA1\u6709\u5019\u9009)");
    const fmt = (value) => typeof value === "number" ? value.toFixed(3) : " n/a ";
    for (const [seq, item] of rows) {
      lines.push(`  s${String(seq).padStart(5)}  ${String(item.tool).padEnd(12)} ${item.keep ? "\u4FDD\u7559 " : "\u88C1\u6389 "} ${fmt(item.prob)}  ${fmt(item.effectProb)}  ${item.chars}`);
    }
    if (stats.lastNote) lines.push("", `\u6700\u8FD1\uFF08\u7B2C\u4E00\u5C42\uFF09: ${stats.lastNote}`);
    if (stats.lastCompactNote) lines.push(`\u6700\u8FD1\uFF08\u7B2C\u4E8C\u5C42\uFF09: ${stats.lastCompactNote}`);
    return lines.join("\n");
  }
  function renderCompactReport(report, { dryRun }) {
    const lines = [
      `${dryRun ? "dry-run\uFF08\u672A\u6267\u884C\u4EFB\u4F55\u538B\u7F29\uFF09" : "\u56DE\u6267\u538B\u7F29 pass \u5B8C\u6210"}`,
      `\u5019\u9009\u5224\u5B9A ${report.verdicts} \u4E2A\uFF1B\u4E24\u8F74\u5C3E\u90E8\u4EA4\u96C6 ${report.eligible.length} \u4E2A${report.eligible.length > 0 ? ` \u2192 [${report.eligible.map((s) => `s${s}`).join(",")}]` : ""}`,
      `\u5408\u683C\u8303\u56F4 ${report.considered} \u6BB5`
    ];
    if (report.blocked) lines.push(`\u672A\u6267\u884C\uFF1A${report.blocked}`);
    if (report.quantileNote) lines.push(`\u5206\u4F4D\u8BF4\u660E\uFF1A${report.quantileNote}`);
    if (report.selection) {
      const s = report.selection;
      lines.push(`\u6392\u9664\u8BA1\u6570\uFF1A\u6700\u8FD1\u533A ${s.skippedTail} / \u5DE5\u5177\u4E0D\u5141\u8BB8 ${s.skippedTool} / \u5224\u5B9A\u4E0D\u901A\u8FC7 ${s.skippedVerdict} / \u8BC1\u636E\u5B88\u536B ${s.skippedGuard} / \u7ED3\u8BBA\u6587\u672C\u8FC7\u957F ${s.skippedText} / \u601D\u8003\u8349\u7A3F\u8FC7\u957F ${s.skippedReasoning} / \u914D\u5BF9\u4E0D\u5B8C\u6574 ${s.skippedIncomplete} / \u5DF2\u662F\u56DE\u6267 ${s.skippedReceipt ?? 0} / \u7701\u5F97\u592A\u5C11 ${s.skippedShort}`);
      if ((s.partialSteps ?? 0) > 0) {
        lines.push(`\u5E76\u884C\u6279\u6B21\u90E8\u5206\u56DE\u6267\uFF1A${s.partialSteps} \u6279 / ${s.partialResults} \u4E2A\u7ED3\u679C`);
      }
      const allow = Object.entries(s.allowedToolNames ?? {});
      const block = Object.entries(s.blockedToolNames ?? {});
      if (allow.length > 0) lines.push(`\u901A\u8FC7\u5DE5\u5177\u95E8\u7684\u8C03\u7528\u540D\uFF1A${allow.map(([n, c]) => `${n}\xD7${c}`).join(" ")}`);
      if (block.length > 0) {
        lines.push(`\u88AB\u5DE5\u5177\u95E8\u62E6\u4E0B\u7684\u8C03\u7528\u540D\uFF1A${block.map(([n, c]) => `${n}\xD7${c}`).join(" ")}\uFF08\u5F53\u524D compactTools=${cfg.compactTools.length === 0 ? "[] \u5DF2\u653E\u5BBD" : "\u53EA\u8BFB\u767D\u540D\u5355"}\uFF09`);
      }
      if (s.guardHits?.length > 0) {
        lines.push(`\u8BC1\u636E\u5B88\u536B\u547D\u4E2D\uFF1A${s.guardHits.map((h) => `s${h.headSeq}(${h.matches.slice(0, 3).join("/")})`).join(" ")}`);
      }
    }
    for (const action of report.actions) {
      const head = `\xB7 s${action.start}\u2013s${action.end}\uFF1A${action.calls} \u6B21\u8C03\u7528\uFF0C${action.nodes} \u4E2A\u8282\u70B9\uFF0C\u539F\u8F93\u51FA ${action.resultChars} \u5B57\u7B26 / ${action.shadowedTokens ?? "?"} tokens \u2192 \u56DE\u6267 ${action.receiptTokens} tokens`;
      if (action.ok) lines.push(`${head}  \u2705 \u5DF2\u538B\u7F29\uFF08compactionId ${action.compactionId?.slice(0, 8) ?? "?"}\uFF09`);
      else if (action.dryRun) lines.push(`${head}  \uFF08dry-run\uFF0C\u672A\u6267\u884C\uFF09`);
      else if (action.error) lines.push(`${head}  \u274C ${action.error}`);
      else if (action.skipped) lines.push(`${head}  \u23ED ${action.skipped}`);
    }
    const first = report.actions.find((a) => a.receipt);
    if (first != null && (dryRun || first.dryRun)) {
      lines.push("", "\u56DE\u6267\u5168\u6587\uFF1A", first.receipt);
    }
    return lines.join("\n");
  }
  const commands = ctx.get("commands");
  if (commands != null && typeof commands.register === "function") {
    commands.register({
      name: "jev",
      description: "\u67E5\u770B Jev \u88C1\u526A\u5224\u5B9A\u72B6\u6001",
      async handler(invocation) {
        return { kind: "success", text: renderStatus(invocation.agent) };
      }
    });
  }
  const toolsService = ctx.tools ?? ctx.get?.("tools");
  if (toolsService != null && typeof toolsService.register === "function") {
    toolsService.register(defineTool({
      name: "jev_prune_status",
      description: "Show Jev-driven tool-result pruning status: thresholds, cached per-node judgments, and savings.",
      parameters: {},
      output: {
        schema: { type: "string" },
        render: (_args, value) => [{ type: "text", text: value }]
      },
      async execute(_args, exec) {
        return renderStatus(exec?.agent);
      }
    }));
    toolsService.register(defineTool({
      name: "jev_prune_now",
      description: "Force one Jev-scored tool-result pruning pass on the current session and report what happened. Normally pruning is driven by context pressure; this triggers it explicitly so the behaviour can be inspected.",
      parameters: {},
      output: {
        schema: { type: "string" },
        render: (_args, value) => [{ type: "text", text: value }]
      },
      async execute(_args, exec) {
        const session = exec?.agent?.session;
        if (session?.surface?.nodes == null) return "\u6CA1\u6709\u6D3B\u52A8\u4F1A\u8BDD";
        const pruner = ctx.get("toolResultPruner") ?? ctx.toolResultPruner;
        if (pruner == null) return "ctx.toolResultPruner \u4E0D\u53EF\u7528";
        const cache = decisions.get(session) ?? /* @__PURE__ */ new Map();
        const judgedSeqs = [...cache.entries()].map(([seq, v]) => `s${seq}:${v.keep ? "\u4FDD\u7559" : "\u88C1"}(${typeof v.prob === "number" ? v.prob.toFixed(2) : "n/a"})`);
        let out;
        try {
          out = pruner.pruneSession(session);
        } catch (error) {
          return `\u88C1\u526A\u5931\u8D25\uFF1A${error?.message ?? String(error)}`;
        }
        const lines = [
          `\u88C1\u526A\u5B8C\u6210\uFF1A\u5904\u7406 ${out.pruned.length} \u6761\uFF0C\u7701\u4E0B ${out.charsRemoved} \u5B57\u7B26`,
          `\u672C\u4F1A\u8BDD\u5DF2\u6709\u5224\u5B9A\uFF1A${judgedSeqs.length > 0 ? judgedSeqs.join("  ") : "\uFF08\u65E0\uFF09"}`,
          `\u7D2F\u8BA1\uFF1AJev \u4FDD\u7559 ${stats.keptByJev} / Jev \u88C1\u6389 ${stats.prunedByJev} / \u6309\u4F53\u79EF\u515C\u5E95\u88C1 ${stats.prunedByVolume}`
        ];
        if (out.pruned.length > 0) {
          lines.push("\u9010\u6761\uFF1A");
          for (const p of out.pruned) lines.push(`  s${p.originalSeq} (${p.callId ?? "?"})  ${p.charsBefore} \u2192 ${p.charsAfter} \u5B57\u7B26`);
        } else if (judgedSeqs.length === 0) {
          lines.push("\u6CA1\u6709\u4EFB\u4F55\u5224\u5B9A\uFF0C\u6240\u4EE5\u5168\u90E8\u9000\u56DE\u6309\u4F53\u79EF\u88C1\u51B3\u3002\u5224\u5B9A\u53D1\u751F\u5728 agent/pre-step\uFF1B\u82E5\u521A\u624D\u662F\u9996\u8F6E\uFF0C\u5148\u518D\u505A\u4E00\u6B21\u5DE5\u5177\u8C03\u7528\u8BA9\u5224\u5B9A\u8DD1\u8D77\u6765\u3002");
          const skipCount = stats.judgePassSkipped ?? 0;
          if (skipCount > 0) {
            lines.push(`\u5224\u5B9A pass \u5DF2\u8DF3\u8FC7 ${skipCount} \u6B21\uFF1B\u6700\u8FD1\u539F\u56E0\uFF1A${stats.lastJudgeSkipReason ?? "\uFF08\u672A\u8BB0\u5F55\uFF09"}`);
          }
          if (stats.lastGate?.skip === true) {
            lines.push(`\u538B\u529B\u95E8\u5FEB\u7167\uFF1Aused=${stats.lastGate.used} measured=${stats.lastGate.measured} window=${stats.lastGate.windowTokens} threshold=${stats.lastGate.threshold ?? "\u7B97\u4E0D\u51FA"}\uFF08${stats.lastGate.reason || "\u672A\u77E5"}\uFF09`);
          }
        }
        return lines.join("\n");
      }
    }));
    toolsService.register(defineTool({
      name: "jev_compact_now",
      description: "Force one Jev-driven receipt compaction pass: pick spent read-only tool-call ranges and replace them with a deterministic receipt instead of a model-written summary. Normally driven by context pressure; this triggers it explicitly so the behaviour can be inspected. Pass dryRun to only report what would be compacted.",
      parameters: {
        dryRun: { type: "boolean", description: "Only report the chosen ranges and the receipt text; do not compact." }
      },
      output: {
        schema: { type: "string" },
        render: (_args, value) => [{ type: "text", text: value }]
      },
      async execute(args, exec) {
        const agent = exec?.agent;
        if (agent?.session == null) return "\u6CA1\u6709\u6D3B\u52A8\u4F1A\u8BDD";
        const dryRun = args?.dryRun ?? cfg.dryRun;
        let report;
        try {
          report = await compactPass(agent, { force: true, dryRun, signal: exec?.signal });
        } catch (error) {
          return `\u56DE\u6267\u538B\u7F29\u5931\u8D25\uFF1A${error?.message ?? String(error)}`;
        }
        return renderCompactReport(report, { dryRun });
      }
    }));
    toolsService.register(defineTool({
      name: "jev_restore",
      description: "Return the original text hidden by a compaction checkpoint (read-only safety valve). The originals always stay in the session log; this surfaces them again without restoring the surface.",
      parameters: {
        seq: { type: "integer", description: "Checkpoint surface seq, or the seq of a compaction/summary event" },
        start: { type: "integer", description: "Original shadowed range start seq" },
        end: { type: "integer", description: "Original shadowed range end seq" }
      },
      output: {
        schema: { type: "string" },
        render: (_args, value) => [{ type: "text", text: value }]
      },
      async execute(args, exec) {
        const session = exec?.agent?.session;
        if (session == null) return "\u6CA1\u6709\u6D3B\u52A8\u4F1A\u8BDD";
        let record;
        try {
          record = findCompactionRecord(session, {
            seq: args?.seq ?? null,
            start: args?.start ?? null,
            end: args?.end ?? null
          });
        } catch (error) {
          return `\u67E5\u627E\u5931\u8D25\uFF1A${error?.message ?? String(error)}`;
        }
        if (record == null) return "\u6CA1\u6709\u5339\u914D\u7684\u538B\u7F29\u68C0\u67E5\u70B9\uFF08\u7ED9 seq\uFF0C\u6216\u7ED9 start/end\uFF0C\u6216\u90FD\u4E0D\u7ED9\u5219\u53D6\u6700\u8FD1\u4E00\u4E2A\uFF09";
        const range = record.data?.shadowedRange ?? {};
        const seqs = record.data?.shadowedSeqs ?? [];
        const parts = [`\u8FD8\u539F s${range.start}\u2013s${range.end}\uFF08\u5171 ${seqs.length} \u4E2A\u8282\u70B9\uFF0C\u53EA\u8BFB\uFF0C\u4E0D\u6062\u590D surface\uFF09\uFF1A`, ""];
        for (const seq of seqs) {
          const event = session.eventAt(seq);
          if (event == null) continue;
          const text = eventText(event);
          parts.push(`# s${seq} ${event.type}`, text.length > 4e3 ? `${text.slice(0, 4e3)}
\u2026\uFF08\u622A\u65AD\uFF0C\u539F\u59CB\u4E8B\u4EF6\u4ECD\u53EF\u7528 dsh \u65E5\u5FD7\u67E5\u770B\uFF09` : text, "");
        }
        if (parts.length <= 2) parts.push("\uFF08\u539F\u59CB\u4E8B\u4EF6\u5DF2\u4E0D\u5728\u65E5\u5FD7\u4E2D \u2014\u2014 \u4F1A\u8BDD\u53EF\u80FD\u88AB\u88C1\u526A\u8FC7\uFF09");
        return parts.join("\n");
      }
    }));
    toolsService.register(defineTool({
      name: "jev_probe_shapes",
      description: "Dump the real DSH event shapes on the current surface (types, block types, key names). Use to verify field assumptions such as tool name and callId.",
      parameters: {
        limit: { type: "integer", description: "Max surface nodes to inspect (default 40)" }
      },
      output: {
        schema: { type: "string" },
        render: (_args, value) => [{ type: "text", text: value }]
      },
      async execute(args, exec) {
        const session = exec?.agent?.session;
        if (session?.surface?.nodes == null) return "\u6CA1\u6709\u6D3B\u52A8\u4F1A\u8BDD";
        const surface = [...session.surface.nodes];
        const eventAt = (seq) => session.eventAt(seq);
        const lines = [];
        const { rows, summary } = probeShapes(surface, eventAt, args?.limit ?? 40);
        lines.push("\u4E8B\u4EF6\u5F62\u72B6\u6C47\u603B\uFF08type | blocks | data keys | source keys  \u2192 \u51FA\u73B0\u6B21\u6570\uFF09:");
        for (const item of summary) lines.push(`  ${item.key}   \xD7${item.count}`);
        lines.push("", "\u9010\u8282\u70B9:");
        for (const row of rows) {
          lines.push(`  s${row.seq}  ${row.type}  blocks=[${row.blocks.join(",")}]  data=[${row.dataKeys.join(",")}]  source=[${row.sourceKeys.join(",")}]`);
        }
        const probe = probeToolNames({ surface, eventAt, events: sessionEvents(session), limit: 12 });
        lines.push("", `\u5DE5\u5177\u540D\u89E3\u6790\uFF1A\u7D22\u5F15 ${probe.indexSize} \u6761\uFF0C\u89E3\u6790\u6210\u529F ${probe.resolved} / \u5931\u8D25 ${probe.unresolved}`);
        lines.push(`\u672C\u4F1A\u8BDD\u51FA\u73B0\u8FC7\u7684\u5DE5\u5177\u540D\uFF08\u6765\u81EA tool/call \u4E8B\u4EF6\u7684 data.name\uFF09\uFF1A${probe.names.length > 0 ? probe.names.join(", ") : "\uFF08\u65E0\uFF09"}`);
        for (const row of probe.rows) {
          lines.push(`  s${row.seq}  callId=${row.callId ?? "?"}  \u89E3\u6790\u5DE5\u5177\u540D=${row.tool}`);
        }
        if (probe.unresolved > 0) {
          lines.push(`\u26A0\uFE0F \u6709 ${probe.unresolved} \u6761\u89E3\u6790\u4E0D\u51FA\u5DE5\u5177\u540D \u2014\u2014 \u8FD9\u65F6\u767D\u540D\u5355\u4F1A\u4E00\u5F8B\u62D2\u7EDD\uFF0C\u7B2C\u4E8C\u5C42\u5C06\u6C38\u4E0D\u89E6\u53D1\u3002\u8BF7\u628A\u4E0A\u9762\u51FA\u73B0\u7684\u771F\u5B9E\u5DE5\u5177\u540D\u914D\u8FDB compactTools\uFF0C\u6216\u628A compactTools \u8BBE\u4E3A [] \u53EA\u7528\u9ED1\u540D\u5355\u3002`);
        }
        lines.push("", `compactTools = ${JSON.stringify(cfg.compactTools)}${cfg.compactTools.length === 0 ? "\uFF08\u7A7A = \u4E0D\u8BBE\u767D\u540D\u5355\uFF0C\u53EA\u53D7 neverCompactTools \u7EA6\u675F\uFF09" : ""}`);
        lines.push(`neverCompactTools = ${JSON.stringify(cfg.neverCompactTools)}\uFF08\u6BD4\u8F83\u65F6\u5F52\u4E00\u5316\uFF1A\u5C0F\u5199 + \u53BB\u6389 _ \u4E0E -\uFF09`);
        lines.push("", `\u5982\u60F3\u53EA\u7528\u53EA\u8BFB\u5DE5\u5177\uFF0C\u53EF\u628A compactTools \u914D\u6210\uFF1A${JSON.stringify(DSH_READONLY_TOOLS)}`);
        return lines.join("\n");
      }
    }));
  } else {
    log("info", "ctx.tools \u4E0D\u53EF\u7528 \u2014\u2014 \u8DF3\u8FC7\u72B6\u6001/\u63A2\u9488\u5DE5\u5177\u6CE8\u518C\uFF08\u5224\u5B9A\u4E0E\u88C1\u526A\u4E0D\u53D7\u5F71\u54CD\uFF09");
  }
  if (judge.ready === false) {
    ctx.logger?.info?.("[jev-prune] \u672A\u914D\u7F6E TYPESAFE_API_KEY \u2014\u2014 \u63D2\u4EF6\u5DF2\u52A0\u8F7D\u4F46\u4E0D\u4ECB\u5165\u88C1\u526A");
  }
}

// host-020.js
var name2 = "jev-prune";
var inject = ["tools", "toolResultPruner", "webServer", "connection", "credentials", "settings"];
var fields = {
  enabled: z4.boolean().default(true).volatile(),
  dryRun: z4.boolean().default(true).volatile(),
  earlyPrune: z4.boolean().default(true).volatile(),
  earlyMinChars: z4.natural().min(1e3).default(16e3).volatile(),
  earlyMinSteps: z4.natural().min(1).max(100).default(4).volatile(),
  maxJudgeBatches: z4.natural().min(1).max(1).default(1).volatile(),
  judgeMaxRetries: z4.natural().max(0).default(0).volatile(),
  preserveRecent: z4.natural().min(2).max(100).default(4).volatile(),
  alwaysTrimRatio: z4.number().min(0).max(1).default(0.5).volatile(),
  judgeTimeoutMs: z4.natural().min(1e3).max(3e4).default(5e3).volatile(),
  judgeMaxStateTokens: z4.natural().min(1e3).max(25e3).default(6e3).volatile(),
  proxyUrl: z4.string().default("").volatile(),
  model: z4.string().default("jev-latest").volatile()
};
var Config2 = z4.object(fields);
var keys = Object.keys(fields);
async function apply2(ctx, config) {
  const current = () => Object.fromEntries(keys.map((k) => [k, config[k].get()]));
  let control;
  apply(ctx, { ...current(), judgeOn: "always", compactReceipts: false, credentialRef: "DSH_JEV_PRUNE_API_KEY" }, { onControl: (c) => {
    control = c;
  } });
  const ref = "DSH_JEV_PRUNE_API_KEY";
  const namespace = ctx.fiber?.entry?.options.id ?? ctx.get("entry")?.options.id ?? "jev-prune";
  const credential = async () => await ctx.credentials.resolve(ref) ?? await ctx.credentials.resolve("TYPESAFE_API_KEY");
  const sync = async () => {
    const values = current();
    control.update({ ...values, maxStateTokens: values.judgeMaxStateTokens, apiKey: (await credential())?.value ?? "" });
  };
  ctx.on("agent/pre-step", async (_payload, next) => {
    try {
      await sync();
    } catch {
      control.update({ enabled: false, apiKey: "" });
    }
    return next();
  }, { prepend: true, global: true });
  const json = (res, status, value) => {
    const body = JSON.stringify(value);
    res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    res.end(body);
  };
  ctx.effect(() => ctx.webServer.register({ kind: "exact", path: "/jev-prune/settings", handler: async (req, res) => {
    const rejection = ctx.connection.requestRejection(req);
    if (rejection !== void 0) {
      json(res, rejection, { error: "unauthorized" });
      return;
    }
    try {
      if (req.method === "GET") {
        const key = await credential();
        json(res, 200, { config: current(), credential: { configured: !!key, source: key?.source ?? null }, status: control.status() });
        return;
      }
      if (req.method !== "PUT") {
        json(res, 405, { error: "method not allowed" });
        return;
      }
      let body = "";
      for await (const chunk of req) {
        body += chunk;
        if (Buffer.byteLength(body) > 8192) {
          json(res, 413, { error: "request too large" });
          return;
        }
      }
      const input = JSON.parse(body);
      if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).some((k) => !["config", "apiKey", "clearKey"].includes(k))) {
        json(res, 400, { error: "invalid fields" });
        return;
      }
      if (input.apiKey !== void 0 && (typeof input.apiKey !== "string" || !input.apiKey.trim() || input.apiKey.length > 4096)) {
        json(res, 400, { error: "invalid key" });
        return;
      }
      if (input.clearKey !== void 0 && typeof input.clearKey !== "boolean") {
        json(res, 400, { error: "invalid clearKey" });
        return;
      }
      if (input.apiKey !== void 0 && input.clearKey) {
        json(res, 400, { error: "choose key replacement or removal" });
        return;
      }
      if (input.config !== void 0) {
        if (!input.config || typeof input.config !== "object" || Array.isArray(input.config) || Object.keys(input.config).some((k) => !keys.includes(k))) {
          json(res, 400, { error: "invalid config" });
          return;
        }
        if (input.config.proxyUrl) {
          const url = new URL(input.config.proxyUrl);
          if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
            json(res, 400, { error: "proxy must be HTTP(S) without credentials" });
            return;
          }
        }
        await ctx.settings.update(namespace, input.config);
      }
      if (input.apiKey !== void 0) await ctx.credentials.set(ref, input.apiKey.trim());
      if (input.clearKey) await ctx.credentials.unset(ref);
      await sync();
      json(res, 200, { ok: true });
    } catch {
      json(res, 400, { error: "Could not save settings. Check field values and credential storage permissions." });
    }
  } }));
  try {
    await sync();
  } catch {
    control.update({ enabled: false, apiKey: "" });
  }
}
export {
  Config2 as Config,
  apply2 as apply,
  inject,
  name2 as name
};
