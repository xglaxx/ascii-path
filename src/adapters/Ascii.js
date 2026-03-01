import MapPixel from "./MapPixel.js";
import LengthFontChar from "./LengthFontChar.js";
function isNumber(value) {
   value = Number(value);
   return (!isNaN(value) ? value : 0);
}

export default ((PImage, { frame, make, width, height }, dataAscii) => {
   const chars = dataAscii.chars, scale = dataAscii.scale, colorFont = dataAscii.colorFont, colorChars = dataAscii.colorChars, colorBackground = dataAscii.colorBackground, fontSize = dataAscii.fontSize, fontName = dataAscii.fontName;
   const char = LengthFontChar({ fontSize, fontName }, PImage);
   const scaleX = scale, scaleY = Math.floor(scaleX * char.aspect);
   
   const ascii = [];
   const img = PImage.make(width, height);
   const ctx = img.getContext("2d");
   ctx.fillStyle = colorBackground;
   ctx.fillRect(0, 0, width, height);
   for (let y = 0; y < height; y += scaleY) {
      let lines = "";
      for (let x = 0; x < width; x += scaleX) {
         let r,g,b,pixel;
         if (make) {
            pixel = make.getPixelRGBA(x, y);
            r = (pixel >> 24) & 0xFF, g = (pixel >> 16) & 0xFF, b = (pixel >> 8) & 0xFF;
         } else {
            pixel= ((y * width + x) * 3); 
            r = isNumber(frame[pixel]), g = isNumber(frame[pixel+1]), b = isNumber(frame[pixel+2]);
         }
         
         const brightness = (0.2126 * r) + (0.7152 * g) + (0.0722 * b); //Novo
         const row = MapPixel(brightness, chars);
         if (colorChars) {
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.font = `${fontSize}pt `+fontName;
         }
         ctx.fillText(row, x, y);
         lines += row;
      }
      ascii.push(lines);
   }
   return { ascii, img };
});