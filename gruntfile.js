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
        files:  [ 'routes/*.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          spawn: false
        }
      },
      public: {
        files: ["public/**/*.css", "public/**/*.js"]
      }
    }
  });

  // Load NPM tasks
	require('load-grunt-tasks')(grunt);
  // Default task(s).
  grunt.registerTask('default', ['express:dev']);
  // Server task(s)
  grunt.registerTask('server', [ 'express:dev', 'watch' ]);
};
