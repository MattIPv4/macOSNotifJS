<!--
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
-->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>

    <title>macOSNotifJS</title>

    <meta name="viewport" content="<%= htmlWebpackPlugin.options.meta.viewport %>"/>

    <meta name="title"
          content="macOSNotifJS"/>

    <meta name="description"
          content="macOSNotifJS - A simple Javascript plugin to create simulated macOS notifications on your website."/>

    <meta name="keywords"
          content="javascript, javascript-plugin, notifications, notification, macos, javascript-tools, javascript-utility, javascript-audio, notification-system, simulated-macos-notifications, macosx, osx, osx-notifications, javascript-library, javascript-framework, notification-service, notification-api"/>

    <meta name="viewport"
          content="width=device-width, initial-scale=1"/>

    <link rel="image_src"
          content="https://macosnotif.js.org/brand/macOSNotifJS-818x162.png"/>

    <link rel="canonical"
          href="https://macosnotif.js.org/"/>

    <meta name="canonicalURL"
          content="https://macosnotif.js.org/"/>

    <meta name="twitter:card"
          content="summary_large_image">

    <meta name="twitter:site"
          content="https://macosnotif.js.org/"/>

    <meta name="twitter:creator"
          content="@MattIPv4"/>

    <meta name="twitter:title"
          content="macOSNotifJS"/>

    <meta name="twitter:description"
          content="macOSNotifJS - A simple Javascript plugin to create simulated macOS notifications on your website."/>

    <meta name="twitter:image"
          content="https://macosnotif.js.org/brand/macOSNotifJS-818x162.png"/>

    <meta name="twitter:url"
          content="https://macosnotif.js.org/"/>

    <meta prefix="og: http://ogp.me/ns#" property="og:title"
          content="macOSNotifJS"/>

    <meta prefix="og: http://ogp.me/ns#" property="og:type"
          content="website"/>

    <meta prefix="og: http://ogp.me/ns#" property="og:locale"
          content="en_GB"/>

    <meta prefix="og: http://ogp.me/ns#" property="og:site_name"
          content="macOSNotifJS"/>

    <meta prefix="og: http://ogp.me/ns#" property="og:description"
          content="macOSNotifJS - A simple Javascript plugin to create simulated macOS notifications on your website."/>

    <meta prefix="og: http://ogp.me/ns#" property="og:url"
          content="https://macosnotif.js.org/"/>

    <meta prefix="og: http://ogp.me/ns#" property="og:image"
          content="https://macosnotif.js.org/brand/macOSNotifJS-818x162.png"/>

    <meta prefix="og: http://ogp.me/ns#" property="og:image:url"
          content="https://macosnotif.js.org/brand/macOSNotifJS-818x162.png"/>

    <style>
        html, body {
            margin: 0;
            background: #fff;
            color: #000
        }

        html {
            padding: 0;
        }

        body {
            padding: 3em 5em;
        }

        h1, h2 {
            margin: 1rem -5rem 0;
            padding: .5rem 2.5rem;
            background: #f2f2f2;
            box-shadow: 0 0 10px rgba(0, 0, 0, .2);
            font-weight: 300;
            color: #444;
            text-align: center;
            font-family: SF Display, -apple-system, system-ui, BlinkMacSystemFont, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Segoe UI, Roboto, Ubuntu, Lucida Grande, sans-serif;
            line-height: 1;
        }

        h1 small {
            font-weight: inherit;
            font-size: 50%;
        }

        h2 {
            font-size: 1.6em;
            text-align: left;
        }

        h2 small {
            font-weight: inherit;
            font-size: 70%;
        }

        code, pre {
            color: rgb(255, 59, 48);
        }

        pre {
            display: inline-block;
        }

        button {
            background: rgb(0, 122, 255);
            border: none;
            border-radius: 10px;
            font-weight: normal;
            color: #fff;
            font-size: 1.2em;
            line-height: 1.5em;
            vertical-align: top;
            margin-top: 0.8em;
        }

        button:hover {
            background: rgb(0, 111, 230);
        }

        button:active {
            background: rgb(0, 99, 204);
        }

        button + pre {
            margin-left: 0.8em;
        }

        hr {
            border: none;
            border-top: 1px solid #ddd;
            margin: 0.8rem 1.6rem;
        }

        blockquote.warning h2 {
            border-left: 4px solid #ff5667;
            background: #faebec;
        }
    </style>

    <% for (var css in htmlWebpackPlugin.files.css) { %>
    <link href="<%= htmlWebpackPlugin.files.css[css] %>" rel="stylesheet"/>
    <% } %>

    <!-- Google AdSense -->
    <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "ca-pub-4266526051230566",
            enable_page_level_ads: true
        });
    </script>
</head>
<body class="sf-ui-display">

