const listFontChar = {};
export default (({ fontSize, fontName }, PImage) => {
   const tag = `${fontName}-${fontSize}`;
   if (!(tag in listFontChar)) {
      const temp = PImage.make(10, 10);
      const tctx = temp.getContext("2d");
      tctx.font = `${fontSize}pt `+fontName;
      const width = tctx.measureText("M").width; // Largura
      const height = fontSize; // altura
      const aspect = (height / width);
      listFontChar[tag] = { width, height, aspect };
   }
   
   return listFontChar[tag];
});