const {single,teens, mult10, capitalize} = require("./helpers")

function numberToWordConverter(key, number){
  
    if(number < 1 && key == "minutes") return " O'clock"
    //need to fix this part, in the sense that it would currently output O clock passed 5 
    if(number < 1 && key == "hour") return "Midnight"
    if (number < 10) return single[parseInt(number)]

    if (number > 19){ let individual = number.split("")
return mult10[individual[0]] + " " + single[individual[0]]
}  
    if (number > 10) return teens[number - 11]
}

function timeWord(time){
    let words = []; 
    const regex24 = new RegExp('^([0-1][0-9]|2[0-3]):[0-5][0-9]$')
   //lets first validate a correct input to avoid preventable errors. 
   if(regex24.test(time)){

    let hoursAndMinutes = time.split(":")
    let timeObject = {hour: hoursAndMinutes[0],
        minutes: hoursAndMinutes[1]
    }

   if(Number(timeObject.hour) >= 12) timeObject.hour = Number(timeObject.hour) -12
   if(Number(timeObject.hour == 0) && Number(timeObject.minutes) == 0) return `Midnight`
   
   if(Number(timeObject.minutes) == 0) return `${capitalize(numberToWordConverter("hour", Number(timeObject.hour)))}${numberToWordConverter("minutes", Number(timeObject.minutes))}`
    
    Object.entries(timeObject).forEach(entry => {
    const [k,v] = entry
    letters = numberToWordConverter(k,v)
 
    words.push(capitalize(letters))
   
    })

    return words[1] + " past " + words[0]
   } else {
    return "Error: the time inputted was invalid"
   }


}

console.log(timeWord("00:54"))
console.log(timeWord("23:00"))

module.exports = timeWord;
