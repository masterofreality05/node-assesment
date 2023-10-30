process.env.NODE_ENV = "test"

const app = require("../app");
const request = require("supertest");
const db = require("../db");
const bcrypt = require("bcrypt");
const createToken = require("../helpers/createToken");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const {authenticateJWT } = require("../middleware/auth")


// tokens for our sample users
const tokens = {};

beforeEach(async function() {
    async function _pwd(password) {
      return await bcrypt.hash(password, 1);
    }

    await db.query(`DELETE FROM users`);
  
    let sampleUsers = [
      ["u1", "fn1", "ln1", "email1", "phone1", await _pwd("pwd1"), false],
      ["u2", "fn2", "ln2", "email2", "phone2", await _pwd("pwd2"), false],
      ["u3", "fn3", "ln3", "email3", "phone3", await _pwd("pwd3"), true]
    ];
  
    for (let user of sampleUsers) {
      await db.query(
        `INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        user
      );
      tokens[user[0]] = createToken(user[0], user[6]);
    }
  });

 

  describe("Integration test:admin token and authorization:", function() {
    test("works: authenticating get all users which requires logged in verification",async function() {
        const token = await request(app)
        .post("/auth/login")
        .send({
          username: "u1",
          password: "pwd1"
        });
        console.log(token.body.token)

        const resp = await request(app)
        .get("/users/")
        .set({ authorization: token.body.token});
    
        expect(resp.body).toEqual({"users": [{"email": "email1", "first_name": "fn1", "last_name": "ln1", "phone": "phone1", "username": "u1"}, {"email": "email2", "first_name": "fn2", "last_name": "ln2", "phone": "phone2", "username": "u2"}, {"email": "email3", "first_name": "fn3", "last_name": "ln3", "phone": "phone3", "username": "u3"}]})
      
        
        })

        test("does not work: get all users route with invalid token", async function(){
            const resp = await request(app)
            .get("/users/")
            .set({ authorization: "incorrect"});
        
            expect(resp.body).toEqual({"message": "Unauthorized", "status": 401})


        })
        
        ;
       
          })
    
    //BUG TEST #1
    //as Authenticate JWT is used as middleware functions as part of our routes.
    //it has been incorporated into our integration tests for routes. 

     
     

      
     ;



  