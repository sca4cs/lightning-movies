import { Lightning, Utils } from "@lightningjs/sdk";

export class NavIndicator extends Lightning.Component {
  static _template() {
    return {
      Container: {
        rect: true,
        color: 0xff000000,
        h: 50,
        flex: {},
        Arrow: {
          w: 30,
          h: 30,
          src: Utils.asset('images/arrow.png'),
          rotation: this.bindProp('arrowRotation'),
        },
        Label: {
          text: {
            text: this.bindProp('textLabel'),
            fontSize: 32,
            paddingLeft: 15,
          }
        },
      }
    }
  }

  _focus() {
    this.patch({
      Container: {
        shader: {type: Lightning.shaders.Outline, stroke: 5}
      }
    })
  }

  _unfocus() {
    this.patch({
      Container: {
        shader: null
      }
    })
  }
}