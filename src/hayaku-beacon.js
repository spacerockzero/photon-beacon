(function(window, document){

  // HAYAKU BEACON
  // A lighter, faster, more native performance timing beacon
  // --------------------------------------------------------------------------------

  // REQUIREMENTS:
  // - user timing api support or polyfill
  // - fetch api support or polyfill
  // --------------------------------------------------------------------------------

  window.HAYAKU = {

    // CONFIG
    // --------------------------------------------------------------------------------
    defaultConfig: {
      URL: '/log',
      compressed: false
    },


    // HOIST DATA
    // --------------------------------------------------------------------------------

    data: {},


    // GATHER DATA
    // --------------------------------------------------------------------------------

    gather: function() {
      const data = {};
      // gather marks
      data.marks = window.performance.getEntriesByType('mark');
      // gather measures
      data.measures = window.performance.getEntriesByType('measure');
      // gather navigation
      data.navigations = window.performance.navigation;
      // gather timing
      data.timings = window.performance.timing;
      // gather resources
      data.resources = window.performance.getEntriesByType('resource');
      return data;
    },

    // SEND BEACON
    // ------------------------------------------------------------------------

    // send as beacon / on fallback event
    send: function(isLazy) {
      const data = window.HAYAKU.data
      const headers = {
        type: 'application/json'
      };
      const blob = new Blob([JSON.stringify(data)], headers);
      if (window.navigator.sendBeacon && isLazy) {
        window.navigator.sendBeacon(window.HAYAKU.config.URL, blob);
      }
    }

  };


  // ADDITIONAL SELF-REFERENCING METHODS
  // --------------------------------------------------------------------------------

  window.HAYAKU.getData = function() {
    // if object already exists, merge new data in without overwriting existing values
    window.HAYAKU.data = window.HAYAKU.data
      ? Object.assign(window.HAYAKU.gather(), window.HAYAKU.data)
      : window.HAYAKU.gather();
  }

  window.HAYAKU.addData = function(key, value) {
    window.HAYAKU.data[key] = value;
  }

  window.HAYAKU.config = (window.HAYAKU && window.HAYAKU_CONFIG)
    ? Object.assign(window.HAYAKU.defaultConfig, window.HAYAKU_CONFIG)
    : window.HAYAKU.defaultConfig

  // emit loaded event
  const loadedEvent = new CustomEvent('hayakuLoaded');
  document.dispatchEvent(loadedEvent);

})(window, document);
