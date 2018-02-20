module.exports = {
    build: {
        src: [
            '<%= project.js %>/<%= project.name %>-base.js',
            '<%= project.js %>/<%= project.name %>-run.js'
        ],
        dest: '<%= project.js %>/<%= project.name %>.min.js'
    }
};