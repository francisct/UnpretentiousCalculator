// Karma configuration
// Generated on Sat Mar 25 2017 13:20:28 GMT-0400 (Eastern Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

      plugins : [
          'karma-jasmine',
          'karma-chrome-launcher',
          'karma-ng-html2js-preprocessor' //added this
      ],

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        {pattern: './app/bower_components/angular/angular.js', watch: false},
        {pattern: './app/bower_components/angular-ui-router/release/angular-ui-router.js', watch: false},
        {pattern: './app/bower_components/angular-mocks/angular-mocks.js', watch: false},
        {pattern: './app/bower_components/angular-css/angular-css.js', watch: false},
        {pattern: './app/bower_components/mousetrap/mousetrap.js', watch: false},
        {pattern: './app/bower_components/angular-hotkeys/src/hotkeys.js', watch: false},
        './app/calculatorComponent/calculator.directive.js',
        './app/calculatorComponent/specs/calculator.spec.js',
        './app/calculatorComponent/calculator.html'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './app/calculatorComponent/calculator.html' : ['ng-html2js']
    },

      ngHtml2JsPreprocessor: {
            stripPrefix: 'app/'
            },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
