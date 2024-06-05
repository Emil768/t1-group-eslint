plugins for syntactically correct code of T1 company

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-t1-group`:

```sh
npm install eslint-plugin-t1-group --save-dev
```

## Usage

Add `t1-group-plugin` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
	"plugins": ["t1-group"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
	"rules": {
		"t1-group/import-packages": "error", // or 'no-restricted-imports': ['error', 'lodash'],
		"t1-group/unused-operators": "error",
		"no-restricted-imports": ["error", "lodash"]
	},
	// Recommended for use in pages folder
	"overrides": [
		{
			"files": ["src/pages/**/*.js"],
			"rules": {
				"t1-group/moment-constants-required": "error",
				"t1-group/bem-syntax": "error"
			}
		}
	]
}
```
