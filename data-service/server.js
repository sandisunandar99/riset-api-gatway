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
    
    // console.log(id + title + data);

    connection.query('insert into t_data values (?,?,?)',[id,title,data], function(error, rows, field){
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
      let id = req.params.id;
      let title = req.body.title;
      let data = req.body.data;

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

  delete(req, res){
    let id = req.params.id;

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