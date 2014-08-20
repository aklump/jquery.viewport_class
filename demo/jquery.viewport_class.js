/*!
 * Viewport Class jQuery JavaScript Plugin v0.1.6
 * http://www.intheloftstudios.com/packages/jquery/jquery.viewport_class
 *
 * jQuery plugin (for responsive design) registers an element to maintain a css class of the viewport when it changes (with optional callback on viewport change)
 *
 * Copyright 2013, Aaron Klump
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * There are some global methods/variables available to your other scripts:
 *
 *   - jQuery.fn.viewportClass.getViewport()
 *
 * These variables hold the values computed in
 * jQuery.fn.viewportClass.getViewport() in case you need to back reference
 * them after the environment has changed.
 *
 *   - jQuery.fn.viewportClass.viewport: viewport name
 *   - jQuery.fn.viewportClass.viewportWidth: width of current viewport
 *   - jQuery.fn.viewportClass.width: The window actual width
 *   - jQuery.fn.viewportClass.height: the window actual height
 *
 * @param function callback
 *   A function to be called each time the body class changes. It receives the
 *   following parameters:
 *   - (int) viewportWidth: The pixel width of the design window, e.g. 320
 *   - (string) viewport: The name of the viewport, e.g. mobile-landscape
 *   - (bool) resized: This will be false the first time callback is called, as
 *     it the page load calls this function; then it will be -1 if the resize
 *     happens while the screen is getting smaller, and 1 if the window got
 *     bigger.
 * @param object breakpoints
 *   Optional. An object that defines custom breakpoints and classes.
 *  
 * @code
 *  $('body').viewportClass();
 * @endcode
 *
 * @code
 *  $('body').viewportClass(onViewportChange, {
      'mobile-p': 320,
      'mobile-l': 480,
      'iphone5-l': 568,
      'tablet_p': 768,
      'desktop': 960,
      'widescreen': 1080,
    });
 *
 * ...elsewhere in your code...
 *
 * function onViewportChange(viewportWidth, viewport, resized) {
 *   // The beauty of this callback is that it is only triggered when switching
 *   between viewports, not when the window changes. And you know if you're
 *   getting bigger or smaller windows.
 * }
 * @endcode
 *
 * Date: Wed, 04 Dec 2013 12:11:48 -0800
 */
;(function($, undefined) {
"use strict";

$.fn.viewportClass = function(callback, breakpoints) {

  var $node         = $(this);
  if ($node.length === 0) {
    return;
  }

  if (typeof breakpoints === 'undefined') {
    breakpoints = {
      'mobile-mini': 0,
      'mobile-portrait': 320,
      'mobile-landscape': 480,
      'tablet_portrait': 768,
      'desktop': 960,
    }
  };

  var prevViewport, prevWidth, firstRun;

  // On first run assign class and callback
  if (!prevViewport) {
    $(window).load(function() {
      var viewport = $.fn.viewportClass.getViewport(breakpoints);
      applyClass(viewport, 0);
    });
  }
  else {
    firstRun = false;
  }

  // On resize apply class
  $(window).bind('resize', function() {
    var viewport = $.fn.viewportClass.getViewport(breakpoints);
    if (viewport !== prevViewport) {
      applyClass(viewport, (getWidth() > prevWidth ? 1 : -1));
    }
  });

  function applyClass(viewport, resized) {
    $node.removeClass('viewport-' + prevViewport);
    if (prevViewport !== viewport) {
      prevViewport = viewport;
      prevWidth = getWidth();
    }
    $node.addClass('viewport-' + viewport);
    if (callback) {
      callback($.fn.viewportClass.viewportWidth, viewport, resized);
    }
  }

  return this;
};

/**
 * Return the current viewport
 *
 * Also calculates/populates the following vars:
 * 
 * - jQuery.fn.viewportClass.viewport
 * - jQuery.fn.viewportClass.viewportWidth
 * - jQuery.fn.viewportClass.width
 * - jQuery.fn.viewportClass.height
 *
 * @return string
 */
$.fn.viewportClass.getViewport = function(breakpoints) {

  var data = {
    width: getWidth(),
    height: getHeight()
  };

  var breakpoint = null;
  for (var i in breakpoints) {
    if (data.width <= breakpoints[i]) {
      data.viewport = i;
      data.viewportWidth = breakpoints[i];
      break;
    }
    // Finally we use the last group.
    data.viewport = i;
    data.viewportWidth = breakpoints[i];    
  };

  for (var i in data) {
    $.fn.viewportClass[i] = data[i];
  }

  return data.viewport;
};

function getWidth() {
  return $(window).width();
}

function getHeight() {
  return $(window).height();
}

$.fn.viewportClass.version = function() { return '0.1.6'; };

})(jQuery);