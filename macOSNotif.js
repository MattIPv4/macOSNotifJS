class __macOSNotifJS_Interact {
    constructor(element) {
        this.element = typeof(element) === 'string' ? document.querySelector(element) : element;

        this.drag_acting = false;
        this.drag_xOrg = 0;
        this.drag_xOffset = 0;
    }

    onDismiss(callback) {
        this.onDismiss = callback;
        return this;
    }

    scroll_move(evt) {
        if (!evt.deltaX) return;
        if (evt.deltaX < 0) this.onDismiss();
    }

    scroll_run() {
        this.element.addEventListener('wheel', (evt) => this.scroll_move(evt), true);
    }

    drag_move(evt) {
        if (!this.drag_acting) return;
        evt.preventDefault();
        evt.stopPropagation();

        let position = this.drag_xOffset + this.drag_xOrg;
        if (evt.type === "mousemove") {
            position -= evt.clientX;
        } else if (evt.type === "touchmove") {
            position -= evt.targetTouches[0].clientX;
        }
        if (position > this.drag_xOrg) position = this.drag_xOrg;

        this.element.style.transition = "unset";
        this.element.style.right = position + "px";
    }

    drag_rightOffset() {
        let thisRect = this.element.getBoundingClientRect();
        let parentRect = this.element.parentElement.getBoundingClientRect();
        return parentRect.right - thisRect.right;
    }

    drag_start(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (evt.type === "mousedown") {
            this.drag_xOffset = evt.clientX;
        } else if (evt.type === "touchstart") {
            this.drag_xOffset = evt.targetTouches[0].clientX;
        }

        this.drag_xOrg = this.drag_rightOffset();
        this.drag_acting = true;
    }

    drag_stop(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (!this.drag_acting) return;

        // Reset transition and stop dragging
        this.element.style.transition = "";
        this.drag_acting = false;

        // Check if we should dismiss
        let offset = Math.abs(this.drag_rightOffset());
        let threshold = this.element.offsetWidth / 4;
        if (offset >= threshold) {
            this.onDismiss();
        } else {
            this.element.style.right = this.drag_xOrg + "px";
        }
    }

    drag_run() {
        this.element.addEventListener("mousedown", (evt) => this.drag_start(evt), true);
        this.element.addEventListener("touchstart", (evt) => this.drag_start(evt), true);

        window.addEventListener('mousemove', (evt) => this.drag_move(evt), true);
        window.addEventListener('touchmove', (evt) => this.drag_move(evt), true);

        window.addEventListener("mouseup", (evt) => this.drag_stop(evt), true);
        window.addEventListener("touchend", (evt) => this.drag_stop(evt), true);
    }

    run() {
        this.drag_run();

        // TODO: this
        this.scroll_run();
    }
}

let __macOSNotifJS_template = null;
let __macOSNotifJS_notifs = {};
const __macOSNotifJS_src = document.currentScript.src.substr(0, document.currentScript.src.lastIndexOf('/'));

function __macOSNotifJS_loadCSS() {
    if (document.getElementById("macOSNotifJS_CSS")) return;

    let css = document.createElement("link");
    css.id = "macOSNotifJS_CSS";
    css.rel = "stylesheet";
    css.type = "text/css";
    css.href = __macOSNotifJS_src + "/res/macOSNotif.css";

    document.getElementsByTagName("head")[0].appendChild(css);
}

async function __macOSNotifJS_loadTemplate() {
    if (__macOSNotifJS_template) return;

    // Generate template url
    let src = __macOSNotifJS_src + "/res/macOSNotif.html";

    // Get the template
    const response = await fetch(src);
    __macOSNotifJS_template = await response.text();
}

function __macOSNotifJS_fullId(id) {
    return "macOSNotifJS_n" + id.toString();
}

async function __macOSNotifJS_generateTemplate() {
    // Ensure we have the template
    await __macOSNotifJS_loadTemplate();

    // Get the template and insert the id
    let template = __macOSNotifJS_template;
    let id = 0;
    if (__macOSNotifJS_notifs) while (id in __macOSNotifJS_notifs) id++;
    __macOSNotifJS_notifs[id] = null;
    template = template.replace(/macOSNotifJS_/g, __macOSNotifJS_fullId(id) + "_");

    // Return template and the ID of it
    return [template, id];
}

