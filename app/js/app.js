/* global $ location */
var Loading
  , Report
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

Loading = {
  opts: {
    lines: 13
  , length: 20
  , width: 10
  , radius: 30
  , corners: 1
  , rotate: 0
  , direction: 1
  , color: '#000'
  , speed: 1
  , trail: 60
  , shadow: false
  , hwaccel: false
  , className: 'spinner'
  , zIndex: 2e9
  , top: 'auto'
  , left: 'auto'
  }

, target: document.getElementsByClassName('report')[0]
, spinner: function() {
    return new Spinner(this.opts)
  }
, start: function() {
    this.spinner().spin(this.target)
  }
, stop: function() {
    this.spinner().stop()
  }
}

Routes = {
  main: function() {
  }

, report: function(obj) {
    var data
      , fragment

    Loading.start()

    $.ajax({
      url: '/api/naughty_count/' + obj.username
    , type: 'json'
    }).then(function(resp) {
      data = {report: resp}
      fragment = $.renderTemplate(template('showUser'), data)
      changePage(fragment)
      Loading.stop()
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
