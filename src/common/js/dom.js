export const addClass = (el, className) => {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export const hasClass = (el, className) => {
  //开头或者是空白字符     空白字符或者结束
  let reg = new RegExp('(^|\\s' + className + '(\\s|$)')

  return reg.test(el.className)
}

//dom结点添加属性
export const getData = (el, name, val) => {
  const prefix = 'data-'
  name = prefix + name

  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}
//兼容
let elmentStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elmentStyle[transformNames[key]] != undefined) {
      return key
    }
  }
  return false
})()

export const prefixStyle = (style) => {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}