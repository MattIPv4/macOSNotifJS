/**
 *  macOSNotifJS: A simple Javascript plugin to create simulated macOS notifications on your website.
 *  <https://github.com/MattIPv4/macOSNotifJS/>
 *  Copyright (C) 2018 Matt Cowley (MattIPv4) (me@mattcowley.co.uk)
 *
 *  This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as published
 *   by the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *  This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *  You should have received a copy of the GNU Affero General Public License
 *   along with this program. If not, please see
 *   <https://github.com/MattIPv4/macOSNotifJS/blob/master/LICENSE> or <http://www.gnu.org/licenses/>.
 */

class __macOSNotifJS_Interact {
    constructor(element) {
        this.element = typeof(element) === 'string' ? document.querySelector(element) : element;

        this.drag_acting = false;
        this.drag_xOrg = null;
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

        if (this.drag_xOrg === null) this.drag_xOrg = this.drag_rightOffset();
        this.drag_acting = true;
    }

    drag_stop(evt) {
        if (!this.drag_acting) return;
        evt.preventDefault();
        evt.stopPropagation();

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

class macOSNotifJS {

    constructor(options) {
        /*
        options = {
            delay: .5,                              // Delay before display (in seconds)
            autoDismiss: 0,                         // Delay till automatic dismiss (0 = Never, in seconds)
            interactDismiss: true,                  // Toggle swipe/drag to dismiss
            zIndex: 5000,                           // The css z-index value of the notification
            title: "Please Define title",           // Main Notif Title
            subtitle: "Please Define subtitle",     // Main Notif Sub Title
            mainLink: null,                         // Link for the main text body (null for no link, '#' for dismiss)
            btn1Text: "Go",                         // Text for Button 1 (null to hide all buttons)
            btn1Link: null,                         // Link for Button 1 (null or '#' for dismiss only)
            btn2Text: "Dismiss",                    // Text for Button 2 (null to hide second button)
            btn2Link: null,                         // Link for Button 2 (null or '#' for dismiss only)
        }
        */

        // Load our options
        if (typeof(options) === 'undefined') options = {};
        if (typeof(options.delay) === 'undefined') options.delay = .5;
        if (typeof(options.autoDismiss) === 'undefined') options.autoDismiss = 0;
        if (typeof(options.interactDismiss) === 'undefined') options.interactDismiss = true;
        if (typeof(options.zIndex) === 'undefined') options.zIndex = 5000;
        if (typeof(options.title) === 'undefined') options.title = "macOSNotifJS";
        if (typeof(options.subtitle) === 'undefined') options.subtitle = "Default notification text";
        if (typeof(options.mainLink) === 'undefined') options.mainLink = null;
        if (typeof(options.btn1Text) === 'undefined') options.btn1Text = "Go";
        if (typeof(options.btn1Link) === 'undefined') options.btn1Link = null;
        if (typeof(options.btn2Text) === 'undefined') options.btn2Text = "Dismiss";
        if (typeof(options.btn2Link) === 'undefined') options.btn2Link = null;

        // Save
        this.options = options;

        // For up/down shift
        this.yOffset = null;
    }

    static __loadCSS() {
        if (document.getElementById("macOSNotifJS_CSS")) return;

        let css = document.createElement("link");
        css.id = "macOSNotifJS_CSS";
        css.rel = "stylesheet";
        css.type = "text/css";
        css.href = __macOSNotifJS_src + "/res/macOSNotif.css";

        document.getElementsByTagName("head")[0].appendChild(css);
    }

    static async __loadTemplate() {
        if (__macOSNotifJS_template) return;

        // Generate template url
        let src = __macOSNotifJS_src + "/res/macOSNotif.html";

        // Get the template
        const response = await fetch(src);
        __macOSNotifJS_template = (await response.text()).replace(/<!--[\s\S]*?(?:-->)/g, '');
    }

    static __fullId(id) {
        return "macOSNotifJS_n" + id.toString();
    }

    static __nextId() {
        // Handle empty
        if (!__macOSNotifJS_notifs || Object.keys(__macOSNotifJS_notifs).length === 0) return 0;

        // Get max
        let keys = Object.keys(__macOSNotifJS_notifs).map(x => parseInt(x));
        return Math.max.apply(null, keys) + 1
    }

    static async __generateTemplate() {
        // Ensure we have the template
        await macOSNotifJS.__loadTemplate();

        // Get the template and insert the id
        let template = __macOSNotifJS_template;
        let id = macOSNotifJS.__nextId();
        __macOSNotifJS_notifs[id] = null;
        template = template.replace(/macOSNotifJS_/g, macOSNotifJS.__fullId(id) + "_");

        // Return template and the ID of it
        return [template, id];
    }

    static __shiftAfter(id, callback) {
        for (const key in __macOSNotifJS_notifs) {
            if (!__macOSNotifJS_notifs.hasOwnProperty(key)) continue;
            if (parseInt(key) < id) __macOSNotifJS_notifs[key][callback]();
        }
    }

    static __shiftDownAfter(id) {
        macOSNotifJS.__shiftAfter(id, "__shiftDown");
    }

    static __shiftUpAfter(id) {
        macOSNotifJS.__shiftAfter(id, "__shiftUp");
    }

    __shift(type) {
        const outer = this.container.parentElement;
        const newPos = outer.getBoundingClientRect().top + (outer.offsetHeight * type);
        outer.style.top = newPos + "px";
    }

    __shiftDown() {
        this.__shift(1);
    }

    __shiftUp() {
        this.__shift(-1);
    }

    __dismiss() {

        // Get our ids
        const id = this.container.getAttribute("data-id");
        const fullId = macOSNotifJS.__fullId(id);

        // Animate dismissal
        this.container.parentElement.style.pointerEvents = "none";
        this.container.style.right = -this.container.parentElement.offsetWidth + "px";
        this.container.style.opacity = '0.1';
        macOSNotifJS.__shiftUpAfter(parseInt(id));

        // Clear the autodismiss if applicable
        if (window[fullId + "_AutoDismiss"]) {
            clearTimeout(window[fullId + "_AutoDismiss"]);
            delete window[fullId + "_AutoDismiss"];
        }

        // Clear the onclick handlers
        if (window[fullId + "_ButtonMain"]) delete window[fullId + "_ButtonMain"];
        if (window[fullId + "_Button1"]) delete window[fullId + "_Button1"];
        if (window[fullId + "_Button2"]) delete window[fullId + "_Button2"];

        // Remove fully once animation completed
        setTimeout(() => {
            this.container.parentElement.remove();
            delete __macOSNotifJS_notifs[id];
        }, 800);
    }

    __handleGo(link, nullNoDismiss) {
        if (typeof(nullNoDismiss) === 'undefined') nullNoDismiss = false;

        if (link === '#' || (link === null && !nullNoDismiss)) this.__dismiss();
        if (link === '#' || link === null) return;

        setTimeout(() => {
            window.location.href = link;
        }, 800);
        this.__dismiss();
    }

    async run() {
        // Generate the base template
        macOSNotifJS.__loadCSS();
        const templateData = await macOSNotifJS.__generateTemplate();

        // Add the notification to DOM
        document.body.insertAdjacentHTML('beforeend', templateData[0]);

        // Find the container
        const fullId = macOSNotifJS.__fullId(templateData[1]);
        this.container = document.getElementById(fullId + "_Container");
        this.container.setAttribute("data-id", templateData[1]);

        // Apply user defined options
        this.container.parentElement.style.zIndex = (this.options.zIndex + templateData[1]).toString();
        document.getElementById(fullId + "_Title").innerHTML = this.options.title;
        document.getElementById(fullId + "_Subtitle").innerHTML = this.options.subtitle;
        if (this.options.mainLink !== null) {
            document.getElementById(fullId + "_Text").classList.add("macOSNotif_TextClickable");
        }
        if (this.options.btn1Text !== null) {
            document.getElementById(fullId + "_Button1").innerHTML = this.options.btn1Text;
            if (this.options.btn2Text !== null) {
                document.getElementById(fullId + "_Button2").innerHTML = this.options.btn2Text;
            } else {
                document.getElementById(fullId + "_Button1").classList.add("macOSNotif_ButtonFull");
                document.getElementById(fullId + "_Button2").remove();
            }
        } else {
            document.getElementById(fullId + "_Text").classList.add("macOSNotif_TextFul");
            document.getElementById(fullId + "_Buttons").remove();
        }

        // Interact dismiss
        if (this.options.interactDismiss) {
            this.interact = new __macOSNotifJS_Interact(this.container);
            this.interact.onDismiss(() => {
                this.__dismiss();
            }).run();
        }

        // Set the actions
        window[fullId + "_ButtonMain"] = () => {
            this.__handleGo(this.options.mainLink, true);
        };
        window[fullId + "_Button1"] = () => {
            this.__handleGo(this.options.btn1Link);
        };
        window[fullId + "_Button2"] = () => {
            this.__handleGo(this.options.btn2Link);
        };

        // Set autodismiss
        if (this.options.autoDismiss !== 0) {
            window[fullId + "_AutoDismiss"] = setTimeout(() => {
                this.__dismiss();
            }, (this.options.autoDismiss * 1000) + (this.options.delay * 1000));
        }

        // Handle show
        setTimeout(() => {
            macOSNotifJS.__shiftDownAfter(templateData[1]);
            this.container.style.right = '15px';
            this.container.style.opacity = '1';
        }, this.options.delay * 1000);

        // Save
        __macOSNotifJS_notifs[templateData[1]] = this;
    }
}

async function macOSNotif(options) {
    // A quick method for generating a full instance of macOSNotifJS and running it
    return await (new macOSNotifJS(options)).run()
}