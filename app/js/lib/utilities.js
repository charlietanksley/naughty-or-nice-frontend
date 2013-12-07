function findView(name) {
  var fullName = 'app/templates/' + name + '.hb'

  return JST[fullName]
}