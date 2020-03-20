var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://waimanshe.com/login/reg.php?type=reg',
  'headers': {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  'proxy': 'http://127.0.0.1:1081',
  form: {
    'username': '18956782451',
    'pwd': 'a123456',
    'pwdtwo': 'a123456'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
