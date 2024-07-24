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
			code: `const TableContentView = ({isTableDataLoading, accordeonItems, isAllOpen, accordionIndex, onAccordionOpen}) => {
				return (
				  <div className='table-content table-content_red'>
					<div className={\`table-content \${
					  isHistoryPlayerInfoOpen && historyPlayerPosition === 'bottom' ? 'table-content__position_bottom' : 'table-content__position_right'
					} \${historyPlayerPosition === 'right' ? 'table-content__position_right' : null} \`}>test</div>
					<div className="table-content__header">
					  <span className="table-content__header-text">Автопарк</span>
					  <div className="table-content table-content__header__icon_red">Иконка</div>
					  {isTableDataLoading && (
						<Dimmer active inverted>
						  <Loader active={isTableDataLoading} size="medium" />
						</Dimmer>
					  )}
					  {accordeonItems ?
						accordeonItems.map(({ title, error, Component, isTitleIcon, itemKey, active }, index) => {
						  return (
							<div key={itemKey || title} >
							  {title && (
								<Accordion.Title
								  active={isAllOpen || active || accordionIndex === index}
								  index={index}
								  onClick={onAccordionOpen}
								>
								  {title}
								  {isTitleIcon && (
									<Icon
									  name={isAllOpen || accordionIndex === index ? 'caret down' : 'caret right'}
									  data-testid="accordion-icon"
									/>
								  )}
								</Accordion.Title>
							  )}
							  <Accordion.Content active={isAllOpen || active || accordionIndex === index}>
								{Component}
							  </Accordion.Content>
							</div>
						  );
						}) : <div>test</div>}
					</div>
				  </div>
				);
			  }`.replace(/\t/g, ''),
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
		{
			code: `const TableContentView = ({}) => {
				return (
					<div className="table-content">
							<span className="table-content__header-text">Автопарк</span>
							<div className="table-content_red table-content_red">Иконка</div>
						</div>
				);
			}`.replace(/\t/g, '  '),
			errors: [{ message: 'Невозможно одновременно использовать два одинаковых модификатора' }],
		},
		{
			code: `const TableContentView = ({}) => {
					return (
						<div className="table-content table-content_red">
						{test.map((item) => {
							return (
							<ul className="table-content__list">
								<li className="table-content__list-item_red">{item}</li>
							</ul>
							);
						})}
						</div>
					);
			};`.replace(/\t/g, '  '),
			errors: [{ message: 'Модификатор не может использоваться без родительского класса' }],
		},
	],
});
