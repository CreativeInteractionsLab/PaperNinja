var boot = {
    create: function () {
        // Setup game world + arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.renderer.renderSession.roundPixels = true;
        game.world.resize(screenWidth * (obstacles.length + 1) + 175, screenHeight);
        game.state.start('load');
    }
}
