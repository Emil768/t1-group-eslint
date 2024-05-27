/**
 * @fileoverview Rules for correctly writing classes using the BEM methodology
 * @author BEM-syntax
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/bem-syntax'),
	RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('bem-syntax', rule, {
	valid: [
		{
			code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
			errors: [],
		},
	],

	invalid: [
		{
			code: '',
			errors: [{ message: 'Fill me in.', type: 'Me too' }],
		},
	],
});
