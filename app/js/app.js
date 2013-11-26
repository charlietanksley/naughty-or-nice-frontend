/* global $ location */

function templateCache() {
  return $.v.reduce(document.scripts
                   , function(memo, item, index) {
                       memo[item.id] = index
                       return memo
                    }
                   , {})
}

function template(name) {
  var cache
    , id

  cache = templateCache()
  id = cache[name]

  return document.scripts[id].innerHTML
}

function changePage(fragment) {
  var element

  element = document.getElementsByClassName('main')[0]
  element.innerHTML = fragment
}
