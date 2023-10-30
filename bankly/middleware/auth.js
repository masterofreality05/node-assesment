/** Middleware for handling req authorization for routes. */

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

/**
 *authenticateJWT will extract from req.headers
 */


//FIXES BUG #1 - allows for possible token interception on all routes, optional further 
//middleware can be applied to further specify
//which validation is necessary.

function authenticateJWT(req, res, next) {
  

  //token is attached under the req.header[authorization] and is inspected within this middleware function.
  //if payload data is returned from jwt.verify we set req.body._token and req.curr_username to the value
  //and then call next, which could be an authorization ensuring piece of middleware. 
  try {
    console.log("running authenticateJWT")
    const tokenFromBody = req.headers['authorization'];
    const payload = jwt.verify(tokenFromBody, SECRET_KEY);
  
    //conditional logic here could be useful in that admin?true? then set req.curr_admin?
    console.log("what is the payload of thistoken: " + payload.username)
    if(payload) req.body._token = tokenFromBody;
    if(payload.admin == true) req.curr_admin = payload //now working, only single equals means assigment *** 
    if(payload.username) req.curr_username = payload.username;
    console.log(payload.username)
    return next()
    
  } catch (err) {
    console.log(err)
    // error in this middleware isn't error -- continue on
    return next();
  }
}

/** Authorization Middleware: Requires user is logged in. */

function requireLogin(req, res, next) {
  try {
    console.log("running requireLogin")
    if (req.curr_username) {
      console.log(req.curr_username)
      return next();
    } else {
      return next({ status: 401, message: 'Unauthorized' });
    }
  } catch (err) {
    return next(err);
  }
}

/** Authorization Middleware: Requires user is logged in and is staff. */

function requireAdmin(req, res, next) {
  try {
    if (req.curr_admin) {
    
      return next();
    } else {
      return next({ status: 401, message: 'Unauthorized' });
    }
  } catch (err) {
    return next(err);
  }
}



/***Authentication for correct user to interact with their own data or also admin */
/**BUG FIX2, for selected Routes you can either be authorized as an Admin Or CorrectUser. */
function requireAdminOrCorrectUser(req, res, next) {
  try {
    console.log(req.curr_username)
    //if the payload of our authenticated JWT username matches the one in the query param or if there an admin assigned to our req.
    if (req.curr_username == req.params.username || req.curr_admin) {
      return next();
    } else {
      return next({ status: 401, message: 'Unauthorized' });
    }
  } catch (err) {
    return next(err);
  }
}

/** Authentication Middleware: put user on request
 *
 * If there is a token, verify it, get payload (username/admin),
 * and store the username/admin on the request, so other middleware/routes
 * can use it.
 *
 * It's fine if there's no token---if not, don't set anything on the
 * request.
 *
 * If the token is invalid, an error will be raised.
 *
 **/
/*

function authUser(req, res, next) {

  //we need to look at this this seems to duplicate authenticateJWT
  //it is currently not incorporate on every route (by use of app.use())
  //it is being called manually when explicitly stated in the routes middleware functions. 
  //this is something we want to run on all routes, whiuch authenticateJWT already is, 
  //will comment this out for now. 
 
  try {
    const token = req.body._token || req.query._token;
    if (token) {
      console.log("token was found in authUser middleware " + token)
      let payload = jwt.decode(token);
      req.curr_username = payload.username;
      req.curr_admin = payload.admin;
    }
    return next();
  } catch (err) {
    err.status = 401;
    return next(err);
  }
  
} */// end

module.exports = {
  requireLogin,
  requireAdmin,
  authenticateJWT,
  requireAdminOrCorrectUser
};
