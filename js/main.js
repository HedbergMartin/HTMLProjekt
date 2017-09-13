var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player;
var moveSpeed = 300;
var bulletSpeed = 900;
var bullets;
var mousePressed = false;

var bugs;
var bugMoveSpeed = 200;

function preload() {
	game.load.image('player', 'assets/player.png');
	game.load.image('weapon', 'assets/weapon.png');
	game.load.image('bullet1', 'assets/0.png');
	game.load.image('bullet2', 'assets/1.png');
	game.load.image('bug1', 'assets/bug1.png');
}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.body.collideWorldBounds = true;
	player.anchor.setTo(0.5, 0.5);
	
	//weapon = game.add.sprite(0, 0, 'weapon');
	//weapon.anchor.setTo(0, -1);
	bullets = game.add.group();
	bullets.enableBody = true;
	bullets.physicsBodyType = Phaser.Physics.ARCADE;
	bullets.createMultiple(20, ['bullet1', 'bullet2']);
	bullets.setAll('outOfBoundsKill', true);
	bullets.setAll('checkWorldBounds', true);
	bullets.setAll('anchor.x', .5);
	bullets.setAll('anchor.y', .5);
	bullets.setAll('scale.x', .5);
	bullets.setAll('scale.y', .5);

	bugs = game.add.group();
	bugs.enableBody = true;
	bugs.physicsBodyType = Phaser.Physics.ARCADE;
	
	wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
	aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
	dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
	LMB = game.input.activePointer;

	spawnBugs(10); //TODO remove and implement waves
}

function update() {
	movePlayer();
	aim();
	shoot();

	//updateBugs();
	game.physics.arcade.overlap(bullets, bugs, collisionHandler, null, this);
	game.physics.arcade.collide(bugs, bugs);
	bugs.forEach(updateBug, this, true);
}

function updateBug(bug) {
	var angle = game.physics.arcade.moveToObject(bug, player, bugMoveSpeed);
	bug.angle = angle * (360 / (2 * Math.PI));
}

function shoot() {
	if (LMB.isDown && !mousePressed) {
		mousePressed = true;
		bullet = getRandomNonExists(bullets);
		if (bullet) {
			bullet.reset(player.x, player.y);
			bullet.body.velocity.x = bulletSpeed * Math.cos(playerRadians);
			bullet.body.velocity.y = bulletSpeed * Math.sin(playerRadians);
		}
	}
	else if (!LMB.isDown && mousePressed) {
		mousePressed = false;
	}
}

function movePlayer() {
	var moveX = 0;
	var moveY = 0;
	
	if (wKey.isDown) {
		moveY -= moveSpeed;
	}
	if (aKey.isDown) {
		moveX -= moveSpeed;
	}
	if (sKey.isDown) {
		moveY += moveSpeed;
	}
	if (dKey.isDown) {
		moveX += moveSpeed;
		game.camera.x += moveSpeed;
	}
	
	if (moveX != 0 && moveY != 0) {
		moveX *= Math.cos(Math.PI/4);
		moveY *= Math.cos(Math.PI/4);
	}
	
	player.body.velocity.x = moveX;
	player.body.velocity.y = moveY;
}

function aim() {
	//weapon.x = player.x;
	//weapon.y = player.y;
	
	mouseX = game.input.mousePointer.x;
	mouseY = game.input.mousePointer.y;
	
	playerRadians = Math.atan(-(player.y - mouseY) / (mouseX - player.x));
	playerDegrees = playerRadians * (360 / (2 * Math.PI));
	
	if (mouseX < player.x) {
		playerDegrees += 180;
		playerRadians += Math.PI;
	}
	
	player.angle = playerDegrees;
	//weapon.angle = playerDegrees;
}

function spawnBugs(amount) {
	for (var i = 0; i < amount; i++) {
		var spawnX, spawnY;
		switch (game.math.between(0,3)){ //TODO byt till världsbredd
			case 0: //Upper wall
				spawnX = (Math.random() * 768) + 16;
				spawnY = 16;
			break;
			case 1: //Right wall
				spawnX = 784;
				spawnY = (Math.random() * 768) + 16;
			break;
			case 2: //Bottom wall
				spawnX = (Math.random() * 768) + 16;
				spawnY = 784;
			break;
			case 3: //Left wall
				spawnX = 16;
				spawnY = (Math.random() * 768) + 16;
			break;
		};

		bugs.create(spawnX, spawnY, 'bug1');
	}
}

function updateBugs() {
	for (var i = 0; i < bugs.length; i++) {
		var bugRadians = Math.atan(-(bugs[i].y - player.y) / (player.x - bugs[i].x));
		bugs[i].angle = bugRadians * (360 / (2 * Math.PI));
		
		if (player.x < bugs[i].x) {
			bugs[i].angle += 180;
			bugRadians += Math.PI;
		}
	}
}

function collisionHandler(bullet, bug) {
	bullet.kill();
	bug.kill();
}

function getRandomNonExists(group) {
    var list = group.getAll('exists', false);
    return game.rnd.pick(list);
};
