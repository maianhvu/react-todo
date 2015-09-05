module.exports = function(grunt) {

  // Configuration
  grunt.initConfig({
    // Read package file
    pkg: grunt.file.readJSON('package.json'),

    // Babel
    babel: {
      options: {
        sourceMap: true
      },
      // For development
      compile: {
        files: {
          '<%= pkg.paths.dest %>/app.js': '<%= pkg.paths.src %>/app.jsx'
        }
      },
      // For production
      dist: {
        files: {
          '<%= pkg.paths.babelTmp %>/app.js': '<%= pkg.paths.src %>/app.jsx'
        }
      }
    },

    // ESLint
    eslint: {
      compile: ['<%= pkg.paths.dest %>/app.js'],
      dist: ['<%= pkg.paths.babelTmp %>/app.js']
    },

    // Browserify
    browserify: {
      dist: {
        files: {
          '<%= pkg.paths.browserifyTmp %>/app.js': '<%= pkg.paths.babelTmp %>/app.js'
        }
      }
    },

    // Uglify
    uglify: {
      dist: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
          screwIE8: true
        },
        files: {
          '<%= pkg.paths.dest %>/app.js': ['<%= pkg.paths.browserifyTmp %>/app.js']
        }
      }
    },

    // Watch
    watch: {
      dist: {
        files: ['<%= pkg.paths.src %>/app.jsx'],
        tasks: ['compile'],
      },
      livereload: {
        options: { livereload: true },
        files: ['<%= pkg.paths.dest %>/app.js', 'css/*.css', 'index.html', 'app.html']
      }
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Register custom tasks
  grunt.registerTask('compile', ['babel:compile', 'eslint:compile']);
  grunt.registerTask('build', ['babel:dist', 'eslint:dist', 'browserify:dist', 'uglify:dist']);

  // Register default task
  grunt.registerTask('default', ['compile']);
};
