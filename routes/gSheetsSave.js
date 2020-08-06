const {OAuth2Client} = require('google-auth-library');
const http = require('http');
const url = require('url');
const open = require('open');
const destroyer = require('server-destroy');
const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const {google} = require('googleapis');
 
// Download your OAuth2 configuration from the Google
const keys = require('../keys');
const saveSheet = require("../apis/gSheetsFunctions.js");

router.get("/", function(req, res){
	res.redirect("/budgetapp");
});

router.get("/budgetapp", function(req, res){
	res.render("index");
});

router.post('/savebudget', function(req, res){
  console.log('Reached the savebudget route');
  console.log(req.body);
  const inc_arr = req.body.income,
        exp_arr = req.body.expenses,
        budgetVal = req.body.budgetValue

  console.log(inc_arr);
  // console.log(inc_arr.length);
  console.log(exp_arr);

  var arr = []
  for(var i = -1; i < inc_arr.length; i++){
    if(i == -1) {
      arr.push(
        {
          "values":[
            {
              "userEnteredValue":{
                "stringValue": "Item Name"
              }
            },
            {
              "userEnteredValue":{
                "stringValue": "Value"
              }
            },
            {
              "userEnteredValue":{
                "stringValue": "Available Budget"
              }
            },
            {
              "userEnteredValue":{
                "stringValue": budgetVal
              },
              "effectiveFormat": {
                "numberFormat": {
                  "type": "CURRENCY"
                }
              }
            }
          ],
        }
      );
    } else {
      arr.push(
        {
          "values":[
            {
              "userEnteredValue":{
                "stringValue": inc_arr[i][0]  
              }
            },
            {
              "userEnteredValue":{
                "numberValue": inc_arr[i][1]
              },
              "effectiveFormat": {
                "numberFormat": {
                  "type": "CURRENCY"
                }
              }
            }
          ],
        }
      );
    }
  }

  for(var i = 0; i < exp_arr.length; i++){
    arr.push(
      {
        "values":[
          {
            "userEnteredValue":{
              "stringValue": exp_arr[i][0]  
            }
          },
          {
            "userEnteredValue":{
              "numberValue": exp_arr[i][1]
            },
            "effectiveFormat": {
              "numberFormat": {
                "type": "CURRENCY"
              }
            }
          }
        ],
      }
    );
  };

  console.log('Printing arr');
  console.log(arr);

  saveSheet.saveSheet(arr).catch(console.error);

  // res.redirect(response.spreadsheetUrl);
  // res.redirect('/budgetapp');
});

module.exports = router;


