/** User related routes. */

const User = require('../models/user');
const express = require('express');
const router = new express.Router();
const ExpressError = require('../helpers/expressError');
const {requireLogin, requireAdmin,requireAdminOrCorrectUser } = require('../middleware/auth');

/** GET /
 *
 * Get list of users. Only logged-in users should be able to use this.
 *
 * It should return only *basic* info:
 *    {users: [{username, first_name, last_name}, ...]}
 *
 */


//lets read our routes, docstrings and leavecomments
/*
{
	"users": [
		{
			"username": "bill",
			"first_name": "bill",
			"last_name": "massy",
			"email": "b@m.ie",
			"phone": "29991"
		}
	]
}
//i see no bug with this route. 

//only logged in users should be abvle to use this, therefore we use our requireLogin middleware. */

router.get('/', requireLogin, async function(req, res, next) {
  // i set a token in the header but still unauthorized
  //inspecting the requireLogin middleware. 
  try {
    console.log("running get all route")
    //to inspect our User.getAll() static method
    let users = await User.getAll();
    //User.getAll() returns result.rows

    return res.json({ users });
  } catch (err) {
    return next(err);
  }
}); // end

/** GET /[username]
 *
 * Get details on a user. Only logged-in users should be able to use this.
 *
 * It should return:
 *     {user: {username, first_name, last_name, phone, email}}
 *
 * If user cannot be found, return a 404 err.
 *
 * //here we are using the middleware of authUser
 */
//seems to be working fine. 
router.get('/:username', requireLogin, async function(req,res, next) {
  try {
    let user = await User.get(req.params.username);
    //user.get does not seem to throw an error if user does not exist in the db.
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[username]
 *
 * Update user. Only the user themselves or any admin user can use this.
 *
 * It should accept:
 *  {first_name, last_name, phone, email}
 *
 * It should return:
 *  {user: all-data-about-user}
 *
 * It user cannot be found, return a 404 err. If they try to change
 * other fields (including non-existent ones), an error should be raised.
 *
 */


//potential bug here is that we need to authUser, must be logged in and an addmin
//if we want to update a user maybe it is best to be an admin or that correct user
//perhaps a refactoring of middle ware to ensureCorrectUserOrAdmin is appropriate here. 
//its possible also that requireLogin is unecessary
router.patch('/:username', requireAdminOrCorrectUser, async function(req,res,next) {
  try {
   
    // get fields to change; remove token so we don't try to change it
    let fields = { ...req.body};
    delete fields._token;

    let user = await User.update(req.params.username, fields);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
}); // end

/** DELETE /[username]
 *
 * Delete a user. Only an admin user should be able to use this.
 *
 * It should return:
 *   {message: "deleted"}
 *
 * If user cannot be found, return a 404 err.
 */

router.delete('/:username', requireAdmin, async function(
  req,
  res,
  next
) {
  console.log("running our delete route")
  try {
    
    console.log(req.params.username)
    User.delete(req.params.username);
    return res.json({ message: 'deleted' });
  } catch (err) {
    return next(err);
  }
}); // end

module.exports = router;
