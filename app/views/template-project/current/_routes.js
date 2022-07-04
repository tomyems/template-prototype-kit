var express = require('express')
var router = express.Router()

let errors = require('../../../errors');

// This is so the link to the page index in the footer works on form pages
router.all('/template-form/index', function (req, res) {
    res.redirect('../index')
  })

// Add any routes specific to your form here. Remove this example one.
router.post('/template-form/radios-route', function (req, res) {
    const whereDoYouLive = req.session.data['where-do-you-live']
    let pageErrors = new errors.ErrorMessages()

    // Check fields in the order that they are on the page
    // example:
    //   pageErrors.checkDateCompleted(req, id of date component, error message)
    pageErrors.checkCompleted(req, 'where-do-you-live', 'Select the country where you live')

    if (pageErrors.hasErrors()) {
      // render the same page with errors
      res.render('template-project/current/template-form/radios', pageErrors)
    } else {
      // given no erros continue with normal routing logic
      if (whereDoYouLive == "england") {
        res.redirect('multiple-questions')
      }
      else {
        res.redirect('checkboxes')
      }
    }
  })

  router.post('/template-form/multiple-questions-route', function (req, res) {

      let pageErrors = new errors.ErrorMessages()

      // Check fields in the order that they are on the page
      // example:
      //   pageErrors.checkDateCompleted(req, id of date component, name of date)
      pageErrors.checkDateCompleted(req, 'event-date', 'the event date')
      pageErrors.checkDatePast(req, 'event-date', 'the event date')

      pageErrors.checkDateCompleted(req, 'next-event', 'the next event date')
      pageErrors.checkDateFuture(req, 'next-event', 'the next event date')

      // Add more complex logic around a field or combination of fields.
      // Access the data in the field with req.session.data[id of field]
      if (req.session.data['event-description'].length < 10) {
        pageErrors.addError('event-description', "Event description must be 10 characters or more")
      }

      // Test to see if the page has any errors at all.
      if (pageErrors.hasErrors()) {
        // render the same page with errors
        console.log(req.session.data)
        res.render('template-project/current/template-form/multiple-questions', pageErrors)
      } else {
        // given no erros continue with normal routing logic
        res.redirect('check-answers')
      }
    })

module.exports = router
