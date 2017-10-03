var play = {
    /* --- CREATE --- */
    create: function () {
        // Make a background for each screen
        for (var i = 0; i <= (obstacles.length + 1); i++) {
            game.add.sprite(screenWidth * i, 0, 'background');
        }

        // Initialize the straight values of each bend sensor
        initializeFlatValues();

        paperIsThin = false;
        paperIsFolded = false;
        paperIsCrumpled = false;
        hold1Once = true;
        hold2Once = true;
        paperIsMoving = false;
        paperIsBent = false;
        paperIsOnWall = false;
        obstacleTime = time;

        // Start a new line in the log file
        testName = "Paper Ninja Game";
        roundNum++;

        // Setup the game time
        timer = game.time.create(false); //  Create our Timer
        timer.loop(1, this.updateTime, this); //  Set a TimerEvent to occur every 1 millisecond
        timer.start(); //  Start the timer

        // Create a platforms group
        platforms = game.add.physicsGroup();
        platforms.enableBody = true;
        platforms.physicsBodyType = Phaser.Physics.ARCADE;

        // Create a breaking platform group
        breaking = game.add.physicsGroup();
        breaking.enableBody = true;
        breaking.physicsBodyType = Phaser.Physics.ARCADE;

        // Create a checkpoint platform group
        checkpoint = game.add.physicsGroup();
        checkpoint.enableBody = true;
        checkpoint.physicsBodyType = Phaser.Physics.ARCADE;

        // Add the first checkpoint
        checkpoint0 = checkpoint.create(430, -20, 'checkpoint');
        checkpoint0.body.immovable = true;
        checkpoint0.anchor.setTo(0, 0);

        // Create paperAirplane bullets group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        // Create the ground for the first screen
        var ground = platforms.create(0, game.world.height - 20, 'ground'); // The platform has a height of 20
        ground.body.immovable = true;

        // Call obstaclePlatform function to create the map
        //shuffle(obstacles); //<--uncomment this line if you want a randomized map
        for (var i = 1; i <= obstacles.length; i++) {
            this.obstaclePlatform(i, obstacles[i - 1]);
        }

        // Create the paper sprite (player)
        paperSprite = game.add.sprite(200, game.world.height - 100, 'normal');
        game.physics.arcade.enable(paperSprite);
        paperSprite.body.collideWorldBounds = false;
        paperSprite.body.velocity.y = gravity;
        paperSprite.anchor.setTo(1, 1);
        game.camera.follow(paperSprite);

        // Creat the bin
        bin = game.add.sprite(game.world.width, game.world.height, 'bin');
        game.physics.arcade.enable(bin);
        bin.body.collideWorldBounds = false;
        bin.scale.setTo(0.6);
        bin.anchor.setTo(1);

        // Add vertical platform to left of bin
        var blockBin = platforms.create(bin.x - bin.width, bin.y, 'vPlatform');
        blockBin.body.immovable = true;
        blockBin.anchor.setTo(1);

        /* --- BUTTONS --- */
        //show the control as on-screen buttons if the bend sensors are not available or for testing purposes
        if (showButtons) {
            // Bottom side up button
            jumpButton = game.add.button(screenWidth * 0.25, screenHeight * 0.8, 'upButton', canvas_moveUp, this);
            jumpButton.scale.setTo(0.2);
            jumpButton.fixedToCamera = true;
            // Left side up button
            thinButton = game.add.button(screenWidth * 0.105, screenHeight * 0.4, 'upButton', showThinPaper, this);
            thinButton.scale.setTo(0.2);
            thinButton.fixedToCamera = true;
            // Top side up button
            foldButton = game.add.button(screenWidth * 0.4, screenHeight * 0, 'upButton', showFold, this);
            foldButton.scale.setTo(0.2);
            foldButton.fixedToCamera = true;
            // Top left up button
            crumpleButton = game.add.button(screenWidth * 0.105, screenHeight * 0, 'upButton', crumplePaper, this);
            crumpleButton.scale.setTo(0.2);
            crumpleButton.fixedToCamera = true;
            // Top right down button
            climb1Button = game.add.button(screenWidth * 0.85, screenHeight * 0, 'downButton', showWallClimb1, this);
            climb1Button.scale.setTo(0.2);
            climb1Button.fixedToCamera = true;
            // Top left down button
            climb2Button = game.add.button(screenWidth * 0, screenHeight * 0, 'downButton', showWallClimb2, this);
            climb2Button.scale.setTo(0.2);
            climb2Button.fixedToCamera = true;
            // Bottom right up button
            kick2Button = game.add.button(screenWidth * 0.745, screenHeight * 0.8, 'upButton', showKick2, this);
            kick2Button.scale.setTo(0.2);
            kick2Button.fixedToCamera = true;
            // Bottom right down button
            kick1Button = game.add.button(screenWidth * 0.85, screenHeight * 0.8, 'downButton', showKick1, this);
            kick1Button.scale.setTo(0.2);
            kick1Button.fixedToCamera = true;
            // Top right up button
            shootButton = game.add.button(screenWidth * 0.745, screenHeight * 0, 'upButton', showPaperShooting, this);
            shootButton.scale.setTo(0.2);
            shootButton.fixedToCamera = true;
            // Right side up button
            movLButton = game.add.button(screenWidth * 0.745, screenHeight * 0.4, 'upButton', movePaperLeft, this);
            movLButton.scale.setTo(0.2);
            movLButton.fixedToCamera = true;
            // Left side up
            movRButton = game.add.button(screenWidth * 0, screenHeight * 0.4, 'upButton', movePaperRight, this);
            movRButton.scale.setTo(0.2);
            movRButton.fixedToCamera = true;
        }
        /* --- END OF BUTTONS --- */
    },

    /* --- UPDATE --- */
    update: function () {
        // Check if reset button is pressed (to reset flat values)
        if (buttonState)
            initializeFlatValues();

        // Constantly check for any collisions
        game.physics.arcade.collide(paperSprite, platforms);
        game.physics.arcade.collide(paperSprite, hBreak, this.hBreakFunction, null, this);
        game.physics.arcade.collide(bullets, vBreak3, this.vBreakFunction, null, this);
        game.physics.arcade.collide(paperSprite, bin, this.wonGame, null, this);
        game.physics.arcade.collide(paperSprite, checkpoint0, this.paperHitCheckpoint0, null, this);
        game.physics.arcade.collide(paperSprite, checkpoint1, this.paperHitCheckpoint1, null, this);
        game.physics.arcade.collide(paperSprite, checkpoint2, this.paperHitCheckpoint2, null, this);
        game.physics.arcade.collide(paperSprite, checkpoint3, this.paperHitCheckpoint3, null, this);
        game.physics.arcade.collide(paperSprite, checkpoint4, this.paperHitCheckpoint4, null, this);
        game.physics.arcade.collide(paperSprite, checkpoint5, this.paperHitCheckpoint5, null, this);
        game.physics.arcade.collide(paperSprite, checkpoint6, this.paperHitCheckpoint6, null, this);
        game.physics.arcade.collide(paperSprite, checkpoint7, this.paperHitCheckpoint7, null, this);
        game.physics.arcade.collide(paperSprite, checkpoint8, this.paperHitCheckpoint8, null, this);

        // Check if paper is overlapping with the wall
        this.checkOverlap(paperSprite, wall);

        // Check if paper ever falls off the platform
        if ((paperSprite.y - paperSprite.height) > screenHeight)
            game.state.start('gameover', true, false, 0, time);
        // clearWorld, default at true, clearCache (assets), default at false, everything else are variables we pass

        // Left side up + Right side up = thin paper
        if ((flat_A[0] - A[0]) > 50 && (A[2] - flat_A[2]) > 50 && (flat_A[1] - A[1]) > 50 && (A[3] - flat_A[3]) > 50) {
            logInput("LSU+RSU");
            paperSprite.loadTexture('thin');
            paperSprite.body.setSize(paperSprite.width, paperSprite.height);
            paperIsBent = true;
            paperIsThin = true;
        }
        /* --- FIRST CHECK IF PAPER IS MOVING --- */
        //  Left side down = move left (Unless paper reached left bounds)
        else if ((A[0] - flat_A[0]) > 70 && (A[2] - flat_A[2]) > 70 && paperSprite.x > 0) {
            logInput("LSD");
            paperSprite.body.velocity.x = -250;
            paperIsMoving = true;
        }
        //  Right side down = move right (Unless paper reached right bounds)
        else if ((A[1] - flat_A[1]) > 70 && (A[3] - flat_A[3]) > 70 && (paperSprite.x + paperSprite.width) < game.world.width) {
            logInput("RSD");
            paperSprite.body.velocity.x = 250;
            paperIsMoving = true;
        }
        //  Top side down to jump up (not move)
        else if (((A[0] - flat_A[0]) > 120 && (A[1] - flat_A[1]) > 120) && paperSprite.y > 0) {
            logInput("TSD");
            paperSprite.body.velocity.y = -400;
            paperIsMoving = true;
        } else {
            paperSprite.body.velocity.x = 0;
            paperIsMoving = false;
        }

        /* --- SECOND CHECK IF PAPER IS NOT MOVING --- */
        if (!paperIsMoving) {
            // Top left down = hold1
            if (paperIsOnWall && (A[0] - flat_A[0]) > 50) {
                logInput("TLD");
                if (hold1Once) {
                    paperSprite.x += (paperSprite.width / 2) - 20;
                    hold1Once = false;
                }
                paperSprite.loadTexture('hold1');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                if (hold2Once) {
                    hold2Once = false;
                }
                paperSprite.body.gravity.y = 0;
                paperSprite.body.velocity.y = 0;
                paperIsBent = false;
            }

            // Top right down = hold2
            else if (paperIsOnWall && (A[1] - flat_A[1]) > 50) {
                logInput("TRD");
                if (!hold2Once) {
                    paperSprite.x += (paperSprite.width / 2) + 25;
                    hold2Once = true;
                }
                paperSprite.loadTexture('hold2');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                paperSprite.body.gravity.y = 0;
                paperSprite.body.velocity.y = 0;
                paperIsBent = false;
            }

            //  Top side up = fold paper
            else if ((flat_A[0] - A[0]) > 150 && (flat_A[1] - A[1]) > 150) {
                logInput("TSU");
                paperSprite.loadTexture('folded');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                paperIsBent = true;
                paperIsFolded = true;
            }

            // Top left up + Bottom right up = crumpled ball
            else if ((flat_A[0] - A[0]) > 100 && (flat_A[3] - A[3]) > 100) {
                logInput("TLU+BRU");
                paperSprite.loadTexture('crumpled');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                paperIsBent = true;
                paperIsCrumpled = true;
            }

            // Bottom left up + Bottom right down (alternating) = kick1
            else if ((flat_A[2] - A[2]) > 50 && (A[3] - flat_A[3]) > 50) {
                logInput("BLU+BRD");
                paperSprite.loadTexture('kick1');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                paperIsBent = false;
                // Increment hit count by 1 Once
                if (waitForKick1) {
                    breakHitPoint++;
                    waitForKick1 = false;
                    waitForKick2 = true;
                    switch (breakHitPoint) {
                    case 1:
                        hTween1.start();
                        break;
                    case 2:
                        hTween2.start();
                        break;
                    case 3:
                        hTween3.start();
                        break;
                    case 4:
                        hTween4.start();
                        break;
                    }
                }
            }

            // Bottom left down + Bottom right up (alternating) = kick2
            else if ((flat_A[2] - A[2]) > 50 && (A[3] - flat_A[3]) > 50) {
                logInput("BLD+BRU");
                paperSprite.loadTexture('kick2');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                paperIsBent = false;
                // Increment hit count by 1 Once
                if (waitForKick2) {
                    breakHitPoint++;
                    waitForKick1 = true;
                    waitForKick2 = false;
                    switch (breakHitPoint) {
                    case 1:
                        hTween1.start();
                        break;
                    case 2:
                        hTween2.start();
                        break;
                    case 3:
                        hTween3.start();
                        break;
                    case 4:
                        hTween4.start();
                        break;
                    }
                }
            }

            // Top right up = shoot
            else if ((A[1] - flat_A[1]) > 50) {
                logInput("TRU");
                paperSprite.loadTexture('shoot');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                this.shootPaperAirplanes();
                paperIsBent = false;
            }
            // No bends
            else {
                if (!paperIsBent)
                    paperSprite.loadTexture('normal');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                paperSprite.body.velocity.x = 0;
                paperSprite.body.gravity.y = gravity;
                /*
                if (!hold1Once) {
                    hold1Once = true;
                }
                */
            }
        }
        /* --- THIRD IF PAPER IS BENT THEN USER CAN UNBEND IT --- */
        if (paperIsBent) {
            if (paperIsThin && (flat_A[0] - A[0]) > 50 && (A[2] - flat_A[2]) > 50 && (flat_A[1] - A[1]) > 50 && (A[3] - flat_A[3]) > 50
                || paperIsFolded && (flat_A[0] - A[0]) > 150 && (flat_A[1] - A[1]) > 150 
                || paperIsCrumpled && (flat_A[0] - A[0]) > 100 && (flat_A[3] - A[3]) > 100) {
                paperSprite.loadTexture('normal');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                paperSprite.body.velocity.x = 0;
                if (!hold1Once) {
                    hold1Once = true;
                }
                paperIsBent = false;
                paperIsThin = false;
                paperIsFolded = false;
                paperIsCrumpled = false;
            }
        }
    },

    // Update time
    updateTime: function () {
        time++;
    },

    /* --- DEBUGGING --- */
    render: function () {
        if (debugMode) {
            //game.debug.bodyInfo(paperSprite, 32, 32);
            game.debug.body(paperSprite);
        }
    },

    // This is called to shoot paper airplanes
    shootPaperAirplanes: function () {
        if (game.time.now > nextFire) {
            nextFire = game.time.now + fireRate;
            bullet = bullets.create(paperSprite.x, paperSprite.y - paperSprite.height, 'paperAirplane');
            //bullet.body.immovable = true;
            bullet.scale.setTo(0.7);
            //bullet.reset(paperSprite.x + paperSprite.width, paperSprite.y);
            game.physics.arcade.moveToXY(bullet, game.world.width, paperSprite.y, 600); // Move speed
        }
    },

    // This is called when the paper goes in the bin
    wonGame: function () {
        game.state.start('gameover', true, false, 1, time);
    },

    // This is called when the paper passes checkpoint0
    paperHitCheckpoint0: function () {
        checkpoint0.kill();
        storeThisInfo(0);
    },
    // This is called when the paper passes checkpoint1
    paperHitCheckpoint1: function () {
        checkpoint1.kill();
        storeThisInfo(1);
    },
    // This is called when the paper passes checkpoint2
    paperHitCheckpoint2: function () {
        checkpoint2.kill();
        storeThisInfo(2);
    },
    // This is called when the paper passes checkpoint3
    paperHitCheckpoint3: function () {
        checkpoint3.kill();
        storeThisInfo(3);
    },
    // This is called when the paper passes checkpoint4
    paperHitCheckpoint4: function () {
        checkpoint4.kill();
        storeThisInfo(4);
    },
    // This is called when the paper passes checkpoint5
    paperHitCheckpoint5: function () {
        checkpoint5.kill();
        storeThisInfo(5);
    },
    // This is called when the paper passes checkpoint6
    paperHitCheckpoint6: function () {
        checkpoint6.kill();
        storeThisInfo(6);
    },
    // This is called when the paper passes checkpoint7
    paperHitCheckpoint7: function () {
        checkpoint7.kill();
        storeThisInfo(7);
    },
    // This is called when the paper passes checkpoint8
    paperHitCheckpoint8: function () {
        checkpoint8.kill();
        storeThisInfo(8);
    },

    // Called every frame to see if paper is on the wall
    checkOverlap: function (paperSprite, wall) {
        var boundsA = paperSprite.getBounds();
        var boundsB = wall.getBounds();

        if (Phaser.Rectangle.intersects(boundsA, boundsB)) {
            paperIsOnWall = true;
        } else
            paperIsOnWall = false;
    },

    // This is called to check if the paper is kicking the hBreak ledge
    hBreakFunction: function () {
        if (breakHitPoint >= 4) {
            hBreak.kill();
            breakHitPoint = 0;
        }
    },

    // This is called to check if the paper airplanes hit the vBreak ledge
    vBreakFunction: function () {
        bullet.kill();
        breakHitPoint++;
        if (breakHitPoint >= 4) {
            vBreak3.kill();
            vBreak2.kill();
            vBreak1.kill();
            breakHitPoint = 0;
        }
        switch (breakHitPoint) {
        case 1:
            vTween1.start();
            break;
        case 2:
            vTween2.start();
            break;
        case 3:
            vTween3.start();
            break;
        case 4:
            vTween4.start();
            break;
        }
    },

    // This is called to create the entire map in random order
    obstaclePlatform: function (screenNumber, obstacleNumber) {
        switch (obstacleNumber) {

        case 1:
            // PAPER JUMPS OVER PLATFORM

            // Add checkpoint
            checkpoint1 = checkpoint.create((screenWidth * (screenNumber + 1)) - 370, -20, 'checkpoint');
            checkpoint1.body.immovable = true;
            checkpoint1.anchor.setTo(0, 0);

            // Create the ground
            ground = platforms.create(screenWidth * screenNumber, game.world.height - 20, 'ground'); // The platform has a height of 20
            ground.body.immovable = true;

            // Create a vertical ledge
            vLedge = platforms.create(screenWidth * screenNumber, game.world.height - 20, 'vPlatform');
            vLedge.body.immovable = true;
            vLedge.anchor.setTo(0, 1);

            // Create 2 horizontal ledges side by side
            hLedge = platforms.create(vLedge.x, vLedge.y - vLedge.height, 'hPlatform');
            hLedge.body.immovable = true;
            hLedge = platforms.create(hLedge.x + hLedge.width - 50, hLedge.y, 'hPlatform');
            hLedge.body.immovable = true;
            break;

        case 2:
            // PAPER MUST BE THIN

            // Create the ground
            ground = platforms.create(screenWidth * screenNumber, game.world.height - 20, 'ground'); // The platform has a height of 20
            ground.body.immovable = true;

            // Create a vertical ledge
            vLedge = platforms.create(screenWidth * screenNumber, game.world.height - 20, 'vPlatform');
            vLedge.body.immovable = true;
            vLedge.anchor.setTo(0, 1);

            // Create 2 horizontal ledges side by side
            hLedge = platforms.create(vLedge.x, vLedge.y - vLedge.height, 'hPlatform');
            hLedge.body.immovable = true;
            hLedge = platforms.create(hLedge.x + hLedge.width + 45, hLedge.y, 'hPlatform');
            hLedge.body.immovable = true;

            // Create 2 other vertical ledges
            vLedge = platforms.create(hLedge.x + hLedge.width, hLedge.y, 'vPlatform');
            vLedge.body.immovable = true;
            vLedge.anchor.setTo(1);
            vLedge = platforms.create(vLedge.x, vLedge.y - vLedge.height, 'vPlatform');
            vLedge.body.immovable = true;
            vLedge.anchor.setTo(1);

            // Add checkpoint
            checkpoint2 = checkpoint.create(vLedge.x + vLedge.width, -20, 'checkpoint');
            checkpoint2.body.immovable = true;
            checkpoint2.anchor.setTo(0, 0);
            break;

        case 3:
            // PAPER MUST FOLD/BEND DOWN

            // Add checkpoint
            checkpoint3 = checkpoint.create((screenWidth * (screenNumber + 1)) - 370, -20, 'checkpoint');
            checkpoint3.body.immovable = true;
            checkpoint3.anchor.setTo(0, 0);

            // Create the ground
            ground = platforms.create(screenWidth * screenNumber, game.world.height - 20, 'ground'); // The platform has a height of 20
            ground.body.immovable = true;

            // Create a vertical wall
            vLedge = platforms.create(screenWidth * screenNumber, game.world.height - 95, 'vPlatform');
            vLedge.body.immovable = true;
            vLedge.anchor.setTo(0, 1);
            vLedge = platforms.create(vLedge.x, vLedge.y - vLedge.height, 'vPlatform');
            vLedge.body.immovable = true;
            vLedge.anchor.setTo(0, 1);
            break;

        case 4:
            // PAPER MUST CRUMPLE THROUGH TUNNEL

            // Add checkpoint
            checkpoint4 = checkpoint.create((screenWidth * (screenNumber + 1)) - 370, -20, 'checkpoint');
            checkpoint4.body.immovable = true;
            checkpoint4.anchor.setTo(0, 0);

            // Create the ground
            ground = platforms.create(screenWidth * screenNumber, game.world.height - 20, 'ground'); // The platform has a height of 20
            ground.body.immovable = true;

            // Create first crumple ledge
            crumple1 = platforms.create((screenWidth * screenNumber) + 100, game.world.height - 20, 'crumple1');
            crumple1.body.immovable = true;
            crumple1.anchor.setTo(1);

            // Create second crumple ledge
            crumple2 = platforms.create(crumple1.x, crumple1.y, 'crumple2');
            crumple2.body.immovable = true;
            crumple2.anchor.setTo(0, 1);

            // Create third crumple ledge
            crumple3 = platforms.create(crumple1.x + 80, crumple2.y - crumple2.height - 80, 'crumple3');
            crumple3.body.immovable = true;
            crumple3.anchor.setTo(0, 1);

            // Create vertical wall
            vLedge = platforms.create(crumple3.x + crumple3.width, crumple3.y, 'vPlatform');
            vLedge.body.immovable = true;
            vLedge.anchor.setTo(1);
            vLedge = platforms.create(vLedge.x, vLedge.y - vLedge.height, 'vPlatform');
            vLedge.body.immovable = true;
            vLedge.anchor.setTo(1);
            break;

        case 5:
            // PAPER MUST CLIMB A WALL

            // Create wall
            wall = game.add.sprite(screenWidth * screenNumber, game.world.height - 20, 'wall');
            wall.anchor.setTo(0, 1);

            // No ground in the middle of the screen
            ground = platforms.create((screenWidth * screenNumber) - 700, game.world.height - 20, 'ground');
            ground.body.immovable = true;
            ground = platforms.create((screenWidth * screenNumber) + 500, game.world.height - 20, 'ground');
            ground.body.immovable = true;

            // Add checkpoint
            checkpoint5 = checkpoint.create(wall.x + wall.width, -20, 'checkpoint');
            checkpoint5.body.immovable = true;
            checkpoint5.anchor.setTo(0, 0);
            break;

        case 6:
            // PAPER MUST BREAK GROUND BY KICKING IT

            // Create the ground
            ground = platforms.create(screenWidth * screenNumber, game.world.height - 20, 'ground'); // The platform has a height of 20
            ground.body.immovable = true;

            // Create a vertical ledge
            vLedge = platforms.create(screenWidth * screenNumber, game.world.height - 20, 'vPlatform');
            vLedge.body.immovable = true;
            vLedge.anchor.setTo(0, 1);

            // Create 2 horizontal ledges and the breaking ledge
            hLedge = platforms.create(vLedge.x, vLedge.y - vLedge.height, 'hPlatform');
            hLedge.body.immovable = true;

            hBreak = breaking.create(hLedge.x + hLedge.width, hLedge.y, 'hBreak');
            hBreak.body.immovable = true;
            // Add tween to the break ledge
            hTween1 = game.add.tween(hBreak).to({
                y: hBreak.y + 10
            }, 700, "Linear", false, 0, 0, true);
            hTween2 = game.add.tween(hBreak).to({
                y: hBreak.y + 10
            }, 700, "Linear", false, 0, 0, true);
            hTween3 = game.add.tween(hBreak).to({
                y: hBreak.y + 10
            }, 700, "Linear", false, 0, 0, true);
            hTween4 = game.add.tween(hBreak).to({
                y: hBreak.y + 10
            }, 700, "Linear", false, 0, 0, true);

            hLedge = platforms.create(hBreak.x + hBreak.width, hBreak.y, 'hPlatform');
            hLedge.body.immovable = true;

            // Create 2 other vertical ledges
            vLedge = platforms.create(hLedge.x + hLedge.width, hLedge.y, 'vPlatform');
            vLedge.body.immovable = true;
            vLedge.anchor.setTo(1);
            vLedge = platforms.create(vLedge.x, vLedge.y - vLedge.height, 'vPlatform');
            vLedge.body.immovable = true;
            vLedge.anchor.setTo(1);

            // Add checkpoint
            checkpoint6 = checkpoint.create(vLedge.x + vLedge.width, -20, 'checkpoint');
            checkpoint6.body.immovable = true;
            checkpoint6.anchor.setTo(0, 0);
            break;

        case 7:
            // PAPER MUST SHOOT THE WALL TO BREAK IT (WITH PAPER AIRPLANES)

            // Add checkpoint
            checkpoint7 = checkpoint.create((screenWidth * (screenNumber + 1)) - 370, -20, 'checkpoint');
            checkpoint7.body.immovable = true;
            checkpoint7.anchor.setTo(0, 0);

            // Create the ground
            ground = platforms.create(screenWidth * screenNumber, game.world.height - 20, 'ground'); // The platform has a height of 20
            ground.body.immovable = true;

            // Create the thick block
            firstBlock = platforms.create(screenWidth * screenNumber, game.world.height + 120, 'vPlatform');
            firstBlock.body.immovable = true;
            firstBlock.anchor.setTo(0, 1);

            // Create the first vertical wall (that will disappear)
            vBreak1 = platforms.create(firstBlock.x, firstBlock.y - 300, 'vBreak');
            vBreak1.body.immovable = true;
            vBreak1.anchor.setTo(0, 1);
            vBreak2 = platforms.create(vBreak1.x, vBreak1.y - vBreak1.height, 'vBreak');
            vBreak2.body.immovable = true;
            vBreak2.anchor.setTo(0, 1);

            // Create a vertical target wall
            vBreak3 = platforms.create(firstBlock.x + firstBlock.width + 160, game.world.height - 20, 'vBreak');
            vBreak3.body.immovable = true;
            vBreak3.anchor.setTo(0, 1);
            // Add tween to the break ledge
            vTween1 = game.add.tween(vBreak3).to({
                x: vBreak3.x + 10
            }, 700, "Linear", false, 0, 0, true);
            vTween2 = game.add.tween(vBreak3).to({
                x: vBreak3.x + 10
            }, 700, "Linear", false, 0, 0, true);
            vTween3 = game.add.tween(vBreak3).to({
                x: vBreak3.x + 10
            }, 700, "Linear", false, 0, 0, true);
            vTween4 = game.add.tween(vBreak3).to({
                x: vBreak3.x + 10
            }, 700, "Linear", false, 0, 0, true);

            // Create the wall above the target wall
            vLedge = platforms.create(vBreak3.x, vBreak3.y - vBreak3.height, 'vPlatform');
            vLedge.body.immovable = true;
            vLedge.anchor.setTo(0, 1);
            vLedge = platforms.create(vLedge.x, vLedge.y - vLedge.height, 'vPlatform');
            vLedge.body.immovable = true;
            vLedge.anchor.setTo(0, 1);
            break;

        case 8:
            // PAPER MOVES LEFT THROUGH SNAKE PLATFORM

            // Create the ground
            ground = platforms.create(screenWidth * screenNumber, game.world.height - 20, 'ground'); // The platform has a height of 20
            ground.body.immovable = true;

            // Create first vertical ledge
            vLedge1 = platforms.create(screenWidth * screenNumber, game.world.height - 20, 'vPlatform');
            vLedge1.body.immovable = true;
            vLedge1.anchor.setTo(0, 1);
            vLedge2 = platforms.create(vLedge1.x, vLedge1.y - 100, 'vPlatform');
            vLedge2.body.immovable = true;
            vLedge2.anchor.setTo(0, 1);

            // Create first row of horizontal ledges side by side
            hLedge1 = platforms.create(vLedge2.x, vLedge2.y - vLedge2.height, 'hPlatform');
            hLedge1.body.immovable = true;
            hLedge1.anchor.setTo(0, 1);
            hLedge2 = platforms.create(hLedge1.x + hLedge1.width, hLedge1.y, 'hPlatform');
            hLedge2.body.immovable = true;
            hLedge2.anchor.setTo(0, 1);

            // Create second vertical ledge
            vLedge3 = platforms.create(vLedge1.x + hLedge1.width + hLedge2.width + 200, 0, 'vPlatform');
            vLedge3.body.immovable = true;
            vLedge3.anchor.setTo(0, 0);
            vLedge4 = platforms.create(vLedge3.x, vLedge3.y + 100, 'vPlatform');
            vLedge4.body.immovable = true;
            vLedge4.anchor.setTo(0, 0);

            // Create second row of horizontal ledges side by side
            hLedge3 = platforms.create(vLedge4.x, vLedge4.y + vLedge4.height, 'hPlatform');
            hLedge3.body.immovable = true;
            hLedge3.anchor.setTo(1, 1);
            hLedge4 = platforms.create(hLedge3.x - hLedge3.width, hLedge3.y, 'hPlatform');
            hLedge4.body.immovable = true;
            hLedge4.anchor.setTo(1, 1);

            // Add checkpoint
            checkpoint8 = checkpoint.create(vLedge4.x + vLedge4.width, -20, 'checkpoint');
            checkpoint8.body.immovable = true;
            checkpoint8.anchor.setTo(0, 0);
            break;
        }
    }
}

