const path = require('path');

module.exports = {
	hasViewSuffix,
	convertToDashCase,
	validateBEMClassName,
	processClassNameAttributes,
	processChildren,
	processChildrenForTernaryOperator,
	getPageName,
	processCallExpression,
	processClassNameAttributesAndChildren,
	processValidateExpression,
};

function getPageName(filename) {
	return path.basename(path.dirname(filename));
}

function hasViewSuffix(str) {
	return str.endsWith('View');
}

function convertToDashCase(str) {
	return str
		.replace(/(view|wrapper)$/i, '')
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.toLowerCase();
}

function validateBEMClassName(className, componentName, conditions) {
	const classes = className.split(' ');
	let hasPrefix = false;
	const modifiers = {};

	for (const classItem of classes) {
		if (classItem === convertToDashCase(componentName)) {
			hasPrefix = true;
			continue;
		}

		if (classItem.split(/_/)[0] !== convertToDashCase(componentName)) {
			return { valid: false, errorType: 'prefixMessageId' };
		}

		const restOfClassName = classItem.slice(componentName.length);

		if (!restOfClassName.match(/^([-_]{1,2}[a-z]+[a-z0-9]*)*$/)) {
			return { valid: false, errorType: 'syntaxMessageId' };
		}

		const parts = restOfClassName.split(/_/);

		let length = parts.length > 2 ? 2 : 1;

		if (parts.length > 2 || parts.length === 2) {
			const modifier = parts[parts.length - 1];

			if (!modifier.match(/^[a-zA-Z]+(-[a-zA-Z]+)*$/)) {
				return { valid: false, errorType: 'syntaxMessageId' };
			}

			if (!conditions) {
				if (parts[parts.length - length] !== '') {
					if (modifiers[modifier]) {
						return { valid: false, errorType: 'dublicateModificatorMessageId' };
					}
					modifiers[modifier] = true;
				} else {
					return { valid: true };
				}
			}
		}
	}

	if (!hasPrefix && !conditions) {
		return { valid: false, errorType: 'missingModifierMessageId' };
	}

	return { valid: true };
}

const expressionsToProcess = ['consequent', 'alternate', 'right'];

const expressionTypes = ['ConditionalExpression', 'LogicalExpression', 'IfStatement'];

function processClassNameAttributes(attributes, node, componentName, context) {
	attributes.forEach((attribute) => {
		if (attribute.name?.name === 'className' && attribute?.value) {
			if (attribute.value.type === 'JSXExpressionContainer') {
				processValidateExpression(attribute.value.expression, attribute, componentName, context, true);
			} else if (attribute?.value?.expression?.openingElement) {
				const attributes = attribute.value.expression?.openingElement.attributes;

				processClassNameAttributesAndChildren(
					attributes,
					attribute.value.expression?.children,
					attribute,
					convertToDashCase(componentName),
					context,
				);
			} else {
				const resultValidate = validateBEMClassName(attribute.value.value, componentName);

				if (!resultValidate.valid) {
					context.report({
						node: attribute,
						messageId: resultValidate.errorType,
					});
				}
			}
		}

		if (attribute?.value?.type === 'JSXExpressionContainer') {
			if (attribute.value.expression) {
				if (attribute.value.expression.elements) {
					processArrayExpression(attribute.value.expression.elements, componentName, context);
				} else {
					processValidateExpression(attribute.value.expression, attribute, componentName, context);
				}
			}
		}
	});
}

function processChildren(children, node, componentName, context) {
	children.forEach((child) => {
		if (child.type === 'JSXElement') {
			const attributes = child.openingElement.attributes;

			processClassNameAttributesAndChildren(
				attributes,
				child.children,
				node,
				convertToDashCase(componentName),
				context,
			);
		}

		if (child.type === 'JSXExpressionContainer') {
			processValidateExpression(child.expression, node, componentName, context);
		}
	});

	if (node.type === 'JSXElement') {
		const attributes = node.openingElement.attributes;
		processClassNameAttributes(attributes, node, componentName, context);
	}
}

function processCallExpression(expression, node, componentName, context) {
	if (expression?.arguments[0] && expression?.arguments[0]?.type === 'ArrowFunctionExpression') {
		if (Array.isArray(expression?.arguments[0]?.body?.body)) {
			processBodyAttributes(expression?.arguments[0]?.body?.body, node, componentName, context);
		} else if (expression?.arguments[0]?.body?.type === 'ObjectExpression') {
			processObjectExpression(expression?.arguments[0]?.body?.properties, componentName, context);
		} else {
			const attributes = expression?.arguments[0]?.body?.openingElement?.attributes;

			processClassNameAttributesAndChildren(
				attributes,
				expression?.arguments[0]?.body?.children,
				node,
				convertToDashCase(componentName),
				context,
			);
		}
	}
}

