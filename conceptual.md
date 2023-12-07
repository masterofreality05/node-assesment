### Conceptual Exercise

Answer the following questions below:

- What is a JWT?

JWT stands for Javascript web token. It is a signed and verified encrypted code which consists a header section, which contains metadata about the token and the cryptographic algorithims used to secure its contents, further it also contains the section of a "payload" which means a body of information and a digital signature which is featuring the encrypted secret key which is specified in the configuration of the server which creates the token. It is used primarily for authorization, of routes, to determine whether the user of the server is logged in, an admin, or possibly the correct user for the intended purpose.

- What is the signature portion of the JWT?  What does it do?

The signature portion of a JWT consists of a digital signature from the provider which contain s in its makeup a secret key. The function of the signature is to prove that the JWT is valid for the server, and that it has not been tampered with or falsified.

- If a JWT is intercepted, can the attacker see what's inside the payload?
JWTs are not encrypted but encoded. Therefore anyone who intercepts a JWT can read its payload (body of information)
Using the method such as jwt.decode(token) or an online decoder, the information can be visible to anyone, with or without the secret key which makes up the signature section.
In order to use a JWT for verification (JWT.verify(token, secret-key) the key is required therefore anyone who intercepts the token can view its data but cannot use just the token itself to forge authorization.

- How can you implement authentication with a JWT?  Describe how it works at a high level.
JWT tokens, as stated previously, consist of encoded data (payload) and a signature, which ensures a valid token for the server in conjunction with a secret key set in the servers configuration.
When we use JWT.decode(token) we can see the payload data, this can be intercepted by anyone as stated previously.
When we user JWT.verify(token,secret-key) The secret key (which should remain a secret!) is used in part to verify and authorize the correct user is acccessing the route. When using JWT.verify with the token and correct secret key, we will recieve back the payload which has been encoded.
If the secret key is incorrect, it will throw an error,
If the method does not throw an error and returns our payload, we can consider the data passed to be verified, therefore achieving verification.


- Compare and contrast unit, integration and end-to-end tests.
Unit testing is the testing of individual units, for example functions, methods etc.
In the case of a PostgreSQL driven Node API, each database table in the node interface could include classes, with static class methods such as, get, create, delete, update. To test these methods would be unit testing.
Integration testing focuses more on testing multiple "units" together to fulfill a more higher order function. For example in our PostgreSQL node server, we would have routes, which when visited by the client may call on the static methods we have mentioned previously. Therefore when we test this route we are testing both the route and the methods found within, therefore it is an integration test.
End to end testing refers to the testing of an entire piece of software all together, including the front end and mostly from a client(user) perspective.

- What is a mock? What are some things you would mock?
Mocking is common in unit testing.
Mocks are used primarily in unit testing. From time to time objects that are being used in a test could have complex dependencies, Mocking is a way to simulate the behaviour of the item that we want to test, this is especially useful when the actual object to test is impractical (e.g) the object for testing is the result of an external API request, which could cost money depending on the server.


- What is continuous integration?
Continuous integration is the practice of automating the integration of code changes from multiple contributors, into a single project. It allows developers to frequently merge code changes into a central repository where builds and tests then run. Automated tools are used to assert the new codes correctness before integrating.
Continuos integration refers to merging in small code changes frequently over time instead of merging one largechange at the end of a session or developmental cycle.

- What is an environment variable and what are they used for?
An enviroment variable is a user definable value (a variable) that can affect the way proccesses will run on a computer. For example we could set the enviroment with process.env == "Test", which in the corresponding file, we could use if statement to determine if(process.env =="test") then set db. to "test_db§ instead of simply "db.


- What is TDD? What are some benefits and drawbacks?
TDD stands for Test Driven Development, it refers to the practice of writing tests (units, integration) before creating the units or integrated units themselves. Of course the tests will fail, it is then the next step to build the unit to correspond and pass the test. With TDD we only write the necessary code to get the test to pass. Once we can get the function to pass the test, we can always continue to refactor.

- What is the value of using JSONSchema for validation?
JSONschema is a powerful tool for validating the structure of JSON data passed in. This can prevent errors, in that we can validate the JSON data of a route before sending the data to a potential function or method that for example interacts with a DB via SQL, this could prevent errors that could easily be avoidable at the first possible hurdle.

- What are some ways to decide which code to test?
It would be very important to test all the routes, with correct input data, and the outcome of what happens when our input is incorrect. Furthermore it would be very important to test the units which make up the integrated result of these routes.

- What does `RETURNING` do in SQL? When would you use it?
When we make a SQL request with RETURNING it will provide as the return value of the request, the columns which we specify (or * for all columns) We would often use this with create/update requests. Where we would like to see the row we have created/updated. We could access this returned data like so, console.log(requestExample.rows[0])

- What are some differences
- between Web Sockets and HTTP?
A Web socket is a computer communications protocol that allows simultaneous communication between two parties. The difference between  Web sockets and HTTP (Hyper text transfer protocol) is that with HTTP for each new piece of information, a new request needs to be made.

- Did you prefer using Flask over Express? Why or why not (there is no right
  answer here --- we want to see how you think about technology)?
I prefered Flask initially as I found it to be more intuitive and easier to use.
Express certainly has a higher learning curve, but its approach to handling errors is in my opinion more open ended and comprehensive.
As I become more familiar with Express, I see its potential, but I would be lying if I said its open-endedness didnt intimidate me at first. 
