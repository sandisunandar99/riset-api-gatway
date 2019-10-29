let jwt = require('jsonwebtoken');

const redis = require('redis');
const client = redis.createClient();

const config = require('./config');

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];// Express headers are auto converted to lowercase

  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};


let checkAuthorize = (req, res, next) =>{
  
  if (req.decoded) {
      let Data = req.decoded;
      let permission = Data.user.permission;
      let url = req.url;
      let split = url.split(/[.,\/ -]/);
      let urlData= split[1]; // ambil pada array ke 1
      
      let service = [];
      let method = [];

      permission.forEach(val => {
        service.push(val.service);
        if(val.service == urlData){
          method = val.method
        }
      });
      
      if(service.includes(urlData)){
        if(method.includes(req.method)){
          next();
        }else{
          return res.status(401).json({
            success: false,
            message: 'User not authorize'
          });
        }
      }else{
        return res.status(401).json({
          success: false,
          message: 'User not authorize'
        });
      }

      // console.log(service);
      // console.log(method);

  } else {
    return res.status(401).json({
            success: false,
            message: 'User not authorize'
           });
  }


  /**
   * methode autorize dengan mengambil informasi dari redis
   */
  // client.get('userid', function(err, data){
  //     if(err){
  //       console.log(err);
  //     }else{
       
  //       /*
  //        * cara autorize metode pertama 
  //        */
  //       // let js = JSON.parse(data);
  //       // let arr = js.permission;

  //       // console.log(arr[0]);

  //       // if(arr.includes(req.method)){
  //       //   next();
  //       // }else{
  //       //   return res.json({
  //       //     success: false,
  //       //     message: 'User not authorize for this metod'
  //       //   });
  //       // }
      
  //        /*
  //        * cara autorize metode kedua
  //        */
  //       let js = JSON.parse(data);
  //       let arr = js.permission;
  //       let url = req.url;
  //       let split = url.split(/[.,\/ -]/);
  //       let urlData= split[1]; // ambil pada array 1
  //       let service = [];
  //       let method = [];

  //       arr.forEach(val => {
  //         service.push(val.service);
  //         if(val.service == urlData){
  //           method = val.method
  //         }
  //       });
        
  //       if(service.includes(urlData)){
  //         if(method.includes(req.method)){
  //           next();
  //         }else{
  //           return res.status(401).json({
  //             success: false,
  //             message: 'User not authorize'
  //           });
  //         }
  //       }else{
  //         return res.status(401).json({
  //           success: false,
  //           message: 'User not authorize'
  //         });
  //       }
  //       // console.log(service.includes(urlData));
  //       // console.log(service);
  //       // console.log(method);

  //     }
  //   }); 
    
}


module.exports = {
  checkToken: checkToken,
  checkAuthorize : checkAuthorize
}
