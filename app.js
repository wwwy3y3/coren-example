const express = require('express');
const app = express();
const coren = require('coren/lib/server/coren-middleware');

app.set('port', (process.env.PORT || 9393));

app.use(coren(__dirname));
app.use('/dist', express.static(__dirname + '/.coren/public/dist'));

app.get('/*', function(req, res) {
  return res.sendCoren('index', {});
});

app.listen(app.get('port'), 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at ', app.get('port'));
});
