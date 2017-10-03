var menu = {
    create: function () {
        // Game title
        var gameTitle = game.add.text(400, 150, 'Paper Ninja', {
            fontSize: '62px',
            fill: '#fff'
        });
        gameTitle.anchor.setTo(0.5);

        // Instructions
        var instructions = game.add.text(400, 210, 'Get the paper to the Bin!', {
            fontSize: '32px',
            fill: '#fff'
        });
        instructions.anchor.setTo(0.5);

        // Start button
        var startButton = this.game.add.button(400, 340, 'start', this.start, this);
        startButton.anchor.setTo(0.5);
    },
    start: function () {
        game.state.start('play');
    }
};
