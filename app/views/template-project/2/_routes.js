var express = require('express')
var router = express.Router()

router.post('/template-form/radios-submit', function (req, res) {
    let intercept = req.session.data['intercept']

    if (intercept == "none") {
      res.redirect('multiple-questions')
    }
    else {
      res.redirect('checkboxes')
    }
  })

module.exports = router
