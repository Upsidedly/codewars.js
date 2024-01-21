module.exports = {
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'neon/common', 'neon/typescript', 'neon/module', 'neon/prettier'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['tsconfig.json']
	},
    ignorePatterns: ['.eslintrc.cjs', 'ecosystem.config.cjs', 'dist/**/**.js'],
    root: true,
	rules: {
		"@typescript-eslint/consistent-type-definitions": "off"
	}
};
