var express = require('express')
var router = express.Router()

router.post('/radios-submit', function (req, res) {
  res.redirect('/checkboxes')
})

module.exports = router
