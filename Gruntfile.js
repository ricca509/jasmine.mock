/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: true
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: [ 'src/**/*.js', 'test/**/*.js', '!test/lib/**/*.js']
            }
        },
        jasmine: {
            lib: {
                src: 'src/**/*.js',
                options: {
                    specs: 'test/spec/*.spec.js',
                    vendor: [
                        "components/underscore/underscore.js",
                        "components/backbone/backbone.js"
                    ],
                    keepRunner: true
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma-conf.js'
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', 'nodeunit']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-karma');

    // Default task.
    grunt.registerTask('default', ['jasmine']);

};
