
import ZoomableImage from "./ZoomableImage.js";
import DraggableImage from "./DraggableImage.js";
import BaseClass from "./BaseClass.js";

class PureJsCropper extends BaseClass {
  constructor(container, options = {}) {
    super(container, options);
    this.zoomable = new ZoomableImage(container, options);
    this.draggable = new DraggableImage(container);
  }

  
  loadImage(src) {
    this.image = new Image();
    this.image.src = src;
    this.image.style.width = this.options.width;
    this.image.style.height = this.options.height;
    this.image.style.userSelect = "none"; // avoid text highlight
    
    this.image.onload = () => {
      this.render();

      // Initialize zoomable and draggable functionalities
      this.zoomable.setImage(this.image);
      this.draggable.setImage(this.image);
    };
  }
    
  // Add convenience passthrough methods
  zoomIn()  { this.zoomable.zoomIn(); }
  zoomOut() { this.zoomable.zoomOut(); }
  resetZoom() { this.zoomable.resetZoom(); }
}


// Export for Node/ESM/CommonJS
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = PureJsCropper;
} else if (typeof define === "function" && define.amd) {
  define([], () => PureJsCropper);
} else {
  window.PureJsCropper = PureJsCropper;
}

export default PureJsCropper;
