var express = require('express');
var app = express();
const sqlite3 = require('sqlite3').verbose();

var server = app.listen(process.env.PORT || 3000, listen);
let counter = 0;

app.use(express.static('Public'));

app.post('/count', function(req,res,next){
    let user = req?.headers?.user || null;
    if(user){
        db.run(`INSERT INTO users VALUES(?)`, [user], function(err) {
            if (err) {
              return console.log(err.message);
            }
            counter++;
            console.log(`A row has been inserted with rowid ${this.lastID}`);
          });
    }
    console.log(counter);
    res.sendStatus(200);
});

function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Started server at https://' + host + ':' + port);
}

let db = new sqlite3.Database('./db/data.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
    
  });

  db.run(`CREATE TABLE IF NOT EXISTS users (
	        user TEXT NOT NULL PRIMARY KEY
        ) WITHOUT ROWID;`);