<a href="https://github.com/MattIPv4/macOSNotifJS" class="github-corner" aria-label="View source on GitHub">
    <svg width="80" height="80" viewBox="0 0 250 250"
         style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; left: 0; transform: scale(-1, 1);"
         aria-hidden="true">
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
              fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
        <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
              fill="currentColor" class="octo-body"></path>
    </svg>
    <style>.github-corner:hover .octo-arm {
        animation: octocat-wave 560ms ease-in-out
    }

    @keyframes octocat-wave {
        0%, 100% {
            transform: rotate(0)
        }
        20%, 60% {
            transform: rotate(-25deg)
        }
        40%, 80% {
            transform: rotate(10deg)
        }
    }

    @media (max-width: 500px) {
        .github-corner:hover .octo-arm {
            animation: none
        }

        .github-corner .octo-arm {
            animation: octocat-wave 560ms ease-in-out
        }
    }</style>
</a>

<h1>
    macOSNotifJS
    <br/>
    <small>
        A simple Javascript plugin to create simulated macOS notifications on your website.
        <br/>macOSNotifJS is a plugin created by <a href="https://mattcowley.co.uk/" target="_blank">Matt Cowley</a>.
    </small>
    <br/>
    <small>
        <a href="https://macosnotif.js.org/">
            <img src="https://img.shields.io/badge/package-<%= htmlWebpackPlugin.options.meta.version.replace(/-/g, '--') %>-007aff.svg?style=flat-square"
                 alt="Package Version">
        </a>
        <a href="https://github.com/MattIPv4/macOSNotifJS/tree/master/LICENSE">
            <img src="https://img.shields.io/badge/license-AGPL--3.0-007aff.svg?style=flat-square" alt="License">
        </a>
        <a href="https://david-dm.org/MattIPv4/macOSNotifJS?type=dev">
            <img src="https://img.shields.io/david/dev/MattIPv4/macOSNotifJS.svg?style=flat-square&colorB=007aff"
                 alt="Dev Dependencies">
        </a>
        <a href="https://github.com/MattIPv4/macOSNotifJS/blob/master/dist/macOSNotif.min.js">
            <img src="https://img.shields.io/github/size/MattIPv4/macOSNotifJS/dist/macOSNotif.min.js.svg?style=flat-square&colorB=007aff"
                 alt="JS Size">
        </a>
        <a href="http://patreon.mattcowley.co.uk/" target="_blank">
            <img src="https://img.shields.io/badge/patreon-IPv4-blue.svg?style=flat-square&colorB=007aff" alt="Patreon"/>
        </a>
        <a href="http://slack.mattcowley.co.uk/" target="_blank">
            <img src="https://img.shields.io/badge/slack-MattIPv4-blue.svg?style=flat-square&colorB=007aff" alt="Slack"/>
        </a>
    </small>
</h1>

<blockquote class="warning">
    <h2>
        Breaking Change<br/>
        <small>
            From version <code>0.0.5-beta1</code> onwards, the option to trigger the dark mode theme was changed from
            <code>dark</code> to <code>themeDark</code> to match the new native OS theme detection option,
            <code>themeNative</code>.
        </small>
    </h2>
</blockquote>

<h3>Installation:</h3>
<p>To use the plugin, copy the <code>dist</code> folder from the <a href="https://github.com/MattIPv4/macOSNotifJS">
    macOSNotifJS GitHub repository</a> to your website.</p>

<p>To then have the plugin available on a page, in your head tag have the following to load the notification
    styling:</p>
<pre><code><% for (var css in htmlWebpackPlugin.files.css) { %>&lt;link href="<%= htmlWebpackPlugin.files.css[css] %>" rel="stylesheet"/&gt;<% } %></code></pre>

<p>At the bottom of your body, you then need to have the following to load the notification script:</p>
<pre><code><% for (var chunk in htmlWebpackPlugin.files.chunks) { %>&lt;script src="<%= htmlWebpackPlugin.files.chunks[chunk].entry %>"&gt;&lt;/script&gt;<% } %></code></pre>

<h3>Usage:</h3>
<p>To get started, simply call the function <code>macOSNotif</code>.
    <br/>To customise your notification, you can supply an object containing any of the options listed below:</p>
<pre>
options = {
    delay: 0.5,                             // Delay before display (in seconds)
    autoDismiss: 0,                         // Delay till automatic dismiss (0 = Never, in seconds)
    interactDismiss: true,                  // Toggle swipe/drag to dismiss

    sounds: false,                          // Play sounds for notification
    themeDark: false,                       // Use dark mode style for notification
    themeNative: false,                     // Attempt to detect light/dark from OS, fallback to themeDark
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
}
</pre>

<h3>Example Usage:</h3>

<button data-demo-load
        onclick="macOSNotif({title:'Dual button notification', subtitle:'Two buttons; dismiss and a link (opens in a new tab)', btn1Text:'Close', btn1Link:null, btn2Text:'Author', btn2Link:'https://mattcowley.co.uk/', btn2NewTab:true})">
    Dual button notification
</button>
<pre><code>macOSNotif({
    title:'Dual button notification',
    subtitle:'Two buttons; dismiss and a link (opens in a new tab)',
    btn1Text:'Close',
    btn1Link:null,
    btn2Text:'Author',
    btn2Link:'https://mattcowley.co.uk/',
    btn2NewTab:true
})</code></pre>

