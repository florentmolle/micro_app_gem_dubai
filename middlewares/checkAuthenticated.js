module.exports = function(req, res, next) 
{      
      if (req.session.loggedin) 
      {
            next();
      } else 
      {
            res.redirect('/login');
      }
};