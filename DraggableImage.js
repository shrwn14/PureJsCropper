export default class DraggableImage {
  constructor(container, transformState) {
    this.container = container;
    this.image = null;
    this.transform = transformState;
    this.dragging = false;
    this.offset = { x: 0, y: 0 };
  }

  setImage(image) {
    this.image = image;
    this.image.style.cursor = "grab";

    this.image.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  onMouseDown(e) {
    e.preventDefault();
    this.dragging = true;
    this.offset.x = e.clientX - this.transform.x;
    this.offset.y = e.clientY - this.transform.y;
    this.image.style.cursor = "grabbing";
  }

  onMouseMove(e) {
    if (!this.dragging) return;

    this.transform.x = e.clientX - this.offset.x;
    this.transform.y = e.clientY - this.offset.y;

    this.applyTransform();
  }

  onMouseUp() {
    this.dragging = false;
    if (this.image) this.image.style.cursor = "grab";
  }

  applyTransform() {
    if (!this.image) return;
    this.image.style.transform = `
      translate(${this.transform.x}px, ${this.transform.y}px)
      scale(${this.transform.scale})
    `;
  }
}