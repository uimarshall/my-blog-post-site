# nodejs-express-typescript-template-

This repository is a template on how to setup node express and typescript for projects. This will enable you integrate TypeScript into your nodejs project.

The Principle
We write typescript code in a TypeScript file, then compile or transpile those typescript code into JavaScript and then take those Js file and serve them. Just like we serve files when calls are made to our APIs.

## Things to mention

How I resolved the [Cannot find module error](https://bobbyhadz.com/blog/javascript-cannot-find-module-loader-js)

It happens that the main file in package.json was pointing to `index.js` instead of "main": "`dist/index.js`",

[Creating templates on github](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository)

[Reference](https://blog.logrocket.com/how-to-set-up-node-typescript-express/)

[Reference youtube](https://www.youtube.com/watch?app=desktop&v=11jpa8e5jEQ)

[Reference](https://medium.com/@oxodesign/node-js-express-with-typescript-eslint-jest-prettier-and-husky-part-2-f129188ce404)

[Reference](https://github.com/prettier/eslint-config-prettier)

[Nice eslint doc](https://www.codiga.io/code-analysis/rules/javascript/all/all/)

[Help to resolve one error in the rules](https://stackoverflow.com/questions/74863939/error-invalid-type-boolean-undefined-of-template-literal-expression-typescr)

[ParserOptions.project issue](https://bobbyhadz.com/blog/typescript-parseroptions-project-has-been-set-for)
