// fis.config.set('name', 'fe-workflow');
// fis.config.set('version', '1.0.5');

fis.media("prod")
.match('/*.{js,css}', {
  useHash: true
}).match('/*.js', {
  optimizer: fis.plugin('uglify-js')
}).match('/*.css', {
  optimizer: fis.plugin('clean-css')
}).match('/*.{png,jpg}', {
  useHash: true,
  optimizer: fis.plugin('png-compressor')
});

fis.match('/(**.*)', {
  // release: '/${name}/${version}/$1'
  release: '/$1'
});