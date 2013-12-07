var UserReport = can.Control.extend({
  defaults: { view: findView('showUser') }
}, {
  init: function(element, options) {
    var self = this
  }

, show: function(username) {
    var self = this
    ScoreReport.findOne({username: username})
    .then(function(data) {
      var fragment
        , report
        , score

      score = data.naughtyCount / data.tweetsConsidered * 100

      report = { username: data.username
               , score: Math.round(score) }
      fragment = can.view(self.options.view, report)
      self.element.html(fragment)
    })
  }
})