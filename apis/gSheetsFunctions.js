const {OAuth2Client} = require('google-auth-library');
const http = require('http');
const url = require('url');
const open = require('open');
const destroyer = require('server-destroy');
const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const {google} = require('googleapis');
const {Server} = require('ws');
const request = require('request-promise');
 
// Download your OAuth2 configuration from the Google
const keys = require('../keys');
 
/**
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow.  Return the full client to the callback.
 */
function getAuthenticatedClient() {
  return new Promise((resolve, reject) => {
    // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
    // which should be downloaded from the Google Developers Console.
    // const {client_secret, client_id, redirect_uris} = keys.sheetsBudget;
    const oAuth2Client = new OAuth2Client(
      keys.sheetsBudget.client_id,
      keys.sheetsBudget.client_secret,
      keys.sheetsBudget.redirect_uris[5]
    );
 
    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/spreadsheets',
    });

    // Open an http server to accept the oauth callback. In this simple example, the
    // only request to our webserver is to /oauth2callback?code=<code>
    const server = http.createServer(async (req, res) => {
      try {
        console.log(req.url);
        // if (req.url.indexOf('/localhost:5000') > -1) {
        // acquire the code from the querystring, and close the web server.
        const qs = new url.URL(req.url, keys.sheetsBudget.redirect_uris[5]).searchParams;
        const code = qs.get('code');
        console.log(`Code is ${code}`);
        res.end('Authentication successful! A Spreadsheet was just created on your Google Sheets Account with the information reported in the BudgetApp. For security purposes, please close this tab.');
        server.destroy();

        // Now that we have the code, use that to acquire tokens.
        const r = await oAuth2Client.getToken(code);
        // Make sure to set the credentials on the OAuth2 client.
        oAuth2Client.setCredentials(r.tokens);
        console.info('Tokens acquired.');
        resolve(oAuth2Client);
        // }
        // console.log(req.url);
      } catch (err) {
        console.log(err);
        // console.log(req.url);
        reject(err);
      }
    }).listen(3000, () => {
      // open the browser to the authorize url to start the workflow
      open(authorizeUrl, {wait: false}).then(cp => cp.unref());
    });
    destroyer(server);
  });
}

module.exports = {
  /**
 * Start by acquiring a pre-authenticated oAuth2 client.
 */
  saveSheet: async function main(arr) {
    console.log('Starts User Authentication');
    const oAuth2Client = await getAuthenticatedClient();
    // Make a simple request to the People API using our pre-authenticated client. The `request()` method
    // takes an GaxiosOptions object.  Visit https://github.com/JustinBeckwith/gaxios.
    console.log('Creating Sheet...');
    const sheets = google.sheets('v4');
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let dateObj = new Date();
    let month = monthNames[dateObj.getMonth()];
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    let date = month  + '-' + day  + '-' + year;
    console.log(date);
    const request = {
      resource: {
        "properties": {
          "title": 'BudgetApp -' + date
        },
        "sheets": [
          {
            "properties": {
              "title": "Summary"
            },
            "data":[
              {
                "startRow": 0,
                "startColumn": 0,
                "rowData": arr
              }
            ]  
          }
        ],
      },
      // TODO: Add desired properties to the request body.
      auth: oAuth2Client,
    };

    try {
      const response = (await sheets.spreadsheets.create(request)).data;
      // TODO: Change code below to process the `response` object:
      console.log(JSON.stringify(response, null, 2));
      return JSON.stringify(response, null, 2);
    } catch (err) {
      console.error(err);
    }

  }
}
