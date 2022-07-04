var express = require('express')
var router = express.Router()

router.post('/template-form/radios-submit', function (req, res) {
  const whereDoYouLive = req.session.data['where-do-you-live']

  if (whereDoYouLive === 'england') {
    res.redirect('multiple-questions')
  } else {
    res.redirect('checkboxes')
  }
})

module.exports = router
