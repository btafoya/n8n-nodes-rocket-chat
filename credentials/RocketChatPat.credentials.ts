import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class RocketChatPat implements ICredentialType {
	name = 'rocketChatPat';
	displayName = 'Rocket.Chat (PAT)';
	documentationUrl = 'https://developer.rocket.chat/apidocs/rocketchat-api';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://chat.example.com',
			placeholder: 'https://chat.example.com',
			description: 'Your Rocket.Chat server URL',
		},
		{
			displayName: 'User ID',
			name: 'userId',
			type: 'string',
			default: '',
			description: 'The user ID owning the PAT (e.g. rbAXPnMktTFbNpwtJ)',
		},
		{
			displayName: 'Auth Token (PAT)',
			name: 'authToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Personal Access Token',
		},
		{
			displayName: 'Default Target (channel or @user)',
			name: 'defaultTarget',
			type: 'string',
			default: 'your-channel',
			description: 'Used when a node omits a target',
		},
		{
			displayName: 'Request Timeout (ms)',
			name: 'timeout',
			type: 'number',
			default: 30000,
		},
	];
}
