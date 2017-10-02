(function(window, document){

  // PHOTON BEACON
  // A performance timing beacon that's traveling light
  // Native-API first to keep things light & minimal
  // --------------------------------------------------------------------------------

  // REQUIREMENTS:
  // - user timing api support or polyfill
  // - fetch api support or polyfill
  // --------------------------------------------------------------------------------

  const PHOTON = {

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
      const data = window.PHOTON.data || {};
      const headers = {
        type: 'application/json'
      };
      // const blob = new Blob([JSON.stringify(data, null, 2)], headers);
      const payload = JSON.stringify(data, null, 2);
      if (window.navigator.sendBeacon) {
        // Chrome 60 breaks blobs in sendBeacon. Need fix.
        // Firefox still works
        window.navigator.sendBeacon(window.PHOTON.config.URL, payload);
      }
    }

  };


  // ADDITIONAL SELF-REFERENCING METHODS
  // --------------------------------------------------------------------------------

  PHOTON.getData = function() {
    // if object already exists, merge new data in without overwriting existing values
    PHOTON.data = PHOTON.data
      ? Object.assign(PHOTON.gather(), PHOTON.data)
      : PHOTON.gather();
  }

  PHOTON.addData = function(key, value) {
    PHOTON.data[key] = value;
  }

  PHOTON.config = (PHOTON && PHOTON_CONFIG)
    ? Object.assign(PHOTON.defaultConfig, PHOTON_CONFIG)
    : PHOTON.defaultConfig

  // assign to window
  window.PHOTON = PHOTON;

  // emit loaded event
  const loadedEvent = new CustomEvent('PHOTONLoaded');
  document.dispatchEvent(loadedEvent);

})(window, document);
