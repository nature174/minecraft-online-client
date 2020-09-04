const mineflayer = require('mineflayer')
const http = require("http")
const mineflayerViewer = require("prismarine-viewer").mineflayer

const bot = mineflayer.createBot({
  host: 'localhost', // optional
  port: 25565,       // optional
  username: 'bot', // email and password are required only for
  password: '',          // online-mode=true servers
  version: false                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
})

bot.once('spawn', () => {
  mineflayerViewer(bot, { port: 3007 })
})

bot.on('chat', function (username, message) {
  console.log(username, ": ", message)
})

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write("<!DOCTYPE HTML><html><body><iframe src=\"http://localhost:3007\" width='100%' height='480' style=\"border:none;\">Loading...</iframe><iframe name='ctrl' width='0' height='0'></iframe><a href='/fwd' accesskey='w' target='ctrl'><button>Forward</button></a><a href='/bkd' target='ctrl'><button>Reverse</button></a><a href='/left' target='ctrl'><button>Left</button></a><a href='/right' target='ctrl'><button>Right</button></a><a href='/attack' target='ctrl'><button>Attack nearest mob</button></a><a href='/jump' target='ctrl'><button>Jump</button></a><a href='/stop' target='ctrl'><button>Stop</button></a><br/><form action='/chat' target='ctrl'><input type='text' id='chat'><input type='submit' value='Send'></form><form action='/goto' target='ctrl'>x: <input name='x' id='x' type='int'>  z: <input name='z' id='z' type='int'><input type='Submit' value='Go'></form>");
  console.log(req.url)

  if (req.url.indexOf("/chat") > -1){
    var url = require('url')
    var q = url.parse(req.url, true).query
    var msg = q.chat
    console.log(msg)
    //bot.chat(msg)
    //break
  }

  if (req.url.indexOf("/goto") > -1){
    var url = require('url')
    var p = url.parse(req.url, true).query
    const { pathfinder, Movements } = require('mineflayer-pathfinder')
    const { GoalNear, GoalBlock, GoalXZ, GoalY, GoalInvert, GoalFollow } = require('mineflayer-pathfinder').goals
    bot.loadPlugin(pathfinder)
    const defaultMove = new Movements(bot, mcData)
    bot.pathfinder.setMovements(defaultMove)
    bot.pathfinder.setGoal(new GoalXZ(p.x, p.z))
  }

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
  }
  //bot.on('kicked', (reason, loggedIn) => res.write("Account Kicked from server: ", reason, loggedIn));
  res.end();
}).listen(8080);
// Log errors and kick reasons:
//bot.on('error', err => console.log(err))
