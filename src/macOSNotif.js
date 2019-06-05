require("./css/macOSNotif.css");
require("@babel/polyfill");

/**
 *  macOSNotifJS: A simple Javascript plugin to create simulated macOS notifications on your website.
 *  <https://github.com/MattIPv4/macOSNotifJS/>
 *  Copyright (C) 2019 Matt Cowley (MattIPv4) (me@mattcowley.co.uk)
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
        // Get the actual element (supports selector passing)
        this.element = typeof (element) === "string" ? document.querySelector(element) : element;

        this.drag_acting = false;
        this.drag_xOrg = null;
        this.drag_xOffset = 0;
    }

    onDismiss(callback) {
        // Set the onDismiss action (overwrites this func, so can only be set once)
        this.onDismiss = callback;
        return this;
    }

    scroll_move(evt) {
        // TODO: make this work, detect X scrolling as a swipe to dismiss
        if (!evt.deltaX) return;
        if (evt.deltaX < 0) this.onDismiss();
    }

    scroll_run() {
        this.element.addEventListener("wheel", (evt) => this.scroll_move(evt), true);
    }

    drag_move(evt) {
        // Don't run if currently doing drag stuff
        if (!this.drag_acting) return;
        evt.preventDefault();
        evt.stopPropagation();

        // Get the position and adjust based on movement
        let position = this.drag_xOffset + this.drag_xOrg;
        if (evt.type === "mousemove") {
            position -= evt.clientX;
        } else if (evt.type === "touchmove") {
            position -= evt.targetTouches[0].clientX;
        }

        // Only allow dragging to the right of the original notif position
        if (position > this.drag_xOrg) position = this.drag_xOrg;

        // Move the element to match mouse drag
        this.element.style.transition = "unset";
        this.element.style.right = position + "px";
    }

    drag_rightOffset() {
        const thisRect = this.element.getBoundingClientRect();
        const parentRect = this.element.parentElement.getBoundingClientRect();
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
        const offset = Math.abs(this.drag_rightOffset());
        const threshold = this.element.offsetWidth * 0.2;
        if (offset >= threshold) {
            this.onDismiss();
        } else {
            this.element.style.right = this.drag_xOrg + "px";
        }
    }

    drag_run() {
        this.element.addEventListener("mousedown", (evt) => this.drag_start(evt), true);
        this.element.addEventListener("touchstart", (evt) => this.drag_start(evt), true);

        window.addEventListener("mousemove", (evt) => this.drag_move(evt), true);
        window.addEventListener("touchmove", (evt) => this.drag_move(evt), true);

        window.addEventListener("mouseup", (evt) => this.drag_stop(evt), true);
        window.addEventListener("touchend", (evt) => this.drag_stop(evt), true);
    }

    run() {
        this.drag_run();

        // TODO: this
        //this.scroll_run();
    }
}

const __macOSNotifJS_template = (require("./html/macOSNotif.html").default).replace(/<!--(?!>)[\S\s]*?-->/g, ""); // Strip HTML comments
const __macOSNotifJS_notifs = {};
let __macOSNotifJS_fadeThreshold = 6;
const __maOSNotifJS_themes = {
    Light: { c: "light" },
    Dark: { c: "dark" },
    Info: { c: "info" },
    Warning: { c: "warning" },
    Danger: { c: "danger" },
    Success: { c: "success" },
};

window.macOSNotifThemes = Object.assign({}, __maOSNotifJS_themes); // Ensure copy

class macOSNotifJS {

    constructor(options) {
        const defaultOptions = {
            delay: 0.5,                             // Delay before display (in seconds)
            autoDismiss: 0,                         // Delay till automatic dismiss (0 = Never, in seconds)
            interactDismiss: true,                  // Toggle swipe/drag to dismiss

            sounds: false,                          // Play sounds for notification
            theme: __maOSNotifJS_themes.Light,      // Set the theme to be used by the notification (from window.macOSNotifThemes)
            themeNative: false,                     // Attempt to detect light/dark from OS, fallback to theme
            zIndex: 5000,                           // CSS z-index value of the notification (will be adjusted for stacked notifications)

            imageSrc: null,                         // Link of the icon to display (null to hide icon)
            imageName: "",                          // Alt/Title text of the icon
            imageLink: null,                        // Link for icon click (null for no link, '#' for dismiss)
            imageLinkNewTab: false,                 // Open Image Link in New Tab (ignored if link is set to dismiss)

            title: "macOSNotifJS",                  // Main Notif Title
            subtitle: "Default notification text",  // Main Notif Sub Title

            mainLink: null,                         // Link for the main text body (null for no link, '#' for dismiss)
            mainLinkNewTab: false,                  // Open Main Link in New Tab (ignored if link is set to dismiss)

            btn1Text: "Close",                      // Text for Button 1 (null to hide all buttons)
            btn1Link: null,                         // Link for Button 1 (null or '#' for dismiss only)
            btn1Dismiss: true,                      // Dismiss notification after Button 1 pressed (useful if link is function)
            btn1NewTab: false,                      // Open Button 1 Link in New Tab (ignored if link is set to dismiss)

            btn2Text: "Go",                         // Text for Button 2 (null to hide second button)
            btn2Link: null,                         // Link for Button 2 (null or '#' for dismiss only)
            btn2Dismiss: true,                      // Dismiss notification after Button 2 pressed (useful if link is function)
            btn2NewTab: false,                      // Open Button 2 Link in New Tab (ignored if link is set to dismiss)
        };

        // Load our options
        this.options = { ...defaultOptions, ...options };
        // Allow for old-style dark mode option
        if ("dark" in options) this.options.theme = (options.dark ? __maOSNotifJS_themes.Dark : __maOSNotifJS_themes.Light);
        // Fix invalid theme option
        if (!Object.values(__maOSNotifJS_themes).includes(this.options.theme)) this.options.theme = defaultOptions.theme;

        // Other properties
        this.container = null;
        this.id = null;
        this.interact = null;
        this.dismissing = false;
    }

    static get fadeThreshold() {
        return __macOSNotifJS_fadeThreshold;
    }

    static set fadeThreshold(value) {
        __macOSNotifJS_fadeThreshold = value;
    }

    static __fullId(id) {
        return "macOSNotifJS_n" + id.toString();
    }

    static __nextId() {
        // Handle empty
        if (!__macOSNotifJS_notifs || Object.keys(__macOSNotifJS_notifs).length === 0) return 0;

        // Get max
        const keys = Object.keys(__macOSNotifJS_notifs).map(Number);
        return Math.max(...keys) + 1;
    }

    static __generateTemplate() {
        // Get the template and insert the id
        let template = __macOSNotifJS_template;
        const id = macOSNotifJS.__nextId();
        __macOSNotifJS_notifs[id] = null;
        template = template.replace(/macOSNotifJS_/g, macOSNotifJS.__fullId(id) + "_");

        // Return template and the ID of it
        return { template, id };
    }

    static __generateAudio() {
        // If already exists, return it
        const element = document.getElementById("macOSNotifJS_Audio");
        if (element) return element;

        // Create new audio
        const audio = document.createElement("audio");
        audio.id = "macOSNotifJS_Audio";
        audio.autoplay = false;
        audio.volume = 1;
        audio.controls = false;
        audio.preload = "auto";

        // Create sources
        const sourceMp3 = document.createElement("source");
        sourceMp3.src = require("./audio/macOSNotif.mp3");
        sourceMp3.type = "audio/mpeg";
        audio.appendChild(sourceMp3);
        const sourceOgg = document.createElement("source");
        sourceOgg.src = require("./audio/macOSNotif.ogg");
        sourceOgg.type = "audio/ogg";
        audio.appendChild(sourceOgg);

        // Add to DOM and return
        document.body.appendChild(audio);
        return audio;
    }

    static __getElements(id) {
        // Get the full ID
        const fullId = macOSNotifJS.__fullId(id) + "_";

        // Get all the elements
        const Outer = document.getElementById(fullId + "Outer");
        const Container = document.getElementById(fullId + "Container");
        const Img = document.getElementById(fullId + "Img");
        const Image = document.getElementById(fullId + "Image");
        const Text = document.getElementById(fullId + "Text");
        const Title = document.getElementById(fullId + "Title");
        const Subtitle = document.getElementById(fullId + "Subtitle");
        const Buttons = document.getElementById(fullId + "Buttons");
        const Button1 = document.getElementById(fullId + "Button1");
        const Button2 = document.getElementById(fullId + "Button2");

        // Return
        return { Outer, Container, Img, Image, Text, Title, Subtitle, Buttons, Button1, Button2 };
    }

    static __doAfter(id, callback) {
        for (const key in __macOSNotifJS_notifs) {
            if (!__macOSNotifJS_notifs.hasOwnProperty(key)) continue;
            if (parseInt(key, 10) < id) __macOSNotifJS_notifs[key][callback]();
        }
    }

    static __dismissAfter(id) {
        macOSNotifJS.__doAfter(id, "dismiss");
    }

    static __updatePosAll() {
        for (const key in __macOSNotifJS_notifs) {
            if (!__macOSNotifJS_notifs.hasOwnProperty(key)) continue;
            __macOSNotifJS_notifs[key].__updatePos();
        }
    }

    __updatePos() {
        // Calculate notifications above (that aren't dismissing)
        const id = this.id;
        let elmsAbove = 0;
        Object.values(__macOSNotifJS_notifs).forEach(function (value) {
            if (value.id > id) {
                if (!value.dismissing) {
                    elmsAbove += 1;
                }
            }
        });

        const outer = this.container.parentElement;
        let newPos = (outer.offsetHeight * (Math.min(elmsAbove, __macOSNotifJS_fadeThreshold - 1)));

        // Within visible list
        if (elmsAbove < __macOSNotifJS_fadeThreshold) {
            this.container.style.opacity = 1;
            this.container.style.pointerEvents = "auto";
            outer.style.top = newPos + "px";
        } else {

            // Within stack (1st/2nd after threshold)
            if (elmsAbove - __macOSNotifJS_fadeThreshold < 2) {
                this.container.style.opacity = (3 - (elmsAbove - __macOSNotifJS_fadeThreshold)) / 4;
                this.container.style.pointerEvents = "none";
                newPos += outer.offsetHeight * (elmsAbove - __macOSNotifJS_fadeThreshold + 1) / 8;
                outer.style.top = newPos + "px";
            } else {

                // Hidden
                this.container.style.opacity = 0;
                this.container.style.pointerEvents = "none";
            }
        }
    }

    __handleGo(link, newTab, dismiss, nullNoDismiss) {
        if (typeof (nullNoDismiss) === "undefined") nullNoDismiss = false;

        if (dismiss && !(link === null && nullNoDismiss)) this.dismiss();

        if (link === "#" || link === null) return;

        setTimeout(() => {
            if (typeof (link) === "function") {
                link(this);
            } else {
                if (newTab) {
                    const win = window.open(link, "_blank");
                    win.focus();
                } else {
                    window.location.href = link;
                }
            }
        }, (dismiss ? 800 : 0));
    }

    static dismissAll() {
        const notifs = Object.values(__macOSNotifJS_notifs).reverse();
        for (let i = 0; i < notifs.length; i++) {
            setTimeout(function () {
                notifs[i].dismiss();
            }, 100 * i);
        }
    }

    dismiss() {
        // Only dismiss once
        if (this.dismissing) return;

        // Let others know
        this.dismissing = true;

        // Get our ids
        const fullId = macOSNotifJS.__fullId(this.id);

        // Animate dismissal
        this.container.parentElement.style.pointerEvents = "none";
        this.container.style.right = -this.container.parentElement.offsetWidth + "px";
        this.container.style.opacity = "0.1";
        macOSNotifJS.__updatePosAll();

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
            this.container.parentElement.parentElement.removeChild(this.container.parentElement);
            delete __macOSNotifJS_notifs[this.id];
            delete window[fullId];
        }, 800);
    }

    applyTheme(theme) {
        const { Outer } = macOSNotifJS.__getElements(this.id);
        Outer.setAttribute("data-macOSNotifTheme", theme.c);
    }

    checkNative() {
        // Get current
        const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isMSDarkHighContrast = window.matchMedia("(-ms-high-contrast: white-on-black)").matches;
        const isLightMode = window.matchMedia("(prefers-color-scheme: light)").matches;
        const isNotSpecified = window.matchMedia("(prefers-color-scheme: no-preference)").matches;
        const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified;

        // Fallback to themeDark if no support or not specified
        if (hasNoSupport || isNotSpecified) {
            this.applyTheme(this.options.theme);
            return;
        }

        // Apply based on OS
        if (isDarkMode || isMSDarkHighContrast) {
            this.applyTheme(window.macOSNotifThemes.Dark);
        } else {
            this.applyTheme(window.macOSNotifThemes.Light);
        }
    }

    setTitle(text) {
        // Set the title for the notification
        this.options.title = text;
        const { Title } = macOSNotifJS.__getElements(this.id);
        Title.textContent = text;
    }

    setSubtitle(text) {
        // Set the subtitle for the notification
        this.options.subtitle = text;
        const { Subtitle } = macOSNotifJS.__getElements(this.id);
        Subtitle.textContent = text;
    }

    __run_initialContainer() {
        // Generate the base template
        const templateData = macOSNotifJS.__generateTemplate();
        this.id = templateData.id;

        // Add the notification to DOM
        document.body.insertAdjacentHTML("beforeend", templateData.template);

        // Find the container
        const { Container } = macOSNotifJS.__getElements(this.id);
        this.container = Container;
        this.container.setAttribute("data-id", this.id);
    }

    __run_applyTheming() {
        if (this.options.themeNative) {
            // Check current
            this.checkNative();

            // Attach listeners
            window.matchMedia("(prefers-color-scheme: dark)").addListener(() => this.checkNative());
            window.matchMedia("(prefers-color-scheme: light)").addListener(() => this.checkNative());
        } else {
            this.applyTheme(this.options.theme);
        }
    }

    __run_applyOptions() {
        // Get the elements
        const { Img, Image, Text, Buttons, Button1, Button2 } = macOSNotifJS.__getElements(this.id);

        // Set the z-index with offset based on id (stacking)
        this.container.parentElement.style.zIndex = (this.options.zIndex + this.id).toString();

        // Set the icon (& link if needed)
        if (this.options.imageSrc !== null) {
            if (this.options.imageLink !== null) {
                Image.classList.add("macOSNotif_Clickable");
            }
            Image.src = this.options.imageSrc;
            Image.alt = this.options.imageName;
            Image.title = this.options.imageName;
        } else {
            Img.parentElement.removeChild(Img);
        }

        // Set the titles
        this.setTitle(this.options.title);
        this.setSubtitle(this.options.subtitle);
        if (this.options.mainLink !== null) {
            Text.classList.add("macOSNotif_Clickable");
        }

        // Set the buttons
        if (this.options.btn1Text !== null) {
            Button1.textContent = this.options.btn1Text;
            if (this.options.btn2Text !== null) {
                Button2.textContent = this.options.btn2Text;
            } else {
                Button1.classList.add("macOSNotif_ButtonFull");
                Button2.parentElement.removeChild(Button2);
            }
        } else {
            Text.classList.add("macOSNotif_TextFull");
            Buttons.parentElement.removeChild(Buttons);
        }
    }

    __run_startInteract() {
        if (this.options.interactDismiss) {
            this.interact = new __macOSNotifJS_Interact(this.container);
            this.interact.onDismiss(() => {
                this.dismiss();
            }).run();
        }
    }

    __run_defineActions() {
        const fullId = macOSNotifJS.__fullId(this.id);
        // Define these all in window as this is where the HTML template calls to (we don't bind events here)
        window[fullId + "_ButtonImg"] = () => {
            this.__handleGo(this.options.imageLink, this.options.imageLinkNewTab, true, true);
        };
        window[fullId + "_ButtonMain"] = () => {
            this.__handleGo(this.options.mainLink, this.options.mainLinkNewTab, true, true);
        };
        window[fullId + "_Button1"] = () => {
            this.__handleGo(this.options.btn1Link, this.options.btn1NewTab, this.options.btn1Dismiss);
        };
        window[fullId + "_Button2"] = () => {
            this.__handleGo(this.options.btn2Link, this.options.btn2NewTab, this.options.btn2Dismiss);
        };
    }

    __run_autoDismiss() {
        if (this.options.autoDismiss !== 0) {
            // Set the timeout (in window, so user can control if needed)
            window[macOSNotifJS.__fullId(this.id) + "_AutoDismiss"] = setTimeout(() => {
                this.dismiss();
            }, (this.options.autoDismiss * 1000) + (this.options.delay * 1000));
        }
    }

    __run_showNotification() {
        setTimeout(() => {
            // Stop overlapping
            macOSNotifJS.__updatePosAll();

            // Do sound
            if (this.options.sounds) macOSNotifJS.__generateAudio().play();

            // Show
            this.container.style.right = "15px";
            this.container.style.opacity = "1";
        }, this.options.delay * 1000);
    }

    __run_storeNotification() {
        __macOSNotifJS_notifs[this.id] = this;
        window[macOSNotifJS.__fullId(this.id)] = this;
    }

    run() {
        // Only ever run once
        if (this.id !== null) return;

        // Template into DOM with container ID
        this.__run_initialContainer();

        // Apply theme
        this.__run_applyTheming();

        // Apply user defined options
        this.__run_applyOptions();

        // Interact dismiss
        this.__run_startInteract();

        // Set the actions
        this.__run_defineActions();

        // Set autodismiss
        this.__run_autoDismiss();

        // Handle show
        this.__run_showNotification();

        // Store
        this.__run_storeNotification();
    }
}

window.macOSNotifJS = macOSNotifJS;
window.macOSNotif = function macOSNotif(options) {
    // A quick method for generating a full instance of macOSNotifJS and running it
    const thisNotif = new macOSNotifJS(options);
    thisNotif.run();
    return thisNotif;
};
