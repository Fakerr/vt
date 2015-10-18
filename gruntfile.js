module.exports = function(grunt) {

  //Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options:{
          script: 'server.js'
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      views: {
        files: [ 'views/**.*' ]
      },
      express: {
        files:  [ 'routes/*.js', 'app.js', 'server.js',
        'socketCtrl.js' ],
        tasks:  [ 'jshint', 'express:dev' ],
        options: {
          spawn: false
        }
      },
      public: {
        files: ["public/stylesheets/*.css", "public/javascripts/*.js"],
        tasks: ['jshint', 'csslint']
      }
    },
    jshint: {
			all: {
				src:['public/javascripts/*.js'].concat(['routes/*.js',
         'server.js', 'app.js', 'socketCtrl.js', 'gruntfile.js']),
				options: {
					jshintrc: true
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc',
			},
			all: {
				src: ["public/stylesheets/*.css"]
			}
		},
  });

  // Load NPM tasks
	require('load-grunt-tasks')(grunt);
  // Default task(s).
  grunt.registerTask('default', ['lint', 'express:dev', 'watch']);
  // Lint task(s).
  grunt.registerTask('lint', ['jshint', 'csslint']);

};
