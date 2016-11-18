const http = require('http'),
  https = require('https'),
  xml2js = require('xml2js');

module.exports = {
  asXML: asXML,
  asJSON: asJSON,
  asObject: asObject
};

function asXML(callback) {
  getBolagetXML((xml) => {
    callback(xml);
  });
}

function asObject(callback) {
  asXML((xml) => {
    xml2js.parseString(xml, function(err, result) {
        callback(result, err);
    });
  });
}

function asJSON(callback) {
  asXML((xml) => {
    xml2js.parseString(xml, function(err, result) {
        callback(result, err);
    });
  });
}

function getBolagetXML(callback) {
  https.get('https://www.systembolaget.se/api/assortment/products/xml', (res) => {
    const statusCode = res.statusCode;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`);
    } else if (!/^application\/xml/.test(contentType)) {
      error = new Error(`Invalid content-type.\n` +
                      `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.log(error.message);

      // consume response data to free up memory
      res.resume();
      throw error;
    } else {
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => rawData += chunk);

      res.on('end', () => {
        try {
          callback(rawData);
        }  catch (e) {
          console.log(e.message);
        }
      });
    }
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
    callback({}, e);
    throw e;
  }).end();
}
