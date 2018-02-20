module.exports = {
	pug: {
		options: {
			data: {
				debug: false
			}
		},
		files: {
			'<%=project.dist %>/index.html': ['<%=project.app %>/tpls/index.pug']
		}
	}
};
