var Router = can.Control.extend({
  'about/score route': function() {
    var about
    about = new About('.report')
    about.score()
  }

, 'search route': function(data) {
    can.route.attr('username', data.username)
  }

, ':username route': function(data) {
   var report
   report = new UserReport('.report')

   report.show(data.username)
 }

, 'route': function() {
    $('.report').html('')
  }
})
