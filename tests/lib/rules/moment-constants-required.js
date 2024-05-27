/**
 * @fileoverview rule for required moment constants
 * @author moment-constants-required
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/moment-constants-required"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("moment-constants-required", rule, {
  valid: [
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: "",
      errors: [{ messageId: "Fill me in.", type: "Me too" }],
    },
  ],
});
