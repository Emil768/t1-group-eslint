/**
 * @fileoverview rule for check unused operators in company
 * @author unused-operators
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/unused-operators'),
	RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

ruleTester.run('unused-operators', rule, {
	valid: [
		{
			code: 'const test = moment().format("DD.MM.YYYY HH:mm")',
			errors: [],
		},
	],

	invalid: [
		{
			code: 'const test = !!moment().format("DD.MM.YYYY HH:mm")',
			errors: [{ message: 'Используйте Boolean вместо !!' }],
		},
	],
});
