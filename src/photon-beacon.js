(function (window, document, UserTimingCompression, ResourceTimingCompression, performance, LZString) {
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
      URL: '/beacon'
    },

    // HOIST DATA
    // --------------------------------------------------------------------------------

    data: {},

    // GATHER DATA
    // --------------------------------------------------------------------------------

    gather () {
      let data = {}

      // if (UserTimingCompression) PHOTON.defaultConfig.utCompress = true
      // if (ResourceTimingCompression) PHOTON.defaultConfig.rtCompress = true

      // gather timing
      if (UserTimingCompression) {
        data.userTimingsCompressed = UserTimingCompression.compressForUri(UserTimingCompression.getCompressedUserTiming())
        // debugger
      } else {
        // gather marks
        data.marks = performance.getEntriesByType('mark')
        // gather measures
        data.measures = performance.getEntriesByType('measure')
      }

      // gather timings
      data.timings = performance.timing

      // first paint
      if (window.chrome) {
        data.firstPaint = window.chrome.loadTimes().firstPaintTime
      } else {
        // TODO: IE has something but needs a conversion
      }

      // gather resources
      if (ResourceTimingCompression) {
        data.resourcesCompressed = ResourceTimingCompression.getResourceTiming()
      } else {
        data.resources = performance.getEntriesByType('resource')
      }
      if (LZString) {
        console.log('before zip length:', JSON.stringify(data).length)
        data = {
          LZString: true,
          data: LZString.compressToEncodedURIComponent(JSON.stringify(data))
        }
      }
      console.log('data:', data)
      console.log('final beacon length:', JSON.stringify(data).length)

      return data
    },

    // SEND BEACON
    // ------------------------------------------------------------------------

    // send as beacon / on fallback event
    send () {
      const data = window.PHOTON.data || {}
      if (window.navigator.sendBeacon) {
        // eww until chrome fixes sendBeacon bug
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
        if (isChrome) {
          // Chrome 60 breaks blob headers in sendBeacon. Need fix. plaintext still works in chrome
          const payload = JSON.stringify(data, null, 2)
          window.navigator.sendBeacon(window.PHOTON.config.URL, payload)
        } else {
          // Firefox still works
          const blob = new window.Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
          })
          window.navigator.sendBeacon(window.PHOTON.config.URL, blob)
        }
      } else {
        // use fetch? will cancel on navigation unless in web worker
      }
    }

  }

  // ADDITIONAL SELF-REFERENCING METHODS
  // --------------------------------------------------------------------------------

  PHOTON.getData = () => {
    // if object already exists, merge new data in without overwriting existing values per category
    PHOTON.data = PHOTON.data
      ? Object.assign(PHOTON.data, PHOTON.gather())
      : PHOTON.gather()
  }

  PHOTON.addData = (key, value) => {
    PHOTON.data[key] = value
  }

  PHOTON.config = (PHOTON && window.PHOTON_CONFIG)
    ? Object.assign(PHOTON.defaultConfig, window.PHOTON_CONFIG)
    : PHOTON.defaultConfig

  // assign to window
  window.PHOTON = PHOTON

  // emit loaded event
  // const loadedEvent = new window.CustomEvent('PHOTONLoaded')
  // document.dispatchEvent(loadedEvent)
  // console.log('PHOTONLoaded')
})(window, document, window.UserTimingCompression, window.ResourceTimingCompression, window.performance, window.LZString)
