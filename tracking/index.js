const DBURI = process.env.DBURI
const DBNAME = 'tracking'

const { parse } = require('url')
const mongo = require('mongodb').MongoClient
const uuidv1 = require('uuid/v1')

let client

const routes = {
  "/fltbttn.js": async (req, res) => {
    return store('impressions', { when: Date.now().toString() })
  },
  
  "/trackvmod": async (req, res) => {
    return store('vmod', { when: Date.now().toString() })
  },
  
  "/t": async (req, res) => {
    if(req.query.app) {
      return store('apps', { app: req.query.app, when: Date.now().toString() })
    } else {
      return '-4'
    }
  },
  
  // get a new timestamp based user id
  "/newuid": async (req, res) => {
    return uuidv1()
  },
  
  // store uid for an app
  "/uid": async (req, res) => {
    if(req.query.app && req.query.uid) {
      return store('apps', { app: req.query.app, uid: req.query.uid, when: Date.now().toString() })
    } else {
      return '-4'
    }
  },

  // get number of distinct user ids for a specific app
  "/uids": async (req, res) => {
    if(req.query.app) {
      return getUidCount('apps', req.query.app)
    } else {
      return '-4'
    }
  },
  
  // remove all user ids for a specific app
  "/deleteuids": async (req, res) => {
    if(req.query.app) {
      return deleteUids('apps', req.query.app)
    } else {
      return '-4'
    }
  }
}

let store = async (coll, row) => {
  client = await mongo.connect(DBURI)
  const db = client.db(DBNAME)
  await db.collection(coll).insertOne(row)

  return '1'
}

let getUidCount = async (coll, app) => {
  client = await mongo.connect(DBURI)
  const db = client.db(DBNAME)
  const docs = await db.collection(coll).distinct('uid', {app: app})

  return docs.length
}

let deleteUids = async (coll, app) => {
  client = await mongo.connect(DBURI)
  const db = client.db(DBNAME)
  await db.collection(coll).deleteMany({ app: app })
  
  return '1'
}

let send = response => result => {
  if(client) client.close()
  response.end(result.toString())
}

module.exports = (req, res) => {
  try {
    const route = routes[parse(req.url).pathname]

    if(!route) {
      res.end('0')
      return
    }

    route(req, res)
      .then(send(res))
      .catch(send(res))
  } catch(err) {
    send(res)(err)
  }
}
