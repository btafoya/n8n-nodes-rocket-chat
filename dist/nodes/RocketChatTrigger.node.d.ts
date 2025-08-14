import type { IWebhookFunctions, ITriggerResponse, ITriggerFunctions, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class RocketChatTrigger implements INodeType {
    description: INodeTypeDescription;
    webhook(this: IWebhookFunctions): Promise<{
        workflowData: import("n8n-workflow").INodeExecutionData[][];
        noWebhookResponse?: undefined;
    } | {
        noWebhookResponse: boolean;
        workflowData?: undefined;
    }>;
    trigger(this: ITriggerFunctions): Promise<ITriggerResponse>;
}
