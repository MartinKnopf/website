const DBURI = process.env.DBURI
const DBNAME = 'tracking'

const { parse } = require('url')
const mongo = require('mongodb').MongoClient
const uuidv1 = require('uuid/v1')

let client

const routes = {
  "/fltbttn.js": async (req, res) => {
    const result = await store('impressions', { when: Date.now().toString() })
    res.end(result)
  },
  
  "/trackvmod": async (req, res) => {
    const result = await store('vmod', { when: Date.now().toString() })
    res.end(result)
  },
  
  "/t": async (req, res) => {
    const { query } = parse(req.url, true)
    
    if(query && query.app) {
      const result = await store('apps', { app: query.app, when: Date.now().toString() })
      res.end(result)
    } else {
      res.end('-4')
    }
  },
  
  // get a new timestamp based user id
  "/newuid": (req, res) => {
    res.end(uuidv1())
  },
  
  // store uid for an app
  "/uid": async (req, res) => {
    const { query } = parse(req.url, true)
    
    if(query && query.app && query.uid) {
      const result = await store('apps', { app: query.app, uid: query.uid, when: Date.now().toString() })
      res.end(result)
    } else {
      res.end('-4')
    }
  },

  // get number of distinct user ids for a specific app
  "/uids": async (req, res) => {
    const { query } = parse(req.url, true)
    
    if(query && query.app) {
      const result = await getUidCount('apps', query.app, res)
      res.end(result)
    } else {
      res.end('-4')
    }
  }
}

let store = async (coll, row) => {
  try {
    client = await mongo.connect(DBURI)
    const db = client.db(DBNAME)
    await db.collection(coll).insertOne(row)

    return '1'
  } catch(err) {
    return err
  }
}

let getUidCount = async (coll, app) => {
  try {
    client = await mongo.connect(DBURI)
    const db = client.db(DBNAME)
    const docs = await db.collection(coll).distinct('uid', {app: app})
    
    return docs.length
  } catch(err) {
    return err
  }
}

module.exports = async (req, res) => {
  const route = parse(req.url).pathname

  if(routes[route]) {
    await routes[route](req, res)

    if(client) client.close()
  } else {
    res.end('0')
  }
}
