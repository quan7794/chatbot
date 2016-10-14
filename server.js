// # SimpleServer
// A simple chat bot server
var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var router = express();
var S = require('string');
var request = require("request")


var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);
var request = require("request");

app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

// Đây là đoạn code để tạo Webhook
app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === 'onggiarua') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

// Xử lý khi có người nhắn tin cho bot
app.post('/webhook', function(req, res) {
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
            // If user send text
            if (message.message.text) {
              var text = message.message.text;
              console.log(text); // In tin nhắn người dùng
                if(S(text).contains("mp3.zing.vn")) {
                  //tach id bai hat ra
                  
                      var id = text;
                      id= S(text).left(-13).s; //'JP', same as right(2)
                      id = S(id).between('', '.html').s;
                      console.log(id);
                  
                  //json parse data begin
                            var diachi = "http://api.mp3.zing.vn/api/mobile/song/getsonginfo?requestdata={%22id%22:%22"+id+"%22}";
                            
                            request({
                                url: diachi,
                                json: true
                            }, function (error, response, body) {
                            
                                if (!error && response.statusCode === 200) {
                                  try {
                                    var arr = Object.keys(body.source).map(function (key) { return body.source[key]; });
                                        console.log(arr[1]);
                                    sendMessage(senderId,"Tên bài hát: "+body.title);
                                    sendMessage(senderId,"Link 320p: "+arr[1]); }
                                    catch(e) { console.log("loi");
                                  
                                };
                                    
                                }
                            })
                  //json parse data end
                  
                }
                else
                sendMessage(senderId, "Tui là bot đây: " + text);
            }
      }
    }
  }

  res.status(200).send("OK");
});
  

// Gửi thông tin tới REST API để trả lời
function sendMessage(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: "EAAFGCNVuFYABAOPuwbJiM2RvLKhHcXP0sfle8OLWuOv2R20tbqmGsKGL7VOa6CbgXGxa7tZAlrnjegDSMsZA16WP6CXBSVtBl7oqaAWE0eoKSBk2kZCHyXGdHwAGJys9xdqnBQWXkDQptwe1fNGHnaj1e7trdmSQwRbIvhNXgZDZD",
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1");

server.listen(app.get('port'), app.get('ip'), function() {
  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});