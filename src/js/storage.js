define(function () {
    var handler = {
        add(key, value) {
            if (typeof key === 'string' && key !== '' && typeof value === 'string' && value !== '') {
                window.localStorage.setItem(key, value);
            }
        },
        get(key) {
            if (typeof key === 'string') {
                return window.localStorage.getItem(key);
            }
        }
    }

    return handler;
});