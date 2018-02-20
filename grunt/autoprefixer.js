module.exports = {
    options: {
        map: true,
        browsers: ['last 2 version', '> 1% in RU', 'ie 9']
    },
    main: {
        files: {
            src: '<%= project.dist %>/css/<%= project.name %>.css'
        }
    }
};
