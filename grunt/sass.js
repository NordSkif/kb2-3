module.exports = {
    dist: {
        options: {
            style: 'expanded',
            sourceMap: true
        },
        files: {
            '<%= project.dist %>/css/<%= project.name %>.css': '<%= project.sass %>'
        }
    }
};
