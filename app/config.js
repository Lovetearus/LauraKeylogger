var __config = {

    // If set to true, system will start to collect data on startup
    default_startup: false,

    // App window options
    opt_window: {
        id: '__LauraKeyloggerWindow',
        bounds: {
            width: 1350,
            height: 825,
            left: 10,
            top: 10
        },
        minWidth: 1350,
        minHeight: 825
    },

    // Output window options
    out_window: {
        id: '__LauraKeyloggerOutput',
        bounds: {
            width: 900,
            height: 1000,
            left: 10,
            top: 10
        },
        minWidth: 900,
        minHeight: 550
    },

    // Video Feed window options
    videoFeed_window: {
        id: '__LauraKeyloggerVideoFeed',
        bounds: {
            width: 690,
            height: 500,
            left: 10,
            top: 10
        },
        minWidth: 690,
        minHeight: 500
    },

    notificationID: "__LauraKeyloggerNotifications",
    
    // Debug option
    __debug__: true
};