import { SNSClient as AWSSNSClient, PublishCommand } from '@aws-sdk/client-sns';

interface ISNSClient {
  publish(topicArn: string, message: string): Promise<void>;
}

export class SNSClient extends AWSSNSClient implements ISNSClient {
  async publish(topicArn: string, message: string): Promise<void> {
    await this.send(
      new PublishCommand({
        Message: message,
        TopicArn: topicArn,
      }),
    );
  }
}
