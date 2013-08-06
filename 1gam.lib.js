(function(e){if("function"==typeof bootstrap)bootstrap("omg",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeOmg=e}else"undefined"!=typeof window?window.omg=e():global.omg=e()})(function(){var define,ses,bootstrap,module,exports;
return (function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
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

},{"./canvas":2,"./container":3,"./easing":4,"./events":5,"./game":6,"./gui/badge":7,"./gui/element":8,"./gui/label":9,"./gui/modal":10,"./keys":11,"./menu":12,"./particles":13,"./racket":14,"./raf":15,"./resources":16,"./sponge":17}],2:[function(require,module,exports){
(function() {
    var canvas = document.getElementsByTagName("canvas")[0];
    function Canvas(canvas) {
        canvas = canvas || document.createElement("canvas");
        // canvas.style.zIndex = 55;
        var context = canvas.getContext("2d");
        var C = {
            element: canvas,
            context: context,
            imageData: function(data) {
                if(data) {
                    context.putImageData(data, 0, 0);
                }
                return context.getImageData(0, 0, canvas.width, canvas.height);
            },
            create: function(size) {
                var newCanvas = Canvas();
                newCanvas.size(size);
                return newCanvas;
            },
            clone: function(empty) {
                var clone = Canvas();
                clone.size(C.size());
                if(!empty) {
                    clone.context.drawImage(C.element, 0,  0);
                }
                return clone;
            },
            clear: function(color) {
                if(!color) {
                    canvas.width = canvas.width;
                } else {
                    context.save();
                    context.fillStyle = color;
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    context.restore();
                }
            },
            size: function(w, h) {
                if(w) {
                    if(typeof(w) === "object") {
                        canvas.width = w.W || w.width;
                        canvas.height = w.H || w.height;
                    } else {
                        canvas.width = w;
                        canvas.height = h;
                    }
                }
                return { width: canvas.width, height: canvas.height };
            }
        };
        Object.defineProperty(C, "width", {
            get: function() { return canvas.width; },
            set: function(w) { canvas.width = w; }
        });
        Object.defineProperty(C, "height", {
            get: function() { return canvas.height; },
            set: function(h) { canvas.height = h; }
        });

        C.position = (function() {
            var x = 0,
                y = 0,
                parent = C.element;
            while(parent) {
                x += parent.offsetLeft;
                y += parent.offsetTop;
                parent = parent.parentElement;
            }
            return {X: x, Y: y};
        }());

        return C;
    }
    exports.Canvas = Canvas(canvas);
}());

},{}],3:[function(require,module,exports){
(function() {
    var Container = function() {
        var items = [];
        var container = {
            noncollider: true,
            count: function() {
                return items.length;
            },
            add: function(item) {
                items.push(item);
            },
            remove: function(item) {
                for(var i = items.length -1; i >= 0; --i) {
                    if(items[i] === item) {
                        items.splice(i, 1);
                        break;
                    }
                }
            },
            each: function(cb) {
                for(var i = 0; i < items.length; i++) {
                    cb(items[i]);
                }
            },
            draw: function() {
                container.each(function(item) {
                    item.draw();
                });
            }
        };
        return container;
    };
    exports.Container = Container;
}());

},{}],4:[function(require,module,exports){
exports.easing = function (t, b, c, d) {
    if ((t/=d) < (1/2.75)) {
        return c*(7.5625*t*t) + b;
    } else if (t < (2/2.75)) {
        return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
    } else if (t < (2.5/2.75)) {
        return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
    } else {
        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
    }
};

},{}],5:[function(require,module,exports){
exports.Events = {
    attach: function(obj) {
        var eventList = {},
            eventTarget = {
                on: function(ev, f) {
                    if(!eventList[ev]) eventList[ev] = [];
                    eventList[ev].push(f);
                    return obj;
                },
                fire: function(ev, evobj) {
                    if(eventList[ev]) {
                        for(var i = 0; i < eventList[ev].length; i++) {
                            if(eventList[ev][i].call(obj, evobj)) {
                                return;
                            }
                        }
                    }
                },
                remove: function(ev, f) {
                    if(!eventList[ev]) {
                        return;
                    }
                    for(var i = 0; i < eventList[ev].length; i++) {
                        if(eventList[ev][i] === f) {
                            eventList[ev].splice(i, 1);
                            break;
                        }
                    }
                }
            };
        for(var prop in eventTarget) {
            obj[prop] = eventTarget[prop];
        }
    }
};

},{}],6:[function(require,module,exports){
(function(){
    "strict mode";
    var raf = require("./raf").raf;
    var Canvas = require("./canvas").Canvas;
    // var stats = new Stats();
    // stats.domElement.style.position = 'absolute';
    // stats.domElement.style.left = '0px';
    // stats.domElement.style.top = '0px';

    // document.body.appendChild( stats.domElement );

    var game = {
            mouse: [],
            run: function() {
                // stats.begin();
                if(game.state) {
                    game.state.run();
                }
                raf.requestAnimationFrame.call(window, game.run);
                // stats.end();
            },
            touches: {}
        },
        state = null;

    Object.defineProperty(game, "state", {
        get: function() {
            return state;
        },
        set: function(newstate) {
            if(state) {
                state.clear(function() {
                    newstate.init();
                    state = newstate;
                });
            } else {
                newstate.init();
                state = newstate;
            }
        }
    });

    window.addEventListener("keyup", function(e) {
        if(game.state && game.state.keyup) {
            game.state.keyup(e.keyCode, {
                ctrl: e.ctrlKey,
                alt: e.altKey,
                shift: e.shiftKey
            });
        }
        if(e.keyCode === 27) {
            game.state = game.paused;
        }
    });
    window.addEventListener("keydown", function(e) {
        if(game.state && game.state.keydown) {
            game.state.keydown(e.keyCode, {
                ctrl: e.ctrlKey,
                alt: e.altKey,
                shift: e.shiftKey
            });
        }
    });

    window.addEventListener("mousemove", function(e) {
        if(game.state && game.state.mousemove) {
            var x = e.clientX - Canvas.position.X;
            var y = e.clientY - Canvas.position.Y;
            game.state.mousemove({X: x, Y: y});
        }
    });

    // window.addEventListener("contextmenu", function(e) {
    //     if(game.state && game.state.click) {
    //         var x = e.clientX - Canvas.position.X;
    //         var y = e.clientY - Canvas.position.Y;
    //         game.state.click({X: x, Y: y, button: 2});
    //     }
    // });

    // window.addEventListener("click", function(e) {
    //     if(game.state && game.state.click) {
    //         var x = e.clientX - Canvas.position.X;
    //         var y = e.clientY - Canvas.position.Y;
    //         game.state.click({X: x, Y: y, button: e.button});
    //     }
    // });

    Canvas.element.addEventListener("mousedown", function(e) {
        game.mouse[e.button] = Date.now();
        e.preventDefault();
        if(game.state && game.state.mousedown) {
            var x = e.clientX - Canvas.position.X;
            var y = e.clientY - Canvas.position.Y;
            game.state.mousedown({X: x, Y: y, button: e.button});
        }
    });


    Canvas.element.addEventListener("mouseup", function(e) {
        var now = Date.now();
        var x, y;
        console.log(now - game.mouse[e.button]);
        if(now - game.mouse[e.button] < 150) {
            if(game.state && game.state.click) {
                x = e.clientX - Canvas.position.X;
                y = e.clientY - Canvas.position.Y;
                game.state.click({X: x, Y: y, button: e.button});
            }
        }
        game.mouse[e.button] = null;
        if(game.state && game.state.mouseup) {
            x = e.clientX - Canvas.position.X;
            y = e.clientY - Canvas.position.Y;
            game.state.mouseup({X: x, Y: y, button: e.button});
        }
    });

    window.addEventListener("touchstart", function(e) {
        console.log("touchstart");
        if(game.state && game.state.mousedown) {
            var touches = e.changedTouches;
            if(touches.length > 0) {
                var x = (touches[0].pageX | 0);// - Canvas.position.X;
                var y = (touches[0].pageY | 0);// - Canvas.position.Y;
                game.state.mousedown({X: x, Y: y});
                game.touches[touches[0].identifier] = Date.now();
            }
        }
    });


    window.addEventListener("touchmove", function(e) {
        console.log("touchmove");
        if(game.state && game.state.mousemove) {
            var touches = e.changedTouches;
            if(touches.length > 0) {
                var x = (touches[0].pageX | 0);// - Canvas.position.X;
                var y = (touches[0].pageY | 0);// - Canvas.position.Y;
                game.state.mousemove({X: x, Y: y});
                //game.touches[touches[0].identifier] = Date.now();
            }
        }
    });

    window.addEventListener("touchend", function(e) {
        console.log("touchend");
        var touches = e.changedTouches;
        var x, y;
        if(game.state && game.state.mouseup) {
            if(touches.length > 0) {
                x = (touches[0].pageX | 0);// - Canvas.position.X;
                y = (touches[0].pageY | 0);// - Canvas.position.Y;
                game.state.mouseup({X: x, Y: y});

                //game.touches[touches[0].identifier] = null;
            }
        }
        console.log(game.touches[touches[0].identifier]);
        console.log(Date.now() - game.touches[touches[0].identifier]);
        if(/*game.touches[touches[0].identifier] &&
            Date.now() - game.touches[touches[0].identifier] < 400 &&*/
            game.state.click) {
            //if(touches.length > 0) {
                x = (touches[0].pageX | 0);// - Canvas.position.X;
                y = (touches[0].pageY | 0);// - Canvas.position.Y;

                game.state.click({X: x, Y: y});
            //}
        }

    });
    exports.game = game;
}());

},{"./canvas":2,"./raf":15}],7:[function(require,module,exports){
(function() {
    var Canvas = require("../canvas").Canvas;
    var Element = require("./element").gui.Element;
    var Badge = function(obj) {
        var badge = Element({
            position: { X: 30, Y: 80 },
            size: { width: 48, height: 48 },
            title: "Ghost",
            description: "Finished level without being seen",
            active: false
        });
        badge.on("run", function() {
            if(!badge.active) {
                Canvas.context.globalAlpha = 0.2;
            }
            if(badge.image) {
                Canvas.context.drawImage(badge.image, 0, 0,
                    badge.image.width,
                    badge.image.height,
                    badge.position.X,
                    badge.position.Y,
                    badge.size.width,
                    badge.size.height);
            }
            Canvas.context.font = "32px RapscallionRegular";
            Canvas.context.fillText(badge.title, badge.position.X + badge.size.width + 10, badge.position.Y - 8);
            Canvas.context.font = "14px Arial";
            Canvas.context.fillText(badge.description, badge.position.X + badge.size.width + 10, badge.position.Y + 28);
            Canvas.context.globalAlpha = 1.0;
        });
        if(obj) {
            badge.eat(obj);
        }
        return badge;
    }
    if(!exports.gui) {
        exports.gui = {};
    }
    exports.gui.Badge = Badge;
}());

},{"../canvas":2,"./element":8}],8:[function(require,module,exports){
(function() {
    var Canvas = require("../canvas").Canvas;
    var Events = require("../events").Events;
    var Element = function(obj) {
        var elements = [];
        var element = {
            eat: function(obj) {
                for(var prop in obj) {
                    element[prop] = obj[prop];
                }
            },
            add: function(e) {
                elements.push(e);
            },
            position: {X: 0, Y: 0},
            size:  {width: 0, height: 0},
            init: function() {
                element.fire("init");
                for(var i = 0; i < elements.length; i++) {
                    elements[i].init();
                }
            },
            click: function(mouse) {
                if (mouse.X > element.position.X &&
                    mouse.X < element.position.X + element.size.width &&
                    mouse.Y > element.position.Y &&
                    mouse.Y < element.position.Y + element.size.height)  {
                    for(var i = 0; i < elements.length; i++) {
                        elements[i].click({X: mouse.X - element.position.X, Y: mouse.Y - element.position.Y });
                    }
                    element.fire("click");
                }
            },
            run: function() {
                element.fire("run");
                Canvas.context.save();
                Canvas.context.translate(element.position.X, element.position.Y);
                for(var i = 0; i < elements.length; i++) {
                    elements[i].run();
                }
                Canvas.context.restore();
            }
        };
        if(obj) {
            element.eat(obj);
        }
        Events.attach(element);
        return element;
    };
    if(!exports.gui) {
        exports.gui = {};
    }
    exports.gui.Element = Element;
}());

},{"../canvas":2,"../events":5}],9:[function(require,module,exports){
(function() {
    var Canvas = require("../canvas").Canvas;
    var Element = require("./element").gui.Element;
    var Label = function(text, obj) {
        var label = Element({
            position: {X: 200, Y: 20},
            size: { width: 0, height: 0 },
            text: text,
            fontSize: 48,
            font: "RapscallionRegular",
            color: "white",
            align: "center",
            background: null
        });
        label.on("init", function() {
            if(!label.initialized) {
                //set correct size for click events
                Canvas.context.font = label.fontSize + "px " + label.font;
                var labelSize = Canvas.context.measureText(label.text);
                label.size = {width: labelSize.width + label.fontSize / 2,
                                height: label.fontSize * 1.4};
                if(label.align == "center") {
                    label.position.X -= label.size.width / 2 - label.fontSize / 4;
                }
                label.initialized = true;
            }
        });
        label.on("run", function() {
            if(label.background) {
                Canvas.context.fillStyle = label.background;
                Canvas.context.fillRect(label.position.X - (label.fontSize / 4),
                                        label.position.Y - (label.fontSize / 4),
                                        label.size.width,
                                        label.size.height);
            }
            Canvas.context.fillStyle = label.color;
            Canvas.context.font = label.fontSize + "px " + label.font;
            Canvas.context.textAlign = "left";
            Canvas.context.textBaseline = "top";
            Canvas.context.fillText(label.text, label.position.X, label.position.Y);
        });
        if(obj) {
            label.eat(obj);
        }

        return label;
    };
    if(!exports.gui) {
        exports.gui = {};
    }
    exports.gui.Label = Label;
}());

},{"../canvas":2,"./element":8}],10:[function(require,module,exports){
(function() {
    var easing = require("../easing").easing;
    var Canvas = require("../canvas").Canvas;
    var Element = require("./element").gui.Element;
    var color = "rgba(55, 55, 55, 0.5)",
        buffer = 80,
        duration = 500;

    if(!exports.gui) {
        exports.gui = {};
    }
    exports.gui.Modal = function(size) {
        var start = 0, from, to,
            position = {X: 0, Y: Canvas.height / 2 - size.height / 2 },
            context = Canvas.context;
        var modal = Element({
            font: "48px customfont",
            position: position,
            size: size,
            lifetime: function() {
                return Date.now() - start;
            },
            clear: function(cb) {
                modal.time = Date.now() - start;
                start = Date.now();
                from = 0;
                to = -size.width;
                position.X = from;
                modal.done = cb;
            }
        });

        modal.on("init", function() {
            modal.background = document.createElement("canvas");
            modal.background.width = Canvas.width;
            modal.background.height = Canvas.height;
            modal.background.getContext("2d").drawImage(Canvas.element, 0, 0);

            start = Date.now();
            from = -size.width;
            to = (Canvas.width / 2) - (size.width / 2) + size.width;
            position.X = from;
        });

        modal.on("run", function() {
            if(start === 0) return;
            var now = Date.now() - start,
                sign = -1;

            if(now < duration) {
                position.X = easing(now, from, to, duration) | 0;
            } else {
                position.X = from + to;
                if(to < 0 && modal.done) {
                    modal.done();
                }
            }
            context.drawImage(modal.background, 0, 0);
            context.fillStyle = color;
            context.fillRect(position.X, position.Y, size.width, size.height);
        });
        return modal;
    };
}());

},{"../canvas":2,"../easing":4,"./element":8}],11:[function(require,module,exports){
exports.keys = {
    BACKSPACE:8,
    TAB:9,
    ENTER:13,
    SHIFT:16,
    CTRL:17,
    ALT:18,
    PAUSE:19,
    CAPSLOCK:20,
    ESC:27,
    SPACE:32,
    PAGEUP:33,
    PAGEDOWN:34,
    END:35,
    HOME:36,
    LEFT:37,
    UP:38,
    RIGHT:39,
    DOWN:40,
    INSERT:45,
    DELETE:46,
    F1:112,
    F2:113,
    F3:114,
    F4:115,
    F5:116,
    F6:117,
    F7:118,
    F8:119,
    F9:120,
    F10:121,
    F11:122,
    F12:123,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    NUMLOCK:144,
    SCROLLLOCK:145
};

},{}],12:[function(require,module,exports){
(function() {
    var easing = require("./easing").easing;
    var color = "rgba(0, 0, 0, 0.7)",
        width = 324,
        buffer = 80,
        duration = 500;


    function hit(index, pos) {
        var rect = {X: 10, Y: 10 + (index * 120), W: 280, H: 100};
        if (pos.X > rect.X &&
            pos.X < rect.X + rect.W &&
            pos.Y > rect.Y && pos.Y < rect.Y + rect.H) {
            return true;
        }
        return false;
    }
    var Menu =  function(canvas, menu, splash) {
        var start = 0, from, to,
            position = {X: 0, Y: 0},
            context = canvas.getContext("2d"),
            splashX = 0;
        var paused = {
            font: "48px Arial",
            click: function(mouse) {
                //menu[0].action();
                if(mouse.X < width) {
                    for(var i = 0; i < menu.length; i++) {
                        if(hit(i, mouse)) {
                            menu[i].action();
                        }
                    }
                }
            },
            run: function() {
                if(start === 0) return;
                var now = Date.now() - start,
                    sign = -1,
                    splashStart = canvas.width;
                if(splash && to < 0) {
                    sign = 1;
                    splashStart = canvas.width - splash.width;
                }
                if(now < duration) {
                    position.X = easing(now, from, to, duration) | 0;
                    if(splash) {
                        splashX = easing(now, splashStart, sign * splash.width, duration) | 0;
                    }
                } else {
                    position.X = from + to;
                    if(splash) {
                        splashX = canvas.width - splash.width;
                    }
                    if(to < 0 && paused.done) {
                        paused.done();
                    }
                }
                context.save();
                context.drawImage(paused.background, 0, 0);
                if(splash) {
                    context.drawImage(splash, splashX, canvas.height / 2 - splash.height / 2);
                }
                context.fillStyle = color;
                context.fillRect(position.X - buffer, position.Y, width + buffer, canvas.height);
                context.translate(position.X, position.Y);

                context.textBaseline = "middle";
                context.textAlign = "center";
                context.font = paused.font;
                for(var i = 0; i < menu.length; i++) {
                    var iconSpace = menu[i].icon ? 37 : 0;
                    if(menu[i].label) {
                        context.fillStyle = color;
                        //context.strokeRect(10, 10 + (i * 120), 280, 100);
                        context.fillStyle = "white";
                        context.fillText(menu[i].label, 10 + 140 + iconSpace, 10 + 50 + (i * 120));
                    }
                    if(menu[i].icon) {
                        context.drawImage(menu[i].icon, 0, 0, menu[i].icon.width, menu[i].icon.height, 37, 37 + (i * 120), 48, 48);
                    }
                }
                context.restore();
            },
            init: function() {
                paused.background = document.createElement("canvas");
                paused.background.width = canvas.width;
                paused.background.height = canvas.height;
                paused.background.getContext("2d").drawImage(canvas, 0, 0);

                start = Date.now();
                from = -width;
                to = width;
                position.X = from;
            },
            lifetime: function() {
                return Date.now() - start;
            },
            clear: function(cb) {
                paused.time = Date.now() - start;
                start = Date.now();
                from = 0;
                to = -width;
                position.X = from;
                paused.done = cb;
            }
        };
        return paused;
    };
    exports.Menu = Menu;
}());

},{"./easing":4}],13:[function(require,module,exports){
(function() {
    var Canvas = require("./canvas").Canvas;
    var Resources = require("./resources").Resources;
    var Events = require("./events").Events;
    var Position = function(x, y) {
        return {X: x, Y: y};
    };

    Position.copy = function(position) {
        return {X: position.X, Y: position.Y};
    };

    function createParticle(options) {
        var dead = false;
        var particle = {
            then: Date.now(),
            birth: Date.now(),
            angle: 0,
            unborn: true,
            ttl: Math.random() * (options.ttl.max - options.ttl.min),
            reset: function(position) {
                if(particle.dead) {
                    particle.unborn = true;
                    return;
                }
                var now = Date.now();
                var direction = Math.random() * (2 * Math.PI);
                particle.position = Position.copy(options.position);
                particle.startPosition = Position.copy(options.position);
                particle.birth = now;
                particle.alpha = 1.0;
                particle.unborn = false;
                particle.then = now;
                particle.image = Resources[options.image];
                particle.direction = Position(Math.cos(direction), Math.sin(direction));
                particle.scale = Math.random() * (options.scale.max - options.scale.min) + options.scale.min;
                particle.speed = Math.random() * (options.speed.max - options.speed.min) + options.speed.min;
                particle.ttl = Math.random() * (options.ttl.max - options.ttl.min) + options.ttl.min;
                //console.log(particle.direction);
            },
            die: function() {
                particle.dead = true;
            },
            update: function(position) {
                var now = Date.now();
                var life = now - particle.birth;
                if(life > particle.ttl) {
                    particle.reset(options.position);
                } else {
                    if(!particle.unborn) {
                        var distance = life * particle.speed;
                        //console.log(distance);
                        particle.position.X = particle.startPosition.X + distance * particle.direction.X;
                        particle.position.Y = particle.startPosition.Y + distance * particle.direction.Y;
                        particle.angle += 0.1;
                        particle.alpha = 1 - (life / particle.ttl);
                        //console.log(particle.startPosition);
                        // particle.scale -= 0.01;
                        // if(particle.scale < 0) particle.scale = 0;
                    }
                }
                particle.then = now;
            },
            draw: function() {
                if(!particle.unborn) {
                    Canvas.context.save();
                    //Canvas.context.globalCompositeOperation = "lighter";
                    Canvas.context.translate(particle.position.X, particle.position.Y);
                    Canvas.context.scale(particle.scale, particle.scale);
                    Canvas.context.rotate(particle.angle);
                    Canvas.context.globalAlpha = particle.alpha;
                    Canvas.context.drawImage(particle.image, -particle.image.width / 2, -particle.image.height / 2);
                    Canvas.context.restore();
                }
            }
        };
        return particle;
    }
    var particles = function(options) {
        var ttl = options.systemTtl || 0;
        var birth = Date.now();
        var position = {X: 100, Y:100};
        var angle = 1;
        // var options = {
        //  position: position,
        //  image: image,
        //  scale: {min: 0.1, max: 0.4},
        //  speed: {min: 0.01, max:0.04},
        //  ttl: {min: 30, max: 1000},
        //  count: 50
        // };
        var particleList = [];
        // for(var i = 0; i < options.count; i++) {
        //  particleList.push(createParticle(options));
        // }
        var direction = {X: 4, Y: 4};
        var i;
        var p = {
            position: options.position,
            draw: function() {
                p.run();
            },
            keyup: function(key) {
                if(key === 32) {
                    p.kill();
                }
            },
            kill: function() {
                ttl = 1;
            },
            run: function() {
                if(p.dead) {
                    return;
                }
                if(options.count > particleList.length) {
                    for(i = 0; i < options.count - particleList.length; i++){
                        particleList.push(createParticle(options));
                    }
                }
                if(options.count < particleList.length) {
                    particleList.length = options.count | 0;
                }
                var now = Date.now();
                var deadParticles = 0;
                for(i = 0; i < particleList.length; i++) {
                    particleList[i].update();
                    particleList[i].draw();
                    if(ttl !== 0 && now - birth > ttl) {
                        particleList[i].die();
                    }
                    if(particleList[i].dead && particleList[i].unborn) {
                        deadParticles++;
                    }
                    if(deadParticles === particleList.length) {
                        p.fire("death");
                        p.dead = true;
                    }
                }
            },
            init: function() {
                console.log("init particles");
            }
        };
        Events.attach(p);
        return p;
    };
    exports.Particles = particles;
}());

},{"./canvas":2,"./events":5,"./resources":16}],14:[function(require,module,exports){
(function(){/*jshint newcap:false, nonew:true */
/*global console, define */
(function() {
    "use strict";
    function audio(files, callback) {
        var file = new Audio(),
            maxChannels = 3,
            channels = [],
            fileType = files.substr(files.lastIndexOf(".") + 1).toLowerCase();

        callback = callback || function(success) { console.log("no callback set for loading audio."); };
        var rfile = {
            canPlay: {
                "mp3": file.canPlayType("audio/mpeg"),
                "ogg": file.canPlayType("audio/ogg"),
                "wav": file.canPlayType("audio/wav")
            },
            volume: function(vol) {
                for(var i = 0; i < channels.length; i++) {
                    channels[i].volume = vol;
                }
            },
            play: function(loop) {
                for(var i = 0; i < maxChannels; i++) {
                    if(i >= channels.length) {
                        channels[i] = new Audio(files);
                        if(channels[i].load) {
                            channels[i].load();
                        }
                    }
                    if(channels[i].currentTime === 0 || channels[i].ended) {
                        channels[i].loop = loop;
                        channels[i].play();
                        return;
                    }
                }
                //if all else fails.
                channels[0].pause();
                channels[0].loop = loop;
                channels[0].currentTime = 0;
                channels[0].play();
            },
            stop: function() {
                for(var i = 0; i < channels.length; i++) {
                    if(channels[i] && !channels[i].paused) {
                        channels[i].pause();
                        channels[i].currentTime = 0;
                    }
                }
            }
        };
        if(!rfile.canPlay[fileType]) {
            callback(false);
            console.log("This filetype cannot be played on this browser: " + fileType);
        } else {
            //for(var i = 0; i < maxChannels; i++) {
                channels.push(new Audio(files));
                if(channels[0].load) {
                    channels[0].load();
                }
            //}
            callback(true);
        }
        return rfile;
    }

    exports.Racket = {
        create: audio
    };

}());

})()
},{}],15:[function(require,module,exports){
(function() {
    var requestAnimationFrame = (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(cb) {
            setTimeout(cb, 17);
        });
    exports.raf = {
        requestAnimationFrame: requestAnimationFrame
    };
}());

},{}],16:[function(require,module,exports){
(function() {
    var events = require("./events").Events;
    var Racket = require("./racket").Racket;
    if(window._GAME_RESOURCES_) {
        exports.Resources =  window._GAME_RESOURCES_;
        return;
    }
    var meshLoader = null;
    var audio = /(wav$|mp3$|ogg$)/;
    var mesh = /(3d$|js$|json$)/;
    var resources = {
        loaded: 0,
        load: function(files) {
            resources.load.total = 0;
            resources.load.loaded = 0;
            function loaded(file) {
                resources.load.loaded++;
                resources.fire("progress", file);
                if(resources.load.loaded === resources.load.total) {
                    resources.fire("load");
                }
            }
            for(var file in files) {
                if(resources[file]) {
                    throw "naming conflict: cannot load resource named " + file;
                }
                var type = "image";
                console.log(file + " is audio: " + audio.test(files[file]));
                if(audio.test(files[file])) {
                    type = "audio";
                }
                if(mesh.test(files[file])) {
                    type = "mesh";
                }
                resources.load.total++;
                switch(type) {
                    case "audio":
                        (function(file) {
                            resources[file] = Racket.create(files[file], function(success) {
                                if(!success) {
                                    console.log("failed to load: " + files[file]);
                                }
                                loaded(file);
                            });
                        }(file));
                    break;
                    case "mesh":
                        if(meshLoader === null) {
                            meshLoader = new THREE.JSONLoader();
                        }
                        (function(file) {
                            meshLoader.load(files[file], function(geometry, material) {
                                console.log(material);
                                console.log("3d file loaded: " + file);
                                for(var i = 0; i < material.length; i++) {
                                    material[i].shading = THREE.FlatShading;
                                }
                                var faceMaterial = new THREE.MeshFaceMaterial(material);
                                resources[file] = { geometry: geometry, material: faceMaterial }; //new THREE.Mesh(geometry, faceMaterial);
                                loaded(file);
                            });
                        }(file));
                    break;
                    default:
                        var img = new Image();
                        (function(img, file){
                            img.onload = function() {
                                loaded(file);
                            };
                            img.onerror = function() {
                                //fail silently.
                                console.log("failed to load: " + files[file]);
                                loaded(file);
                            };
                        }(img, file));
                        img.src = files[file];
                        img.setAttribute("class", "resources");
                        img.setAttribute("name", file);
                        resources[file] = img;
                    break;
                }
            }
        }
    };

    // var domResources = document.querySelectorAll("img.resources");
    // for(var i = 0; i < domResources.length; i++) {
    //     resources[domResources[i].getAttribute("name")] = domResources[i];
    // }
    events.attach(resources);
    window._GAME_RESOURCES_ = resources;
    exports.Resources = resources;
}());

},{"./events":5,"./racket":14}],17:[function(require,module,exports){
//attach a sponge to an object to allow it to absorb other objects (mixins)
exports.Sponge = {
    attach: function(obj) {
        obj.absorb = function(other) {
            for(var property in other) {
                if(other.hasOwnProperty(property)) {
                    var descriptor = Object.getOwnPropertyDescriptor(other, property);
                    Object.defineProperty(obj, property, descriptor);
                }
            }
        };
    }
};

},{}]},{},[1])(1)
});
;