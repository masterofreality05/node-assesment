- Bug #1 
The first bug that I noticed is that we had no authenticateJWT middleware built in. 
This will be used to authenticate JSON web tokens in order to fulfill the correct use of our other authorization middleware functions. 
authenticateJWT function built in /helpers/middleware/auth.js
Incorporated into our app.js using app.use() and running on all routes, with or without further authentication middleware following it. 

-Bug #2
router.patch('/:username', authUser, requireLogin, requireAdmin)
Stated in the doc string of this route, that only an admin or the correct user for this user account can update (patch) the user data. 
As we can see requireAdmin middleware is used. 
This does not allow for the correct (non-admin) user to also update their account
solution is to build requireCorrectUserOrAdmin, middleware function. 
it exists in the patch route here but we can refactor this into middleware so that we can re-use the logic. 
    if (!req.curr_admin && req.curr_username !== req.params.username) {
      throw new ExpressError('Only that user or admin can edit a user.', 401);
This route also uses the middleware of requireLogin, which is now duplicated and refactored into our 
requireAdminOrCorrectUser middleware. Removing this middlewarefrom our route to avoid duplication. 

-Bug #3 
AuthUser middleware function, is being used on selected routes when explicitly called as one of the routes middleware functions. 
In bug number 1 I noticed there was no authenticateJWT middleware function built. Now I see that this logic is being handled  by authUser, but only on routes where it is called by name. 
I have refactored this in so that authenticateJWT runs on all routes, and if a valid token is passed, a corresponding middleware will recieve the payload when next() is called. 
This helps us use the payload of the token when passed in different ways, for example ensureAdmin, ensureLoggedIn, ensureCorrectUserOrAdmin. 

-Bug #4
When creating an admin user, the admin column defaults to false. 
Inspecting 
in helpers, createToken.js, admin=false. 
So with further inspection, I have INSERT INTO users via the terminal, and when I log in to recieve my token, admin reverts to false. We need to look at our auth/login route.
Login uses User.authenticate to validate the log in details, after that it uses "./helpers/createToken
to write and sign the token.The bug was that the admin property passed into this helper method was defaulted to false. 
This was now fixed by creating a seperate function that is excluded from any route to create admin. 


-Bug #5
Potentially a bug, that there are no unit tests of the class methods. 
Initializing user.test.js

-Bug #6
When searching for a user by username, if no userfound, 404 error is not handled and returned as JSON response, rather empty res object. Investigating
Class method User.get does not seem to throw an error if user does not exist in the db.
This is now fixed, the conditional logic to check if user is present in the DB existed, but the new Error which was being defined was not being thrown therefore not caught in our catch(err){} logic.
