import { Lightning } from "@lightningjs/sdk";

export class Poster extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: 300,
      h: 450,
      color: 0x00808080,
      flexItem: {
        margin: 10,
        marginBottom: 100,
      },
      Image: {
        src: this.bindProp('movieImage'),
      },
      Label: {
        x: 5,
        y: 465,
        text: {
          text: this.bindProp('label'),
          wordWrapWidth: 300,
          fontSize: 30
        }
      }
    }
  }

  _focus() {
    this.patch({
      Image: {
        shader: {type: Lightning.shaders.Outline, stroke: 5}
      },
    })
  }

  _unfocus() {
    this.patch({
      Image: {
        shader: null
      },
    })
  }
}