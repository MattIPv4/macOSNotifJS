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
            btn1Text: "Go",                         // Text for Button 1
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
    }

    static __macOSNotifJS_loadCSS() {
        if (document.getElementById("macOSNotifJS_CSS")) return;

        let css = document.createElement("link");
        css.id = "macOSNotifJS_CSS";
        css.rel = "stylesheet";
        css.type = "text/css";
        css.href = __macOSNotifJS_src + "/res/macOSNotif.css";

        document.getElementsByTagName("head")[0].appendChild(css);
    }

    static async __macOSNotifJS_loadTemplate() {
        if (__macOSNotifJS_template) return;

        // Generate template url
        let src = __macOSNotifJS_src + "/res/macOSNotif.html";

        // Get the template
        const response = await fetch(src);
        __macOSNotifJS_template = (await response.text()).replace(/<!--[\s\S]*?(?:-->)/g, '');
    }

    static __macOSNotifJS_fullId(id) {
        return "macOSNotifJS_n" + id.toString();
    }

    static async __macOSNotifJS_generateTemplate() {
        // Ensure we have the template
        await macOSNotifJS.__macOSNotifJS_loadTemplate();

        // Get the template and insert the id
        let template = __macOSNotifJS_template;
        let id = 0;
        if (__macOSNotifJS_notifs) while (id in __macOSNotifJS_notifs) id++;
        __macOSNotifJS_notifs[id] = null;
        template = template.replace(/macOSNotifJS_/g, macOSNotifJS.__macOSNotifJS_fullId(id) + "_");

        // Return template and the ID of it
        return [template, id];
    }

    static __macOSNotifJS_hideNotif(elm) {
        while (!elm.id.endsWith("_Container")) {
            elm = elm.parentElement;
        }
        const id = elm.getAttribute("data-id");
        const fullId = macOSNotifJS.__macOSNotifJS_fullId(id);
        elm.style.right = -elm.parentElement.offsetWidth + "px";
        elm.style.opacity = '0.1';
        if (window[fullId + "_AutoDismiss"]) clearTimeout(window[fullId + "_AutoDismiss"]);
        setTimeout(() => {
            elm.parentElement.remove();
            delete __macOSNotifJS_notifs[id];
        }, 800);
    }

    static __macOSNotifJS_handleGo(link, elm, nullNoDismiss) {
        if (typeof(nullNoDismiss) === 'undefined') nullNoDismiss = false;

        if (link === '#' || (link === null && !nullNoDismiss)) macOSNotifJS.__macOSNotifJS_hideNotif(elm);
        if (link === '#' || link === null) return;

        setTimeout(() => {
            window.location.href = link;
        }, 800);
    }

    async run() {
        // Put out template into the body
        macOSNotifJS.__macOSNotifJS_loadCSS();
        const templateData = await macOSNotifJS.__macOSNotifJS_generateTemplate();
        document.body.innerHTML += "\n\n" + templateData[0];

        // Set our options
        const fullId = macOSNotifJS.__macOSNotifJS_fullId(templateData[1]);
        let container = document.getElementById(fullId + "_Container");
        container.setAttribute("data-id", templateData[1]);
        container.parentElement.style.zIndex = (this.options.zIndex + templateData[1]).toString();
        document.getElementById(fullId + "_Title").innerHTML = this.options.title;
        document.getElementById(fullId + "_Subtitle").innerHTML = this.options.subtitle;
        if (this.options.mainLink !== null) {
            document.getElementById(fullId + "_Text").classList.add("macOSNotif_TextClickable");
        }
        document.getElementById(fullId + "_Button1").innerHTML = this.options.btn1Text;
        if (this.options.btn2Text !== null) {
            document.getElementById(fullId + "_Button2").innerHTML = this.options.btn2Text;
        } else {
            document.getElementById(fullId + "_Button1").classList.add("macOSNotif_ButtonFull");
            document.getElementById(fullId + "_Button2").remove();
        }

        // Interact dismiss
        if (this.options.interactDismiss) {
            this.interact = new __macOSNotifJS_Interact(container);
            this.interact.onDismiss(() => {
                macOSNotifJS.__macOSNotifJS_hideNotif(container)
            }).run();
        }

        // Set the actions
        window[fullId + "_ButtonMain"] = (elm) => {
            macOSNotifJS.__macOSNotifJS_handleGo(this.options.mainLink, elm, true);
        };
        window[fullId + "_Button1"] = (elm) => {
            macOSNotifJS.__macOSNotifJS_handleGo(this.options.btn1Link, elm);
        };
        if (this.options.btn2Text !== null) {
            window[fullId + "_Button2"] = (elm) => {
                macOSNotifJS.__macOSNotifJS_handleGo(this.options.btn2Link, elm);
            };
        }

        // Handle show + autodismiss
        setTimeout(() => {
            container.style.right = '15px';
            container.style.opacity = '1';
            if (this.options.autoDismiss !== 0) {
                window[fullId + "_AutoDismiss"] = setTimeout(() => {
                    macOSNotifJS.__macOSNotifJS_hideNotif(container);
                }, this.options.autoDismiss * 1000);
            }
        }, this.options.delay * 1000);

        // Save
        __macOSNotifJS_notifs[templateData[1]] = [container, this];
    }
}

async function macOSNotif(options) {
    // A quick method for generating a full instance of macOSNotifJS and running it
    return await (new macOSNotifJS(options)).run()
}