/**
 * @fileoverview Rules for correctly writing classes using the BEM methodology
 * @author BEM-syntax
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */

const {
	convertToDashCase,
	processCallExpression,
	processClassNameAttributesAndChildren,
	processValidateExpression,
} = require('../../utils');

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
					if (node.init?.body?.body && node.init?.body?.body.length) {
						const layout = node.init?.body?.body;

						layout.forEach((item) => {
							if (item.argument) {
								if (item.argument?.type === 'JSXElement' && item.argument?.openingElement) {
									const attributes = item.argument.openingElement.attributes;

									processClassNameAttributesAndChildren(
										attributes,
										item.argument.children,
										node,
										convertToDashCase(componentName),
										context,
									);
								}

								if (item.argument?.type === 'JSXFragment' && item.argument?.openingFragment) {
									processClassNameAttributesAndChildren(
										null,
										item.argument.children,
										node,
										convertToDashCase(componentName),
										context,
									);
								}
							}

							if (item.type === 'IfStatement') {
								processValidateExpression(item, node, componentName, context);
							}
						});
					}

					if (node.init?.type === 'CallExpression' && node.init?.arguments?.length) {
						processCallExpression(node.init, node, componentName, context);
					}
				}
			},
		};
	},
};
