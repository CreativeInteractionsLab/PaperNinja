/* ---------------------------------
Author: Elias Fares
Date: Feb 24, 2016
Modified by Victor Cheung as needed for ISS2017 demo and beyond

Description:
Game using Phaser JS
This is a horizontal scrolling game that requires bend gesture input to play.
Player is a piece of paper that must dodge incoming sticks or it will rip and loose.
--------------------------------- */

// Switch off debugging (false) for max performance
var debugMode = false; // Switch off debugging (false) for max performance
var showButtons = false; // False if we're using the bend sensors (bluetooth)
var btConnected = false; //signifies if bluetooth is connected

// Called when bluetooth connects
function bt_OnConnect(ok) {
    
    if(btConnected) return;
    
    if (!ok) {
        console.log("BT ERROR!");
        bt.Connect("HC-05"); // Try to reconnect again
    } else {
        console.log("BT Connection Successful");
    	//app.ShowPopup( "BT Connected" );
    	btConnected = true;
    }
};

// Called when we get data from bluetooth device (array of analogRead inputs from Arduino)
function bt_OnReceive(data) {
    A = data.split(",");
    console.log("Received: " + A[0]+","+A[1]+","+A[2]+","+A[3]+","+A[4]);

    // Send data to Phaser web control (sometimes BT is slow and not all values are received right away)
    if (!(A[0] === undefined || A[1] === undefined || A[2] === undefined || A[3] === undefined)) {//if all elements have some value
        console.log("use above");
        web.Execute("updateBend(" + A[0] + "," + A[1] + "," + A[2] + "," + A[3] + "," + A[4] + ")");
    }
};

// Called when application starts
function OnStart() {
    app.SetOrientation("Landscape"); // Lock screen orientation to Landscape
    app.PreventScreenLock(true); // Stop screen turning off while playing
    app.SetScreenMode("Game"); // Hide the status bar (fullscreen mode)
    app.SetDebugEnabled(debugMode); // true or false

    // Create a layout with objects vertically centered
    layout = app.CreateLayout("linear", "Horizontal,VCenter,FillXY");

    // Create a web control to see the game
    web = app.CreateWebView(1, 1, "NoScrollbar");
    web.SetBackColor("black");
    layout.AddChild(web);

    if (!showButtons) {
        // Create Bluetooth serial object
        bt = app.CreateBluetoothSerial();
        bt.SetOnConnect(bt_OnConnect);
        bt.SetOnReceive(bt_OnReceive);
        bt.SetSplitMode("End", "\n");

        // Connect to the HC-05 bluetooth chip
        bt.Connect("HC-05");
    }

    // Add layout to app
    app.AddLayout(layout);

    // Load Phaser game
    web.LoadUrl("game.html", "IgnoreErrors");
};
