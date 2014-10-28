# Laura Keylogger

This project is a collection of `chrome-extension` and `chrome-application` that logs user events on page. Each event is logged with time

## Logging structure

```

event : {
	time : {
		epoch : time of event from epoch
		localeTime : time string formatted with locale rules
		localeDate : date string formatted with locale rules
	}	

	title : title of page that generates event

	mouse : {
		x : x position of mouse with respect to screen
		y : y position of mouse with respect to screen
		xWin : x position of mouse with respect to document
		yWin : y position of mouse with respect to document
		evnt : type of event (click, move, ...)
		target : target that has generated click/dblclick event
		button : button pressed
	}

	keyboard : {
		keyCode : hex code of key pressed
		key : string char of key pressed
		string : complete combination of key pressed
		ctrl : track if ctrl modifier is pressed
		alt : track if alt modifier is pressed
		shift : track if shift modifier is pressed
		meta : track if meta modifier is pressed
	}
}

```

## Installation

 1. Copy the github repo (or [download zip file](https://github.com/MatteoRagni/LauraKeylogger/archive/master.zip)) in folder `$LauraKeylogger`
 2. Install keylogger app and keylogger extension on google-chrome:
   * go to `chrome://extension`
   * select **Developer Mode**
   * click on **Load unpacked extension...**
   * select the folder: `$LauraKeylogger/app` to install app
   * select the folder: `$LauraKeylogger/extension` to install extension
 3. Copy the `id` value assigned at the app from google-chrome (`$appID`)
 4. Copy the `id` value assigned at the extension from google-chrome (`$extensionID`)
 5. Open the file `$LauraKeylogger/app/appID.js` with a text editor and modify `__appID` variable with `id`'s obtained in steps 3 and 4.
 6. Open the file `$LauraKeylogger/extension/appID.js` with a text editor and modify `__appID` variable with `id`'s obtained in steps 3 and 4.
 ``` Javascript	
 // Application IDs, used for message passing
 var __appID = {
 	app: "insert here $appID",
	ext: "insert here $extensionID"
 }
 ```
 7. In chrome, reload the extension and the application. 

 Configurations are in `config.js` files.

**A screen recorder is included in the application using [whammy.js](https://github.com/antimatter15/whammy), but the recorded quality is not high enough for the space required for a recording**
