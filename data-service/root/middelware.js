let jwt = require('jsonwebtoken');

const redis = require('redis');
const client = redis.createClient();

const config = require('./config');


let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];// Express headers are auto converted to lowercase
  
  if (token.startsWith('Bearer')) {
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
  
  let perm = {
    GET: ["view_data"],
    POST: ["create_data"],
    PUT: ["update_one_data", "update_all_data"],
    DELETE: ["delete_one_data", "delete_all_data"]
  }


  if (req.decoded) {
      let Data = req.decoded;
      let permission = Data.user.permission;
      let url = req.url;
      let split = url.split(/[.,\/ -]/);
      let urlData= split[1]; // ambil pada array ke 1
      
      let service = [];
      let method = [];
      let request_method = perm[req.method]; // ambil method dan bandingkan dengan array permission yg telah di definisikan
      let get_request_method;
      
      
      permission.forEach(val => {
        // ambil service2 yang terdafta di user
        service.push(val.service);
        if(val.service == urlData){
          // amil method ==> karena method adalah array maka dimasukan kedalam array variable lagi
          method = val.method
        }
      });
      
      //ambil request method GET,POST,PUT,DELETE yg telah di convert menjadi nama method
      //lalu bandingkan dengan methode yang ada di info user 
      //dan ambil salah satu nya dan simpan di get_request_method
      request_method.forEach(val =>{
          if(method.includes(val)){
            //jika true maka nama method simpan di variable    
            get_request_method = val;
            //simpan di reqest agar bisa d panggl global
            req.get_request_method = val;
          }
      });

      if(service.includes(urlData)){
      
        if(method.includes(get_request_method)){
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
 
  } else {
    return res.status(401).json({
            success: false,
            message: 'User not authorize'
           });
  }

          // console.log(service); 
          // console.log(method);
          // console.log(get_request_method); 

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
  //       let urlData= split[1]; // ambil pada array ke 1
        
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

  //       // console.log(service);
  //       // console.log(method);

  //     }
  //   });

}

module.exports = {
  checkToken: checkToken,
  checkAuthorize : checkAuthorize
}
