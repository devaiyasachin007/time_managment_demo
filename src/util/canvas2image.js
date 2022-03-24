// =========================
// Canvas 转换为 Image 格式.
//
// @version 0.1.0.
// @update 2019/03/18.
// @author Jesonhu(github).
// @email jesonhu_web@163.com.
// =========================
class Canvas2Image {
  constructor (oCanvas) {
    this.init(oCanvas)
  }

  init (oCanvas) {
    this.initData(oCanvas)
  }

  initData (oCanvas) {
    this._canvasEl = oCanvas
  }

  getBase64 () {
    const oCanvas = this._canvasEl
    // @see https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toDataURL
    return oCanvas.toDataURL('image')
  }
}

const Util = {
  isCanvas (el) {
    return el instanceof HTMLCanvasElement
  }
}

/**
   * canvas 转换为 Image
   */
const canvas2Image = {
  getImage (oCanvas, imgType = 'png') {
    const isCanvas = Util.isCanvas(oCanvas)
    if (!isCanvas) {
      throw Error('getImage method param must be a canvas element')
    }
    const image = new Canvas2Image(oCanvas)
    return image.getBase64()
  },
  /**
     *
     */
  getBase64 () {
  }
}

export default canvas2Image
