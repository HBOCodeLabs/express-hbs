var assert = require('assert');
var hbs = require('..');
var path = require('path');


function stripWs(s) {
  return s.replace(/\s+/g, '');
}

describe('issue-23', function() {
  var dirname =  path.join(__dirname, 'issues/23');

  it('should not pass an empty or missing partial to handlebars', function(done) {
    var render = hbs.create().express3({
      partialsDir: [dirname + '/partials']
    });

    function check(err, html) {
      assert.ifError(err);
      assert.equal('<html>Hello</html>', stripWs(html));
      done();
    }
    var result = render(dirname + '/index.hbs', {cache: true, settings: {views: dirname + '/views'}}, check);
  });

  it('should handle empty string', function(done) {
    var render = hbs.create().express3({
      partialsDir: [dirname + '/partials']
    });

    function check(err, html) {
      assert.ifError(err);
      assert.equal('', stripWs(html));
      done();
    }
    var result = render(dirname + '/empty.hbs', {cache: true, settings: {views: dirname + '/views'}}, check);
  });


  it('should register empty partial', function(done) {
    var hb = hbs.create();
    var render = hb.express3({
      partialsDir: [dirname + '/partials']
    });
    hb.handlebars.registerPartial('emptyPartial', '');

    var pass = 0;
    function check(err, html) {
      pass++;
      assert.ifError(err);
      assert.equal('foo', stripWs(html));
      if (pass < 3) {
        doIt();
      } else {
        done();
      }
    }
    function doIt() {
      render(dirname + '/emptyPartial.hbs', {cache: true, settings: {views: dirname + '/views'}}, check);
    }
    doIt();
  });

  it('should register partial that results in empty string (comment)', function(done) {
    var hb = hbs.create();
    var render = hb.express3({
      partialsDir: [dirname + '/partials']
    });
    // this fails
    //hb.handlebars.registerPartial('emptyComment', '{{! just a comment}}');
    hb.registerPartial('emptyComment', '{{! just a comment}}');

    var pass = 0;
    function check(err, html) {
      pass++;
      assert.ifError(err);
      assert.equal('foo', stripWs(html));
      if (pass < 3) {
        doIt();
      } else {
        done();
      }
    }
    function doIt() {
      render(dirname + '/emptyComment.hbs', {cache: true, settings: {views: dirname + '/views'}}, check);
    }
    doIt();
  });
});


describe('issue-21', function() {
  var dirname =  path.join(__dirname, 'issues/21');
  var render = hbs.create().express3({
    layoutsDir: dirname + '/views/layouts'
  });

  it('should allow specifying layouts without the parent dir', function(done) {
    function check(err, html) {
      assert.ifError(err);
      assert.equal('<html>index</html>', stripWs(html));
      done();
    }

    var options = {cache: true, layout: 'default', settings: {views: dirname + '/views'}};
    var result = render(dirname + '/views/index.hbs', options, check);
  });


  it('should allow specifying layouts without the parent dir in a sub view', function(done) { function check(err, html) {
      assert.ifError(err);
      assert.equal('<html>sub</html>', stripWs(html));
      done();
    }

    var options = {cache: true, layout: 'default', settings: {views: dirname + '/views'}};
    var result = render(dirname + '/views/sub/sub.hbs', options, check);
  });

  it('should treat layouts that start with "." relative to template', function(done) { function check(err, html) {
      assert.ifError(err);
      assert.equal('<relative>sub</relative>', stripWs(html));
      done();
    }

    var options = {cache: true, layout: './relativeLayout', settings: {views: dirname + '/views'}};
    var result = render(dirname + '/views/sub/sub.hbs', options, check);
  });

  it('should allow layouts in subfolders', function(done) {
    function check(err, html) {
      assert.ifError(err);
      assert.equal('<sub>useLayoutInDir</sub>', stripWs(html));
      done();
    }

    var options = {cache: true, layout: 'sub/child', settings: {views: dirname + '/views'}};
    var result = render(dirname + '/views/useLayoutInDir.hbs', options, check);
  });

  it('should treat layouts relative to views directory if layoutsDir is not passed', function(done) {
    var dirname =  path.join(__dirname, 'issues/21');
    var render = hbs.create().express3();

    function check(err, html) {
      assert.ifError(err);
      assert.equal('<sub>sub</sub>', stripWs(html));
      done();
    }

    var options = {cache: true, layout: 'layouts/sub/child', settings: {views: dirname + '/views'}};
    var result = render(dirname + '/views/sub/sub.hbs', options, check);
  });
});

