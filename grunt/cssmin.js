module.exports = {
    combine: {
        options: {
            keepSpecialComments: 0
        },
        files: {
            '<%= project.dist %>/css/<%= project.name %>.min.css': [
                '<%= project.dist %>/css/<%= project.name %>.css'
            ]
        }
    }
};