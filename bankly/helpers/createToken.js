const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");


/** return signed JWT for payload {username, admin}. */

function createToken(username, admin) {

  //admin is undefined 
  let payload = {username, admin};
  //why is not signing admin into the jwt?
  return jwt.sign(payload, SECRET_KEY);
}


module.exports = createToken;