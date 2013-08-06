(function() {
    var requestAnimationFrame = (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(cb) {
            setTimeout(cb, 17);
        });
    exports.raf = {
        requestAnimationFrame: requestAnimationFrame
    };
}());
