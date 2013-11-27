/* global $ location */
var Report
  , Routes
  , router

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

  element = document.getElementsByClassName('report')[0]
  element.innerHTML = fragment
}

Routes = {
  main: function() {
  }

, report: function(obj) {
    var data
      , fragment

    $.ajax({
      url: '/api/naughty_count/' + obj.username
    , type: 'json'
    }).then(function(resp) {
      data = {report: resp}
      fragment = $.renderTemplate(template('showUser'), data)
      changePage(fragment)
    })
  }

, search: function(obj) {
    var path
      , regex
      , username

    regex = new RegExp(/=(\w+)$/)
    username = regex.exec(location.search)[1]
    path = username
    location.replace(path)
  }
}

router = new $.route()
router.add({
  '/': Routes.main
, '/search': Routes.search
, '/:username': Routes.report
});

$(document).ready(function () {
  router.run(document.location.pathname);
})
