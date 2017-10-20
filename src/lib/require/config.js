requirejs.config({
    baseUrl: "/src/js",
    paths: {
        "vue": "../lib/vue.min",
        'html': '../lib/template-web',
        'layer': '../lib/layer/layer',
        'jquery': '../lib/jquery',
        'socket': '../lib/socket.io'
    },
    map: {
        '*': {
            'css': '../lib/require/lib/css.min'
        }
    },
    shim: {
        'layer': {
            deps: [
                'css!../lib/layer/skin/default/layer.css'
            ]
        }
    }
});
