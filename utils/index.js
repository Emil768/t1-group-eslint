const path = require('path');

module.exports = {
	hasViewSuffix,
	convertToDashCase,
	validateBEMClassName,
	processClassNameAttributes,
	processChildren,
	processChildrenForTernaryOperator,
	getPageName,
};

function getPageName(filename) {
	return path.basename(path.dirname(filename));
}

function hasViewSuffix(str) {
	return str.endsWith('View');
}

function convertToDashCase(str) {
	return str
		.replace(/view$/i, '')
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.toLowerCase();
}

function validateBEMClassName(className, componentName, parentNode) {
	const classes = className.split(' ');
	let hasPrefix = false;
	const modifiers = {};

	for (const classItem of classes) {
		if (parentNode) {
			if (classItem !== convertToDashCase(componentName)) {
				return { valid: false, errorType: 'prefixMessageId' };
			}
		}

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
		if (parts.length > 2) {
			const modifier = parts[parts.length - 1];

			if (parts[parts.length - 2] !== '') {
				if (modifiers[modifier]) {
					return { valid: false, errorType: 'dublicateModificatorMessageId' };
				}
				modifiers[modifier] = true;
			} else {
				return { valid: true };
			}
		}
	}

	if (!hasPrefix) {
		return { valid: false, errorType: 'missingModifierMessageId' };
	}

	return { valid: true };
}

function processClassNameAttributes(attributes, componentName, context, parentNode = false) {
	attributes.forEach((attribute) => {
		if (attribute.name.name === 'className' && attribute.value) {
			if (attribute.value.type === 'JSXExpressionContainer') {
				const expression = attribute.value.expression;

				if (expression.quasis?.length) {
					expression.quasis.forEach((item) => {
						if (item.value.raw.trim() !== '') {
							const resultQuasisValidate = validateBEMClassName(
								item.value.raw.trim(),
								componentName,
								parentNode,
							);

							if (!resultQuasisValidate.valid) {
								context.report({
									node: attribute,
									messageId: resultQuasisValidate.errorType,
								});
							}
						}
					});
				}

				if (expression.openingElement) {
					const attributes = expression.openingElement.attributes;
					processClassNameAttributes(attributes, componentName, context);

					processChildren(expression.children, attribute, componentName, context);
				}
			} else {
				const resultValidate = validateBEMClassName(attribute.value.value, componentName, parentNode);

				if (!resultValidate.valid) {
					context.report({
						node: attribute,
						messageId: resultValidate.errorType,
					});
				}
			}
		} else if (attribute?.value?.expression?.openingElement) {
			const attributes = attribute.value.expression?.openingElement.attributes;
			processClassNameAttributes(attributes, componentName, context);

			processChildren(attribute.value.expression?.children, attribute, componentName, context);
		}
	});
}

function processChildren(children, node, componentName, context) {
	if (!children) return;

	children.forEach((child) => {
		if (child.type === 'JSXElement') {
			const attributes = child.openingElement.attributes;
			processClassNameAttributes(attributes, componentName, context);

			if (child.children) {
				processChildren(child.children, node, componentName, context);
			}
		}

		if (child.type === 'JSXExpressionContainer') {
			const expression = child.expression;

			if (expression.type === 'ConditionalExpression' || expression.type === 'LogicalExpression') {
				const expressionToProcess = expression.consequent || expression.alternate || expression.right;

				if (expressionToProcess) {
					processChildren(expressionToProcess.children, expressionToProcess, componentName, context);
				}
			}
		}
	});

	if (node.type === 'JSXElement') {
		const attributes = node.openingElement.attributes;
		processClassNameAttributes(attributes, componentName, context);
	}
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
