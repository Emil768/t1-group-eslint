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

ruleTester.run('bem-syntax', rule, {
	valid: [
		{
			code: `const TableContentView = ({}) => {
				return (
					<div className="table-content">
						<div className="table-content__header">
							<span className="table-content__header-text">Автопарк</span>
							<div className="table-content table-content__header__icon_red">Иконка</div>
							{isTableDataLoading &&(
								<Dimmer active inverted>
									<Loader active={isTableDataLoading} size="medium" />
								</Dimmer>
							)}
						
							</div>
					</div>
				);
			}`.replace(/\t/g, '  '),
			errors: [],
		},
	],

	invalid: [
		{
			code: `const TableContentView = ({}) => {
				return (
					<div className="table-conten"></div>
				);
			}`.replace(/\t/g, '  '),
			errors: [{ message: 'Наименование класса должно совпадать с родительским' }],
		},
		{
			code: `const TableContentView = ({}) => {
				return (
					<div className="table-content">
						<div className="table-content-view"></div>
					</div>
				);
			}`.replace(/\t/g, '  '),
			errors: [{ message: 'Наименование класса должно совпадать с родительским' }],
		},
		{
			code: `const TableContentView = ({}) => {
				return (
					<div className="table-content">
						<div className="table-content__21312++"></div>
					</div>
				);
			}`.replace(/\t/g, '  '),
			errors: [{ message: 'В наименовании классов не должно быть лишних символов' }],
		},
		{
			code: `const TableContentView = ({}) => {
				return (
					<div className="table-content">
							<span className="table-content__header-text">Автопарк</span>
							<div className="table-content__header__icon_red">Иконка</div>
						</div>
				);
			}`.replace(/\t/g, '  '),
			errors: [{ message: 'Модификатор не может использоваться без родительского класса' }],
		},
		{
			code: `const TableContentView = ({}) => {
				return (
					<div className="table-content">
							<span className="table-content__header-text">Автопарк</span>
							<div className="table-content__header__icon_red table-content__header__icon_red">Иконка</div>
						</div>
				);
			}`.replace(/\t/g, '  '),
			errors: [{ message: 'Невозможно одновременно использовать два одинаковых модификатора' }],
		},
	],
});
