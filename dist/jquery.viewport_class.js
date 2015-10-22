/**
 * Viewport Class jQuery JavaScript Plugin v1.1.1
 * http://www.intheloftstudios.com/packages/jquery/jquery.viewport_class
 *
 * jQuery plugin (for responsive design) registers an element to maintain a css class of the viewport when it changes (with optional callback on viewport change)
 *
 * Copyright 2013-2015, Aaron Klump <sourcecode@intheloftstudios.com>
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Thu Oct 22 09:26:16 PDT 2015
 *
 * @license
 */
/**
 * There are some global methods/variables available to your other scripts:
 *
 *   - jQuery.fn.viewportClass.getViewport()
 *
 * These variables hold the values computed in
 * jQuery.fn.viewportClass.getViewport() in case you need to back reference
 * them after the environment has changed.
 *
 *   - jQuery.fn.viewportClass.data.viewport: viewport name
 *   - jQuery.fn.viewportClass.data.viewportWidth: width of current viewport
 *   - jQuery.fn.viewportClass.data.width: The window actual width
 *   - jQuery.fn.viewportClass.data.height: the window actual height
 *
 * @param object|function callback
 *   If an object you omit the second param, and you use this first as the 
 *   options parameter.
 *   
 *   But for convenience you can pass a function to be called each time the 
 *   body class changes. It receives the following parameters:
 *   - (int) viewportWidth: The pixel width of the design window, e.g. 320
 *   - (string) viewport: The name of the viewport, e.g. mobile-landscape
 *   - (bool) resized: This will be false the first time callback is called, as
 *     it the page load calls this function; then it will be -1 if the resize
 *     happens while the screen is getting smaller, and 1 if the window got
 *     bigger.
 * @param {object} options Optional. See $.fn.viewportClass.defaults
 *  
 * @code
 *  $('body').viewportClass();
 * @endcode
 *
 * @code
 *  $('body').viewportClass(onViewportChange, {cssPrefix: 'vp-'});
 * @endcode
 *
 * @code
 *  $('body').viewportClass({
 *    callback: onViewportChange,
 *    breakpoints: {
 *      mobile-p: 320,
 *      mobile-l: 480,
 *      iphone5-l: 568,
 *      tablet_p: 768,
 *      desktop: 960,
 *      widescreen: 1080,
 *    },
 *    onReady: function () {
 *      alert("I'm ready")
 *    }
 *  });
 *
 * ...elsewhere in your code...
 *
 * function onViewportChange(viewportWidth, viewport, resized) {
 *   // The beauty of this callback is that it is only triggered when switching
 *   between viewports, not when the window changes. And you know if you're
 *   getting bigger or smaller windows.
 * }
 * @endcode
 */
;(function($, window, document, undefined) {
"use strict";

  // The actual plugin constructor
  function ViewportClass(element, options) {
    this.el           = element;
    this.$el          = $(element);
    this.options      = $.extend( {}, $.fn.viewportClass.defaults, options) ;
    this.callback     = this.options.callback;
    this.prevViewport = null;
    this.prevWidth    = null;
    this.init();
  }

  /**
   * Remove/add the correct classes to the element.
   *
   * @param  {string} viewport The css class string for the viewport.
   * @param  {int} resized  -1, 0, 1 (getting bigger)
   */
  ViewportClass.prototype.applyClass = function (viewport, resized) {
    // Removes the old class from the element.
    this.$el.removeClass(this.options.cssPrefix + this.prevViewport);
    if (this.prevViewport !== viewport) {
      this.prevViewport = viewport;
      this.prevWidth = getWidth();
    }

    // Adds the new class to the element.
    this.$el.addClass(this.options.cssPrefix + viewport);
    
    // Fires callback if provided
    if (this.callback) {
      this.callback($.fn.viewportClass.data.viewportWidth, viewport, resized);
    }
  };

  ViewportClass.prototype.init = function () {
    var instance    = this;
    var viewport;

    // Call this here to capture our data before the window loads so it's
    // available immediately after instantiating an instance.
    $.fn.viewportClass.getViewport(instance.options.breakpoints);

    // On first run assign class and callback
    if (instance.prevViewport === null) {

      // It's possible that some of our dimensions will change after everything
      // has loaded so we really apply this after all that is done.
      $(window).load(function() {
        viewport = $.fn.viewportClass.getViewport(instance.options.breakpoints);
        instance.applyClass(viewport, 0);
        if ($.isFunction(instance.options.onReady)) {
          instance.options.onReady(viewport, instance);
        }
      });
    }

    // On resize apply class
    $(window).bind('resize', function() {
      viewport = $.fn.viewportClass.getViewport(instance.options.breakpoints);
      if (viewport !== instance.prevViewport) {
        var resize = (getWidth() > instance.prevWidth ? 1 : -1);
        instance.applyClass(viewport, resize);
      }
    });
  };

  $.fn.viewportClass = function(callback, options) {

    // Allow passing just an object instead of null, {...}
    if (typeof callback === 'object' && typeof options === 'undefined') {
      options  = callback;
      callback = null;
    }
    else if (typeof callback === 'function') {
      options = options || {};
      options.callback = callback;  
    }

    return this.each(function () {
      var vc = new ViewportClass(this, options);
      $.fn.viewportClass.instances.push(vc);
    });
  };

  $.fn.viewportClass.defaults = {
    // A function to call when element has been made ready.  It will 
    // receive these args: viewport, instance
    "onReady": null,

    // A function to call when the viewport changes breakpoints.
    "callback": null,

    // An object that defines custom breakpoints and classes.  Each
    // element should be a breakpoint name and the max width for that
    // breakpoint. THE MAX WIDTH ON THE FINAL BREAKPOINT SHOULD BE SET TO
    // NULL.
    "breakpoints" : {
      "mobile-mini": 240,
      "mobile-portrait": 320,
      "mobile-landscape": 480,
      "tablet-portrait": 768,
      "desktop": null
    },
    
    // A prefix for all css classes
    "cssPrefix" : 'viewport-'
  };

  /**
   * Contains the instances of ViewportClass objects.
   *
   * @type {Array}
   */
  $.fn.viewportClass.instances = [];
  $.fn.viewportClass.data = {};

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

    if (typeof breakpoints === 'undefined') {
      breakpoints = $.fn.viewportClass.defaults.breakpoints;
    }

    for (var i in breakpoints) {
      if (data.width <= breakpoints[i]) {
        data.viewport = i;
        data.viewportWidth = breakpoints[i];
        break;
      }
      // Finally we use the last group.
      data.viewport = i;
      data.viewportWidth = breakpoints[i];
    }

    $.fn.viewportClass.data = {};
    for (i in data) {
      $.fn.viewportClass.data[i] = data[i];
    }

    return data.viewport;
  };

  /**
   * Returns the current window width in pixels.
   *
   * @return {int}
   */
  function getWidth() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return e[ a+'Width' ];
  }

  /**
   * Returns the current window height in pixels.
   *
   * @return {int}
   */
  function getHeight() {
    return $(window).height();
  }

  $.fn.viewportClass.version = function() { return '1.1.1'; };

})(jQuery, window, document);