/* This is the original gesture mapping assuming that there are 8 bend sensors
        // Left side up + Right side up = thin paper
        if ((flat_A[0] - A[0]) > 50 && (A[3] - flat_A[3]) > 50 && (flat_A[4] - A[4]) > 50 && (A[7] - flat_A[7]) > 50) {
            logInput("LSU+RSU");
            paperSprite.loadTexture('thin');
            paperSprite.body.setSize(paperSprite.width, paperSprite.height);
            paperIsBent = true;
            paperIsThin = true;
        }
        // --- FIRST CHECK IF PAPER IS MOVING
        //  Right side up = move left (Unless paper reached left bounds)
        else if ((flat_A[4] - A[4]) > 70 && (A[7] - flat_A[7]) > 70 && paperSprite.x > 0) {
            logInput("RSU");
            paperSprite.body.velocity.x = -250;
            paperIsMoving = true;
        }
        //  Left side up = move right (Unless paper reached right bounds)
        else if ((flat_A[0] - A[0]) > 70 && (A[3] - flat_A[3]) > 70 && (paperSprite.x + paperSprite.width) < game.world.width) {
            logInput("LSU");
            paperSprite.body.velocity.x = 250;
            paperIsMoving = true;
        }
        //  Bottom side up to jump up (not move)
        else if (((A[1] - flat_A[1]) > 120 && (flat_A[6] - A[6]) > 120) && paperSprite.y > 0) {
            logInput("BSU");
            paperSprite.body.velocity.y = -400;
            paperIsMoving = true;
        } else {
            paperSprite.body.velocity.x = 0;
            paperIsMoving = false;
        }

        // --- SECOND CHECK IF PAPER IS NOT MOVING --- 
        if (!paperIsMoving) {
            // Top right down = hold1
            if (paperIsOnWall && (A[4] - flat_A[4]) > 50 && (flat_A[5] - A[5]) > 50) {
                logInput("TRD");
                if (hold1Once) {
                    paperSprite.x += (paperSprite.width / 2) - 20;
                    hold1Once = false;
                }
                paperSprite.loadTexture('hold1');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                if (hold2Once) {
                    hold2Once = false;
                }
                paperSprite.body.gravity.y = 0;
                paperSprite.body.velocity.y = 0;
                paperIsBent = false;
            }

            // Top left down = hold2
            else if (paperIsOnWall && (A[2] - flat_A[2]) > 50 && (flat_A[3] - A[3]) > 50) {
                logInput("TLD");
                if (!hold2Once) {
                    paperSprite.x += (paperSprite.width / 2) + 25;
                    hold2Once = true;
                }
                paperSprite.loadTexture('hold2');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                paperSprite.body.gravity.y = 0;
                paperSprite.body.velocity.y = 0;
                paperIsBent = false;
            }

            //  Top side up = fold paper
            else if ((flat_A[2] - A[2]) > 150 && (A[5] - flat_A[5]) > 150) {
                logInput("TSU");
                paperSprite.loadTexture('folded');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                paperIsBent = true;
                paperIsFolded = true;
            }

            // Top left up + Bottom right up = crumpled ball
            else if ((flat_A[2] - A[2]) > 100 && (A[3] - flat_A[3]) > 100 && (flat_A[6] - A[6]) > 100 && (A[7] - flat_A[7]) > 100) {
                logInput("TLU+BRU");
                paperSprite.loadTexture('crumpled');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                paperIsBent = true;
                paperIsCrumpled = true;
            }

            // Bottom left up + Bottom right down (alternating) = kick1
            else if ((flat_A[0] - A[0]) > 50 && (A[1] - flat_A[1]) > 50 && (A[6] - flat_A[6]) > 50 && (flat_A[7] - A[7]) > 50) {
                logInput("BLU+BRD");
                paperSprite.loadTexture('kick1');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                paperIsBent = false;
                // Increment hit count by 1 Once
                if (waitForKick1) {
                    breakHitPoint++;
                    waitForKick1 = false;
                    waitForKick2 = true;
                    switch (breakHitPoint) {
                    case 1:
                        hTween1.start();
                        break;
                    case 2:
                        hTween2.start();
                        break;
                    case 3:
                        hTween3.start();
                        break;
                    case 4:
                        hTween4.start();
                        break;
                    }
                }
            }

            // Bottom left down + Bottom right up (alternating) = kick2
            else if ((A[0] - flat_A[0]) > 50 && (flat_A[1] - A[1]) > 50 && (flat_A[6] - A[6]) > 50 && (A[7] - flat_A[7]) > 50) {
                logInput("BLD+BRU");
                paperSprite.loadTexture('kick2');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                paperIsBent = false;
                // Increment hit count by 1 Once
                if (waitForKick2) {
                    breakHitPoint++;
                    waitForKick1 = true;
                    waitForKick2 = false;
                    switch (breakHitPoint) {
                    case 1:
                        hTween1.start();
                        break;
                    case 2:
                        hTween2.start();
                        break;
                    case 3:
                        hTween3.start();
                        break;
                    case 4:
                        hTween4.start();
                        break;
                    }
                }
            }

            // Top right up = shoot
            else if ((flat_A[4] - A[4]) > 200 && (A[5] - flat_A[5]) > 200) {
                logInput("TRU");
                paperSprite.loadTexture('shoot');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                this.shootPaperAirplanes();
                paperIsBent = false;
            }
            // No bends
            else {
                if (!paperIsBent)
                    paperSprite.loadTexture('normal');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                paperSprite.body.velocity.x = 0;
                paperSprite.body.gravity.y = gravity;
            }
        }
        // --- THIRD IF PAPER IS BENT THEN USER CAN UNBEND IT ---
        if (paperIsBent) {
            if ((paperIsThin && (A[0] - flat_A[0]) > 50 && (flat_A[3] - A[3]) > 50 && (A[4] - flat_A[4]) > 50 && (flat_A[7] - A[7]) > 50) || (paperIsFolded && (A[2] - flat_A[2]) > 50 && (flat_A[5] - A[5]) > 50) || (paperIsCrumpled && (A[2] - flat_A[2]) > 50 && (flat_A[3] - A[3]) > 50 && (A[6] - flat_A[6]) > 50 && (flat_A[7] - A[7]) > 50)) {
                paperSprite.loadTexture('normal');
                paperSprite.body.setSize(paperSprite.width, paperSprite.height);
                paperSprite.body.velocity.x = 0;
                if (!hold1Once) {
                    hold1Once = true;
                }
                paperIsBent = false;
                paperIsThin = false;
                paperIsFolded = false;
                paperIsCrumpled = false;
            }
        }
*/
