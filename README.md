# Photon-beacon
A performance timing beacon that's traveling light

To stay light and native, it assumes you either polyfill for [user timing api](http://caniuse.com/#search=user%20timing) and fetch APIs, or are ok with not measuring performance of users with unsupported browsers

It progressively supports user-timing compression, and will automatically detect if you use it. Just be sure to either use the photon-server, or detect and decompress your data before logging it!
