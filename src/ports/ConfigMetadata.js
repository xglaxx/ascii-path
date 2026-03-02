import fs from "fs";
import SetMetadata from "./SetMetadata.js";
export default class ConfigMetadata extends SetMetadata {
   constructor(data) {
      super();
      this._set(data);
   }
   
   _set(data) {
      if (typeof data !== "object") throw data;
      
      this.dir = (data?.dir || "");
      this.path = (data?.path || "");
      this.scale = (data?.scale || 0);
      this.chars = (data?.chars || "");
      this.output = (data?.output || "");
      this.fontDir = (data?.fontDir || "");
      this.fontSize = (data?.fontSize || 0);
      this.colorFont = (data?.colorFont || "");
      this.colorChars = (data?.colorChars || "");
      this.colorBackground = (data?.colorBackground || "");
      this.changeFont(data?.font, data?.nameFont);
   }
}