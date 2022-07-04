const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const waitForApplication = async () => {
  cy.task('log', 'Waiting for app to restart and load home page')
  cy.task('waitUntilAppRestarts')
  cy.visit('/')
  cy.get('h1.govuk-heading-l', { timeout: 20000 })
    .should('contains.text', 'Template project')
}

module.exports = {
  sleep,
  waitForApplication
}
