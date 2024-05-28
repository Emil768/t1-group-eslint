/**
 * @fileoverview rule for check unused operators in company
 * @author unused-operators
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'rule for check unused operators in company',
			recommended: false,
			url: null,
		},
		fixable: null,
		messages: {
			unusedOperatorsTwiceMessageId: 'Используйте Boolean вместо !!',
		},
		schema: [],
	},

	create(context) {
		return {
			UnaryExpression(node) {
				// Оператор !!
				if (node.operator + node.argument.operator === '!!') {
					context.report({
						node: node,
						messageId: 'unusedOperatorsTwiceMessageId',
					});
				}
			},
		};
	},
};
