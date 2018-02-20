module.exports = function (grunt) {

    var path = require('path');

    require('time-grunt')(grunt);

    require('load-grunt-config')(grunt, {

        configPath: path.join(process.cwd(), 'grunt'),

        jitGrunt: {
            staticMappings: {
                pug: 'grunt-contrib-pug'
            }
        },

        data: {
            project: {
                name: 'app-project',
                app: 'public',
                dist: '<%=project.app %>/dist',
                sass: '<%=project.app %>/<%=project.name%>.sass',
                js: '<%=project.dist %>/js',
                blocks: '<%=project.app %>/blocks',
                libs: '<%=project.app %>/libs',
                modules: '<%=project.app %>/modules',
                nodemodules: 'node_modules',
                images: '<%=project.app %>/img',
                fonts: '<%=project.app %>/fonts',
                video: '<%=project.app %>/video',
                audio: '<%=project.app %>/audio',
                content: '<%=project.app %>/content',
                tpls: 'templates'
            }
        }
    });
};
