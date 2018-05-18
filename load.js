let macOSNotifJS_template = null;
let macOSNotifJS_AutoDismiss = null;
let macOSNotifJS_lastTemplate = -1;
let macOSNotifJS_src = document.currentScript.src;

async function macOSNotifJS_loadTemplate() {
    if (macOSNotifJS_template) return;

    // Generate template url
    let src = macOSNotifJS_src.substr(0, macOSNotifJS_src.lastIndexOf('/'));
    src += "/template.html";

    // Get the template
    const response = await fetch(src);
    macOSNotifJS_template = await response.text();
}

async function macOSNotifJS_generateTemplate() {
    // Ensure we have the template
    await macOSNotifJS_loadTemplate();

    // Get the template and insert the id
    let template = macOSNotifJS_template;
    macOSNotifJS_lastTemplate++;
    let templateID = "macOSNotifJS_n" + macOSNotifJS_lastTemplate.toString();
    template = template.replace(/macOSNotifJS_/g, templateID + "_");

    // Return template and the ID of it
    return [template, templateID];
}

async function macOSNotifJS(options) {
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
    const templateData = await macOSNotifJS_generateTemplate();
    document.body.innerHTML += "\n\n" + templateData[0];

    // Load our options
    if (typeof(options) === 'undefined') options = {};
    if (typeof(options.delay) === 'undefined') options.delay = .5;
    if (typeof(options.autoDismiss) === 'undefined') options.autoDismiss = 0;
    if (typeof(options.title) === 'undefined') options.title = "macOSNotifJS";
    if (typeof(options.subtitle) === 'undefined') options.subtitle = "Default notification text";
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
        let container = document.getElementById(templateData[1] + "_Container");
        container.style.right = '15px';
        container.style.opacity = '1';
        if (options.autoDismiss != 0) {
            window[templateData[1]+"_AutoDismiss"] = setTimeout(function () {
                container.style.right = '-400px';
                container.style.opacity = '0.1';
                setTimeout(function () {
                    container.parentElement.remove();
                }, 800);
            }, options.autoDismiss * 1000);
        }
    }, options.delay * 1000);
}