var gameState = {
	preload: preloadGame,
	create: createGame,
	update: updateGame
}

var player;
var playerActive;
var moveSpeed = 300;
var bulletSpeed = 900;
var bullets;
var mousePressed;
var fireingDelay;
var lastFire;

var bugs;
var bugMoveSpeed = 150;

var wave;
var kills;
var hpBar;

var bugArray = ['bug1', 'bug2'];

function preloadGame() {
	game.load.image('player', 'assets/player.png');
	game.load.image('weapon', 'assets/weapon.png');
	game.load.image('bullet1', 'assets/0.png');
	game.load.image('bullet2', 'assets/1.png');
	game.load.image('bug1', 'assets/bug1.png');
	game.load.image('bug2', 'assets/bug2.png');
	game.load.image('hp', 'assets/lives.png');
	game.load.bitmapFont('gamefont', 'assets/GameFont_0.png', 'assets/GameFont.xml');
}

function createGame() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.body.collideWorldBounds = true;
	player.anchor.setTo(0.5, 0.5);
	player.maxHealth = 3;
	player.health = 3;
	playerActive = true;
	
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
	
	mousePressed = false;
	wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
	aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
	dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
	LMB = game.input.activePointer;
	fireingDelay = 20;
	lastFire = 100;

	wave = 0;
	countWave1 = 0;
	countWave2 = 0;
	kills = 0;

	hpBar = game.add.group();
	for (var hearts = 0; hearts < player.health; hearts++) {
		hpBar.create(30 + (hearts * 40), 30, 'hp');
	}
	wavecounter = game.add.bitmapText(600, 30, 'gamefont', 'Wave\n ' + wave - 1);
	KillCounter = game.add.bitmapText(300, 30, 'gamefont', 'Kills\n ' + kills);
}

function updateGame() {
	if (player.alive && playerActive) {
		movePlayer();
		aim();
		if (lastFire < fireingDelay) {
			lastFire++;
		}
		if (LMB.isDown && lastFire >= fireingDelay) {
			shoot(playerRadians);
		}
		
		checkWave();
		game.physics.arcade.overlap(bullets, bugs, collisionHandler, null, this);
		game.physics.arcade.overlap(player, bugs, hitPlayer, null, this);
		game.physics.arcade.collide(bugs, bugs);
		bugs.forEach(updateBug, this, true);
	} else if (!player.alive) {
		game.state.start('gameoverState');
	} else {
		game.physics.arcade.overlap(bullets, bugs, collisionHandler, null, this);
		killRemainingBugs();
	}
}

function killRemainingBugs() {
	if (bugs.length > 0) {
		bugs.forEach(function(bug) {
			playerRadians = Math.atan(-(player.y - bug.y) / (bug.x - player.x));
			if (bug.x < player.x) {
				playerRadians += Math.PI;
			}
			shoot(playerRadians);
		});
	}
	else {
		playerActive = true;
	}
}

function updateBug(bug) {
	var angle = game.physics.arcade.moveToObject(bug, player, bugMoveSpeed);
	bug.angle = angle * (360 / (2 * Math.PI));
}

function shoot(radians) {
	bullet = getRandomNonExists(bullets);
		if (bullet) {
			bullet.reset(player.x, player.y);
			bullet.body.velocity.x = bulletSpeed * Math.cos(radians);
			bullet.body.velocity.y = bulletSpeed * Math.sin(radians);
			lastFire = 0;
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
	mouseX = game.input.mousePointer.x;
	mouseY = game.input.mousePointer.y;
	
	playerRadians = Math.atan(-(player.y - mouseY) / (mouseX - player.x));
	playerDegrees = playerRadians * (360 / (2 * Math.PI));
	
	if (mouseX < player.x) {
		playerDegrees += 180;
		playerRadians += Math.PI;
	}
	
	player.angle = playerDegrees;
}

function checkWave() {
	if (countWave1 < 60) {
		countWave1++;
	}
	else if (countWave2 < wave){
		spawnBugs(wave);
		countWave1 = 0;
		countWave2++;
	}
	if (bugs.length == 0 && countWave2 == wave) {
		newWave();
	}
}

function spawnBugs(amount) {
	for (var i = 0; i < amount; i++) {
		
		//TODO byt till världsmått
		var randomRadian = Math.random() * 2 * Math.PI;
		var spawnX = 400 + Math.cos(randomRadian) * 570;
		var spawnY = 400 + Math.sin(randomRadian) * 570;

		bugs.create(spawnX, spawnY, bugArray[Math.floor(Math.random() * bugArray.length)]);
	}
	bugs.setAll('anchor.x', .5);
	bugs.setAll('anchor.y', .5);
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
	killBug(bug);
}

function getRandomNonExists(group) {
    var list = group.getAll('exists', false);
    return game.rnd.pick(list);
};

function newWave() {
	wave++;
	countWave1 = 0;
	countWave2 = 0;
	setCounterText(wavecounter, 'Wave\n', wave-1);
	if (wave == 6) {
		fireingDelay = 8;
	}
}

function hitPlayer(playerToHit, bug) { //BUG, oavsätt ordning på args så är bug groupen alltid sist??
	playerActive = false;
	killBug(bug);
	player.damage(1);
	hpBar.remove(hpBar.getAt(hpBar.length-1), true);
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
}

function killBug(bugToKill) {
	bugs.remove(bugToKill);
	bugToKill.kill();
	if (playerActive) {
		kills++;
		setCounterText(KillCounter, 'Kills\n', kills);
	}
}

function setCounterText(textObj, prefix, number) {
	textObj.setText(prefix + ' ' + number);
}
