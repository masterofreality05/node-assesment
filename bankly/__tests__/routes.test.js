// Set ENV VAR to test before we load anything, so our app's config will use
// testing settings

process.env.NODE_ENV = "test"


const app = require("../app");
const request = require("supertest");

const db = require("../db");
const bcrypt = require("bcrypt");
const createToken = require("../helpers/createToken");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

// tokens for our sample users
const tokens = {};

/** before each test, insert u1, u2, and u3  [u3 is admin] */



beforeEach(async function() {
  //whats happening here?
  let clear_testdb = await db.query(`
  DELETE FROM users`)
  async function _pwd(password) {
    //async function to create a hashedpw
    return await bcrypt.hash(password, 1);
  }


  let sampleUsers = [
    //array of 3 sub arrays with details to be for looped through and INSERT INTO db
    ["u1", "fn1", "ln1", "email1", "phone1", await _pwd("pwd1"), false],
    ["u2", "fn2", "ln2", "email2", "phone2", await _pwd("pwd2"), false],
    ["u3", "fn3", "ln3", "email3", "phone3", await _pwd("pwd3"), true]
  ];

  for (let user of sampleUsers) {
    await db.query(
      `INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      user
    );
    //tokens is initializedc as an empty object
    //this is still within the for loop
    //for each user create a property on tokens with the username and assign value of createtoken 
    //create token requires arguments username and admin to create the token 
    tokens[user[0]] = createToken(user[0], user[6]);
    //this creates an object of all tokens, key=username value = signed token.
  }
});

describe("POST /auth/register", function() {
  test("should allow a user to register in", async function() {
    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "new_user",
        password: "new_password",
        first_name: "new_first",
        last_name: "new_last",
        email: "new@newuser.com",
        phone: "1233211221"
      });
      console.log(response.body)
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ token: expect.any(String) });
    console.log("resp:body is " + response.body.token) //token

    let { username, admin } = jwt.verify(response.body.token, SECRET_KEY);
    console.log(username) //working
    expect(username).toBe("new_user");
    expect(admin).toBe(undefined); //coming out undefined
  });

  test("should not allow a user to register with an existing username", async function() {
    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "u1",
        password: "pwd1",
        first_name: "new_first",
        last_name: "new_last",
        email: "new@newuser.com",
        phone: "1233211221"
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      status: 400,
      message: `There already exists a user with username 'u1'`
    });
  });
  
});


describe("POST /auth/login", function() {
  test("should allow a correct username/password to log in", async function() {
    const response = await request(app)
      .post("/auth/login")
      .send({
        username: "u1",
        password: "pwd1"
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ token: expect.any(String) });

    let { username, admin } = jwt.verify(response.body.token, SECRET_KEY);
    expect(username).toBe("u1");
    expect(admin).toBe(false);
  });
});


describe("GET /users", function() {
  test("should deny access if no token provided", async function() {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(401);
  });

  test("should list all users: admin auth required", async function() {
    const response = await request(app)
      .get("/users")
      .set({authorization:tokens["u3"]});
    expect(response.statusCode).toBe(200);
    expect(response.body.users.length).toBe(3);
  });
});


describe("GET /users/[username]", function() {
  test("does not work: should deny access if no token provided", async function() {
    const response = await request(app).get("/users/u1");
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized")
  });

  //BUG TEST #6 correct error thrown.
  test("does not work: notFoundError if incorrect username in query", async function() {
    const response = await request(app).get("/users/incorrectuser")
                                       .set({authorization:tokens["u3"]})
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('No such user')
  });

  

  test("does not work: should deny access incorrect user token", async function() {
    const response = await request(app).get("/users/u1")
                                       .set({authorization:"incorrect token"});
    expect(response.statusCode).toBe(401);
  });

  test("works: return data on u1: with u1 token (correct user)", async function() {
    const response = await request(app)
      .get("/users/u1")
      .set({authorization:tokens["u1"]})
      ;
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1"
    });
  });

  test("works: return data on u1: with u3 token (admin user)", async function() {
    const response = await request(app)
      .get("/users/u1")
      .set({authorization:tokens["u3"]})
      ;
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1"
    });
  });
});

describe("PATCH /users/[username]", function() {
  //BUG TEST #2 unauthorized: no token, not admin or correct user
  //works: authorized when correct user or admin
  test("does not work: should deny access if no token provided", async function() {
    const response = await request(app).patch("/users/u1");
    expect(response.statusCode).toBe(401);
  });

  test("does not work: should deny access if not admin/right user", async function() {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u2 }); // wrong user!
    expect(response.statusCode).toBe(401);
  });

  test("works: should patch data if admin", async function() {
    const response = await request(app)
      .patch("/users/u1")
      .send({first_name: "new-fn1" })
      .set({authorization:tokens["u3"]}); // u3 is admin
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "new-fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1",
      admin: false,
      password: expect.any(String)
    });
  });

  test("works: should patch data if correct user", async function() {
    const response = await request(app)
      .patch("/users/u1")
      .send({first_name: "new-fn1" })
      .set({authorization:tokens["u1"]}); // u3 is admin
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "new-fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1",
      admin: false,
      password: expect.any(String)
    });
  });
  //BUG #4 Demonstrating the use of JWT validator on all routes
  //here is an example of the authenticateJWT middleware used in conjunction with next
  //next calling the second middleware which interprets the payload data of authenticateJWT
  //if the username = the passed username in the query parameter, or if amin=true on the payload data
  //then authorized
  //otherwise unauthorized.
  test("unauthorized: should disallowing patching not-allowed-fields", async function() {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u1, admin: true });
    expect(response.statusCode).toBe(401);
  });

  test("does not work: should return 404 if cannot find", async function() {
    const response = await request(app)
      .patch("/users/not-a-user")
      .send({first_name: "new-fn" })
      .set({authorization:tokens["u3"]}); // u3 is admin
    expect(response.statusCode).toBe(404);
  });
  
});


describe("DELETE /users/[username]", function() {
  test("unauthorized: should deny access if no token provided", async function() {
    const response = await request(app).delete("/users/u1");
    expect(response.statusCode).toBe(401);
  });

  test("does not work: should deny access if not admin", async function() {
    const response = await request(app)
      .delete("/users/u1")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(401);
  });


  test("works: should allow if admin", async function() {
    const response = await request(app)
      .delete("/users/u1")
      .set({authorization:tokens["u3"]}); // u3 is admin
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "deleted" });
  });
  
});


afterAll(function() {
  db.end();
});
