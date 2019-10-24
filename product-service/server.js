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
    
    // console.log(id + title + data);

    connection.query('insert into t_product values (?,?,?)',[id,product,description], function(error, rows, field){
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
      // console.log(req.params);
      let id = req.params.id;
      let product = req.body.product;
      let description = req.body.product;

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

  delete(req, res){
    let id = req.params.id;

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