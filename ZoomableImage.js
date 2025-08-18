class ZoomableImage {
  constructor(container, options = {}) {
    this.container = container;
    this.image = null;
    this.scale = 1;
    this.minScale = options.minScale || 0.5;
    this.maxScale = options.maxScale || 3;
    this.zoomStep = options.zoomStep || 0.1;
  }

  setImage(img) {
    this.image = img;
    this.image.style.transformOrigin = "center center";
    this.applyZoom();
    this.addWheelZoom();
  }

  applyZoom() {
    if (!this.image) return;
    this.image.style.transform = `scale(${this.scale})`;
  }

  zoomIn() {
    this.scale = Math.min(this.maxScale, this.scale + this.zoomStep);
    this.applyZoom();
  }

  zoomOut() {
    this.scale = Math.max(this.minScale, this.scale - this.zoomStep);
    this.applyZoom();
  }

  resetZoom() {
    this.scale = 1;
    this.applyZoom();
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

export default ZoomableImage;
