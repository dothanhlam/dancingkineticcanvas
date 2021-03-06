/**
 * Created with JetBrains WebStorm.
 * User: Lam Do
 * Date: 3/2/13
 * Time: 2:29 PM
 * To change this template use File | Settings | File Templates.
 */
var FRAME_RATE = 30;
var IDLE_TIMEOUT = 1000; //seconds
var GAME_OVER_DURATION = 5; //
var idleSecondsCounter = 0;

var stage = null;
var images = {}; // hash of images

var keys = [['Q','W','E'],['A','S','D'],['J','K','L']];
var keysMap = { 65:"A", 97:"A", 83:"S", 115:"S", 68:"D", 100:"D",
                81:"Q",113:"Q",87:"W", 118:"W", 69:"E", 101:"E",
                74:"J",106:"Q",75:"K", 107:"K", 76:"L", 108:"L"};

var currentKeys = keys[0];
var isPressedKeyLeft = false;
var isPressedKeyRight = false;

//screens
var currentScreen;
var titleScreen;
var instructionScreen;
var playingScreen;
var gameOverScreen;

//text
var key1Text, key2Text, key3Text;
var scoreText, levelText;
//animations
var textLayer;
var animationLayer;
var dancingBugs;
// game logic
var speedOfPressingKeys = 0;
var numKeysPressed = 0;
var numKeysMissed = 0;
var isGameStarted = false;
var timeInRedZone = 0;
var score = 0;
var level = 1;
var scorePerLevel = [2000, 4000, 6000, 8000, 10000];

var intervalHandlerIds =[];

var animations = {
    idle:[  {x:0, y:0, width: 152, height: 257},
            {x:157, y:0, width: 159, height: 257},
            {x:315, y:0, width: 156, height: 257},
            {x:469, y:0, width: 155, height: 257},
            {x:623, y:0, width: 152, height: 257},
            {x:775, y:0, width: 155, height: 257},
            {x:930, y:0, width: 160, height: 257}],

    dancing:[   {x: 0, y: 259, width: 136, height: 344},
                {x: 134, y: 259, width: 151, height: 344},
                {x: 286, y: 259, width: 169, height: 344},
                {x: 455, y: 259, width: 182, height: 344},
                {x: 636, y: 259, width: 213, height: 344},
                {x: 850, y: 259, width: 212, height: 344},
                {x: 1060, y: 259, width: 145, height: 344},
                {x: 1205, y: 259, width: 159, height: 344},
                {x: 1363, y: 259, width: 153, height: 344},
                {x: 1514, y: 259, width: 155, height: 344},
                {x: 1668, y: 259, width: 184, height: 344},
                {x: 1852, y: 259, width: 170, height: 344},
                {x: 2021, y: 259, width: 142, height: 344},
                {x: 2163, y: 259, width: 144, height: 344},
                {x: 2307, y: 259, width: 127, height: 344}]
};
window.onload = function() {
    stage = new Kinetic.Stage({
        container: 'container',
        width: 688,
        height: 375
    });

    var sources = {
        titleScreenAsset: 'asset/title_screen.png',
        titleScreenPlayButtonAsset:'asset/title_screen_play_button.png',
        instructionScreenAsset:'asset/instruction_screen.png',
        instructionScreenPlayButtonAsset:'asset/instruction_screen_play_button.png',
        playingScreenAsset:'asset/playing_screen.png',
        playingScreenLightingAsset:'asset/playing_screen_lighting.png',
        playingScreenBustAMoveLightingAsset:'asset/bust_a_move.png',
        playingScreenDialAsset:'asset/dial2.png',
        spriteSheetBugs:'asset/bugs_dancing_spritesheet.png',
        gameOverScreenAsset:'asset/game_over_screen.png',
        gameOverScreenPlayAgainButtonAsset:'asset/game_over_screen_play_again.png'
    };

    loadImages(sources, function(){
        initApplication();
    });
}

function loadImages(sources, callback) {
    var loadedImages = 0;
    var numImages = 0;
    for (var src in sources) {
        numImages++;
        images[src] = new Image();

        images[src].onload = function(){
            if (++loadedImages >= numImages) {
                callback();
            }
        };
        images[src].src = sources[src];
    }
}

