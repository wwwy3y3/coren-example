const express = require('express');
const app = express();
const coren = require('coren/lib/server/coren-middleware');

app.set('port', (process.env.PORT || 9393));

app.use(coren(__dirname));
app.use('/dist', express.static(__dirname + '/.coren/public/dist'));

app.get('/', function(req, res) {
  return res.sendCoren('index');
});

app.get('/users', function(req, res) {
  return res.sendCoren('index/users');
});

app.get('/users/:id', function(req, res) {
  const id = req.params.id;
  return res.sendCoren('index/users/' + id);
});

app.listen(app.get('port'), function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at ', app.get('port'));
});
