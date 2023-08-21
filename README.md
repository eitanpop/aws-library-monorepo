# AWS Helper Library

This library simplifies working with various AWS services, such as DynamoDB, AWS Timestream, and Cognito. Each of the AWS libraries are modularized and managed using Lerna, allowing for them to be released as separate npm packages.

## Prerequisites

- Make sure you have `node.js` and `npm` installed on your machine.
- `lerna` should be installed globally or can be run using `npx`.

## Setup

1. **Installing Dependencies**  
   Before you start working with the libraries, install all the dependencies.
   ```bash
   npm i
   ```

2. **Building the Libraries**  
   To compile and build the packages, use the build command:
   ```bash
   npm run build
   ```

3. **Deploying to a Development Environment**  
   To deploy to an AWS environment
   ```bash
   npm run deploy:dev
   npm run deploy:staging
   npm run deploy:prod
   ```

4. **Running Unit Tests**  
   To run unit tests:
   ```bash
   npm run test:unit
   ```

5. **Visualizing Dependency Graph**  
   To view the dependency graph:
   ```bash
   npx nx graph
   ```


## Future Development


## Contribution
If you would like to contribute to the development of this wrapper, please fork the repository and submit a pull request. Feedback and suggestions are always welcome!

## License
This project is licensed under the MIT License.