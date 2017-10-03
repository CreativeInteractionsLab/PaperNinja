# PaperNinja
Code base for the said project.

All the javascript codes are in the PaperNinjaGame folder, this also include the Phaser script as the game engine, which is under the Html folder.

Currently the game is using Phaser 2.6.2, which is a few versions older than the current one.

Update on 3 Oct, 2017: 
The original game was made with DroidScript down the Javascript route (i.e., starts with a .js file, then have a webview opening the html game, which loads a bunch of other supporting .js files). However, there seems to be a problem with the way the files load and the bluetooth callback function becomes undefined at some point, crashing the game all too often.

So now the game is made with DroidScript down the Html route (i.e., starts with the html game, which loads a bunch of other supporting .js files). This seems to solve the issue of undefined functions. The Javascript version is just here for archive purpose, it works about 20% of the time as long as the bluetooth connection works in the first go and keeps running, which is not likely.
