const DBURI = process.env.DBURI
const DBNAME = 'tracking'

const { parse } = require('url')
const mongo = require('mongodb').MongoClient
const uuidv1 = require('uuid/v1')

let client

const routes = {
  "/fltbttn.js": async (req, query, res) => {
    end(res, await store('impressions', { when: Date.now().toString() }))
  },
  
  "/trackvmod": async (req, query, res) => {
    end(res, await store('vmod', { when: Date.now().toString() }))
  },
  
  "/t": async (req, query, res) => {
    if(query.app) {
      end(res, await store('apps', { app: query.app, when: Date.now().toString() }))
    } else {
      end(res, '-4')
    }
  },
  
  // get a new timestamp based user id
  "/newuid": async (req, query, res) => {
    return uuidv1()
  },
  
  // store uid for an app
  "/uid": async (req, query, res) => {
    if(query.app && query.uid) {
      end(res, await store('apps', { app: query.app, uid: query.uid, when: Date.now().toString() }))
    } else {
      end(res, '-4')
    }
  },

  // get number of distinct user ids for a specific app
  "/uids": async (req, query, res) => {
    if(query.app) {
      end(res, await getUidCount('apps', query.app, res))
    } else {
      end(res, '-4')
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

let end = (response, result) => {
  if(client) client.close()
  response.end(result)
}

module.exports = (req, res) => {
  try {
    const route = parse(req.url).pathname

    if(routes[route]) {
      const { query } = parse(req.url, true) || {}

      routes[route](req, query, res)
    } else {
      res.end('0')
    }
  } catch(err) {
    res.end(err)
  }
}
