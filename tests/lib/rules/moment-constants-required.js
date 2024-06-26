/**
 * @fileoverview rule for required moment constants
 * @author moment-constants-required
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/moment-constants-required'),
	RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

// TODO: Дописать тесты
ruleTester.run('moment-constants-required', rule, {
	valid: [{ code: 'export const test = moment().format(TEST)', errors: [] }],

	invalid: [
		{
			code: 'export const test = moment().format("DD.MM.YYYY HH:mm")',
			errors: [{ message: 'Формат должен находится в константах' }],
		},
	],
});
