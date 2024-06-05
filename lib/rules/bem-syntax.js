/**
 * @fileoverview Rules for correctly writing classes using the BEM methodology
 * @author BEM-syntax
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */

const { hasViewSuffix, convertToDashCase, processClassNameAttributes, processChildren } = require('../../utils');

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Rules for correctly writing classes using the BEM methodology',
			recommended: false,
			url: null,
		},
		fixable: null,
		messages: {
			missingModifierMessageId: 'Модификатор не может использоваться без родительского класса',
			dublicateModificatorMessageId: 'Невозможно одновременно использовать два одинаковых модификатора',
			prefixMessageId: 'Наименование класса должно совпадать с родительским',
			syntaxMessageId: 'В наименовании классов не должно быть лишних символов',
		},
		schema: [],
	},

	create(context) {
		return {
			VariableDeclarator(node) {
				const componentName = node.id.name;

				if (componentName && hasViewSuffix(componentName)) {
					if (node.init?.body?.body) {
						const layout = node.init.body.body[0].argument;

						if (layout?.openingElement) {
							const attributes = layout.openingElement.attributes;
							processClassNameAttributes(attributes, convertToDashCase(componentName), context, true);

							processChildren(layout.children, node, convertToDashCase(componentName), context);
						}
					}

					if (node.init?.type === 'CallExpression' && node.init?.arguments?.length) {
						if (node.init?.arguments[0] && node.init?.arguments[0]?.type === 'ArrowFunctionExpression') {
							const layout = node.init?.arguments[0]?.body?.body[0]?.argument;
							if (layout?.openingElement) {
								const attributes = layout.openingElement.attributes;
								processClassNameAttributes(attributes, convertToDashCase(componentName), context, true);

								processChildren(layout.children, node, convertToDashCase(componentName), context);
							}
						}
					}
				}
			},
		};
	},
};
