export default class DraggableImage {
  constructor(container) {
    this.container = container;
    this.image = null;
    this.dragging = false;
    this.offset = { x: 0, y: 0 };
    this.transform = {
      scale: 1,
      x: 0,
      y: 0,
    };
  }

  setImage(image) {
    this.image = image;
    this.image.style.cursor = "grab";
    this.image.style.willChange = "transform";

    this.parseTransform(); // Initialize transform values

    this.image.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  parseTransform() {
    const style = window.getComputedStyle(this.image);
    const matrix = style.transform;

    if (matrix && matrix !== "none") {
      const values = matrix.match(/matrix\(([^)]+)\)/)[1].split(", ");
      const a = parseFloat(values[0]); // scaleX
      const d = parseFloat(values[3]); // scaleY
      const x = parseFloat(values[4]); // translateX
      const y = parseFloat(values[5]); // translateY

      this.transform.scale = a; // assuming uniform scale
      this.transform.x = x;
      this.transform.y = y;
    } else {
      this.transform = { scale: 1, x: 0, y: 0 };
    }
  }

  onMouseDown(e) {
    e.preventDefault();
    this.dragging = true;
    this.parseTransform(); // Refresh transform before drag

    this.offset = {
      x: e.clientX - this.transform.x,
      y: e.clientY - this.transform.y,
    };

    this.image.style.cursor = "grabbing";
  }

  onMouseMove(e) {
    if (!this.dragging) return;

    const newX = e.clientX - this.offset.x;
    const newY = e.clientY - this.offset.y;

    this.transform.x = newX;
    this.transform.y = newY;

    this.image.style.transform = `matrix(${this.transform.scale}, 0, 0, ${this.transform.scale}, ${newX}, ${newY})`;
  }

  onMouseUp() {
    this.dragging = false;
    if (this.image) this.image.style.cursor = "grab";
  }
}