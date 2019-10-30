const express = require('express');
// const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 


const jwt = require('jsonwebtoken');
// const redis = require('redis');
// const client = redis.createClient();

let config = require('./root/config');
let middleware = require('./root/middelware');

class HandlerGenerator {
   login (req, res) {
    let app = express();

    let username = req.body.username;
    let password = req.body.password;
    
    
    let mockedUsername = ['provinsi','kecamatan','desa'];
    let mockedPassword = '123456';

    if (username && password) {
      if (mockedUsername.includes(username) && password === mockedPassword) {
      // if (username === mockedUsername && password === mockedPassword) {
      
        let User;

        switch (username) {
          case 'provinsi':
            User = {
              id: 3,
              username: 'provinsi',
              firstname: 'provinsi',
              lastname: 'provinsi',
              roles:{ id: 1, name: 'admin',},
              permission: [
                {service : 'ALL', method: ['ALL']},
              ]
            }
            break;
          case 'kecamatan':
              User = {
                id: 3,
                username: 'kecamatan',
                firstname: 'kecamatan',
                lastname: 'kecamatan',
                roles:{ id: 10, name: 'kecamatan',},
                permission: [
                  {service : 'data', method: ['view_data','create_data','update_all_data','delete_one_data']},
                  {service : 'product', method: ['view_product','create_product','delete_one_product']},
                ]   
              }
              break;
          case 'desa':
              User = {
                id: 3,
                username: 'desa',
                firstname: 'desa',
                lastname: 'desa',
                roles:{ id: 10, name: 'ketuaRT',},
                permission: [
                  {service : 'data', method: ['view_data','create_data','delete_one_data']},
                  {service : 'product', method: ['view_product']}
                ]    
              }
              break;
          default:
            break;
        }

        // simpan data user di token JWT
        let token = jwt.sign({user: User},
          config.secret,
          { expiresIn: '24h' // expires in 24 hours
          }
        );
      
        // simpan info user d redis
        //client.setex('userid', 3600, JSON.stringify(User));
        

        // simpan info user di cookies
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
  app.get('/index', handlers.index);
  // app.get('/index', middleware.checkToken, handlers.index);
  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();