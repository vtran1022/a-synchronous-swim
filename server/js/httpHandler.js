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
      //if we don't find a background image, set the header to 404
      //else, return the image? (render it to the screen, is now the background)
      fs.readFile(module.exports.backgroundImageFile, (err, data) => {
        if (err) {
          res.writeHead(404, headers);
          res.write(err);
        } else {
          res.writeHead(200, headers);
          res.write(data, 'binary');
        }
        res.end()
        next();
      });
    }
  }
  // res.writeHead(404, headers);
  // res.end();
  // next();
};

