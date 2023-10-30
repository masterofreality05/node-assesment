const timeWord = require('./timeWord');

describe('#timeword', () => {

  test('it is a function', () => {
    expect(typeof timeWord).toBe('function');
  });
});

describe('testing our regex validator', () => {

  test('works: correct time input', () => {
    expect(timeWord("12:12")).toEqual("Twelve past Midnight")
  })

  test('does not work: incorrect input (letters)', () => {
    expect(timeWord("1b:aaa2")).toEqual("Error: the time inputted was invalid")
  })

})

describe('testing our integrated time converter w/helper function', () => {
  test('works: functioning 24 hour clock (numbers over 12', () => {
    expect(timeWord("23:12")).toEqual("Twelve past Eleven")
  })
  test('works: functioning for a 00:00 time read', () => {
    expect(timeWord("00:00")).toEqual("Midnight")
  })
  
  test('works: converting AM time which contains leading zeroes', ()=> {
    expect(timeWord("07:12")).toEqual("Twelve past Seven")
   
  })

  test('does not work: incorrect time input: hours exceed 23', () => {
    expect(timeWord("26:00")).toEqual("Error: the time inputted was invalid")
  })

  test('does not work: incorrect time input: time exceed 59', () => {
    expect(timeWord("11:88")).toEqual("Error: the time inputted was invalid")
  })

  
})



