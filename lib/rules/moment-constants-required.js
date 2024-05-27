/**
 * @fileoverview rule for required moment constants
 * @author moment-constants-required
 */
'use strict';

const { getPageName } = require('../../utils');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'rule for required moment constants',
			recommended: false,
			url: null,
		},
		fixable: null,
		messages: {
			momentRequiredContstansMessageId: 'Формат должен находится в константах',
		},
		schema: [],
	},

	create(context) {
		return {
			VariableDeclarator(node) {
				const expressions = node.init.expressions;
				const isPages = getPageName(context.getFilename()) === 'pages';

				if (isPages) {
					if (expressions?.type === 'CallExpression') {
						if (expressions.callee?.object?.callee?.name === 'moment') {
							if (expressions.arguments[0]?.type === 'Literal') {
								context.report({
									node: node,
									messageId: 'momentRequiredContstansMessageId',
								});
							}
						}
					}
				}
			},
		};
	},
};
