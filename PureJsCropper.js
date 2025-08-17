class PureJsCropper {
  constructor(container, options = {}) {
    this.container = container;
    this.image = null;
    this.cropBox = null;
    this.dragging = false;
    this.resizing = false;
    this.resizeHandle = null;

    this.options = Object.assign({
      width: "300px",
      height: "300px",
      border: "1px dashed #53535c",
      minCropBoxWidth: 30,
      minCropBoxHeight: 30
    }, options);
  }

  loadImage(src) {
    this.image = new Image();
    this.image.src = src;
    this.image.onload = () => {
      this.render();
    };
  }

  render() {
    // Clear container
    this.container.innerHTML = "";
    this.container.style.position = "relative";
    this.container.style.width = this.options.width;
    this.container.style.height = this.options.height;
    this.container.style.overflow = "hidden";

    // Add image
    this.container.appendChild(this.image);

    // Add crop box
    this.cropBox = document.createElement("div");
    this.cropBox.style.position = "absolute";
    this.cropBox.style.top = "50px";
    this.cropBox.style.left = "50px";
    this.cropBox.style.width = "100px";
    this.cropBox.style.height = "100px";
    this.cropBox.style.border = this.options.border;
    this.cropBox.style.cursor = "move";
    this.cropBox.style.boxSizing = "border-box";

    this.container.appendChild(this.cropBox);

    // Add resize handles
    const handles = ["nw", "ne", "sw", "se"];
    handles.forEach(pos => {
      const handle = document.createElement("div");
      handle.className = "resize-handle " + pos;
      handle.style.position = "absolute";
      handle.style.width = "10px";
      handle.style.height = "10px";
      handle.style.background = "#53535C";
      handle.style.border = "1px solid rgba(255, 255, 255, 0.5)";
      handle.style.cursor = `${pos}-resize`;

      switch (pos) {
        case "nw":
          handle.style.left = "-5px";
          handle.style.top = "-5px";
          break;
        case "ne":
          handle.style.right = "-5px";
          handle.style.top = "-5px";
          break;
        case "sw":
          handle.style.left = "-5px";
          handle.style.bottom = "-5px";
          break;
        case "se":
          handle.style.right = "-5px";
          handle.style.bottom = "-5px";
          break;
      }

      this.cropBox.appendChild(handle);

      handle.addEventListener("mousedown", (e) => {
        e.stopPropagation(); // prevent triggering move
        this.resizing = true;
        this.resizeHandle = pos;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startW = this.cropBox.offsetWidth;
        this.startH = this.cropBox.offsetHeight;
        this.startLeft = this.cropBox.offsetLeft;
        this.startTop = this.cropBox.offsetTop;
      });
    });

    // Dragging events
    this.cropBox.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("resize-handle")) return; // skip if resizing
      this.dragging = true;
      this.startX = e.clientX - this.cropBox.offsetLeft;
      this.startY = e.clientY - this.cropBox.offsetTop;
    });

    window.addEventListener("mousemove", (e) => {
      if (this.dragging) {
        let x = e.clientX - this.startX;
        let y = e.clientY - this.startY;

        // Keep inside container
        x = Math.max(0, Math.min(x, this.container.clientWidth - this.cropBox.offsetWidth));
        y = Math.max(0, Math.min(y, this.container.clientHeight - this.cropBox.offsetHeight));

        this.cropBox.style.left = x + "px";
        this.cropBox.style.top = y + "px";
      } else if (this.resizing) {
        this.handleResize(e);
      }
    });

    window.addEventListener("mouseup", () => {
      this.dragging = false;
      this.resizing = false;
      this.resizeHandle = null;
    });
  }

  handleResize(e) {
    let dx = e.clientX - this.startX;
    let dy = e.clientY - this.startY;

    let newW = this.startW;
    let newH = this.startH;
    let newLeft = this.startLeft;
    let newTop = this.startTop;

    switch (this.resizeHandle) {
      case "se":
        newW = this.startW + dx;
        newH = this.startH + dy;
        break;
      case "sw":
        newW = this.startW - dx;
        newH = this.startH + dy;
        newLeft = this.startLeft + dx;
        break;
      case "ne":
        newW = this.startW + dx;
        newH = this.startH - dy;
        newTop = this.startTop + dy;
        break;
      case "nw":
        newW = this.startW - dx;
        newH = this.startH - dy;
        newLeft = this.startLeft + dx;
        newTop = this.startTop + dy;
        break;
    }

    // enforce minimum size
    newW = Math.max(this.options.minCropBoxWidth, newW);
    newH = Math.max(this.options.minCropBoxHeight, newH);

    // enforce container bounds
    newW = Math.min(newW, this.container.clientWidth - newLeft);
    newH = Math.min(newH, this.container.clientHeight - newTop);
    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;

    this.cropBox.style.width = newW + "px";
    this.cropBox.style.height = newH + "px";
    this.cropBox.style.left = newLeft + "px";
    this.cropBox.style.top = newTop + "px";
  }

  crop() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const boxX = parseInt(this.cropBox.style.left, 10);
    const boxY = parseInt(this.cropBox.style.top, 10);
    const boxW = this.cropBox.offsetWidth;
    const boxH = this.cropBox.offsetHeight;

    canvas.width = boxW;
    canvas.height = boxH;

    ctx.drawImage(
      this.image,
      boxX, boxY, boxW, boxH,  // source region
      0, 0, boxW, boxH         // destination
    );

    return canvas.toDataURL("image/png"); // return cropped image as base64
  }
}

export default PureJsCropper;
