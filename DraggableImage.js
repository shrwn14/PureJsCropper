export default class DraggableImage {
  constructor(container) {
    this.container = container;
    this.image = null;
    this.dragging = false;
    this.offset = { x: 0, y: 0 };
    this.position = { x: 0, y: 0 }; // Track translate position
  }

  setImage(image) {
    this.image = image;
    this.image.style.cursor = "grab";
    this.image.style.willChange = "transform";
    
    this.image.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  onMouseDown(e) {
    e.preventDefault();
    this.dragging = true;
    this.offset = {
      x: e.clientX - this.position.x,
      y: e.clientY - this.position.y,
    };
    this.image.style.cursor = "grabbing";
  }

  onMouseMove(e) {
    if (!this.dragging) return;

    this.position = {
      x: e.clientX - this.offset.x,
      y: e.clientY - this.offset.y,
    };

    this.image.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
  }

  onMouseUp() {
    this.dragging = false;
    if (this.image) this.image.style.cursor = "grab";
  }
}
