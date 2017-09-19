var game = new Phaser.Game(800, 800, Phaser.AUTO, '');

game.state.add('startupState', startupState);
game.state.add('tutorialState', tutorialState);
game.state.add('gameState', gameState);
game.state.add('gameoverState', gameoverState);

game.state.start('startupState');
