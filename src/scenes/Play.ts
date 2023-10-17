import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;
  moveSpeed?: number;

  rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.moveSpeed = 0.5;
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);

    this.spinner = this.add.rectangle(300, 400, 50, 50, 0xff0000);
    this.spinner.setOrigin(0.5, 0.5);
  }

  update(_timeMs: number, delta: number) {
    this.starfield!.tilePositionX -= 4;

    if (this.left!.isDown) {
      const leftBorder = this.spinner!.x - this.spinner!.width / 2;

      this.spinner!.x =
        leftBorder > 0
          ? this.spinner!.x - delta * this.moveSpeed!
          : this.spinner!.width / 2;
    }
    if (this.right!.isDown) {
      const rightBorder = this.spinner!.x + this.spinner!.width / 2;
      this.spinner!.x =
        rightBorder < (this.game.config.width! as number)
          ? this.spinner!.x + delta * this.moveSpeed!
          : (this.game.config.width! as number) - this.spinner!.width / 2;
    }

    if (this.fire!.isDown) {
      //spawn bullet
      const bullet = this.add.rectangle(
        this.spinner?.x,
        this.spinner?.y,
        10,
        10,
        0x00ff00,
      );
      this.tweens.add({
        targets: bullet,
        y: this.spinner?.y! - (this.game.config.height! as number),
        duration: 1000,
        ease: "linear",
      });
      //destroy bullet
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          bullet.destroy();
        },
      });
    }
  }
}
