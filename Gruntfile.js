module.exports = function(grunt) {
    // Do grunt-related things in here

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            files: {
                src: ['js/*.js','js/*/*.js' ,'js/*/*/*.js' ],  // source files mask
                dest: 'min/',    // destination folder
                expand: true,    // allow dynamic building
                flatten: true,   // remove all unnecessary nesting
                ext: '.min.js'   // replace .js to .min.js
            },
            options: {
                preserveComments: false
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['min/angularApp.min.js', 'min/*min.js'],
                dest: 'app.min.js'
            },
            css: {
                src: 'css/*.min.css',
                dest: 'app.min.css'
            }
        },
        processhtml: {
            dist: {
                files:{
                    'index.html' : ["index.debug.html"]
                }
            }
        },
        clean: ["min"]
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.registerTask('default', ['clean', 'uglify', 'concat', 'processhtml']);
};
