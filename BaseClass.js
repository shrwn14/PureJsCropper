export default class BaseClass {
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
    this.image.style.width = this.options.width;
    this.image.style.height = this.options.height;
    this.image.style.userSelect = "none"; // avoid text highlight
    
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
    this.container.style.userSelect = "none"; // avoid text highlight

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
    this.cropBox.style.userSelect = "none"; // avoid text highlight

    this.container.appendChild(this.cropBox);

    // Add resize handles (corners + edges)
    const handles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
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
        case "n":
          handle.style.left = "50%";
          handle.style.top = "-5px";
          handle.style.transform = "translateX(-50%)";
          break;
        case "ne":
          handle.style.right = "-5px";
          handle.style.top = "-5px";
          break;
        case "e":
          handle.style.right = "-5px";
          handle.style.top = "50%";
          handle.style.transform = "translateY(-50%)";
          break;
        case "se":
          handle.style.right = "-5px";
          handle.style.bottom = "-5px";
          break;
        case "s":
          handle.style.left = "50%";
          handle.style.bottom = "-5px";
          handle.style.transform = "translateX(-50%)";
          break;
        case "sw":
          handle.style.left = "-5px";
          handle.style.bottom = "-5px";
          break;
        case "w":
          handle.style.left = "-5px";
          handle.style.top = "50%";
          handle.style.transform = "translateY(-50%)";
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
      case "n":
        newH = this.startH - dy;
        newTop = this.startTop + dy;
        break;
      case "s":
        newH = this.startH + dy;
        break;
      case "e":
        newW = this.startW + dx;
        break;
      case "w":
        newW = this.startW - dx;
        newLeft = this.startLeft + dx;
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


  crop(cropAsBase64 = true) {
    if (!this.image || !this.cropBox) return null;

    // Rects in *display* pixels (after transforms)
    const imgRect  = this.image.getBoundingClientRect();
    const boxRect  = this.cropBox.getBoundingClientRect();

    // Intersect crop box with the visible image area
    const left   = Math.max(boxRect.left,   imgRect.left);
    const top    = Math.max(boxRect.top,    imgRect.top);
    const right  = Math.min(boxRect.right,  imgRect.right);
    const bottom = Math.min(boxRect.bottom, imgRect.bottom);

    if (right <= left || bottom <= top) {
      // No overlap → return 1×1 transparent
      const blank = document.createElement("canvas");
      blank.width = 1; blank.height = 1;
      return cropAsBase64
        ? blank.toDataURL("image/png")
        : new Promise(res => blank.toBlob(res, "image/png"));
    }

    // Overlap in display pixels (post-zoom)
    const dispX = left - imgRect.left;
    const dispY = top  - imgRect.top;
    const dispW = right - left;
    const dispH = bottom - top;

    // Map display → natural using *display size after transform*
    const natPerDispX = this.image.naturalWidth  / imgRect.width;
    const natPerDispY = this.image.naturalHeight / imgRect.height;

    const sx = Math.max(0, Math.floor(dispX * natPerDispX));
    const sy = Math.max(0, Math.floor(dispY * natPerDispY));
    const sWidth  = Math.max(1, Math.floor(dispW * natPerDispX));
    const sHeight = Math.max(1, Math.floor(dispH * natPerDispY));

    // Clamp to natural bounds (extra safety)
    const sxClamped = Math.min(sx, this.image.naturalWidth  - 1);
    const syClamped = Math.min(sy, this.image.naturalHeight - 1);
    const sWidthClamped  = Math.min(sWidth,  this.image.naturalWidth  - sxClamped);
    const sHeightClamped = Math.min(sHeight, this.image.naturalHeight - syClamped);

    // Render to canvas
    const canvas = document.createElement("canvas");
    canvas.width = sWidthClamped;
    canvas.height = sHeightClamped;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      this.image,
      sxClamped, syClamped, sWidthClamped, sHeightClamped,
      0, 0, sWidthClamped, sHeightClamped
    );

    if (cropAsBase64) {
      return canvas.toDataURL("image/png");
    }
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }
}

