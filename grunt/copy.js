module.exports = {
    main: {
        files: [
            {
                expand: true,
                cwd: '<%=project.images %>',
                src: ['**'],
                dest: '<%= project.dist %>/img'
            },
            {
                expand: true,
                cwd: '<%=project.fonts %>',
                src: ['**'],
                dest: '<%= project.dist %>/fonts'
            },
			{
				expand: true,
				cwd: '<%=project.video %>',
				src: ['**'],
				dest: '<%= project.dist %>/video'
			},
			{
				expand: true,
				cwd: '<%=project.audio %>',
				src: ['**'],
				dest: '<%= project.dist %>/audio'
			},
            {
                expand: true,
                cwd: '<%=project.content %>',
                src: ['**'],
                dest: '<%= project.dist %>/content'
            }
        ]
    }
};