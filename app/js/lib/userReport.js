var UserReport = can.Control.extend({
  defaults: { view: 'showUser' }
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

      report = { username: data.username
               , score: data.naughtyCount }
      fragment = can.view(self.options.view, report)
      self.element.html(fragment)
    })
  }
})