
const con = require('../config/db');
const bcrypt = require('bcryptjs');

exports.postLogin = (req, callback) => 
{
      const username = req.body.username;
      const password = req.body.password;

      if (username && password) 
      {
            con.query('SELECT * FROM accounts WHERE username = ?', [username], async (error, results, fields) => 
            {
                  if (results.length > 0) 
                  {
                        const comparison = await bcrypt.compare(password, results[0].password)
                        if(comparison)
                        {
                              req.session.loggedin = true;
                              req.session.username = username;
                              callback(null, true);
                        } 
                        else 
                        {
                              callback(null, false);
                        }				
                  } 
                  else 
                  {
                        callback(null, false);
                  }
            });
      } 
      else 
      {
            callback(new Error('Please enter Username and Password!'));
      }
};