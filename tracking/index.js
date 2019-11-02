const { parse } = require('url')
const MongoClient = require('mongodb').MongoClient;

const DBURI = process.env.DBURI
const DBNAME = 'tracking'

const routes = {
  "/fltbttn.js": (req, res) => {
    store('impressions', { when: Date.now().toString() }, res)
  },
  
  "/trackvmod": (req, res) => {
    store('vmod', { when: Date.now().toString() }, res)
  },
  
  "/t": (req, res) => {
    const { query } = parse(req.url, true)
    
    if(query && query.app) {
      store('apps', { app: query.app, when: Date.now().toString() }, res)
    } else {
      res.end('-4')
    }
  },

  "/stats": (req, res) => {
    const { query } = parse(req.url, true)
    
    if(query && query.app) {
      getStats('apps', query.app, res)
    } else {
      res.end('-4')
    }
  }
}

let store = (collName, row, res) => {
  try {
    MongoClient.connect(DBURI, (err, client) => {
      try {
        if(err) throw err

        const db = client.db(DBNAME)
        const collection = db.collection(collName)

        collection.insertOne(row, (err, result) => {
          if(err) throw err

          try {
            client.close()

            res.end('1')
          } catch(e) {
            res.end('-3')
          }
        });
      } catch(e) {
        res.end('-2')
      }
    });
  } catch(e) {
    res.end('-1')
  }
}

let getStats = (collName, app, res) => {
  try {
    MongoClient.connect(DBURI, (err, client) => {
      try {
        if(err) throw err

        const db = client.db(DBNAME)
        const collection = db.collection(collName)
        collection.find({app: app}).count().then((count) => {
          res.end('' + count)
        })
      } catch(e) {
        res.end('-2')
      }
    });
  } catch(e) {
    res.end('-1')
  }
}

module.exports = (req, res) => {
  const route = parse(req.url).pathname

  if(routes[route]) {
    routes[route](req, res)
  } else {
    res.end('0')
  }
}
