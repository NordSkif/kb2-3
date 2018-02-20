module.exports = {
    options: {
        livereload: true
    },
    css: {
        files: [
            '<%= project.app %>/blocks/**/{,*/}*.{scss,sass}',
            '<%= project.app %>/libs/sass/{,*/}*.{scss,sass}',
            '<%= project.app %>/<%= project.name %>*.{scss,sass}'
        ],
        tasks: ['sass', 'autoprefixer'],
        options: {
            spawn: false
        }
    },
    image: {
        files: [
            '<%= project.images %>/**/{,*/}*.{png,gif,svg,jpg,jpeg,bmp}'
        ],
        tasks: ['copy']
    },
    fonts: {
        files: [
            '<%= project.fonts %>/**/{,*/}*.{woff,truetype,opentype,svg,otf,ttf}'
        ],
        tasks: ['copy']
    },
    video: {
		files: [
			'<%= project.video %>/**/*.mp4'
		],
		tasks: ['copy']
    },
    content: {
        files: [
            '<%= project.content %>/*.json'
        ],
        tasks: ['copy']
    },
	audio: {
    	files: [
			'<%= project.audio %>/**/*.wav',
			'<%= project.audio %>/**/*.mp3'
		],
		tasks: ['copy']
	},
    scripts: {
        files: [
            '<%= project.libs %>/js/{,*/}*.js',
            '<%= project.blocks %>/**/js/{,*/}*.js',
            '<%= project.blocks %>/**/{,*/}*.js',
            '<%= project.blocks %>/**/{,*/}*.js',
            '<%= project.app %>/{,*/}*.js',
            '<%= project.blocks %>/*.js',
        ],
        tasks: ['concat', 'browserify'],
        options: {
            spawn: false
        }
    },
	pug: {
		files: [
			'<%= project.blocks %>/**/*.pug',
			'<%= project.app %>/tpls/*.pug',
			'<%= project.blocks %>/**/**/*.pug'
		],
		tasks: ['pug']
	}
};
