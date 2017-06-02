performance.mark('test1');
performance.mark('test2');
performance.measure('measure1', 'test1', 'test2');
// var entries = performance.getEntries();
// console.log('entries', entries);
// var marks = performance.getEntriesByType('mark');
// console.log('marks', marks);
// var measures = performance.getEntriesByType('measure');
// console.log('measures', measures);
// // not supported by polyfill, firefox, or safari
// var navigation = performance.getEntriesByType('navigation');
// console.log('navigation', navigation);
// // not supported by polyfill or safari
// var resources = performance.getEntriesByType('resource');
// console.log('resources', resources);

(function(window){

  // config
  const performanceData = {};

  // // gather entries
  // const entries = window.performance.getEntries();

  // gather marks
  performanceData.marks = window.performance.getEntriesByType('mark');

  // gather measures
  performanceData.measures = window.performance.getEntriesByType('measure');

  // gather navigation
  performanceData.navigations = window.performance.navigation;

  // gather timing
  performanceData.timings = window.performance.timing;

  // gather resources
  performanceData.resources = window.performance.getEntriesByType('resource');

  // send as beacon / on fallback event
  console.log('performanceData:', performanceData);
  // console.log('performanceData:', JSON.stringify(performanceData));

  window.addEventListener('unload', logData, false);

  function logData() {
    if (window.navigator.sendBeacon) {
      window.navigator.sendBeacon("/log", performanceData);
    } else {
      var data = new FormData();
      data.append('json', json.stringify(performanceData));
      window.fetch('/log', {
        method: 'POST',
        body: data
      });
    }
  }

})(window);
