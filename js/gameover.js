var gameoverState = {

	preload: function() {
		game.load.image('gameover', 'assets/gameover.png');
	},

	create: function() {
		var gos = game.add.sprite(400, 200, 'gameover'); //TODO worldbounds
		gos.anchor.x = .5;
		gos.anchor.y = .5;
		gos.scale.x = 4;
		gos.scale.y = 4;
		gos.smoothed = false;
		game.input.keyboard.onDownCallback = function() {
			game.input.keyboard.onDownCallback = null;
			game.state.start('gameState');
		}
	},

	update: function() {
		
	}
}