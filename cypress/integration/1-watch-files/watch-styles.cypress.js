const { waitForApplication } = require('../utils')
const appStyles = 'app/assets/sass'
const appStylesheet = `${appStyles}/application.scss`
const cypressTestStyles = 'cypress-test'
const cypressTestStylePattern = `${appStyles}/patterns/_${cypressTestStyles}.scss`
const publicStylesheet = 'public/stylesheets/application.css'
const backupAppStylesheet = 'cypress/temp/temp-application.scss'

describe('watch sass files', () => {
  describe(`sass file ${cypressTestStylePattern} should be created and included within the ${appStylesheet} and accessible from the browser as /${publicStylesheet}`, () => {
    const cssStatement = `
    .hods-header { background: red; }
    `

    before(() => {
      waitForApplication()
      // backup application.scss
      cy.task('copyFile', { source: appStylesheet, target: backupAppStylesheet })
    })

    after(() => {
      // restore files
      cy.task('copyFile', { source: backupAppStylesheet, target: appStylesheet })

      cy.task('deleteFile', { filename: cypressTestStylePattern })

      cy.get('.hods-header', { timeout: 20000 }).should('have.css', 'background-color', 'rgb(255, 255, 255)')
      cy.task('deleteFile', { filename: backupAppStylesheet })
    })

    it('The colour of the header should be change to red then back to black', () => {
      cy.task('log', 'The colour of the header should be black')
      cy.get('.hods-header', { timeout: 20000 }).should('have.css', 'background-color', 'rgb(255, 255, 255)')

      cy.task('log', `Create ${cypressTestStylePattern}`)
      cy.task('createFile', {
        filename: cypressTestStylePattern,
        data: cssStatement
      })

      cy.task('log', `Amend ${appStylesheet} to import ${cypressTestStyles}`)
      cy.task('appendFile', {
        filename: appStylesheet,
        data: `
      @import "patterns/${cypressTestStyles}";
      `
      })

      cy.task('log', 'The colour of the header should be changed to red')
      cy.get('.hods-header', { timeout: 20000 }).should('have.css', 'background-color', 'rgb(255, 0, 0)')
    })
  })
})
