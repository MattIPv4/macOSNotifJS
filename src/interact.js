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

class Interact {

    constructor(element) {
        // Get the actual element (supports selector passing)
        this.element = typeof element === "string" ? document.querySelector(element) : element;

        this.dragActing = false;
        this.dragXOrg = null;
        this.dragXOffset = 0;
    }

    onDismiss(callback) {
        // Set the onDismiss action (overwrites this func, so can only be set once)
        this.onDismiss = callback;
        return this;
    }

    scrollMove(evt) {
        // TODO: make this work, detect X scrolling as a swipe to dismiss
        if (!evt.deltaX) return;
        if (evt.deltaX < 0) this.onDismiss();
    }

    scrollRun() {
        this.element.addEventListener("wheel", evt => this.scrollMove(evt), true);
    }

    dragMove(evt) {
        // Don't run if currently doing drag stuff
        if (!this.dragActing) return;
        evt.preventDefault();
        evt.stopPropagation();

        // Get the position and adjust based on movement
        let position = this.dragXOffset + this.dragXOrg;
        if (evt.type === "mousemove") {
            position -= evt.clientX;
        } else if (evt.type === "touchmove") {
            position -= evt.targetTouches[0].clientX;
        }

        // Only allow dragging to the right of the original notif position
        if (position > this.dragXOrg) position = this.dragXOrg;

        // Move the element to match mouse drag
        this.element.style.transition = "unset";
        this.element.style.right = position + "px";
    }

    dragRightOffset() {
        const thisRect = this.element.getBoundingClientRect();
        const parentRect = this.element.parentElement.getBoundingClientRect();
        return parentRect.right - thisRect.right;
    }

    dragStart(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (evt.type === "mousedown") {
            this.dragXOffset = evt.clientX;
        } else if (evt.type === "touchstart") {
            this.dragXOffset = evt.targetTouches[0].clientX;
        }

        if (this.dragXOrg === null) this.dragXOrg = this.dragRightOffset();
        this.dragActing = true;
    }

    dragStop(evt) {
        if (!this.dragActing) return;
        evt.preventDefault();
        evt.stopPropagation();

        // Reset transition and stop dragging
        this.element.style.transition = "";
        this.dragActing = false;

        // Check if we should dismiss
        const offset = Math.abs(this.dragRightOffset());
        const threshold = this.element.offsetWidth * 0.2;
        if (offset >= threshold) {
            this.onDismiss();
        } else {
            this.element.style.right = this.dragXOrg + "px";
        }
    }

    dragRun() {
        this.element.addEventListener("mousedown", evt => this.dragStart(evt), true);
        this.element.addEventListener("touchstart", evt => this.dragStart(evt), true);

        window.addEventListener("mousemove", evt => this.dragMove(evt), true);
        window.addEventListener("touchmove", evt => this.dragMove(evt), true);

        window.addEventListener("mouseup", evt => this.dragStop(evt), true);
        window.addEventListener("touchend", evt => this.dragStop(evt), true);
    }

    run() {
        this.dragRun();

        // TODO: this
        //this.scrollRun();
    }
}

// Exports the class
module.exports = Interact;
