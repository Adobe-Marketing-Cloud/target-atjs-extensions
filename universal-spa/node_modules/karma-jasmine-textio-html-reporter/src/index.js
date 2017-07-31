var createPattern = function(path) {
  return {pattern: path, included: true, served: true, watched: false};
};

var initReporter = function(files,  baseReporterDecorator) {
  baseReporterDecorator(this);

  // From https://github.com/taras42/karma-jasmine-html-reporter/issues/4#issuecomment-230168638
  var TEST_JASMINE_CORE = /(\/karma-jasmine\/)/i;
  var jasmineIndex = 0;

  files.forEach(function(file, index) {
    if (TEST_JASMINE_CORE.test(file.pattern)) {
      jasmineIndex = index;
    }
  });

  files.splice(++jasmineIndex, 0, createPattern(__dirname + '/css/jasmine.css'));
  files.splice(++jasmineIndex, 0, createPattern(__dirname + '/lib/html.jasmine.reporter.js'));
  files.splice(++jasmineIndex, 0, createPattern(__dirname + '/lib/adapter.js'));
};

initReporter.$inject = ['config.files',  'baseReporterDecorator'];

module.exports = {
  'reporter:kjhtml': ['type', initReporter]
};
