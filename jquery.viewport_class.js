/*!
 * Viewport Class jQuery JavaScript Plugin v0.1.2
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
 *
 * @code
 *  $('body').viewportClass();
 * @endcode
 *
 * @code
 *  $('body').viewportClass(onViewportChange);
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
 * Date: Wed, 04 Dec 2013 11:45:03 -0800
 */
;(function($, undefined) {
"use strict";

$.fn.viewportClass = function(callback) {

  var $node         = $(this);
  if ($node.length === 0) {
    return;
  }

  var prevViewport, prevWidth, firstRun;

  // On first run assign class and callback
  if (!prevViewport) {
    $(window).load(function() {
      var viewport = $.fn.viewportClass.getViewport();
      applyClass(viewport, 0);
    });
  }
  else {
    firstRun = false;
  }

  // On resize apply class
  $(window).bind('resize', function() {
    var viewport = $.fn.viewportClass.getViewport();
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
$.fn.viewportClass.getViewport = function() {
  var data = {
    width: getWidth(),
    height: getHeight()
  };

  if (data.width < 320) {
    data.viewport = 'mobile-mini';
  }
  else if (data.width >= 320 && data.width < 480) {
    data.viewport = 'mobile-portrait';
    data.viewportWidth = 320;
  }
  else if (data.width >= 480 && data.width < 767) {
    data.viewport = 'mobile-landscape';
    data.viewportWidth = 480;
  }
  else if (data.width >= 768 && data.width < 959) {
    data.viewport = 'tablet-portrait';
    data.viewportWidth = 768;
  }
  else if (data.width >= 960) {
    data.viewport = 'desktop';
    data.viewportWidth = 960;
  }
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

$.fn.viewportClass.version = function() { return '0.1.2'; };

})(jQuery);