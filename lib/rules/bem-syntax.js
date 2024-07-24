/**
 * @fileoverview Rules for correctly writing classes using the BEM methodology
 * @author BEM-syntax
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */

const { convertToDashCase, processCallExpression, processClassNameAttributesAndChildren } = require('../../utils');

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

				if (componentName) {
					if (node.init?.body?.body) {
						const layout = node.init?.body?.body[0]?.argument;

						if (layout?.type === 'JSXElement' && layout?.openingElement) {
							const attributes = layout.openingElement.attributes;

							processClassNameAttributesAndChildren(
								attributes,
								layout.children,
								node,
								convertToDashCase(componentName),
								context,
							);
						}

						if (layout?.type === 'JSXFragment' && layout?.openingFragment) {
							processClassNameAttributesAndChildren(
								null,
								layout.children,
								node,
								convertToDashCase(componentName),
								context,
							);
						}
					}

					if (node.init?.type === 'CallExpression' && node.init?.arguments?.length) {
						processCallExpression(node.init, node, componentName, context);
					}
				}
			},
		};
	},
};
