# PureJsCropper

A lightweight, dependency-free image cropper built with **vanilla JavaScript**.  
Easily integrate cropping functionality into your web apps without needing heavy frameworks or external libraries.

---

## ✨ Features
- 📷 Crop images with a simple UI
- 🔄 Drag to reposition crop area
- 📐 Resize crop area dynamically
- 💾 Export cropped image as `base64` or `Blob`
- 🪶 No dependencies – pure JavaScript

---

## 🚀 Installation

### CDN or Local Directory
```html
<script src="./PureJsCropper.js"></script>
```

## Usage in Vanilla JS
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="cropper"></div>
    <button id="cropBtn">Crop</button>
    <img id="result" />
    
    <script type="module">
        import PureJsCropper from "./PureJsCropper.js";

        const cropper = new PureJsCropper(document.getElementById("cropper"), {
            width: "100%",
            height: "100%"
        });

        cropper.loadImage("animals.jpg");

        document.getElementById("cropBtn").addEventListener("click", () => {
            const cropped = cropper.crop();
            document.getElementById("result").src = cropped;
        });
    </script>
</body>
</html>
```

## Usage in Angular
```html
You can integrate **PureJsCropper** into your Angular project like this:
```

```typescript
// app.component.ts
import { Component, AfterViewInit } from '@angular/core';

declare var PureJsCropper: any; // Import global library

@Component({
  selector: 'app-root',
  template: `
    <div class="cropper-container">
      <img id="image" src="assets/sample.jpg" />
      <button (click)="crop()">Crop</button>
      <div *ngIf="croppedImage">
        <h3>Cropped Result:</h3>
        <img [src]="croppedImage" />
      </div>
    </div>
  `
})
export class AppComponent implements AfterViewInit {
  croppedImage: string | null = null;
  cropper: any;

  ngAfterViewInit() {
    const image = document.getElementById('image') as HTMLImageElement;
    this.cropper = new PureJsCropper(image, { aspectRatio: 1 });
  }

  crop() {
    const canvas = this.cropper.getCroppedCanvas();
    this.croppedImage = canvas.toDataURL('image/png');
  }
}
