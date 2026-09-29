self.addEventListener("install", function (event) {

    console.log("ParkLog service worker installed");

    self.skipWaiting();
});


self.addEventListener("activate", function (event) {

    console.log("ParkLog service worker activated");

    event.waitUntil(
        self.clients.claim()
    );
});