function initApplication() {
    titleScreen = new TitleScreen({ stage:stage,
                                    backgroundImage: images.titleScreenAsset,
                                    playButton:{
                                        x: 80, y: 200,
                                        source: images.titleScreenPlayButtonAsset}
                                     });
    titleScreen.playButton.createImageHitRegion(function() {
        titleScreen.layer.drawHit();
    });

    titleScreen.playButton.on("click", function() {
        selectScreen(instructionScreen)
    });


    instructionScreen = new InstructionScreen({ stage:stage,
                                                backgroundImage: images.instructionScreenAsset,
                                                playButton:{
                                                    x: 484,y: 278,
                                                    source: images.instructionScreenPlayButtonAsset}
    });

    instructionScreen.playButton.createImageHitRegion(function() {
        instructionScreen.layer.drawHit();
    });
    instructionScreen.playButton.on("click", function() {
        selectScreen(playingScreen);

    });

    playingScreen = new PlayingScreen({ stage: stage,
                                        backgroundImage: images.playingScreenAsset,
                                        dialImage:images.playingScreenDialAsset,
                                        bustAMoveImage:images.playingScreenBustAMoveLightingAsset,
                                        lightingImage: images.playingScreenLightingAsset
    });

    gameOverScreen = new GameOverScreen({stage: stage,
                                        backgroundImage:images.gameOverScreenAsset,
                                        playAgainButton:{
                                            x: 360,y: 285,
                                            source: images.gameOverScreenPlayAgainButtonAsset}});

    gameOverScreen.playAgainButton.createImageHitRegion(function() {
        gameOverScreen.layer.drawHit();
    });
    gameOverScreen.playAgainButton.on("click", function() {
        selectScreen(playingScreen);
    });

    selectScreen(titleScreen);
}

function selectScreen(screen) {
    if (currentScreen) {
        currentScreen.layer.remove();
    }
    currentScreen = screen;
    stage.add(screen.layer)

    switch (currentScreen) {
        case titleScreen:
            break;

        case instructionScreen:
            break;

        case playingScreen:
            initGame();
            playGame();
            break;

        case gameOverScreen:
            endGame();
            break;

        default:
            break;
    }
}

function getKeys() {
    var index = Math.floor((Math.random()*3));
    return keys[index];
}

function addScoreText(score, xPos, yPos, offsetX, offsetY, layer, removedWhenFinishingTween) {
    var scoreText = new Kinetic.Text({ x: xPos, y: yPos,
        text: score, fontSize: 22, fontFamily: 'Calibri', fill: 'yellow'});
    layer.add(scoreText);
    scoreText.transitionTo({opacity:0, x: xPos + offsetX, y: yPos + offsetY, duration: Math.floor((Math.random()*2) + 1), callback: function() {
        if (removedWhenFinishingTween) {
            scoreText.remove();
        }
    }});
}
// game controller
function initGame() {
    speedOfPressingKeys = 0;
    numKeysPressed = 0;
    numKeysMissed = 0;
    isGameStarted = false;
    timeInRedZone = 0;
    score = 0;
    level = 1;

    dancingBugs = new Kinetic.Sprite({
        x: 256,
        y: 59,
        image: images.spriteSheetBugs,
        animation: 'idle',
        animations: animations,
        frameRate: 7
    });

    animationLayer = new Kinetic.Layer();
    animationLayer.add(dancingBugs);
    stage.add(animationLayer);
    dancingBugs.start();


    key1Text = new Kinetic.Text({ x: 275, y: 332,
                text: currentKeys[0], fontSize: 22, fontFamily: 'Calibri', fill: 'black'});

    key2Text = new Kinetic.Text({ x: 336, y: 332,
                text: currentKeys[1], fontSize: 22, fontFamily: 'Calibri', fill: 'black' });

    key3Text = new Kinetic.Text({ x: 393, y: 332,
                text: currentKeys[2], fontSize: 22, fontFamily: 'Calibri', fill: 'black' });

    scoreText = new Kinetic.Text({ x: 627, y: 18,
                text: "000000", fontSize: 16, fontFamily: 'QuartzBolD', fill: '#ffe169'});

    levelText = new Kinetic.Text({ x: 590, y: 18,
                text: level, fontSize: 16, fontFamily: 'QuartzBolD', fill: '#ffe169'});

    textLayer = new Kinetic.Layer();
    textLayer.add(scoreText);
    textLayer.add(levelText);
    textLayer.add(key1Text);
    textLayer.add(key2Text);
    textLayer.add(key3Text);

    stage.add(textLayer);
}

