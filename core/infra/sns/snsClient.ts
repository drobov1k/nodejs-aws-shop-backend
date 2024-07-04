import { SNSClient as AWSSNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';

interface ISNSClient {
  publish(topicArn: string, message: string, props?: Partial<PublishCommandInput>): Promise<void>;
}

export class SNSClient extends AWSSNSClient implements ISNSClient {
  async publish(topicArn: string, message: string, props?: Partial<PublishCommandInput>): Promise<void> {
    await this.send(
      new PublishCommand({
        Message: message,
        TopicArn: topicArn,
        ...props,
      }),
    );
  }
}
