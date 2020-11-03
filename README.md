[![AWS Serverless Kickstarter](./banner.svg)](./banner.svg)

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI. 

It is based on the [Hello World sample application by AWS](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html), with a few additions:

- **Layers**: sample Utils [AWS Lambda Layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) with `config-utils` to retrieve secrets (i.e. API keys) from [AWS Systems Manager (SSM) Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html), and a sample `google-utils` service for consuming an external API to be used be multiple Lambdas. 
- **Streamlined Deployment & Development Commands**: Simply run `npm run dev` to start a local API, or `npm run deployDev|Staging|Prod` to deploy a [CloudFormation Stack](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacks.html) for an environment.  
- **GitHub Actions CI/CD**: Workflow added to automatically deploy a prod CloudFormation Stack upon merging a PR to `master`. Easily replicable for automatically deploy to a staging or dev environment. 
- **Separate CloudFormation Stacks For Each Environment**

It includes the following files and folders.

- `src/sample` - Code for the application's Lambda function.
- `src/sample/events` - Invocation events that you can use to invoke the function.
- `src/sample/tests` - Unit tests for the application code. 
- `template.yaml` - A template that defines the application's AWS resources.

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

If you prefer to use an integrated development environment (IDE) to build and test your application, you can use the AWS Toolkit.  
The AWS Toolkit is an open source plug-in for popular IDEs that uses the SAM CLI to build and deploy serverless applications on AWS. The AWS Toolkit also adds a simplified step-through debugging experience for Lambda function code. See the following links to get started.

* [PyCharm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [IntelliJ](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [VS Code](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/welcome.html)
* [Visual Studio](https://docs.aws.amazon.com/toolkit-for-visual-studio/latest/user-guide/welcome.html)

## Deploy the sample application

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

Prerequisites:

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 12 or above](https://nodejs.org/en/), including the NPM package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)
* S3 bucket to store build artifacts for AWS SAM. 
    * Create the bucket, and set the value of `s3_bucket` in [samconfig.toml](./samconfig.toml) to the name of the bucket for each environment
* IAM User with [Programmatic Access](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) to AWS
    * The IAM User will need the following [permissions](https://aws.amazon.com/iam/features/manage-permissions/) on the Resource `arn:aws:iam::[your AWS account ID]:role/*`:
        * "iam:TagRole"
        * "iam:CreateRole"
        * "iam:DeleteRole"
        * "iam:AttachRolePolicy"
        * "iam:DetachRolePolicy"
        * "iam:TagUser"
    * When deploying manually, you will need to [configure your AWS CLI with the profile of the user](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).
    * When deploying via CI/CD, you will need to update the [GitHub Actions Secrets](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets) with your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` for the user.

To build and deploy your application for the first time, run the following in your shell:

```bash
npm run deployDev
or
npm run deployStaging
or
npm run deployProd
```

The command will build the source of your application, package, and deploy your application to AWS, with a series of prompts:

You can find your API Gateway Endpoint URL in the output values displayed after deployment.

## Use the SAM CLI to build and test locally

To [start API Gateway locally](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-start-api.html), use the `npm run dev` command.

```bash
$ npm run dev
```

The SAM CLI installs dependencies defined in `src/sample/package.json`, creates a deployment package, and saves it in the `.aws-sam/build` folder. It will accept incoming connections to `localhost:3000`. 

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them with the `npm run local` command.

```bash
$ npm run local
```

The SAM CLI reads the application template to determine the API's routes and the functions that they invoke. The `Events` property on each function's definition includes the route and method for each path.

```yaml
      Events:
        Sample:
          Type: Api
          Properties:
            Path: /sample
            Method: get
```

## Customization

To make the application yours, replace `kickstarter` in [samconfig.toml](./samconfig.toml) and the [package.json](package.json) with the name of your application.  

## Add a resource to your application
The application template uses AWS Serverless Application Model (AWS SAM) to define application resources. AWS SAM is an extension of AWS CloudFormation with a simpler syntax for configuring common serverless application resources such as functions, triggers, and APIs. For resources not included in [the SAM specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md), you can use standard [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html) resource types.

## Fetch, tail, and filter Lambda function logs

To simplify troubleshooting, SAM CLI has a command called `sam logs`. `sam logs` lets you fetch logs generated by your deployed Lambda function from the command line. In addition to printing the logs on the terminal, this command has several nifty features to help you quickly find the bug.

`NOTE`: This command works for all AWS Lambda functions; not just the ones you deploy using SAM.

```bash
$ sam logs -n HelloWorldFunction --stack-name kickstarter-api --tail
```

You can find more information and examples about filtering Lambda function logs in the [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

## Unit tests

Tests are defined in the `sample/tests` folder in this project. Use NPM to install the [Mocha test framework](https://mochajs.org/) and run unit tests.

```bash
$ cd sample
$ npm install
$ npm run test
```

## Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
aws cloudformation delete-stack --stack-name kickstarter-api
```

## Resources

See the [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to SAM specification, the SAM CLI, and serverless application concepts.

Next, you can use AWS Serverless Application Repository to deploy ready to use Apps that go beyond hello world samples and learn how authors developed their applications: [AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/)
