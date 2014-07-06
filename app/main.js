// ******** do not edit below this line *********

// Create the page that draw actual keylogging informations
//var documentWin = null;
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('status.html', __config.opt_window);
});

var Keylogger = function() {
    
    // In this local file will be saved all collected data
    this.file = new __File("events");

    // The object is created with null variables
    this.time = { epoch: 0, obj: new Date(0) };
    this.title = null;
    this.mouse = null;
    this.keyboard = null;
    
    // Select if log in console or not
    this.loginconsole = false;

    // This function is called with the content of the message from the extension
    this.update = function(content) {
        this.time = { epoch: content.time, obj: new Date(content.time) };
        if (content.config.opt_title) { this.title = content.title; } else { this.title = null; }
        if (content.config.opt_mouse) { this.mouse = content.mouse; } else { this.mouse = null; }
        if (content.config.opt_keyboard) { this.keyboard = content.keyboard; } else { this.keyboard = null; }

        // Add an element to the file
        this.file.push(this.get());
    };
    
    // This function returns the whole object
    /*
    ret = {
        time : {
            epoch: time since the epoch,
            localeTime: string that represents the time in locale format,
            localeDate: string that reprensts the date in locale format
        },
        title : title of the document on which event happened. present only if not null,
        mouse : { <- present only if the object is not null
            x: x position of the mouse with respect to screen 
            y: y position of the mouse with respect to screen 
            evnt: event that was triggered
            button: eventually clicked button
        },
        keyboard : { <- present only if is not null
            string: string that rapresents eventually pressed combination
            key: string that represents key pressed
            modifiers: string that represent pressed modifiers
            ctrl: true if ctrl key was pressed
            alt: true if alt key was pressed
            shift: true if key was pressed
            meta: true if key was pressed
            keyCode: hex value that represents key pressed
        }
    }
    */
    this.get = function() {
        var ret = {};
        ret.time = {
            epoch: this.time.epoch,
            localeTime: this.time.obj.toLocaleTimeString(),
            localeDate: this.time.obj.toLocaleDateString()
        };
        if (this.mouse) { ret.mouse = this.mouse };
        if (this.keyboard) { ret.keyboard = this.keyboard };
        if (this.title) { ret.title = this.title };
        return ret;
    };
    
    // This function logs to the console the content of the object
    // this function was written only for debugging purpose
    this.consoleLog = function() {
        if (this.loginconsole) {
            var log = '\n';
            
            // Logging time
            log += "Time: " + this.time.obj.toLocaleString() + " [" + this.time.epoch + "]" + '\n';
            
            // if defined, logging title
            if (this.title) { log += "Title: " + this.title + '\n';}
            if (this.mouse) {
                log += "Mouse:" + '\n';
                log += '\t' + "X: " + this.mouse.x + '\n';
                log += '\t' + "Y:" + this.mouse.y + '\n';
                log += '\t' + "Event: " + this.mouse.evnt + '\n';
                log += '\t' + "Button: " + this.mouse.button + '\n';
            }
            if (this.keyboard) {
                log += "Keyboard:" + this.keyboard.string + '\n';
            }
            console.log(log);
        }
    }

    // This function convert the whole object saved in an xml string
    this.getXML = function() {

        var data = this.file.get();

        var xml = "<events>\n";
        for (var i = 0; i < data.events.length; i++) {
            var event = data.events[i];
            
            // Timing informations
            var xmlev = "  <event>" + "\n" + 
                "    <time>" + "\n" +
                "      <epoch>" + event.time.epoch + "</epoch>" + "\n" +
                "      <locale>" + event.time.localeTime + " - " + event.time.localeDate + "</locale>" + "\n" +
                "    </time>" + "\n";
            
            // Page informations
            if (event.title) {
                xmlev += "  <title>" + event.title + "</title>" + "\n";
            }    

            // Mouse events
            if (event.mouse) {
                xmlev += "    <mouse>" + "\n" +
                         "      <x>" + event.mouse.x + "</x>" + "\n" +
                         "      <y>" + event.mouse.y + "</y>" + "\n" +
                         "      <button>" + event.mouse.button + "</button>" + "\n" +
                         "      <type>" + event.mouse.evnt + "</type>" + "\n" +
                         "    </mouse>" + "\n";
            }

            // Keyboard events
            if (event.keyboard) {
                xmlev += "    <keyboard>"  + "\n" + 
                         "      <keycode>" + event.keyboard.keycode + "<keycode>"  + "\n" +
                         "      <key>" + event.keyboard.key + "</key>" + "\n" +
                         "      <ctrl>" + event.keyboard.ctrl + "</ctrl>" + "\n" +
                         "      <alt>" + event.keyboard.alt + "</alt>" + "\n" +
                         "      <shift>" + event.keyboard.shift + "</shift>" + "\n" +
                         "      <meta>" + event.keyboard.meta + "</meta>" + "\n" +
                         "      <combination>" + event.keyboard.string + "</combination>" + "\n" +
                         "    </keyboard>" + "\n";

            }
            xmlev += "  </event>";

            xml += xmlev;

        }
        xml += "</events>"
        return xml;
    }

    // This function will generate an spss consistent xml file
    this.getXML_SPSS = function() {
        //TODO
    }
    
    this.updateWindow = function() {
        (chrome.app.window.get(__config.opt_window.id)).contentWindow.populate(this.get());
    }
}

var keylog = new Keylogger();

function __printDebug(message) {
    if (__config.__debug__) { console.log(message); }
}

// Function that will be executed only when external message is 
// incoming from authorized external extension
function connectionMessage(msg) {
    
    // implementation of protocol "log" messages
    if (msg.protocol === "log") {
        console.log(msg.content);
    }
    
    // implementation of protocol "event", that must be collected in the file 
    if (msg.protocol === "event") {
        keylog.update(msg.content);
        keylog.consoleLog();
        keylog.updateWindow();
    }

    // implementation of protocol show
    if (msg.protocol === "show") {
        switch (msg.content) {
            case "xml_show": // Open the output window
                if (!(chrome.app.window.get(__config.out_window.id))) {
                   chrome.app.window.create('content.html', __config.out_window);   
                }
                break;
            case "xml_std": // write xml in output window
                (chrome.app.window.get(__config.out_window.id)).contentWindow.document.getElementById("data_container").innerHTML = keylog.getXML();
            break;
            case "xml_spss": // write xml in output window
                (chrome.app.window.get(__config.out_window.id)).contentWindow.populate("XML SPSS not ready yet");
            break;
            case "json": // write xml in output window
                (chrome.app.window.get(__config.out_window.id)).contentWindow.populate("JSON not ready yet");
            break;
            case "csv": // write xml in output window
                (chrome.app.window.get(__config.out_window.id)).contentWindow.populate("CSV not ready yet");
            break;
        }
    }
    
}

// ****** MAIN *******

// Message receiver listener
chrome.runtime.onConnectExternal.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        connectionMessage(msg);
    });
    port.onDisconnect.addListener(function() {
        port = null;
    });
});

chrome.runtime.onMessage.addListener(function(msg) {
    //__printDebug("message listener called" + JSON.stringify(msg));
    connectionMessage(msg);
});



