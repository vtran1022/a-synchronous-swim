const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = () => { }) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  if (req.url === '/') {
    res.writeHead(200, headers);
    if (req.method === 'GET') {
      // const commands = ['up', 'down', 'left', 'right'];
      // let randomCmd = commands[Math.floor(Math.random() * commands.length)];
      // res.write(randomCmd);
      if (messageQueue) {
        res.write(messageQueue.dequeue() || '')
      }
    }
    res.end();
    next();
  }

  if (req.url === '/background.jpg') {
    if (req.method === 'GET') {
      fs.readFile(module.exports.backgroundImageFile, (err, data) => {
        if (err) {
          res.writeHead(404, headers);
          res.write(err);
        } else {
          res.writeHead(200, headers);
          res.write(data, 'binary');
        }
        res.end();
        next();
      });
    } else if(req.method === 'POST') {
      var chunks = [];
      req.on('data', (chunk) => {
        //chunk is a buffer of binary data
        //add chunk to chunks
        chunks.push(chunk);
      });

      req.on('end', () => {
        //combine chunks Buffer.concat()
        //use multipart to convert to image
        //fs.writeFile
        var allData = Buffer.concat(chunks);
        var file = multipart.getFile(allData);
        fs.writeFile(module.exports.backgroundImageFile, file.data, (err) => {
          if (err) {
            res.writeHead(404, headers);
            res.write(err);
          } else {
            res.writeHead(201, headers);
          }
          res.end();
          next();
        });
      });
    }

  }
};

