(function(window, document){

  // HAYAKU BEACON
  // A lighter, faster, more native performance timing beacon
  // --------------------------------------------------------------------------------

  // REQUIREMENTS:
  // - user timing api support or polyfill
  // - fetch api support or polyfill
  // --------------------------------------------------------------------------------

  const HAYAKU = {

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
    send: function() {
      const data = window.HAYAKU.data
      const headers = {
        type: 'application/json'
      };
      const blob = new Blob([JSON.stringify(data)], headers);
      if (window.navigator.sendBeacon) {
        // Chrome 59 breaks blobs in sendBeacon. Need fix.
        window.navigator.sendBeacon(window.HAYAKU.config.URL, blob);
      }
    }

  };


  // ADDITIONAL SELF-REFERENCING METHODS
  // --------------------------------------------------------------------------------

  HAYAKU.getData = function() {
    // if object already exists, merge new data in without overwriting existing values
    HAYAKU.data = HAYAKU.data
      ? Object.assign(HAYAKU.gather(), HAYAKU.data)
      : HAYAKU.gather();
  }

  HAYAKU.addData = function(key, value) {
    HAYAKU.data[key] = value;
  }

  HAYAKU.config = (HAYAKU && HAYAKU_CONFIG)
    ? Object.assign(HAYAKU.defaultConfig, HAYAKU_CONFIG)
    : HAYAKU.defaultConfig

  // assign to window
  window.HAYAKU = HAYAKU;

  // emit loaded event
  const loadedEvent = new CustomEvent('hayakuLoaded');
  document.dispatchEvent(loadedEvent);

})(window, document);
