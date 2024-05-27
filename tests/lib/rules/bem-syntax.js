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

const ruleTester = new RuleTester({
	parserOptions: {
		ecmaVersion: 8,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
			experimentalObjectRestSpread: true,
		},
	},
});

// TODO: Дописать тесты
ruleTester.run('bem-syntax', rule, {
	valid: [
		{
			code: `const Avatar = ({ onAvatarChange, input }) => {
				return (
					<div className="avatar">
						{input.value ? (
							<img className="avatar__image" src={input.value} alt="avatar" />
						) : (
							<Icon size="massive" name="image outline" data-testid="icon" />
						)}
						<Input onChange={onAvatarChange} type="file" id="input__file" />
						<div className="avatar__icon-wrapper">
							<Icon className="avatar__icon" name="pencil alternate" />
						</div>
					</div>
				);
			}`.replace(/\t/g, '  '),
			errors: [],
		},
	],

	invalid: [
		{
			code: `const Avatar = ({ onAvatarChange, input }) => {
				return (
					<div className="avatar_2131231212">
						{input.value ? (
							<img className="avatar__image" src={input.value} alt="avatar" />
						) : (
							<Icon size="massive" name="image outline" data-testid="icon" />
						)}
						<Input onChange={onAvatarChange} type="file" id="input__file" />
						<div className="avatar__icon-wrapper">
							<Icon className="avatar__icon" name="pencil alternate" />
						</div>
					</div>
				);
			}`.replace(/\t/g, '  '),
			errors: [{ message: 'Наименование родительского класса и компонента не совпадают' }],
		},
	],
});
