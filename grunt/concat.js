module.exports = {
    base: {
        src: [
            '<%= project.libs %>/js/*.js',
            '<%= project.libs %>/js/**/*.js'
        ],
        dest: '<%= project.js %>/<%= project.name %>-base.js'
    }
};