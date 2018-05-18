let macOSNotifJS_template = null;
let macOSNotifJS_AutoDismiss = null;
let macOSNotifJS_templateAttempts = 0;
let macOSNotifJS_lastTemplate = -1;

function macOSNotifJS_loadTemplate() {
    // Generate template url
    let src = document.currentScript.src;
    src = src.substr(0, src.lastIndexOf('/'));
    src += "/template.html";

    // IE < 8
    if (!window.XMLHttpRequest && 'ActiveXObject' in window) {
        window.XMLHttpRequest = function () {
            return new ActiveXObject('MSXML2.XMLHttp');
        };
    }

    // Get the template
    let xhr = new XMLHttpRequest();
    xhr.open('GET', src, true);
    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) return;
        if (this.status !== 200) {
            // Try again
            macOSNotifJS_templateAttempts++;
            if (macOSNotifJS_templateAttempts < 5) {
                setTimeout(__loadTemplate, 250);
            } else {
                macOSNotifJS_templateAttempts = 0;
            }
        }
        macOSNotifJS_template = this.responseText;
    };
    xhr.send();
}

function macOSNotifJS_generateTemplate() {
    // Load our template
    while (macOSNotifJS_template == null) {
        macOSNotifJS_loadTemplate();
    }

    // Get the template and insert the id
    let template = macOSNotifJS_template;
    macOSNotifJS_lastTemplate++;
    let templateID = "macOSNotifJS_n" + macOSNotifJS_lastTemplate.toString();
    template = template.replace(/macOSNotifJS_/g, templateID + "_");

    // Return template and the ID of it
    return [template, templateID];
}

function macOSNotifJS(options) {
    /*
    options = {
        delay: .5,                              // Delay before Display - Seconds
        autoDismiss: 0,                         // Delay till Hide - 0 = Never - Seconds
        title: "Please Define title",           // Main Notif Title
        subtitle: "Please Define subtitle",     // Main Notif Sub Title
        goText: "Go",                           // Text for Action Button
        goLink: "#",                            // Link for Action Button
        closeText: "Dismiss"                    // Text for Hide Button
    }
    */

    // Put out template into the body
    templateData = macOSNotifJS_generateTemplate();
    document.body.innerHTML += "\n\n" + templateData[0];

    // Load our options
    if (typeof(options.delay) === 'undefined') options.delay = .5;
    if (typeof(options.autoDismiss) === 'undefined') options.autoDismiss = 0;
    if (typeof(options.title) === 'undefined') options.title = "Please Define title";
    if (typeof(options.subtitle) === 'undefined') options.subtitle = "Please Define subtitle";
    if (typeof(options.goText) === 'undefined') options.goText = "Go";
    if (typeof(options.goLink) === 'undefined') options.goLink = "#";
    if (typeof(options.closeText) === 'undefined') options.closeText = "Dismiss";

    // Set our options
    document.getElementById(templateData[1] + "_ContainerTitle").innerHTML = options.title;
    document.getElementById(templateData[1] + "_ContainerSubTitle").innerHTML = options.subtitle;
    document.getElementById(templateData[1] + "_ContainerGo").innerHTML = options.goText;
    document.getElementById(templateData[1] + "_ContainerGo").href = options.goLink;
    document.getElementById(templateData[1] + "_ContainerClose").innerHTML = options.closeText;

    // Handle show + autodismiss
    setTimeout(function () {
        document.getElementById(templateData[1] + "_Container").style.right = '15px';
        document.getElementById(templateData[1] + "_Container").style.opacity = '1';
        if (options.autoDismiss != 0) {
            window[templateData[1]+"_AutoDismiss"] = setTimeout(function () {
                document.getElementById(templateData[1] + "_Container").style.right = '-400px';
                document.getElementById(templateData[1] + "_Container").style.opacity = '0.1';
                setTimeout(function () {
                    document.getElementById(templateData[1] + "_Outer").remove();
                }, 800);
            }, options.autoDismiss * 1000);
        }
    }, options.delay * 1000);
}