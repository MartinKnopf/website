const DBURI = process.env.DBURI
const DBNAME = 'tracking'

const { parse } = require('url')
const mongo = require('mongodb').MongoClient(DBURI)
const uuidv1 = require('uuid/v1')

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

let store = async (collName, row, res) => {
  try {
    await mongo.connect()

    const db = mongo.db(DBNAME)
    const coll = db.collection(collName)

    await coll.insertOne(row)

    res.end('1')
  } catch(err){
    res.end(err)
  } finally {
    await mongo.close()
  }
}

let getUidCount = async (collName, app, res) => {
  try {
    await mongo.connect()

    const db = mongo.db(DBNAME)
    const coll = db.collection(collName)

    coll.distinct('uid', {app: app}).then((docs) => {
      res.end('' + docs.length)
    })
  } catch(err) {
    res.end(err)
  } finally {
    mongo.close()
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
