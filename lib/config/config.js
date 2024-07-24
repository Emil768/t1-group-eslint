module.exports = {
	rules: {
		'linebreak-style': 'off', // Неправильно работает в Windows.
		'arrow-parens': 'off', // Несовместимо с prettier
		'object-curly-newline': 'off', // Несовместимо с prettier
		'no-mixed-operators': 'off', // Несовместимо с prettier
		'arrow-body-style': 'off', // Это - не наш стиль?
		'function-paren-newline': 'off', // Несовместимо с prettier
		'no-plusplus': 'off',
		'space-before-function-paren': 0, // Несовместимо с prettier
		'max-len': ['warn', 180, 2, { ignoreUrls: true, ignorePattern: '^import' }], // airbnb позволяет некоторые пограничные случаи
		'no-console': 'warn', // airbnb использует предупреждение
		'no-alert': 'warn', // airbnb использует предупреждение
		'no-param-reassign': 'off', // Это - не наш стиль?
		radix: 'off', // parseInt, parseFloat и radix выключены. Мне это не нравится.
		camelcase: 'off', // бэк работает с такими_параметрами_запроса_и_ответа
		'react/require-default-props': 'off', // airbnb использует уведомление об ошибке
		'react/forbid-prop-types': 'off', // airbnb использует уведомление об ошибке
		'react/jsx-filename-extension': ['warn', { extensions: ['.js'] }], // airbnb использует .jsx
		'react/jsx-indent': 'off', // конфликт с prettier
		'prefer-destructuring': 'off',
		'react/jsx-indent-props': 'off', // конфликт с prettier
		'import/no-extraneous-dependencies': 'off',
		'react/no-find-dom-node': 'off', // Я этого не знаю
		'react/no-did-mount-set-state': 'off',
		'react/no-unused-prop-types': 'off', // Это всё ещё работает нестабильно
		'new-cap': 'off',
		'no-shadow': 'off',
		'implicit-arrow-linebreak': 'off',
		'react/jsx-one-expression-per-line': 'off',
		'jsx-a11y/no-static-element-interactions': 'off',
		'jsx-a11y/click-events-have-key-events': 'off',
		'import/prefer-default-export': 'off',
		'operator-linebreak': 'off',
		'jsx-quotes': [2, 'prefer-double'],
		'jsx-a11y/anchor-is-valid': ['warn', { components: ['Link'], specialLink: ['to'] }],
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				js: 'never',
				mjs: 'never',
				jsx: 'never',
			},
		],
		'jsx-a11y/label-has-for': [
			2,
			{
				required: {
					every: ['id'],
				},
			},
		], // для ошибки вложенных свойств htmlFor элементов label
		indent: 'off',
		'no-tabs': 'off',
		'prettier/prettier': [2, { useTabs: true, endOfLine: 'auto' }],
		'padding-line-between-statements': [
			'error',
			{ blankLine: 'always', prev: 'multiline-const', next: '*' },
			{ blankLine: 'always', prev: '*', next: 'multiline-const' },
			{ blankLine: 'always', prev: 'const', next: 'const' },
			{ blankLine: 'always', prev: ['block-like', 'const'], next: 'return' },
		],
		't1-group/import-packages': 'error',
		't1-group/unused-operators': 'error',
		'no-restricted-imports': ['error', 'lodash'],
	},
	overrides: [
		{
			files: ['src/pages/**/*.js'],
			rules: {
				't1-group/moment-constants-required': 'warn',
				't1-group/bem-syntax': 'error',
			},
		},
	],
};
