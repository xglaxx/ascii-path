function isNumber(value) {
   value = Number(value);
   return (!isNaN(value) ? value : 0);
}
export default ((brightness, chars) => {
   brightness = isNumber(brightness);
   let normalized = (brightness / 255);
   normalized = Math.pow(normalized, 0.8);
   const index = Math.min(
      chars.length - 1,
      Math.floor(normalized * chars.length)
   );
   return chars[index];
});