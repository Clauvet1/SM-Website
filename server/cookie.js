var express = require('express');  
var cookieParser = require('cookie-parser');  
var app = express();  
app.use(cookieParser());  
app.get('/cookieset',(req, res) => {  
res.cookie('cookie_name', 'cookie_value');  
res.cookie('company', 'javatpoint');  
res.cookie('name', 'sonoo');  
  
res.status(200).send('Cookie is set');  
});  
app.get('/cookieget',(req, res) => {  
  res.status(200).send(req.cookies);  
});  
app.get('/', (req, res) => {  
  res.status(200).send('Welcome to JavaTpoint!');  
});  
// var server = app.listen(8000, function () {  
//   var host = server.address().address;  
//   var port = server.address().port;  
//   console.log('Example app listening at http://%s:%s', host, port);  
// });  
app.listen(8000, () => {
    console.log(`Server is running on http://localhost: 8000`);
  });