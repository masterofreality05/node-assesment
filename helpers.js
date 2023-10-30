const single = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
const teens = ["eleven", "twelve", "thirteen","fourteen", "fifteen","sixteen","seventeen","eighteen","nineteen"]
const mult10 = ["padding","padding", "twenty","thirty","forty","fifty"]

function capitalize(str){
   return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {single, teens, mult10, capitalize}