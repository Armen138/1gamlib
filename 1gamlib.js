(function() {
    var lib = {
        Canvas: require("./canvas").Canvas,
        Container: require("./container").Container,
        easing: require("./easing").easing,
        Events: require("./events").Events,
        game: require("./game").game,
        keys: require("./keys").keys,
        Menu: require("./menu").Menu,
        Particles: require("./particles").Particles,
        Resources: require("./resources").Resources,
        Racket: require("./racket").Racket,
        raf: require("./raf").raf,
        Sponge: require("./sponge").Sponge,
        gui: {
            Badge: require("./gui/badge").gui.Badge,
            Element: require("./gui/element").gui.Element,
            Label: require("./gui/label").gui.Label,
            Modal: require("./gui/modal").gui.Modal
        }
    };
    if(typeof(module) === "object") {
        module.exports = lib;
    }
    window.ogamlib = lib;
}());
