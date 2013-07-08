Video Encoding and Tagging Utilities
==============

Just some JavaScript (and maybe awk/sed/bash scripts) to help convert videos to M4V format, and add metadata scraped from Wikipedia.

Example usage:
----

    #include jquery
    #include wiki.js
    #include underscore
    #include seasonsToBashScript.js

    (function (global) {
        console.log(global.convertToBashScript(global.wikiscrape(), {
            show: 'My Great Show',
            network: 'PBS'
        }));
    }(this));
