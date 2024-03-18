'use strict';
const sass = require('node-sass');
module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            options: {
                implementation: sass,
                sourceMap: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'assets/scss',
                    src: '*.scss',
                    dest: './',
                    ext: '.css'
                }]
            }
        },
        postcss: {
            autoprefixer: {
                options: {
                    map: true,
                    processors: [
                        require('autoprefixer')({
                            'overrideBrowserslist': [
                                'iOS >= 14.1',
                                'safari >= 14.1',
                                '>= 5%',
                                'last 2 versions'
                            ]
                        })
                    ]
                },
                files: [{
                    src: [
                        '*.css',
                        '!*.min.css'
                    ]
                }]
            },
            minify: {
                options: {
                    processors: [
                        require('cssnano')({
                            preset: ['default', {
                                discardComments: {
                                    removeAll: true
                                }
                            }]
                        })
                    ]
                },
                files: [{
                    expand: true,
                    src: [
                        '*.css',
                        '!*.min.css'
                    ],
                    ext: '.min.css'
                }]
            }
        },

        uglify: {
            options: {
                mangle: true
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'assets/js/scripts/',
                    src: ['*.js', '!*min.js'],
                    dest: 'assets/js/scripts/',
                    ext: '.min.js'
                }]
            }
        },
        watch: {
            styles: {
                files: [
                    'assets/scss/**/*.scss'
                ],
                options: {
                    spawn: false,
                },
                tasks: ['styles']
            },
            scripts: {
                files: [
                    'assets/js/scripts/**/*.js',
                    '!assets/js/scripts/**/*.min.js'
                ],
                options: {
                    spawn: false,
                },
                tasks: ['uglify']
            },
        },
        checktextdomain: {
            options: {
                text_domain: 'corex',
                correct_domain: true,
                keywords: [
                    '__:1,2d',
                    '_e:1,2d',
                    '_x:1,2c,3d',
                    'esc_html__:1,2d',
                    'esc_html_e:1,2d',
                    'esc_html_x:1,2c,3d',
                    'esc_attr__:1,2d',
                    'esc_attr_e:1,2d',
                    'esc_attr_x:1,2c,3d',
                    '_ex:1,2c,3d',
                    '_n:1,2,4d',
                    '_nx:1,2,4c,5d',
                    '_n_noop:1,2,3d',
                    '_nx_noop:1,2,3c,4d'
                ]
            },
            files: {
                src: [
                    '**/*.php',
                    '!docs/**',
                    '!bin/**',
                    '!node_modules/**',
                    '!build/**',
                    '!tests/**',
                    '!.github/**',
                    '!vendor/**',
                    '!*~'
                ],
                expand: true
            },
        },
        makepot: {
            target: {
                options: {
                    cwd: 'languages',
                    updateTimestamp: true,					// Whether the POT-Creation-Date should be updated without other changes.
                    potHeaders: {
                        poedit: true,                 // Includes common Poedit headers.
                        'last-translator': 'Twinger, https://twinger.vn/',
                        'Language-Team': 'Twinger',
                        'Language': ' ko_KR',
                        'Content-Type': ' text/plain; charset=UTF-8',
                        'Content-Transfer-Encoding': ' 8bit',
                        'Plural-Forms': ' nplurals=2; plural=(n != 1);',
                        'x-poedit-basepath': '..',
                        'X-Poedit-KeywordsList': ' __;_e',
                        'x-textdomain-support': 'yes',
                        'X-Poedit-SearchPath-0': ' .',
                        'x-poedit-searchpathexcluded-0': 'node_modules',
                        'x-poedit-searchpathexcluded-1': 'inc',
                    },
                    mainFile: 'style.css',
                    potFilename: 'ko_KR.pot',
                    type: 'wp-theme',
                    updatePoFiles: true,


                }
            }
        }

    });
    grunt.registerTask('i18n', [
        'checktextdomain',
    ]);
    grunt.registerTask('styles', [
        'sass',
        'postcss'
    ]);
    // Default task(s).
    grunt.registerTask('default', [
        'watch',
    ]);
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
};