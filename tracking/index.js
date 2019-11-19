const { parse } = require('url')
const MongoClient = require('mongodb').MongoClient
const uuidv1 = require('uuid/v1')

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
  
  // get a new timestamp based user id
  "/newuid": (req, res) => {
    res.end(uuidv1())
  },
  
  // store uid for an app
  "/uid": (req, res) => {
    const { query } = parse(req.url, true)
    
    if(query && query.app && query.uid) {
      store('apps', { app: query.app, uid: query.uid, when: Date.now().toString() }, res)
    } else {
      res.end('-4')
    }
  },

  // get number of documents with specific app
  "/stats": (req, res) => {
    const { query } = parse(req.url, true)
    
    if(query && query.app) {
      getAppCount('apps', query.app, res)
    } else {
      res.end('-4')
    }
  },

  // get number of distinct user ids for a specific app
  "/uids": (req, res) => {
    const { query } = parse(req.url, true)
    
    if(query && query.app) {
      getUidCount('apps', query.app, res)
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

let getAppCount = (collName, app, res) => {
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

let getUidCount = (collName, app, res) => {
  try {
    MongoClient.connect(DBURI, (err, client) => {
      try {
        if(err) throw err

        const db = client.db(DBNAME)
        const collection = db.collection(collName)
        collection.distinct('uid', {app: app}).then((docs) => {
          res.end('' + docs.length)
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
