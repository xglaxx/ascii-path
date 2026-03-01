import fs from "fs";
import SetMetadata from "./SetMetadata.js";
export default class ConfigMetadata extends SetMetadata {
   constructor(data) {
      super();
      this._set(data);
   }
   
   _set(data) {
      if (typeof data !== "object") throw data;
      if (!(data?.path && fs.existsSync(data.path))) throw data;
      
      this.path = data?.path;
      this.scale = data?.scale;
      this.chars = data?.chars;
      this.output = data?.output;
      this.fontSize = data?.fontSize;
      this.colorFont = data?.colorFont;
      this.colorChars = data?.colorChars;
      this.colorBackground = data?.colorBackground;
      const patExt = this.path.split(".").pop();
      const outExt = this.output.split(".").pop();
      if (patExt !== outExt) {
         this.output = this.output+(patExt === "mp4" ? ".mp4" : ".png");
      }
      this.changeFont(data?.font, data?.nameFont);
   }
}