function playGame() {
    document.onkeyup = function(evt) {
        isGameStarted = true;

        if (currentKeys.indexOf(keysMap[evt.keyCode]) >= 0) {
            if (dancingBugs.getAnimation() != "dancing") {
                dancingBugs.setAnimation("dancing");
                dancingBugs.setY(0);
            }
            numKeysPressed ++;
            playingScreen.lightingImage.show();

            score += 100;
            scoreText.setText(score);

            addScoreText("+100", Math.random()*100 + 400, 300, 0, -300, textLayer, true);

            if (score > scorePerLevel[level-1]) {
                level ++;
                levelText.setText(level);
            }

            if (level > scorePerLevel.length) {
                selectScreen(gameOverScreen);
            }
        }
        else {
            if (dancingBugs.getAnimation() != "idle") {
                dancingBugs.setAnimation("idle");
                dancingBugs.setY(59);
                playingScreen.lightingImage.hide();
            }

            isPressedKeyLeft = !(evt.keyCode == 37);
            isPressedKeyRight = !(evt.keyCode == 39);
            numKeysMissed ++;
        }
    }

    document.onkeydown = function(evt) {
        isPressedKeyLeft = (evt.keyCode == 37);
        isPressedKeyRight = (evt.keyCode == 39);
        idleSecondsCounter = 0;
    }

    intervalHandlerIds.push( setInterval(function() {
        currentKeys = getKeys();
        key1Text.setText(currentKeys[0]);
        key2Text.setText(currentKeys[1]);
        key3Text.setText(currentKeys[2]);
    }, 3000));

    intervalHandlerIds.push( setInterval(gameLoopHandler, 1000 / FRAME_RATE));
    intervalHandlerIds.push( setInterval(checkIdleTimeHandler, IDLE_TIMEOUT));
}

function endGame() {
    document.onkeyup = null;
    document.onkeydown = null;
    while (intervalHandlerIds.length) {
        var id = intervalHandlerIds.pop();
        clearInterval(id);
    }

    var finalScoreText = new Kinetic.Text({ x: 270, y: 195,
        text: score, fontSize: 46, fontFamily: 'QuartzBolD', fill: '#ffe169'});
    textLayer = new Kinetic.Layer();
    finalScoreText.setX((688 - finalScoreText.getWidth()) / 2)
    textLayer.add(finalScoreText);
    stage.add(textLayer)
}

function gameLoopHandler() {
    speedOfPressingKeys = Math.max(0, numKeysPressed - numKeysMissed);
    var angle = Math.min(Math.PI / 2, speedOfPressingKeys / Math.PI);

    playingScreen.bustAMoveImage.transitionTo({opacity: (angle > Math.PI / 3) ? 1 : 0, duration: 1});
    playingScreen.dialImage.transitionTo({rotation: angle, duration: 0.5});

    textLayer.draw();
    animationLayer.draw();
}

//check keyboard idle state
function checkIdleTimeHandler() {
    if (idleSecondsCounter) { // idle
        if (numKeysMissed < numKeysPressed) {
            numKeysMissed += 15;
        } else {
            numKeysMissed = numKeysPressed = 0;
            if (dancingBugs.getAnimation() != "idle") {
                dancingBugs.setAnimation("idle");
                dancingBugs.setY(59);
                playingScreen.lightingImage.hide();
            }
        }

        if (isGameStarted) {
            timeInRedZone ++;
            if (timeInRedZone  > GAME_OVER_DURATION) {
                selectScreen(gameOverScreen);
            }
        }
    }
    else { // active
        timeInRedZone = 0;
    }
    idleSecondsCounter ++;
}