function isNumber(val) {
   val = Number(val);
   return (!isNaN(val) ? val : 0);
}
export default ((value, total) => {
   total = isNumber(total);
   value = isNumber(value);
   value = Math.min(value, total);
   const result = Number((value / total) * 100).toFixed(2);
   return Math.min(result, 100.0);
});