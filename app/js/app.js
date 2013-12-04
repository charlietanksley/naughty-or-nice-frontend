var About
  , page
  , Router
  , ScoreReport
  , UserReport

page = '.report'

ScoreReport = can.Model.extend({
  findOne: 'GET /api/naughty_count/{username}'
}, {})

Router = can.Control.extend({
  'about/score route': function() {
    var about
    about = new About(page)
    about.score()
  }

, 'search route': function(data) {
    can.route.attr('username', data.username)
  }

, ':username route': function(data) {
   var report
   report = new UserReport(page)

   report.show(data.username)
 }

, 'route': function() {
  }
})

About = can.Control.extend({
  defaults: {}
}, {
  init: function(element, options) {

  }

, score: function() {
    var fragment
      , self = this
      , view = 'aboutScore'

    fragment = can.view(view)

    self.element.html(fragment)
  }
})


UserReport = can.Control.extend({
  defaults: { view: 'showUser' }
}, {
  init: function( element , options ) {
    var self = this
  }

, show: function(username) {
    var self = this
    ScoreReport.findOne({username: username})
    .then(function(data) {
      var fragment
        , report

      report = { username: data.username
               , score: data.naughtyCount }
      fragment = can.view(self.options.view, report)

      self.element.html(fragment)
    })
  }
})

new Router()
can.route.ready()
