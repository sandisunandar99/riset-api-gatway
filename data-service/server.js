const express = require('express');
const bodyParser = require('body-parser');

let middleware = require('./root/middelware');
let connection = require('./root/connection');



class HandlerGenerator {
  index (req, res) {
      
    connection.query('select * from t_data', function(error, rows, field){
      if (error) {
        res.json({
          success: false,
          message: 'data error!',
          data: null
        });
      } else {
        res.json({
          success: true,
          message: 'data sukses!',
          data: rows
        }); 
      }
    });
  }

  find(req, res){
    let id = req.params.id;
    connection.query('select * from t_data where id=?',[id], function(error, rows, field){
      if (error) {
        res.json({
          success: false,
          message: 'data error!',
          data: error
        });
      } else {
        res.json({
          success: true,
          message: 'data sukses!',
          data: rows
        }); 
      }
    });
  }

  insert(req, res){
    let id = req.body.id;
    let title = req.body.title;
    let data = req.body.data;
    let inputer = req.body.inputer;
    
    // console.log(id + title + data);

    connection.query('insert into t_data values (?,?,?,?)',[id,title,data,inputer], function(error, rows, field){
      if (error) {
        res.json({
          success: false,
          message: 'data error!',
          data: error
        });
      } else {
        res.json({
          success: true,
          message: 'data sukses!',
          data: 'data berhasil di insert'
        }); 
      }
    });
  
  }

  update(req, res){

      let user = req.decoded;
      let username = user.user.username;
      let get_request_method = req.get_request_method;

      let id = req.params.id;
      let title = req.body.title;
      let data = req.body.data;
      

      if (get_request_method ==='update_one_data') {
        connection.query('update t_data set title=?, data=? where id=? and inputer=?',[title, data, id, username], function(error, rows, field){
          let get = JSON.stringify(rows);
          let get2 = JSON.parse(get);
  
          if (get2.affectedRows === 0) {
            res.json({
              success: false,
              message: 'silahkan edit data yang hanya milik anda!',
              data: error
            });
          } else {
            res.json({
              success: true,
              message: 'data sukses!',
              data: 'data berhasil di update!'
            }); 
          }
        });
      } else {
        connection.query('update t_data set title=?, data=? where id=?',[title, data, id], function(error, rows, field){
          if (error) {
            res.json({
              success: false,
              message: 'data error!',
              data: error
            });
          } else {
            res.json({
              success: true,
              message: 'data sukses!',
              data: 'data berhasil di update!'
            }); 
          }
        });
      }

     
  }

  delete(req, res){


    let user = req.decoded;
    let username = user.user.username;
    let get_request_method = req.get_request_method;

    let id = req.params.id;

    // console.log(get_request_method);
    
    if (get_request_method ==='delete_one_data') {
      connection.query('delete from t_data where id=? and inputer=?',[id, username], function(error, rows, field){
        let get = JSON.stringify(rows);
        let get2 = JSON.parse(get);

        if (get2.affectedRows === 0) {
          res.json({
            success: false,
            message: 'silakan hapus data yg hanya milik anda!',
            data: error
          });
        } else {
          res.json({
            success: true,
            message: 'data sukses!',
            data: 'data berhasil di delete!'
          }); 
        }
      });
    } else {
      connection.query('delete from t_data where id=?',[id], function(error, rows, field){
        if (error) {
          res.json({
            success: false,
            message: 'data error!',
            data: error
          });
        } else {
          res.json({
            success: true,
            message: 'data sukses!',
            data: 'data berhasil di delete!'
          }); 
        }
      });
    }
    
}

}

// Starting point of the server
function main () {
  let app = express(); // Export app for other routes to use
  let handlers = new HandlerGenerator();
  const port = process.env.PORT || 3003;
  app.use(bodyParser.urlencoded({ // Middleware
    extended: true
  }));
  app.use(bodyParser.json());
 

  // Routes & Handlers
  app.get('/data/index', middleware.checkToken, middleware.checkAuthorize, handlers.index);
  app.get('/data/find/:id', middleware.checkToken, middleware.checkAuthorize, handlers.find);
  app.post('/data/insert', middleware.checkToken, middleware.checkAuthorize, handlers.insert);
  app.put('/data/update/:id', middleware.checkToken, middleware.checkAuthorize, handlers.update);
  app.delete('/data/delete/:id', middleware.checkToken, middleware.checkAuthorize, handlers.delete);

  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();