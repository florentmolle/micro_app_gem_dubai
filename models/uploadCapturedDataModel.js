const con = require('../config/db');


exports.saveData = function(filePath, callback) {
      var sql = "INSERT INTO captured_data(file_path) VALUES (?)";
      con.query(sql, [filePath], function (err, result) {
            if (err) return callback(err);
            callback(null, result);
      });
};