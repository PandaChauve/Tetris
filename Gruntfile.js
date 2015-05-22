module.exports = function(grunt) {
    // Do grunt-related things in here

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            files: {
                src: '*/*.js',  // source files mask
                dest: 'min/',    // destination folder
                expand: true,    // allow dynamic building
                flatten: true,   // remove all unnecessary nesting
                ext: '.min.js'   // replace .js to .min.js
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['min/angularApp.min.js', 'min/*min.js', ],
                dest: 'app.min.js'
            },
            css: {
                src: 'css/*.min.css',
                dest: 'app.min.css'
            }
        }, processhtml: {
            dist: {
                files:{
                    'index.html' : ["index.debug.html"]
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-closure-compiler');
    grunt.registerTask('default', ['uglify','concat', 'processhtml']);
    grunt.registerTask('build', ['concat', 'processhtml']);
};