function __macOSNotifJS_hideNotif(elm) {
    while (!elm.id.endsWith("_Container")) {
        elm = elm.parentElement;
    }
    const id = elm.getAttribute("data-id");
    const fullId = __macOSNotifJS_fullId(id);
    elm.style.right = -elm.parentElement.offsetWidth + "px";
    elm.style.opacity = '0.1';
    if (window[fullId + "_AutoDismiss"]) clearTimeout(window[fullId + "_AutoDismiss"]);
    setTimeout(function () {
        elm.parentElement.remove();
        delete __macOSNotifJS_notifs[id];
    }, 800);
}

function __macOSNotifJS_handleGo(link) {
    if (link === null || link === "#") return;

    setTimeout(function () {
        window.location.href = link;
    }, 800);
}

async function macOSNotifJS(options) {
    /*
    options = {
        delay: .5,                              // Delay before display (in seconds)
        autoDismiss: 0,                         // Delay till automatic dismiss (0 = Never, in seconds)
        interactDismiss: true,                  // Toggle swipe/drag to dismiss
        zIndex: 5000,                           // The css z-index value of the notification
        title: "Please Define title",           // Main Notif Title
        subtitle: "Please Define subtitle",     // Main Notif Sub Title
        btn1Text: "Go",                         // Text for Button 1
        btn1Link: null,                         // Link for Button 1 (null or '#' for dismiss only)
        btn2Text: "Dismiss",                    // Text for Button 2
        btn2Link: null,                         // Link for Button 2 (null or '#' for dismiss only)
    }
    */

    // Put out template into the body
    __macOSNotifJS_loadCSS();
    const templateData = await __macOSNotifJS_generateTemplate();
    document.body.innerHTML += "\n\n" + templateData[0];

    // Load our options
    if (typeof(options) === 'undefined') options = {};
    if (typeof(options.delay) === 'undefined') options.delay = .5;
    if (typeof(options.autoDismiss) === 'undefined') options.autoDismiss = 0;
    if (typeof(options.interactDismiss) === 'undefined') options.interactDismiss = true;
    if (typeof(options.zIndex) === 'undefined') options.zIndex = 5000;
    if (typeof(options.title) === 'undefined') options.title = "macOSNotifJS";
    if (typeof(options.subtitle) === 'undefined') options.subtitle = "Default notification text";
    if (typeof(options.btn1Text) === 'undefined') options.btn1Text = "Go";
    if (typeof(options.btn1Link) === 'undefined') options.btn1Link = null;
    if (typeof(options.btn2Text) === 'undefined') options.btn2Text = "Dismiss";
    if (typeof(options.btn2Link) === 'undefined') options.btn2Link = null;

    // Set our options
    const fullId = __macOSNotifJS_fullId(templateData[1]);
    let container = document.getElementById(fullId + "_Container");
    container.setAttribute("data-id", templateData[1]);
    container.parentElement.style.zIndex = options.zIndex;
    document.getElementById(fullId + "_Title").innerHTML = options.title;
    document.getElementById(fullId + "_Subtitle").innerHTML = options.subtitle;
    document.getElementById(fullId + "_Button1").innerHTML = options.btn1Text;
    document.getElementById(fullId + "_Button2").innerHTML = options.btn2Text;

    // Interact dismiss
    if (options.interactDismiss) {
        let interacter = new __macOSNotifJS_Interact(container);
        interacter.onDismiss(function () {
            __macOSNotifJS_hideNotif(container)
        });
        interacter.run();
    }

    // Set the actions
    window[fullId + "_Button1"] = function (elm) {
        __macOSNotifJS_handleGo(options.btn1Link);
        __macOSNotifJS_hideNotif(elm);
    };
    window[fullId + "_Button2"] = function (elm) {
        __macOSNotifJS_handleGo(options.btn2Link);
        __macOSNotifJS_hideNotif(elm);
    };

    // Handle show + autodismiss
    setTimeout(function () {
        container.style.right = '15px';
        container.style.opacity = '1';
        if (options.autoDismiss !== 0) {
            window[fullId + "_AutoDismiss"] = setTimeout(function () {
                __macOSNotifJS_hideNotif(container);
            }, options.autoDismiss * 1000);
        }
    }, options.delay * 1000);

    // Save
    __macOSNotifJS_notifs[templateData[1]] = container;
}