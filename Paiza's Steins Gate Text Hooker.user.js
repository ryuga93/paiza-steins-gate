// ==UserScript==
// @name         Paiza's Steins Gate Text Extractor
// @namespace    https://github.com/ryuga93/
// @version      0.1
// @description  Text extractor for Paiza's Steins Gate web visual novel
// @author       ryuga
// @match        https://paiza.jp/steins_gate/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements("div.message_inner", hook)

    function hook() {
        const targetNode = document.querySelector('.message_inner');

        const config = { childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.target.nodeName === 'SPAN' ) {

                    var texts = document.getElementsByClassName('current_span');
                    var temp = [];

                    for(var i=0;i < texts.length; i++){
                        temp += texts[i].textContent || texts[i].innerText;
                    }

                    navigator.clipboard.writeText(temp);
                }
            }
        };

        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }


    function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
        if (typeof waitOnce === "undefined") {
            waitOnce = true;
        }
        if (typeof interval === "undefined") {
            interval = 300;
        }
        if (typeof maxIntervals === "undefined") {
            maxIntervals = -1;
        }
        var targetNodes = (typeof selectorOrFunction === "function")
        ? selectorOrFunction()
        : document.querySelectorAll(selectorOrFunction);

        var targetsFound = targetNodes && targetNodes.length > 0;
        if (targetsFound) {
            targetNodes.forEach(function(targetNode) {
                var attrAlreadyFound = "data-userscript-alreadyFound";
                var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
                if (!alreadyFound) {
                    var cancelFound = callback(targetNode);
                    if (cancelFound) {
                        targetsFound = false;
                    }
                    else {
                        targetNode.setAttribute(attrAlreadyFound, true);
                    }
                }
            });
        }

        if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
            maxIntervals -= 1;
            setTimeout(function() {
                waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
            }, interval);
        }
    }

})();