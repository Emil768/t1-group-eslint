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
			CallExpression(node) {
				if (node.callee?.object?.callee?.name === 'moment') {
					if (node.callee?.property?.name === 'format') {
						if (node.arguments[0]?.type === 'Literal') {
							context.report({
								node: node,
								messageId: 'momentRequiredContstansMessageId',
							});
						}
					}
				}
			},
		};
	},
};
