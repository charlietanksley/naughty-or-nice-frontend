/* Exports an object that defines
 *  all of the paths & globs that the project
 *  is concerned with.
 *
 * The "configure" task will require this file and
 *  then re-initialize the grunt config such that
 *  directives like <config:files.js.app> will work
 *  regardless of the point you're at in the build
 *  lifecycle.
 *
 * To see the default definitions for all of Lineman's file paths and globs, look at:
 * https://github.com/testdouble/lineman/blob/master/config/files.coffee
 */

module.exports = require(process.env['LINEMAN_MAIN']).config.extend('files', {
  js: {

    app: [
      "app/js/lib/*.js"
    , "app/js/models/*.js"
    , "app/js/data/*.js"
    , "app/js/router.js"
    , "app/js/app.js"
    ]

  , vendor: [
    'bower_components/jquery/jquery.js'
  , 'bower_components/handlebars/handlebars.js'
  , 'bower_components/canjs/can.jquery.js'
  , 'bower_components/canjs/can.route.pushstate.js'
  ]
  }

});
