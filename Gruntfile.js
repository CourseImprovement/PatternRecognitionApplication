module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      norm: {
        src: ['src/*.js', 'src/*/init.js', 'src/*/*.js'],
        dest: 'build/pra.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat:norm']);
};