class ErrorMessages {
  constructor () {
    this.errorList = []
  }

  hasErrors () {
    return (this.errorList.length > 0)
  }

  convertIDToAttributeName (id) {
    // remove dashes
    return id.toLowerCase().split('-').map(function (word) {
      return word.replace(word[0], word[0].toUpperCase())
    }).join('')
  }

  capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  addError (id, errorMessage, href = '') {
    const summaryError = {
      text: errorMessage,
      href: '#' + id + href
    }
    const componentError = { text: errorMessage }
    const attributeName = 'error' + this.convertIDToAttributeName(id)
    this[attributeName] = componentError
    this.errorList.push(summaryError)
  }

  checkCompleted (req, id, errorMessage) {
    const data = req.session.data[id]
    if (!data) {
      this.addError(id, errorMessage)
    }
  }

  checkDateCompleted (req, id, dateName) {
    const day = req.session.data[id + '-day']
    const month = req.session.data[id + '-month']
    const year = req.session.data[id + '-year']

    if (day && month && year) {
      const regExp = /^[0-9]*$/

      if (!regExp.test(day) || !regExp.test(month) || !regExp.test(year)) {
        const attributeName = 'error' + this.convertIDToAttributeName(id)
        this[attributeName] = {}

        this.addError(id, this.capitalizeFirstLetter(dateName) + ' must be a real date')
        if (!regExp.test(day)) {
          this[attributeName].dayError = ' govuk-input--error'
        }
        if (!regExp.test(month)) {
          this[attributeName].monthError = ' govuk-input--error'
        }
        if (!regExp.test(year)) {
          this[attributeName].yearError = ' govuk-input--error'
        }
      } else {
        // All inputs have a value
        const dayValue = parseInt(day)
        const monthValue = parseInt(month)
        const yearValue = parseInt(year)
        const currentYear = new Date().getFullYear()

        if ((monthValue > 12) || (dayValue > 29 && monthValue === 2) || (dayValue > 30 && [4, 6, 9, 11].includes(monthValue)) || (dayValue > 31 && [1, 3, 5, 7, 8, 10, 12].includes(monthValue)) || yearValue < (currentYear - 120)) {
          const attributeName = 'error' + this.convertIDToAttributeName(id)
          this[attributeName] = {}

          this.addError(id, this.capitalizeFirstLetter(dateName) + ' must be a real date')
          if (monthValue > 12) {
            this[attributeName].monthError = ' govuk-input--error'
          }
          if ((dayValue > 29 && monthValue === 2) || (dayValue > 30 && [4, 6, 9, 11].includes(monthValue)) || (dayValue > 31 && [1, 3, 5, 7, 8, 10, 12].includes(monthValue))) {
            this[attributeName].dayError = ' govuk-input--error'
          }
          if (yearValue < (currentYear - 120)) {
            this[attributeName].yearError = ' govuk-input--error'
          }
        }
      }
    } else {
      // At least one input does not have a value
      const attributeName = 'error' + this.convertIDToAttributeName(id)
      this[attributeName] = {}

      const missingValues = []
      if (!day) {
        missingValues.push('day')
      }
      if (!month) {
        missingValues.push('month')
      }
      if (!year) {
        missingValues.push('year')
      }
      if (!day && !month && !year) {
        this.addError(id, 'Enter ' + dateName, '-day')
      } else {
        const missingString = missingValues.join(' and ')
        this.addError(id, this.capitalizeFirstLetter(dateName) + ' must include a ' + missingString, '-day')
      }
      if (!day) {
        this[attributeName].dayError = ' govuk-input--error'
      }
      if (!month) {
        this[attributeName].monthError = ' govuk-input--error'
      }
      if (!year) {
        this[attributeName].yearError = ' govuk-input--error'
      }
    }
  }

  checkDateFuture (req, id, dateName, allowToday) {
    const day = req.session.data[id + '-day']
    const month = req.session.data[id + '-month']
    const year = req.session.data[id + '-year']
    const today = new Date()
    const enteredDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

    const attributeName = 'error' + this.convertIDToAttributeName(id)

    if (!this[attributeName] && ((allowToday && (enteredDate <= today)) || (!allowToday && (enteredDate < today)))) {
      this[attributeName] = {}

      if (allowToday) {
        this.addError(id, this.capitalizeFirstLetter(dateName) + ' must be today or in the future', '-day')
      } else {
        this.addError(id, this.capitalizeFirstLetter(dateName) + ' must be in the future', '-day')
      }
      this[attributeName].dayError = ' govuk-input--error'
      this[attributeName].monthError = ' govuk-input--error'
      this[attributeName].yearError = ' govuk-input--error'
    }
  }

  checkDatePast (req, id, dateName, allowToday) {
    const day = req.session.data[id + '-day']
    const month = req.session.data[id + '-month']
    const year = req.session.data[id + '-year']
    const today = new Date()
    const enteredDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

    const attributeName = 'error' + this.convertIDToAttributeName(id)

    if (!this[attributeName] && ((allowToday && (enteredDate >= today)) || (!allowToday && (enteredDate > today)))) {
      this[attributeName] = {}

      if (allowToday) {
        this.addError(id, this.capitalizeFirstLetter(dateName) + ' must be today or in the past', '-day')
      } else {
        this.addError(id, this.capitalizeFirstLetter(dateName) + ' must be in the past', '-day')
      }
      this[attributeName].dayError = ' govuk-input--error'
      this[attributeName].monthError = ' govuk-input--error'
      this[attributeName].yearError = ' govuk-input--error'
    }
  }
}

module.exports = { ErrorMessages: ErrorMessages }
