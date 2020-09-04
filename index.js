#!/usr/bin/node
const mineflayer = require('mineflayer')
const http = require("http")
const mineflayerViewer = require("prismarine-viewer").mineflayer
console.log("Imported")

const bot = mineflayer.createBot({
  host: 'localhost', // optional
  port: 25565,       // optional
  username: 'put your minecraft account email here', // email and password are required only for
  password: 'put your minecraft account password here',          // online-mode=true servers
  version: false                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
})


bot.once('spawn', () => {
  mineflayerViewer(bot, { port: 3008 })
})


http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write("<!DOCTYPE HTML><html><body><iframe src=\"http://localhost:3008\" width='100%' height='480' style=\"border:none;\">Loading...</iframe><iframe name='ctrl' width='0' height='0'></iframe><a href='/fwd' accesskey='w' target='ctrl'><button>Forward</button></a><a href='/bkd' target='ctrl'><button>Reverse</button></a><a href='/left' target='ctrl'><button>Left</button></a><a href='/right' target='ctrl'><button>Right</button></a><a href='/attack' target='ctrl'><button>Attack nearest mob</button></a><a href='/jump' target='ctrl'><button>Jump</button></a><a href='/stop' target='ctrl'><button>Stop</button></a><br/></body></html>");
//  console.log(req.url)

  switch (req.url){
    case '/fwd':
      bot.setControlState('forward', true)
      break
    case '/stop':
      bot.clearControlStates()
      break
    case '/jump':
      bot.setControlState('jump', true)
      bot.setControlState('jump', false)
    case '/attack':
      entity = bot.nearestEntity()
      if (entity) {
        bot.attack(entity, true)
      } else {
        bot.chat('no nearby entities')
      }
      bot.attack(entity,false)
      break
    case '/right':
      bot.setControlState('right',true)
      break
    case '/left':
      bot.setControlState('left',true)
      break
    case '/bkd':
      bot.setControlState('back',true)
      break
    case '/dig':
      dig()
  }
  res.end()
}).listen(8080)
var stdin = process.openStdin();
stdin.addListener("data", function(d) {
    bot.chat(d.toString().trim());
});

bot.on('chat', function (username, message) {
  console.log(username, ": ", message)
})
