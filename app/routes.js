const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
router.use('/template-project/', require('./views/template-project/_routes'))

module.exports = router