<hr/>

<button data-demo-load
        onclick="macOSNotif({title:'Single button notification', subtitle:'A single button to dismiss the notification', btn2Text:null})">
    Single button notification
</button>
<pre><code>macOSNotif({
    title:'Single button notification',
    subtitle:'A single button to dismiss the notification',
    btn2Text:null
})</code></pre>

<hr/>

<button data-demo-load
        onclick="macOSNotif({title:'Main body link notification', subtitle:'The main notification body is a link (opens in a new tab)', mainLink:'https://mattcowley.co.uk/', mainLinkNewTab:true})">
    Main body link notification
</button>
<pre><code>macOSNotif({
    title:'Main body link notification',
    subtitle:'The main notification body is a link (opens in a new tab)',
    mainLink:'https://mattcowley.co.uk/',
    mainLinkNewTab:true
})</code></pre>

<hr/>

<button data-demo-load
        onclick="macOSNotif({title:'No button notification', subtitle:'The main body link dismisses the notification', mainLink:'#', btn1Text:null})">
    No button notification
</button>
<pre><code>macOSNotif({
    title:'No button notification',
    subtitle:'The main body link dismisses the notification',
    mainLink:'#',
    btn1Text:null
})</code></pre>

<hr/>

<button data-demo-load
        onclick="macOSNotif({title:'Image (icon) notification with link', subtitle:'Has an icon which also has a link', imageSrc:'https://mattcowley.co.uk/me.png', imageLink:'https://mattcowley.co.uk/', imageLinkNewTab:true})">
    Image (icon) notification with link
</button>
<pre><code>macOSNotif({
    title:'Image (icon) notification with link',
    subtitle:'Has an icon which also has a link',
    imageSrc:'https://mattcowley.co.uk/me.png',
    imageLink:'https://mattcowley.co.uk/',
    imageLinkNewTab:true
})</code></pre>

<hr/>

<button data-demo-load
        onclick="macOSNotif({title:'Dark mode notification', subtitle:'Emulates the macOS dark mode styling', themeDark:true, mainLink:'#', btn1Text:'Dark', btn1Dismiss:false, btn1Link:function(n){n.dark();}, btn2Text:'Light', btn2Dismiss:false, btn2Link:function(n){n.light();}})">
    Dark mode notification
</button>
<pre><code>macOSNotif({
    title:'Dark mode notification',
    subtitle:'Emulates the macOS dark mode styling',
    themeDark:true,
    mainLink:'#',
    btn1Text:'Dark',
    btn1Dismiss:false,
    btn1Link:function(n){n.dark();},
    btn2Text:'Light',
    btn2Dismiss:false,
    btn2Link:function(n){n.light();}
})</code></pre>

<hr/>

<button onclick="macOSNotif({title:'Sound (alert) notification', subtitle:'Requires user interaction first on some browsers', sounds:true})">
    Sound (alert) notification
</button>
<pre><code>macOSNotif({
    title:'Sound (alert) notification',
    subtitle:'Requires user interaction first on some browsers',
    sounds:true
})</code></pre>

<hr/>

<button data-demo-load
        onclick="macOSNotif({title:'Native theme notification', subtitle:'Attempts to match the theme preference of the OS', themeNative:true, mainLink:'#', btn1Text:'Close', btn1Link:null, btn2Text:'Support', btn2Link:'https://caniuse.com/prefers-color-scheme', btn2NewTab:true})">
    Native OS theme notification (macOS dark mode)
</button>
<pre><code>macOSNotif({
    title:'Native theme notification',
    subtitle:'Attempts to match the dark/light theme of the OS',
    themeNative:true,
    btn1Text:'Close',
    btn1Link:null,
    btn2Text:'Support',
    btn2Link:'https://caniuse.com/prefers-color-scheme',
    btn2NewTab:true
})</code></pre>

<hr/>

<h2>
    macOSNotifJS
    <br/>
    <small>
        macOSNotifJS is a plugin created by <a href="https://mattcowley.co.uk/" target="_blank">Matt Cowley</a>.
        <br/>
        <br/><i><%= htmlWebpackPlugin.options.meta.versionInfo %></i>
    </small>
</h2>

<% for (var chunk in htmlWebpackPlugin.files.chunks) { %>
<script src="<%= htmlWebpackPlugin.files.chunks[chunk].entry %>"></script>
<% } %>

<script>
    if (window.location.hostname === "macosnotifjs.mattcowley.co.uk") window.location.replace("https://macosnotif.js.org");

    const buttons = document.querySelectorAll("button[data-demo-load]");
    const delay = 750;

    function click(i) {
        if (i < buttons.length) {
            buttons[i].click();
            i++;
            setTimeout(function () {
                click(i);
            }, delay);
        }
    }

    click(0);
</script>

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-113826252-5"></script>
<script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    gtag("js", new Date());

    gtag("config", "UA-113826252-5");
</script>

</body>
</html>
