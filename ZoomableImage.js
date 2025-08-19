export default class ZoomableImage {
  constructor(container, transformState, options = {}) {
    this.container = container;
    this.image = null;
    this.transform = transformState;
    this.minScale = options.minScale || 0.5;
    this.maxScale = options.maxScale || 3;
    this.zoomStep = options.zoomStep || 0.1;
  }

  setImage(img) {
    this.image = img;
    this.image.style.userSelect = "none";
    this.image.style.willChange = "transform";
    this.image.style.maxWidth = "none";
    this.image.style.maxHeight = "none";
    this.image.style.transformOrigin = "center center";

    this.applyTransform();
    this.addWheelZoom();
  }

  applyTransform() {
    if (!this.image) return;
    this.image.style.transform = `
      translate(${this.transform.x}px, ${this.transform.y}px)
      scale(${this.transform.scale})
    `;
  }

  zoomIn() {
    this.transform.scale = Math.min(this.maxScale, this.transform.scale + this.zoomStep);
    this.applyTransform();
  }

  zoomOut() {
    this.transform.scale = Math.max(this.minScale, this.transform.scale - this.zoomStep);
    this.applyTransform();
  }

  resetZoom() {
    this.transform.scale = 1;
    this.transform.x = 0;
    this.transform.y = 0;
    this.applyTransform();
  }

  addWheelZoom() {
    this.container.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
    });
  }
}