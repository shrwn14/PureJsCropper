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

<img width="406" height="634" alt="image" src="https://github.com/user-attachments/assets/9baf7836-426f-45af-9dae-b59d1ab38657" />

## 🚀 Installation

### CDN or Local Directory

```html
<script src="./PureJsCropper.js"></script>
```

### From NPM

```html
npm i pure-js-cropper
```

## Usage in Vanilla JS

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="cropper"></div>
    <button id="cropBtn">Crop (base64)</button>
    <button id="cropBtnBlob">Crop (Blob)</button>
    <img id="result" />

    <script type="module">
      import PureJsCropper from "./PureJsCropper.js";

      const cropper = new PureJsCropper(document.getElementById("cropper"), {
        width: "100%",
        height: "",
      });

      cropper.loadImage("cups.jpg");

      document.getElementById("cropBtn").addEventListener("click", () => {
        const cropped = cropper.crop();
        document.getElementById("result").src = cropped;
      });

      document.getElementById("cropBtnBlob").addEventListener("click", () => {
        cropper.crop(false).then((blob) => {
          const url = URL.createObjectURL(blob);
          document.getElementById("result").src = url;
          console.log("Cropped image in Blob output");
        });
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
import { Component, OnInit } from "@angular/core";
import PureJsCropper from "pure-js-cropper";

@Component({
  selector: "app-root",
  template: `
    <div id="img-cropper"></div>
    <button type="button" (click)="filePic.click()">Browse...</button>
    <br />
    <button type="button" (click)="onCrop()">Crop</button>
    <br />
    <img [src]="croppedImg" />
    <span style="display:none">
      <input
        type="file"
        id="filePic"
        name="filePic"
        #filePic
        accept="image/*"
        (change)="onFileChanged($event)" />
      <span> </span
    ></span>
  `,
})
export class AppComponent implements OnInit {
  cropper: PureJsCropper | null = null;
  croppedImg: string;

  ngOnInit(): void {
    this.cropper = new PureJsCropper(document.getElementById("img-cropper"), {
      width: "100%",
      height: "",
      zoomStep: 0.2,
    });
  }

  onFileChanged(event: any): void {
    event.preventDefault();

    if (event && event.target) {
      const _target: any = event.target;
      const reader = new FileReader();
      const valid_images = [".jpeg", ".jpg", ".png", ".bmp"];

      reader.readAsDataURL(_target.files[0]);

      reader.onload = () => {
        const fname = _target.files[0].name.toLowerCase();
        const ext = fname.substr(fname.lastIndexOf("."));

        if (valid_images.indexOf(ext) === -1) {
          console.log("Unsupported file type.");
          return;
        }

        this.cropper.loadImage(reader.result.toString());
      };

      reader.onerror = (error) => {
        console.log("upload-error: ", error);
      };
    }
  }

  onCrop(): void {
    this.croppedImg = this.cropper.crop();
  }
}
```
