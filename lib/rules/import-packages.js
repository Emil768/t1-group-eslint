/**
 * @fileoverview rule for disable global imports packages
 * @author import-packages
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
			description: 'rule for disable global imports packages',
			recommended: false,
			url: null,
		},
		fixable: null,
		messages: {
			importModulesMessageId: 'Импортируйте только нужный модуль а не всю библиотеку',
		},
		schema: [],
	},

	create(context) {
		return {
			ImportDeclaration(node) {
				// TODO: Добавить еще библиотеки если требуется
				const packages = ['lodash'];

				if (
					node.source.value &&
					packages.includes(node.source.value.split('/')[0]) &&
					!node.source.value.includes('/')
				) {
					context.report({
						node: node,
						messageId: 'importModulesMessageId',
					});
				}
			},
		};
	},
};
