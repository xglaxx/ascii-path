import fs from "fs";
import path from "path";
const asciiChars = {
   minimalist: "#+-.",
   normal: "@%#*+=-:.",
   normal2: "&$Xx+;:.",
   normal3: " .,-:;+=*?%$#@",
   alphabetic: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
   alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz",
   numerical: "0896452317",
   extended: "@%#{}[]()<>^*+=~-:.",
   math: "+-\xd7\xf7=≠≈∞√π",
   arrow: "↑↗→↘↓↙←↖",
   grayscale: "@$BWM#*oahkbdpwmZO0QCJYXzcvnxrjft/|()1{}[]-_+~<>i!lI;:,\"^`'.",
   max: "\xc6\xd1\xcaŒ\xd8M\xc9\xcb\xc8\xc3\xc2WQB\xc5\xe6#N\xc1\xfeE\xc4\xc0HKRŽœXg\xd0\xeaq\xdbŠ\xd5\xd4A€\xdfpm\xe3\xe2G\xb6\xf8\xf0\xe98\xda\xdc$\xebd\xd9\xfd\xe8\xd3\xde\xd6\xe5\xff\xd2b\xa5FD\xf1\xe1ZP\xe4š\xc7\xe0h\xfb\xa7\xddkŸ\xaeS9žUTe6\xb5Oyx\xce\xbef4\xf55\xf4\xfa&a\xfc™2\xf9\xe7w\xa9Y\xa30V\xcdL\xb13\xcf\xcc\xf3C@n\xf6\xf2s\xa2u‰\xbd\xbc‡zJƒ%\xa4Itoc\xeerjv1l\xed=\xef\xec<>i7†[\xbf?\xd7}*{+()/\xbb\xab•\xac|!\xa1\xf7\xa6\xaf—^\xaa„”“~\xb3\xba\xb2–\xb0\xad\xb9‹›;:’‘‚’˜ˆ\xb8…\xb7\xa8\xb4`",
   codepage437: "█▓▒░",
   codepage437v2: "░▒▓█",
   blockelement: "█"
};
export default class SetMetadata {
   constructor() {
      this._path = "";
      this._scale = 8;
      this._fontSize = 12;
      this._colorChars = false;
      this._colorFont = "white";
      this._chars = asciiChars.normal3; // São caracteres para o nível de brilho/densidade.
      this._colorBackground = "black";
      this._output = "tmp/ascii-"+Date.now();
   }
   
   isNumber(value) {
      value = Number(value);
      return (!isNaN(value) ? value : 0);
   }
   
   get path() {
      return this._path;
   }
   set path(dirFile) {
      if (!fs.existsSync(dirFile)) {
         console.error("path-error:", "ARQUIVO NÃO ENCONTRADO =", dirFile);
      }
      
      this._path = dirFile;
      this.output = this._output;
   }
   
   get listChars() {
      return Object.keys(asciiChars);
   }
   set listChars(value) { }
   
   get fontSize() {
      return this._fontSize;
   }
   set fontSize(value) {
      value = Number(value);
      this._fontSize = ((value > 0) ? value : this._fontSize);
   }
   
   get colorChars() {
      return this._colorChars;
   }
   set colorChars(boolean) {
      this._colorChars = (typeof boolean === 'boolean' ? boolean : this._colorChars);
   }
   
   get output() {
      return this._output;
   }
   set output(fileName) {
      if (this.dir) {
         this._output = path.join(this.dir, (fileName || this._output));
         if (this.path) {
            const patExt = this.path.split(".").pop();
            const outExt = this._output.split(".").pop();
            if (patExt !== outExt) {
               this._output = this._output+(patExt === "mp4" ? ".mp4" : ".png");
            }
         }
      }
   }
   
   get chars() {
      return this._chars;
   }
   set chars(tag) {
      this._chars = (typeof tag === 'string' && (tag in asciiChars) ? asciiChars[tag] : this._chars);
   }
   
   get colorFont() {
      return this._colorFont;
   }
   set colorFont(value) {
      this._colorFont = (typeof value === 'string' && value ? value : this._colorFont);
   }
   
   get colorBackground() {
      return this._colorBackground;
   }
   set colorBackground(value) {
      this._colorBackground = (typeof value === 'string' && value ? value : this._colorBackground);
   }
   
   get scale() {
      return this._scale;
   }
   set scale(value) {
      value = this.isNumber(value);
      this._scale = (value > 0 ? value : this._scale);
   }
   
}