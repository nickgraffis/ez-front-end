var handlebars$1 = require('handlebars');
var path = require('path');
var vite = require('vite');
var promises = require('fs/promises');

async function resolveContext(context, pagePath) {
  if (typeof context === 'undefined') {
    return context;
  }

  if (typeof context === 'function') {
    return resolveContext(await context(pagePath), pagePath);
  }

  const output = {};

  for (const key of Object.keys(context)) {
    const value = context[key];

    if (typeof value === 'function') {
      output[key] = await value(pagePath);
    } else {
      output[key] = value;
    }
  }

  return output;
}

function _asyncIterator(iterable) {
  var method;

  if (typeof Symbol !== "undefined") {
    if (Symbol.asyncIterator) {
      method = iterable[Symbol.asyncIterator];
      if (method != null) return method.call(iterable);
    }

    if (Symbol.iterator) {
      method = iterable[Symbol.iterator];
      if (method != null) return method.call(iterable);
    }
  }

  throw new TypeError("Object is not async iterable");
}

function _AwaitValue(value) {
  this.wrapped = value;
}

function _AsyncGenerator(gen) {
  var front, back;

  function send(key, arg) {
    return new Promise(function (resolve, reject) {
      var request = {
        key: key,
        arg: arg,
        resolve: resolve,
        reject: reject,
        next: null
      };

      if (back) {
        back = back.next = request;
      } else {
        front = back = request;
        resume(key, arg);
      }
    });
  }

  function resume(key, arg) {
    try {
      var result = gen[key](arg);
      var value = result.value;
      var wrappedAwait = value instanceof _AwaitValue;
      Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) {
        if (wrappedAwait) {
          resume(key === "return" ? "return" : "next", arg);
          return;
        }

        settle(result.done ? "return" : "normal", arg);
      }, function (err) {
        resume("throw", err);
      });
    } catch (err) {
      settle("throw", err);
    }
  }

  function settle(type, value) {
    switch (type) {
      case "return":
        front.resolve({
          value: value,
          done: true
        });
        break;

      case "throw":
        front.reject(value);
        break;

      default:
        front.resolve({
          value: value,
          done: false
        });
        break;
    }

    front = front.next;

    if (front) {
      resume(front.key, front.arg);
    } else {
      back = null;
    }
  }

  this._invoke = send;

  if (typeof gen.return !== "function") {
    this.return = undefined;
  }
}

if (typeof Symbol === "function" && Symbol.asyncIterator) {
  _AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
    return this;
  };
}

_AsyncGenerator.prototype.next = function (arg) {
  return this._invoke("next", arg);
};

_AsyncGenerator.prototype.throw = function (arg) {
  return this._invoke("throw", arg);
};

_AsyncGenerator.prototype.return = function (arg) {
  return this._invoke("return", arg);
};

function _wrapAsyncGenerator(fn) {
  return function () {
    return new _AsyncGenerator(fn.apply(this, arguments));
  };
}

function _awaitAsyncGenerator(value) {
  return new _AwaitValue(value);
}

function _asyncGeneratorDelegate(inner, awaitWrap) {
  var iter = {},
      waiting = false;

  function pump(key, value) {
    waiting = true;
    value = new Promise(function (resolve) {
      resolve(inner[key](value));
    });
    return {
      done: false,
      value: awaitWrap(value)
    };
  }

  if (typeof Symbol === "function" && Symbol.iterator) {
    iter[Symbol.iterator] = function () {
      return this;
    };
  }

  iter.next = function (value) {
    if (waiting) {
      waiting = false;
      return value;
    }

    return pump("next", value);
  };

  if (typeof inner.throw === "function") {
    iter.throw = function (value) {
      if (waiting) {
        waiting = false;
        throw value;
      }

      return pump("throw", value);
    };
  }

  if (typeof inner.return === "function") {
    iter.return = function (value) {
      if (waiting) {
        waiting = false;
        return value;
      }

      return pump("return", value);
    };
  }

  return iter;
}

const VALID_EXTENSIONS = new Set(['.html', '.handlebars']); // Borrowed from https://gist.github.com/lovasoa/8691344

function walk(_x) {
  return _walk.apply(this, arguments);
}
/**
 * Registers each HTML file in a directory as Handlebars partial
 */


