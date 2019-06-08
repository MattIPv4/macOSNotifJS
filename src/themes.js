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

const { lighten } = require("@wessberg/color");  // Color manipulation

class Theme {

    static defaultTheme() {
        return new Theme(null, null, null, null, false);
    }

    constructor(backgroundColor, buttonPressedColor, lightText, customCss, hasStyles) {
        this.hasStyles = hasStyles !== false;

        // Only define style data if has styles
        if (this.hasStyles) {
            this.backgroundColor = backgroundColor;
            this.buttonBorderColor = lighten(backgroundColor, lightText ? 15 : -15);
            this.buttonPressedColor = buttonPressedColor || lighten(backgroundColor, -30);
            this.textColor = lightText ? "#fefefe" : "#444";
            this.customCss = customCss;
        }
    }

    generateStyle(notificationId) {
        // Return null if no styles
        if (!this.hasStyles) return null;

        // Generate the raw CSS
        let rawStyle = `/* Notification theme */
#{id} .macOSNotif_Container {
    background: ${this.backgroundColor};
}

#{id} .macOSNotif_Container * {
    color: ${this.textColor};
}

#{id} .macOSNotif_Buttons,
#{id} .macOSNotif_Button + .macOSNotif_Button {
    border-color: ${this.buttonBorderColor};
}

#{id} .macOSNotif_Button:active,
#{id} .macOSNotif_Button:focus {
    background: ${this.buttonPressedColor};
}`;

        // Inject custom extra css
        if (this.customCss) rawStyle += "\n\n/* Notification custom styles */\n" + this.customCss;

        // Set id
        rawStyle = rawStyle.replace(/{id}/g, notificationId + "_Outer");

        // Create a style elm and return it
        const styleElement = document.createElement("style");
        styleElement.innerHTML = rawStyle;
        styleElement.id = notificationId + "_Styles";
        return styleElement;
    }
}

module.exports = {
    __macOSNotifJSTheme: Theme,
    __macOSNotifJSThemes: {
        Light: Theme.defaultTheme(),
        Dark: new Theme("#333", "hsl(211, 100%, 40%)", true,
            "#{id} .macOSNotif_Container { box-shadow: rgba(255, 255, 255, .2) 0 0 2px inset, rgba(0, 0, 0, .2) 0 0 10px; }"),

        Info: new Theme("#4A89DC", null, true),
        Warning: new Theme("#eba03f", null, true),
        Danger: new Theme("#DA4453", null, true),
        Success: new Theme("#38ba8f", null, true),
    },
};
