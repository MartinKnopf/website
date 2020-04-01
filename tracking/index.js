const DBURI = process.env.DBURI
const DBNAME = 'tracking'

const { parse } = require('url')
const mongo = require('mongodb').MongoClient(DBURI)
const uuidv1 = require('uuid/v1')

const routes = {
  "/fltbttn.js": async (req, res) => {
    await store('impressions', { when: Date.now().toString() }, res)
  },
  
  "/trackvmod": async (req, res) => {
    await store('vmod', { when: Date.now().toString() }, res)
  },
  
  "/t": async (req, res) => {
    const { query } = parse(req.url, true)
    
    if(query && query.app) {
      await store('apps', { app: query.app, when: Date.now().toString() }, res)
    } else {
      res.end('-4')
    }
  },
  
  // get a new timestamp based user id
  "/newuid": async (req, res) => {
    res.end(uuidv1())
  },
  
  // store uid for an app
  "/uid": async (req, res) => {
    const { query } = parse(req.url, true)
    
    if(query && query.app && query.uid) {
      store('apps', { app: query.app, uid: query.uid, when: Date.now().toString() }, res)
    } else {
      res.end('-4')
    }
  },

  // get number of distinct user ids for a specific app
  "/uids": async (req, res) => {
    const { query } = parse(req.url, true)
    
    if(query && query.app) {
      await getUidCount('apps', query.app, res)
    } else {
      res.end('-4')
    }
  }
}

let store = async (coll, row, res) => {
  let result = ''

  try {
    await mongo.connect()
    const db = mongo.db(DBNAME)
    await db.collection(coll).insertOne(row)

    result = '1'
  } catch(err) {
    result = err
  } finally {
    await mongo.close()
  }
  
  res.end(result)
}

let getUidCount = async (coll, app, res) => {
  try {
    await mongo.connect()

    const db = mongo.db(DBNAME)
    db.collection(coll).distinct('uid', {app: app}).then((docs) => {
      res.end('' + docs.length)
      mongo.close()
    })
  } catch(err) {
    await mongo.close()
    res.end(err)
  }
}

module.exports = async (req, res) => {
  const route = parse(req.url).pathname

  if(routes[route]) {
    await routes[route](req, res)
  } else {
    res.end('0')
  }
}
