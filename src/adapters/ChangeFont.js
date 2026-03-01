import fs from "fs";
import path from "path";
export default ((diretoryFont, nameFont, PImage) => {
   if (!(diretoryFont && diretoryFont.endsWith(".ttf") && fs.existsSync(diretoryFont))) return false;
   
   const fontName = (nameFont || path.basename(diretoryFont, ".ttf"));
   const font = PImage.registerFont(diretoryFont, fontName);
   font.loadSync();
   return fontName;
});