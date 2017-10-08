# Photon-beacon
A performance timing beacon that's traveling light
*Proof of Concept*

To stay light and native, it assumes you either polyfill for [user timing api](http://caniuse.com/#search=user%20timing) and fetch APIs, or are ok with not measuring performance of users with unsupported browsers

# Usage

Install photon-beacon as a dependency
```bash
npm install --save photon-beacon
```

- Set up a config object
- Listen for an event to gather and send on
- Include the dist script on your page near the end. Use `async` attr to the script so it doesn't block

```html
<script>
  window.PHOTON_CONFIG = {
    URL: '/beacon'
  }
  // gather and send on unload, as user leaves page
  window.addEventListener('unload', () => {
    PHOTON.getData(); // (required) gather all performance api data
    PHOTON.addData('foo', {'bar': false}); // (optional) add arbitrary data
    PHOTON.send(); // (required) sends beacon, if supported
  });
</script>
<script async src="photon-beacon/dist/photon-beacon.min.src"></script>
```

# Making measurements
- usetheplatform. Make timings with `performance.mark()` and `performance.measure()`
- `PHOTON.addData('key',value)` to manually add arbitrary data to send with PHOTON, like pagename, data from other systems, etc.
- Automatically sends `performance.timing`, `performance.getEntriesByType("resource")`
