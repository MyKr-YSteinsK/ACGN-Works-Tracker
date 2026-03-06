(function(window) {
    function resolveContextPath() {
        var path = window.location.pathname || "";
        var pageIndex = path.indexOf("/pages/");
        if (pageIndex >= 0) {
            return path.substring(0, pageIndex);
        }

        var lastSlash = path.lastIndexOf("/");
        if (lastSlash > 0) {
            return path.substring(0, lastSlash);
        }

        return "";
    }

    var contextPath = resolveContextPath();

    window.AppPath = {
        contextPath: contextPath,
        api: function(path) {
            return contextPath + path;
        },
        page: function(path) {
            return contextPath + "/pages/" + path;
        },
        asset: function(path) {
            return contextPath + path;
        }
    };
})(window);
