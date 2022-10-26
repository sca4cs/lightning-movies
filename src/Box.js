import { Lightning } from "@lightningjs/sdk";

export class Box extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: 300,
      h: 169,
      color: 0xff808080,
      flexItem: {
        margin: 15,
        marginBottom: 100,
      },
      Image: {
        src: this.bindProp('movieImage'),
      },
      Label: {
        x: 5,
        y: 175,
        text: {
          text: this.bindProp('label'),
          wordWrapWidth: 300,
          fontSize: 30
        }
      }
    }
  }
}