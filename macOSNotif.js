// Swipe for dismissal
class Swipe {
    constructor(element) {
        this.xDown = null;
        this.yDown = null;
        this.element = typeof(element) === 'string' ? document.querySelector(element) : element;

        this.element.addEventListener('touchstart', function (evt) {
            this.xDown = evt.touches[0].clientX;
            this.yDown = evt.touches[0].clientY;
        }.bind(this), false);

    }

    onLeft(callback) {
        this.onLeft = callback;

        return this;
    }

    onRight(callback) {
        this.onRight = callback;

        return this;
    }

    onUp(callback) {
        this.onUp = callback;

        return this;
    }

    onDown(callback) {
        this.onDown = callback;

        return this;
    }

    handleTouchMove(evt) {
        if (!this.xDown || !this.yDown) {
            return;
        }

        const xUp = evt.touches[0].clientX;
        const yUp = evt.touches[0].clientY;

        this.xDiff = this.xDown - xUp;
        this.yDiff = this.yDown - yUp;

        if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) { // Most significant.
            if (this.xDiff > 0) {
                if (this.onLeft) this.onLeft();
            } else {
                if (this.onRight) this.onRight();
            }
        } else {
            if (this.yDiff > 0) {
                if (this.onUp) this.onUp();
            } else {
                if (this.onDown) this.onDown();
            }
        }

        // Reset values.
        this.xDown = null;
        this.yDown = null;
    }

    handleScrollMove(evt) {
        if (!evt.deltaX || !evt.deltaY) {
            return;
        }

        if (Math.abs(evt.deltaX) > Math.abs(evt.deltaY)) { // Most significant.
            if (evt.deltaX > 0) {
                if (this.onLeft) this.onLeft();
            } else {
                if (this.onRight) this.onRight();
            }
            if (evt.deltaY > 0) {
                if (this.onUp) this.onUp();
            } else {
                if (this.onDown) this.onDown();
            }
        }
    }

    run() {
        this.element.addEventListener('touchmove', function (evt) {
            this.handleTouchMove(evt).bind(this);
        }.bind(this), false);

        this.element.addEventListener('wheel', function (evt) {
            this.handleScrollMove(evt).bind(this);
        }.bind(this), false);
    }
}

// macOSNotifJS
let macOSNotifJS_template = null;
let macOSNotifJS_last = -1;
let macOSNotifJS_src = document.currentScript.src;
macOSNotifJS_src = macOSNotifJS_src.substr(0, macOSNotifJS_src.lastIndexOf('/'));

function macOSNotifJS_loadCSS() {
    if (document.getElementById("macOSNotifJS_CSS")) return;

    let css = document.createElement("link");
    css.id = "macOSNotifJS_CSS";
    css.rel = "stylesheet";
    css.type = "text/css";
    css.href = macOSNotifJS_src + "/macOSNotif.css";

    document.getElementsByTagName("head")[0].appendChild(css);
}

async function macOSNotifJS_loadTemplate() {
    if (macOSNotifJS_template) return;

    // Generate template url
    let src = macOSNotifJS_src + "/macOSNotif.html";

    // Get the template
    const response = await fetch(src);
    macOSNotifJS_template = await response.text();
}

async function macOSNotifJS_generateTemplate() {
    // Ensure we have the template
    await macOSNotifJS_loadTemplate();

    // Get the template and insert the id
    let template = macOSNotifJS_template;
    macOSNotifJS_last++;
    const templateID = "macOSNotifJS_n" + macOSNotifJS_last.toString();
    template = template.replace(/macOSNotifJS_/g, templateID + "_");

    // Return template and the ID of it
    return [template, templateID];
}

function macOSNotifJS_hideNotif(elm) {
    while (!elm.id.endsWith("_Container")) {
        elm = elm.parentElement;
    }
    id = elm.getAttribute("data-id");
    elm.style.right = '-400px';
    elm.style.opacity = '0.1';
    if (window[id + "_AutoDismiss"]) clearTimeout(window[id + "_AutoDismiss"]);
    setTimeout(function () {
        elm.remove()
    }, 800);
}

function macOSNotifJS_handleGo(link) {
    if (link == null || link == "#") return;

    setTimeout(function () {
        window.location.href = link;
    }, 800);
}

async function macOSNotifJS(options) {
    /*
    options = {
        delay: .5,                              // Delay before display (in seconds)
        autoDismiss: 0,                         // Delay till automatic dismiss (0 = Never, in seconds)
        swipeDismiss: true,                     // Toggle swipe to dismiss
        title: "Please Define title",           // Main Notif Title
        subtitle: "Please Define subtitle",     // Main Notif Sub Title
        btn1Text: "Go",                         // Text for Button 1
        btn1Link: null,                         // Link for Button 1 (null or '#' for dismiss only)
        btn2Text: "Dismiss",                    // Text for Button 2
        btn2Link: null,                         // Link for Button 2 (null or '#' for dismiss only)
    }
    */

    // Put out template into the body
    macOSNotifJS_loadCSS();
    const templateData = await macOSNotifJS_generateTemplate();
    document.body.innerHTML += "\n\n" + templateData[0];

    // Load our options
    if (typeof(options) === 'undefined') options = {};
    if (typeof(options.delay) === 'undefined') options.delay = .5;
    if (typeof(options.autoDismiss) === 'undefined') options.autoDismiss = 0;
    if (typeof(options.swipeDismiss) === 'undefined') options.swipeDismiss = true;
    if (typeof(options.title) === 'undefined') options.title = "macOSNotifJS";
    if (typeof(options.subtitle) === 'undefined') options.subtitle = "Default notification text";
    if (typeof(options.btn1Text) === 'undefined') options.btn1Text = "Go";
    if (typeof(options.btn1Link) === 'undefined') options.btn1Link = null;
    if (typeof(options.btn2Text) === 'undefined') options.btn2Text = "Dismiss";
    if (typeof(options.btn2Link) === 'undefined') options.btn2Link = null;

    // Set our options
    let container = document.getElementById(templateData[1] + "_Container");
    container.setAttribute("data-id", templateData[1]);
    document.getElementById(templateData[1] + "_Title").innerHTML = options.title;
    document.getElementById(templateData[1] + "_Subtitle").innerHTML = options.subtitle;
    document.getElementById(templateData[1] + "_Button1").innerHTML = options.btn1Text;
    document.getElementById(templateData[1] + "_Button2").innerHTML = options.btn2Text;

    // Swipe dismiss
    // TODO: Fix this
    if (options.swipeDismiss) {
        let swiper = new Swipe(container);
        swiper.onRight(function () {
            macOSNotifJS_hideNotif(container)
        });
        swiper.run();
    }

    // Set the actions
    window[templateData[1] + "_Button1"] = function (elm) {
        macOSNotifJS_handleGo(options.btn1Link);
        macOSNotifJS_hideNotif(elm);
    };
    window[templateData[1] + "_Button2"] = function (elm) {
        macOSNotifJS_handleGo(options.btn2Link);
        macOSNotifJS_hideNotif(elm);
    };

    // Handle show + autodismiss
    setTimeout(function () {
        container.style.right = '15px';
        container.style.opacity = '1';
        if (options.autoDismiss != 0) {
            window[templateData[1] + "_AutoDismiss"] = setTimeout(function () {
                container.style.right = '-400px';
                container.style.opacity = '0.1';
                setTimeout(function () {
                    container.parentElement.remove();
                }, 800);
            }, options.autoDismiss * 1000);
        }
    }, options.delay * 1000);
}