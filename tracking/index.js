const DBURI = process.env.DBURI
const DBNAME = 'tracking'

const { parse } = require('url')
const mongo = require('mongodb').MongoClient
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

let store = async (coll, row, res) => {
  let client
  let result

  try {
    client = await mongo.connect(DBURI)
    const db = client.db(DBNAME)
    await db.collection(coll).insertOne(row)

    result = '1'
  } catch(err) {
    result = err
  }
  
  client.close()
  res.end(result)
}

let getUidCount = async (coll, app, res) => {
  let client
  let result

  try {
    client = await mongo.connect(DBURI)
    const db = client.db(DBNAME)
    const docs = await db.collection(coll).distinct('uid', {app: app})
    result = '' + docs.length
  } catch(err) {
    result = err
  }

  client.close()
  res.end(result)
}

module.exports = (req, res) => {
  const route = parse(req.url).pathname

  if(routes[route]) {
    routes[route](req, res)
  } else {
    res.end('0')
  }
}
