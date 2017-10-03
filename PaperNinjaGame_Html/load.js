var load = {
    preload: function () {
        // Load game assets
        game.load.image('start', 'Img/startButton.png');
        game.load.image('playAgain', 'Img/playAgainButton.png');
        game.load.image('background', 'Img/background.png');
        game.load.image('ground', 'Img/ground.png');
        game.load.image('hPlatform', 'Img/hPlatform.png');
        game.load.image('vPlatform', 'Img/vPlatform.png');
        game.load.image('normal', 'Img/normal.png');
        game.load.image('thin', 'Img/thin.png');
        game.load.image('folded', 'Img/folded.png');
        game.load.image('crumpled', 'Img/crumpled.png');
        game.load.image('crumple1', 'Img/crumple1.png');
        game.load.image('crumple2', 'Img/crumple2.png');
        game.load.image('crumple3', 'Img/crumple3.png');
        game.load.image('kick1', 'Img/kick1.png');
        game.load.image('kick2', 'Img/kick2.png');
        game.load.image('shoot', 'Img/shoot.png');
        game.load.image('hold1', 'Img/hold1.png');
        game.load.image('hold2', 'Img/hold2.png');
        game.load.image('bin', 'Img/bin.png');
        game.load.image('wall', 'Img/wall.png');
        game.load.image('hBreak', 'Img/hBreak.png');
        game.load.image('vBreak', 'Img/vBreak.png');
        game.load.image('paperAirplane', 'Img/paperAirplane.png');
        game.load.image('checkpoint', 'Img/checkpoint.png');
        game.load.image('upButton', 'Img/up.png');
        game.load.image('downButton', 'Img/down.png');
    },
    create: function () {
        game.state.start('menu');
    }
};
