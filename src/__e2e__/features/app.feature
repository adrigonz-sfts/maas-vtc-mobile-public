Feature: App

  Scenario: Load the application
    Given I open the app
    Then the app container is visible

  Scenario: Page has correct title
    Given I open the app
    Then the page title contains "maas-school-front-public"
