const express = require('express');
const bodyParser = require('body-parser');
let middleware = require('./root/middelware');
let connection = require('./root/connection');



class HandlerGenerator {
  index (req, res) {
    connection.query('select * from t_product', function(error, rows, field){
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
    let id = req.body.id;
    connection.query('select * from t_product where id=?',[id], function(error, rows, field){
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

  insert(req, res){
    let id = req.body.id;
    let product = req.body.product;
    let description = req.body.product;
    let inputer = req.body.inputer;
    // console.log(id + title + data);

    connection.query('insert into t_product values (?,?,?,?)',[id,product,description,inputer], function(error, rows, field){
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
      let product = req.body.product;
      let description = req.body.description;

      if (get_request_method ==='update_one_product') {
        connection.query('update t_product set product=?, description=? where id=? and inputer=?',[product,description,id,username], function(error, rows, field){
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
        connection.query('update t_product set product=?, description=? where id=?',[product,description,id], function(error, rows, field){
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


    if (get_request_method ==='delete_one_product') {
      connection.query('delete from t_product where id=?',[id], function(error, rows, field){
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
      connection.query('delete from t_product where id=?',[id], function(error, rows, field){
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
  const port = process.env.PORT || 3002;
  app.use(bodyParser.urlencoded({ // Middleware
    extended: true
  }));
  app.use(bodyParser.json());
 
  // Routes & Handlers
  app.get('/product/index', middleware.checkToken, middleware.checkAuthorize, handlers.index);
  app.get('/product/find/:id', middleware.checkToken, middleware.checkAuthorize, handlers.find);
  app.post('/product/insert', middleware.checkToken, middleware.checkAuthorize, handlers.insert);
  app.put('/product/update/:id', middleware.checkToken, middleware.checkAuthorize, handlers.update);
  app.delete('/product/delete/:id', middleware.checkToken, middleware.checkAuthorize, handlers.delete);

  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();