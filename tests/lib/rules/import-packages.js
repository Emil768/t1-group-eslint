/**
 * @fileoverview rule for disable global imports packages
 * @author import-packages
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/import-packages'),
	RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

ruleTester.run('import-packages', rule, {
	valid: [{ code: 'import { debounce } from "lodash/debounce" ', errors: [] }],

	invalid: [
		{
			code: 'import test from "lodash" ',
			errors: [{ message: 'Импортируйте только нужный модуль а не всю библиотеку' }],
		},
		{
			code: 'import {test,test_2} from "lodash" ',
			errors: [{ message: 'Импортируйте только нужный модуль а не всю библиотеку' }],
		},
	],
});
