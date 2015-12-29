var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('contact_view', {title: 'contact us'});
});

module.exports = router;