const DBURI = process.env.DBURI
const DBNAME = 'tracking'

const { parse } = require('url')
const mongo = require('mongodb').MongoClient
const uuidv1 = require('uuid/v1')

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
  return result
}

let getUidCount = async (coll, app) => {
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
  return result
}

module.exports = (req, res) => {
  const route = parse(req.url).pathname

  if(routes[route]) {
    routes[route](req, res)
  } else {
    res.end('0')
  }
}
