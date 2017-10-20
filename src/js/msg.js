/**
* 脚本名称：前台弹窗辅助脚本
* 脚本说明：
* 1.所有弹窗依赖layui的layer项目，http://www.layui.com/doc/modules/layer.html 其他用法可去官网查看文档
* 
*/


!(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['layer'], factory);
    } else {
        // 浏览器全局变量(root 即 window)
        root.whir = root.whir || {};
        root.whir.layer = factory(layer);
    }
})(window || this, function (layer) {
    var _lastIndex;
    return {
        self: layer,
        prompt(title, callback, defaultVal) {
            layer.prompt({ title: title, value: defaultVal, formType: 0 }, function (val, index) {
                if (callback instanceof Function) callback(val);
                layer.close(index);
            });
        },
        msg(msg) {
            _lastIndex = layer.msg(msg || '无效提示');
        },
        load() {
            _lastIndex = layer.load();
        },
        close() {
            if (layer)
                layer.close(_lastIndex);
        },
        confirm(msg, affirm, cancel, title) {
            layer.confirm(msg, { title: title || '提示' }, function (index) {
                if (affirm instanceof Function) affirm();
                layer.close(index);
            }, function () {
                if (cancel instanceof Function) cancel();
            });
        }
    };
});