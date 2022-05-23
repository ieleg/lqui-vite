const keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  delete: [8, 46]
}

const keyNames = {
  esc: ["Esc", "Escape"],
  tab: "Tab",
  enter: "Enter",
  space: [" ", "Spacebar"],
  up: ["Up", "ArrowUp"],
  left: ["Left", "ArrowLeft"],
  right: ["Right", "ArrowRight"],
  down: ["Down", "ArrowDown"],
  delete: ["Backspace", "Delete", "Del"]
}

export const ModifierHandler = {
  stop($event) {
    $event.stopPropagation()
  },
  prevent($event) {
    $event.preventDefault()
  },
  self($event) {
    if ($event.target !== $event.currentTarget) return null
  },
  ctrl($event) {
    if (!$event.ctrlKey) return null
  },
  shift($event) {
    if (!$event.shiftKey) return null
  },
  alt($event) {
    if (!$event.altKey) return null
  },
  meta($event) {
    if (!$event.metaKey) return null
  },
  left($event) {
    if ("button" in $event && $event.button !== 0) return null
  },
  middle($event) {
    if ("button" in $event && $event.button !== 1) return null
  },
  right($event) {
    if ("button" in $event && $event.button !== 2) return null
  }
}

function debounce(func, delay = 300, immediate = false) {
  let timer
  return function () {
    let context = this
    let args = arguments

    timer && clearTimeout(timer)
    if (immediate) {
      let callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, delay)
      if (callNow) func.apply(context, args)
    } else {
      timer = setTimeout(() => {
        func.apply(context, args)
      }, delay)
    }
  }
}

function throttle(func, delay = 300) {
  let timer = null,
    startTime = Date.now()

  return function () {
    let curTime = Date.now(),
      remaining = delay - (curTime - startTime),
      context = this,
      args = arguments

    timer && clearTimeout(timer)

    if (remaining <= 0) {
      func.apply(context, args)
      startTime = Date.now()
    } else {
      timer = setTimeout(() => {
        func.apply(context, args)
        startTime = Date.now()
      }, remaining)
    }
  }
}

function cached(fn) {
  const cache = Object.create(null)
  return function cachedFn(str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

const hyphenateRE = /\B([A-Z])/g
const hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, "-$1").toLowerCase()
})

function isKeyNotMatch(expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}
function checkKeyCodes(
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  const mappedKeyCode = builtInKeyCode
  if (builtInKeyName && eventKeyName) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

function genFilterCode($event, key) {
  const keyVal = parseInt(key, 10)
  if (keyVal) {
    return $event.keyCode !== keyVal
  }
  const keyCode = keyCodes[key]
  const keyName = keyNames[key]
  return checkKeyCodes($event.keyCode, key, keyCode, $event.key, keyName)
}

function compileCode($event, keys) {
  if ($event.type.indexOf("key") === -1) return false
  const filterKeys = keys.filter(key => keyCodes[key] || keyNames[key])
  if (!filterKeys.length) return false
  return filterKeys.every(key => genFilterCode($event, key))
}

function compileEventModifier($event, keys) {
  const filterModifiers = keys.filter(key => ModifierHandler[key])
  if (!filterModifiers.length) return false
  filterModifiers.some(key => ModifierHandler[key]($event) === null)
}

/**
 *
 * @param {*} el 元素
 * @param {*} binding 对象
 * @param {*} type 'debounce' | 'throttle'
 * `temlate
 *  <button v-debounce.click="handleClick" />
 *  <button v-debounce.click.stop="[handleClick, 500, false]" />
 * `
 */
function eventLimit(el, binding, type) {
  const funcMap = {
    debounce,
    throttle
  }
  const Fn = funcMap[type]
  let bindingValue = binding.value

  if (!Array.isArray(binding.value)) {
    bindingValue = [bindingValue]
  }

  const [func, delay = 300, imediate = true] = bindingValue
  const [, event, ...eventModifier] = binding.rawName.split(".")
  const _Fn = Fn(func, delay, imediate)
  console.log(event, eventModifier)
  el.addEventListener(event, $event => {
    if (compileCode($event, eventModifier)) return null
    if (compileEventModifier($event, eventModifier)) return null
    _Fn()
  })
}

export default function install(Vue) {
  if (install.installed) return

  install.installed = true

  Vue.directive("debounce", {
    inserted: function (el, binding) {
      eventLimit(el, binding, "debounce")
    }
  })
  Vue.directive("throttle", {
    inserted: function (el, binding) {
      eventLimit(el, binding, "throttle")
    }
  })
}
