var About = can.Control.extend({
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