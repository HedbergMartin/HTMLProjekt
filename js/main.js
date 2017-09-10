var game = new Phaser.Game(640, 360, Phaser.AUTO);

var GameState = {
	preload: PreLoad,
	create: Create,
	update: Update
}

function PreLoad() {
	game.load.image('testImg', "assets/testImg.png");
}

function Create() {
	game.add.sprite(0, 0, 'testImg');
}

function Update() {
	
}

game.state.add('GameState', GameState);
game.state.start('GameState');
