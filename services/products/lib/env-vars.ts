import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface IEnv {
  key: string;
  value: string;
}

export const setEnvVars = (fn: NodejsFunction, envs: IEnv[]): void => {
  for (const { key, value } of envs) {
    fn.addEnvironment(key, value);
  }
};
