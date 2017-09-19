var autostart;

var tutorialState = {

	preload: function() {
		game.load.image('controls', 'assets/controls.png');
	},

	create: function() {
		var gos = game.add.sprite(game.width/2, game.height/2, 'controls');
		gos.anchor.setTo(.5, .5);

		autostart = 0;

		game.input.keyboard.onDownCallback = function() {
			game.input.keyboard.onDownCallback = null;
			game.state.start('gameState');
		}
	},

	update: function() {
		if (autostart > 800) {
			game.input.keyboard.onDownCallback = null;
			game.state.start('gameState');
		}
		autostart++;
	}
}
