const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 


const jwt = require('jsonwebtoken');
const redis = require('redis');
const client = redis.createClient();

let config = require('./root/config');
let middleware = require('./root/middelware');

class HandlerGenerator {
   login (req, res) {
    let app = express();

    let username = req.body.username;
    let password = req.body.password;
    // For the given username fetch user from DB
    let mockedUsername = 'admin';
    let mockedPassword = '123456';

    if (username && password) {
      if (username === mockedUsername && password === mockedPassword) {
      
        let User = {
            id: 3,
            username: 'admin',
            firstname: 'sandi',
            lastname: 'sunandar',
             roles:{
                id: 10,
                name: 'ketuaRW',
             },
            //  permission: ['GET'], //--metode pertama
             permission: [
               {service : 'data', method: ['GET','POST']},
               {service : 'product', method: ['POST']}
             ]     
        }

        /**
         * jika generate user info di simpan di token
         */
        // let token = jwt.sign(User,
        //   config.secret,
        //   { expiresIn: '24h' // expires in 24 hours
        //   }
        // );

        let token = jwt.sign({username: username},
          config.secret,
          { expiresIn: '24h' // expires in 24 hours
          }
        );
      
        client.setex('userid', 3600, JSON.stringify(User));
        // client.setex('userid:'+User.id, 3600, JSON.stringify(User));
        
        // app.use(session({
        //   user: User
        // }));

        app.use(cookieParser());
        res.cookie('cookieData',User, { maxAge: 900000, httpOnly: true });
      
  
        res.json({
          success: true,
          message: 'Authentication successful!',
          user: User,
          token: token
        });
      } else {
        res.sendStatus(403).json({
          success: false,
          message: 'Incorrect username or password'
        });
      }
    } else {
      res.sendStatus(400).json({
        success: false,
        message: 'Authentication failed! Please check the request'
      });
    }
  }
   index (req, res) {
    let app = express();
    app.use(cookieParser());

    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)

    res.json({
      success: true,
      message: 'get cookies',
      data: req.cookies.cookieData
    });
  }
}

// Starting point of the server
function main () {
  let app = express(); // Export app for other routes to use
  let handlers = new HandlerGenerator();
  const port = process.env.PORT || 3001;
  app.use(bodyParser.urlencoded({ // Middleware
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(cookieParser());
 
  // Routes & Handlers
  app.post('/login', handlers.login);
  app.get('/index', middleware.checkToken, handlers.index);
  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();