function processValidateExpression(expression, node, componentName, context, className = false) {
	if (expression.expressions?.length) {
		expression.expressions.forEach((item) => {
			if (expressionTypes.includes(item.type)) {
				const isQuasis = expression?.quasis?.some((item) => {
					return item.value?.raw?.trim() === convertToDashCase(componentName);
				});

				expressionsToProcess.forEach((expression) => {
					if (item[expression]?.value && className) {
						const resultExpressionValidate = validateBEMClassName(
							item[expression]?.value.toString('').trim(),
							componentName,
							isQuasis,
						);

						if (!resultExpressionValidate.valid) {
							context.report({
								node: item[expression],
								messageId: resultExpressionValidate.errorType,
							});
						}
					}
				});
			}
		});
	}

	if (expressionTypes.includes(expression.type)) {
		expressionsToProcess.forEach((item) => {
			if (expression[item]?.value && className) {
				const resultExpressionValidate = validateBEMClassName(
					expression[item]?.value.toString('').trim(),
					componentName,
				);

				if (!resultExpressionValidate.valid) {
					context.report({
						node: expression[item],
						messageId: resultExpressionValidate.errorType,
					});
				}
			}
			if (expression[item]?.type === 'JSXElement' && expression[item]?.openingElement) {
				const attributes = expression[item].openingElement.attributes;

				processClassNameAttributesAndChildren(
					attributes,
					expression[item].children,
					expression[item],
					convertToDashCase(componentName),
					context,
				);
			}

			if (expression[item]?.type === 'JSXFragment' && expression[item]?.openingFragment) {
				processClassNameAttributesAndChildren(
					null,
					expression[item].children,
					expression[item],
					convertToDashCase(componentName),
					context,
				);
			}

			if (expression[item]?.type === 'CallExpression' && expression[item]?.arguments?.length) {
				processCallExpression(expression[item], expression[item], componentName, context);
			}
			if (Array.isArray(expression[item]?.body)) {
				processBodyAttributes(expression[item]?.body, node, componentName, context);
			}
		});
	}

	if (expression.quasis?.length) {
		expression.quasis.forEach((item) => {
			if (item.value.raw.trim() !== '' && className) {
				const resultQuasisValidate = validateBEMClassName(item.value.raw.trim(), componentName, true);

				if (!resultQuasisValidate.valid) {
					context.report({
						node: item,
						messageId: resultQuasisValidate.errorType,
					});
				}
			}
		});
	}

	if (expression?.type === 'ArrayExpression') {
		processArrayExpression(expression.elements, componentName, context);
	}

	if (expression?.type === 'ArrowFunctionExpression') {
		if (Array.isArray(expression?.body?.body)) {
			const layout = expression?.body?.body[0]?.argument;

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
	}

	if (expression?.type === 'ObjectExpression') {
		processObjectExpression(expression.properties, componentName, context);
	}

	if (expression?.type === 'CallExpression' && expression?.arguments?.length) {
		processCallExpression(expression, node, componentName, context);
	}

	if (expression.openingElement) {
		processClassNameAttributesAndChildren(
			expression.openingElement.attributes,
			expression.children,
			node,
			convertToDashCase(componentName),
			context,
		);
	}
}

function processBodyAttributes(bodyAttributes, node, componentName, context) {
	bodyAttributes.forEach((item) => {
		if (expressionTypes.includes(item.type)) {
			processValidateExpression(item, node, componentName, context);
		} else if (item.argument?.arguments) {
			processCallExpression(item.argument, node, componentName, context);
		} else {
			processClassNameAttributesAndChildren(
				item.argument?.openingElement?.attributes,
				item.argument?.children,
				node,
				convertToDashCase(componentName),
				context,
			);
		}
	});
}

function processClassNameAttributesAndChildren(attributes, children, node, componentName, context) {
	if (attributes?.length) {
		processClassNameAttributes(attributes, node, convertToDashCase(componentName), context);
	}

	if (children?.length) {
		processChildren(children, node, convertToDashCase(componentName), context);
	}
}

function processArrayExpression(elements, componentName, context) {
	elements.forEach((element) => {
		if (element.properties?.length) {
			element.properties.forEach((property) => {
				if (property?.value?.type === 'JSXElement' && property?.value?.openingElement) {
					const attributes = property?.value?.openingElement?.attributes;

					processClassNameAttributesAndChildren(
						attributes,
						property.value?.children,
						property,
						convertToDashCase(componentName),
						context,
					);
				}
			});
		}
		if (element.type === 'SpreadElement' && element?.argument && element?.argument?.arguments) {
			processCallExpression(element.argument, element.argument, componentName, context);
		}
	});
}

function processObjectExpression(properties, componentName, context) {
	properties.forEach((property) => {
		if (property?.value?.type === 'JSXElement' && property?.value?.openingElement) {
			const attributes = property?.value?.openingElement?.attributes;

			processClassNameAttributesAndChildren(
				attributes,
				property.value?.children,
				property,
				convertToDashCase(componentName),
				context,
			);
		}
		if (expressionTypes.includes(property?.value?.type)) {
			processValidateExpression(property?.value, property, componentName, context);
		}
	});
}

function processChildrenForTernaryOperator(children, node, context) {
	if (!children) return;

	children.forEach((child) => {
		if (child.type === 'JSXElement') {
			if (child.children) {
				processChildrenForTernaryOperator(child.children, node, context);
			}
		}

		if (child.type === 'JSXExpressionContainer') {
			const expression = child.expression;

			if (expression.type === 'ConditionalExpression') {
				if (expression.consequent.consequent || expression.alternate.consequent) {
					context.report({
						node: expression,
						messageId: 'doubleTernaryMessageId',
					});
				}
			}
		}
	});
}
