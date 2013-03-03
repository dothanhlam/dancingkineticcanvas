/**
 * Created with JetBrains WebStorm.
 * User: Lam Do
 * Date: 3/2/13
 * Time: 2:42 PM
 * To change this template use File | Settings | File Templates.
 */

function TitleScreen(config) {
    this.stage = config.stage;
    this.layer = new Kinetic.Layer();
    this.backgroundImage = new Kinetic.Image({image: config.backgroundImage, x: 0, y: 0});
    this.playButton = new Kinetic.Image({image:config.playButton.source, x: config.playButton.x, y:config.playButton.y});

    this.layer.add(this.backgroundImage);
    this.layer.add(this.playButton);
}

function InstructionScreen(config) {
    this.stage = config.stage;
    this.layer = new Kinetic.Layer();
    this.backgroundImage = new Kinetic.Image({image: config.backgroundImage, x: 0, y: 0});
    this.playButton = new Kinetic.Image({image:config.playButton.source, x: config.playButton.x, y:config.playButton.y});

    this.layer.add(this.backgroundImage);
    this.layer.add(this.playButton);
}

function PlayingScreen(config) {
    this.stage = config.stage;
    this.layer = new Kinetic.Layer();
    this.backgroundImage = new Kinetic.Image({image: config.backgroundImage, x: 0, y: 0});
    this.lightingImage = new Kinetic.Image({image: config.lightingImage, x: 0, y: 0, visible: true});
    this.dialImage = new Kinetic.Image({image: config.dialImage, x: 678, y: 368, offset: [15, 48]});
    this.layer.add(this.backgroundImage);
    this.layer.add(this.dialImage);
    this.layer.add(this.lightingImage);
}
