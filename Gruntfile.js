module.exports = function(grunt) {
    // Do grunt-related things in here

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify_parallel: {
            basepackage: {
                src: ['js/*.js','js/*/*.js' ,'js/*/*/*.js' ,'js/*/*/*/*.js', '!js/controllers/arcade/*.js', '!js/controllers/generic/*.js','!js/*ngularApp.js' ],  // source files mask
                dest: 'min/',    // destination folder
                expand: true,    // allow dynamic building
                flatten: true,   // remove all unnecessary nesting
                ext: '.min.js'   // replace .js to .min.js
            },
            generic: {
                src: ['js/controllers/generic/*.js', 'js/angularApp.js' ],  // source files mask
                dest: 'min/generic/',    // destination folder
                expand: true,    // allow dynamic building
                flatten: true,   // remove all unnecessary nesting
                ext: '.min.js'   // replace .js to .min.js
            },
            arcade: {
                src: ['js/controllers/arcade/*.js', 'js/arcadeAngularApp.js' ],  // source files mask
                dest: 'min/arcade/',    // destination folder
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
                separator: ' '
            },
            externals: {
                src: ['min/ext-jquery*.min.js',
                    'min/ext-three*.min.js',
                    'min/ext-angular-1*.min.js',
                    'min/ext-angular-t*.min.js',
                    'min/ext-angular-*.min.js',
                    'min/ext-*.min.js'],
                dest: 'resources/externals.min.js'
            },
            generic: {
                src: ['min/generic/angularApp.min.js',
                    'min/generic/*.min.js',
                    'min/*.min.js',
                    '!min/ext*.min.js'
                ],
                dest: 'app.generic.min.js'
            },
            arcade: {
                src: ['min/arcade/arcadeAngularApp.min.js',
                    'min/arcade/*.min.js',
                    'min/*.min.js',
                    '!min/ext*.min.js'
                ],
                dest: 'app.arcade.min.js'
            },
            css: {
                src: 'css/*.css',
                dest: 'app.min.css'
            }
        },
        processhtml: {
            generic: {
                options:{
                    strip: true
                },
                files:{
                    'index.html' : ["index.template.html"]
                }
            },
            mobile: {
                options:{
                    strip: true
                },
                files:{
                    'index.mobile.html' : ["index.template.html"]
                }
            }
        },
        clean: ["min"]
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-uglify-parallel');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.registerTask('default', ['clean', 'uglify_parallel', 'concat', 'processhtml']);
    grunt.registerTask('genericOnly', ['clean', 'uglify_parallel:basepackage','uglify_parallel:generic', 'concat:externals', 'concat:css',  'concat:generic', 'processhtml:generic']);
    grunt.registerTask('arcadeOnly', ['clean', 'uglify_parallel:basepackage', 'uglify_parallel:arcade', 'concat:externals',  'concat:css',  'concat:arcade']);
    grunt.registerTask('dev', ['uglify_parallel:arcade', 'concat:arcade', 'processhtml:arcade']);
};
