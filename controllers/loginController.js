const loginModel = require('../models/loginModel')


exports.getLogin = (req, res) => 
{
  res.render('login');
};

exports.postLogin = (req, res) => 
{
      loginModel.postLogin(req, (error, authenticated) => 
      {
            if (error) 
            {
                  res.status(500).json({ error: error.message, authenticated: false });
            } 
            else if (authenticated) 
            {
                  console.log("Success auth !")
                  // res.redirect('/home');
                  res.json({ authenticated: true });
            } 
            else 
            {
                  res.json({ authenticated: false, message: 'Incorrect Username and/or Password!' });
            }
      });
};