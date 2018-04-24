(function (window) {
  // PHOTON BEACON
  // A performance timing beacon that's traveling light
  // Native-API first to keep things light & minimal
  // --------------------------------------------------------------------------------

  // REQUIREMENTS:
  // - user timing api support or polyfill
  // - fetch api support or polyfill
  // --------------------------------------------------------------------------------

  let PHOTON = {

    // HOIST DATA
    // --------------------------------------------------------------------------------

    data: {},

    // GATHER DATA
    // --------------------------------------------------------------------------------

    gather () {
      let data = {}
      let perf = performance
      // gather marks
      data.marks = perf.getEntriesByType('mark')
      // gather measures
      data.measures = perf.getEntriesByType('measure')

      // gather timings
      data.timings = perf.timing

      // paint metrics
      let paintMetrics = perf.getEntriesByType('paint');
      if (paintMetrics) {
        data.paintMetrics = paintMetrics;
      }

      // gather resources
      data.resources = perf.getEntriesByType('resource')
      // console.log('final beacon length:', JSON.stringify(data).length)

      return data
    },

    // SEND BEACON
    // ------------------------------------------------------------------------

    // send as beacon / on fallback event
    send () {
      let data = PHOTON.data
      if (navigator.sendBeacon && data) {
        // Firefox still works. Use it until chrome fixes CORs bug with sendBeacon
        // let blob = new Blob([JSON.stringify(data, null, 2)], {
        //   type: 'application/json'
        // })
        let payload = JSON.stringify(data, null, 2)
        navigator.sendBeacon(PHOTON.config.URL, payload)
      }
    }

  }

  // ADDITIONAL SELF-REFERENCING METHODS
  // --------------------------------------------------------------------------------

  PHOTON.getData = () => {
    // if object already exists, merge new data in without overwriting existing values per category
    PHOTON.data = PHOTON.gather()
  }

  PHOTON.addData = (key, value) => {
    PHOTON.data[key] = value
  }

  PHOTON.config = window.PHOTON_CONFIG || {
    URL: '/beacon'
  }

  // assign to window
  window.PHOTON = PHOTON

  // emit loaded event
  // let loadedEvent = new window.CustomEvent('PHOTONLoaded')
  // document.dispatchEvent(loadedEvent)
  // console.log('PHOTONLoaded')
})(window)
