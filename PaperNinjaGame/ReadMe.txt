Reincarnation of Elias' PaperNinja (PN) game. Used for ISS2017 demo and may be some other projects.

Documented by Victor Cheung.

===

To get started, two other things are needed:
Phaser (a Javascript library), DroidScript (an Android app)

PN uses Phaser as the game engine that does all the collision detections and whatnot. At the time of writing this document, Phaser version 2.4.3 is used.

For details of how things work in Phaser, check this out:
http://perplexingtech.weebly.com/game-dev-blog/using-states-in-phaserjs-javascript-game-developement

PN is managed by DroidScript which packages all the code into an Android app. The way it works is you wirelessly connect your computer through a browser to an Android device running this app, and do all the coding there.

===

Since PN is managed by DroidScript, its file structure follows how DroidScript stores its files.

<Assets in the DroidScript IDE>
Html > phaser.2.4.3.min.js
<Edit panel in the DroidScript IDE>
*.js
game.html

===

Since PN is managed by DroidScript, the whole development process is done through its IDE. If you are creating a new version of PN, look for the "New App..." option once you connect to the app.

The starting point of PN is "index.js". The filename is not important, as long as it has the OnStart() function defined. What it does is to setup the app created by DroidScript so that it 1)shows the game within a web control view, 2)connects to bluetooth for the bend sensors to work.

When PN starts, it first goes to OnStart(), does a bunch of setup, and loads the "game.html", which loads all the Phaser stuff and the rest of the game code (*.js). This game.html will also associate all those game code to a "game" object provided by Phaser. 

The "preload" function is a standard Phaser function that is called automatically when entering that state, typically used to load assets; "create" is another standard Phaser function that is called once "preload" finishes:
https://phaser.io/docs/2.4.3/Phaser.State.html

To pair the bluetooth module, look for "HC-05", with PIN 1234.

===

Some useful references (I don't know why I couldn't find them at Phaser's own references):
game.add.button(xCoordinate, yCoordinate, nameOfGraphicAsset, callbackFunction, referenceToThis, ...)

===

Here are the gesture/control mappings. Originally there were 8 bend sensors, but the final design only had 4, so this will be the biggest change I've made to Elias' code... from assuming 8 sensors to reading just 4.

A0 \		/ A1


A2 /		\ A3

Action		Gesture					Senors
------		------					------
Move left	Left side down				A0 & A2
Move up		Top side down				A0 & A1
Move right	Right side down				A1 & A3
Fold in half	Top side up				A0 & A1
Shoot		Top right up				A1
Hold#1		Top left down				A0
Hold#2		Top right down				A1
Make thin	Left side up + Right side up		A0 & A2 + A1 & A3
Crumple		Top left up + bottom right up		A0 + A3
Kick#1		Buttom left up + bottom right down	A2 + A3
Kick#2		Buttom left down + bottom right up	A2 + A3