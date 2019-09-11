const { parse } = require('url')
const MongoClient = require('mongodb').MongoClient;

const DBURI = process.env.DBURI;
const DBNAME = 'tracking';

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
      res.end('0')
    }
  }
}

let store = (collName, row, res) => {
  try {
    MongoClient.connect(DBURI, (err, client) => {
      try {
        if(err) throw err;

        const db = client.db(DBNAME);
        const collection = db.collection(collName);

        collection.insertOne(row, (err, result) => {
          if(err) throw err;

          try {
            client.close();

            res.end('1');
          } catch(e) {
            res.end('0');
          }
        });
      } catch(e) {
        res.end('0');
      }
    });
  } catch(e) {
    res.end('0');
  }
}

module.exports = (req, res) => {
  if(routes[req.url]) {
    routes[req.url](req, res)
  } else {
    res.end('0')
  }
}