function _walk() {
  _walk = _wrapAsyncGenerator(function* (dir) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;

    var _iteratorError;

    try {
      for (var _iterator = _asyncIterator(yield _awaitAsyncGenerator(promises.opendir(dir))), _step, _value; _step = yield _awaitAsyncGenerator(_iterator.next()), _iteratorNormalCompletion = _step.done, _value = yield _awaitAsyncGenerator(_step.value), !_iteratorNormalCompletion; _iteratorNormalCompletion = true) {
        const d = _value;
        const fullFileName = path.join(dir, d.name);

        if (d.isDirectory()) {
          yield* _asyncGeneratorDelegate(_asyncIterator(walk(fullFileName)), _awaitAsyncGenerator);
        } else if (d.isFile()) {
          yield fullFileName;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          yield _awaitAsyncGenerator(_iterator.return());
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });
  return _walk.apply(this, arguments);
}

async function registerPartials(directoryPath, partialsSet) {
  const pathArray = Array.isArray(directoryPath) ? directoryPath : [directoryPath];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;

  var _iteratorError2;

  try {
    for (var _iterator2 = _asyncIterator(pathArray), _step2, _value2; _step2 = await _iterator2.next(), _iteratorNormalCompletion2 = _step2.done, _value2 = await _step2.value, !_iteratorNormalCompletion2; _iteratorNormalCompletion2 = true) {
      const path$1 = _value2;

      try {
        const normalizedPath = vite.normalizePath(path$1);
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;

        var _iteratorError3;

        try {
          for (var _iterator3 = _asyncIterator(walk(path$1)), _step3, _value3; _step3 = await _iterator3.next(), _iteratorNormalCompletion3 = _step3.done, _value3 = await _step3.value, !_iteratorNormalCompletion3; _iteratorNormalCompletion3 = true) {
            const fileName = _value3;
            const normalizedFileName = vite.normalizePath(fileName);
            const parsedPath = path.parse(normalizedFileName);

            if (VALID_EXTENSIONS.has(parsedPath.ext)) {
              let partialName = parsedPath.name;

              if (parsedPath.dir !== normalizedPath) {
                const prefix = parsedPath.dir.replace(`${normalizedPath}/`, '');
                partialName = `${prefix}/${parsedPath.name}`;
              }

              const content = await promises.readFile(fileName);
              partialsSet.add(fileName);
              handlebars$1.registerPartial(partialName, content.toString());
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              await _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      } catch (e) {
        // This error indicates the partial directory doesn't exist; ignore it
        if (e.code !== 'ENOENT') {
          throw e;
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        await _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
}

function handlebars({
  context,
  reloadOnPartialChange = true,
  compileOptions,
  runtimeOptions,
  partialDirectory,
  registerHelpers
} = {}) {
  // Keep track of what partials are registered
  const partialsSet = new Set();
  let root;
  handlebars$1.registerHelper('resolve-from-root', function (path$1) {
    return path.resolve(root, path$1);
  });

  const helpers = Object.keys(registerHelpers)

  if (helpers && helpers.length) {
    helpers.forEach((helper) => {
      if (typeof registerHelpers[helper] === 'function') handlebars$1.registerHelper(helper, registerHelpers[helper])
    })
  }

  return {
    name: 'handlebars',

    configResolved(config) {
      root = config.root;
    },

    async handleHotUpdate({
      server,
      file
    }) {
      if (reloadOnPartialChange && partialsSet.has(file)) {
        server.ws.send({
          type: 'full-reload'
        });
        return [];
      }
    },

    transformIndexHtml: {
      // Ensure Handlebars runs _before_ any bundling
      enforce: 'pre',

      async transform(html, ctx) {
        if (partialDirectory) {
          await registerPartials(partialDirectory, partialsSet);
        }
        // if (ctx.originalUrl === '/waterpolo/') context.basics.name = 'poop'
        const template = handlebars$1.compile(html, compileOptions);
        const resolvedContext = await resolveContext(context, vite.normalizePath(ctx.path));
        const result = template(resolvedContext, runtimeOptions);
        return result;
      }

    }
  };
}

module.exports = handlebars;
//# sourceMappingURL=index.js.map
