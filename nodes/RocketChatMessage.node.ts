import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { rcApiRequest, rcApiRequestAllItems, resolveRoomId, resolveTargetRid } from '../transport/GenericFunctions';

export class RocketChatMessage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Rocket.Chat: Message',
		name: 'rocketChatMessage',
		group: ['output'],
		version: 2,
		description: 'Send, update, delete messages; DM helpers',
		defaults: { name: 'Rocket.Chat Message' },
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [{ name: 'rocketChatPat', required: true }],
		// methods: {
		// 	loadOptions: {
		// 		async listRooms(this: ILoadOptionsFunctions) {
		// 			// Include public channels joined + private groups + DMs the user has access to
		// 			const chans = await rcApiRequestAllItems.call(this, '/api/v1/channels.list.joined', 'channels', {}, 500);
		// 			const groups = await rcApiRequestAllItems.call(this, '/api/v1/groups.list', 'groups', {}, 500).catch(() => []);
		// 			const dms = await rcApiRequestAllItems.call(this, '/api/v1/im.list', 'ims', {}, 500).catch(() => []);

		// 			const opts: Array<{ name: string; value: string; description?: string }> = [];
		// 			for (const c of chans) opts.push({ name: `#${c.name}`, value: c._id, description: 'Channel' });
		// 			for (const g of groups) opts.push({ name: `(Private) ${g.name}`, value: g._id, description: 'Private Group' });
		// 			for (const dm of dms) {
		// 				const uname = dm?.user?.username || dm?.username || dm?.fname || dm?.name || dm?._id;
		// 				opts.push({ name: `DM: @${uname}`, value: dm._id, description: 'Direct Message' });
		// 			}
		// 			return opts.sort((a, b) => a.name.localeCompare(b.name));
		// 		},
		// 		async listUsers(this: ILoadOptionsFunctions) {
		// 			const users = await rcApiRequestAllItems.call(this, '/api/v1/users.list', 'users', {}, 1000);
		// 			return users
		// 				.filter((u: any) => !!u.username)
		// 				.map((u: any) => ({ name: `${u.name || u.username} (@${u.username})`, value: u.username }))
		// 				.sort((a: any, b: any) => a.name.localeCompare(b.name));
		// 		},
		// 	},
		// },
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'post',
				options: [
					{ name: 'Post Message', value: 'post', description: 'chat.postMessage' },
					{ name: 'Send Message (advanced)', value: 'send', description: 'chat.sendMessage (custom _id)' },
					{ name: 'Update Message', value: 'update', description: 'chat.update' },
					{ name: 'Delete Message', value: 'delete', description: 'chat.delete' },
					{ name: 'Open DM', value: 'openDm', description: 'im.open (returns roomId)' },
					{ name: 'Send DM', value: 'sendDm', description: 'im.open + post message to that DM' },
				],
			},

			/** Targeting mode */
			{
				displayName: 'Target Mode',
				name: 'targetMode',
				type: 'options',
				default: 'text',
				options: [
					{ name: 'Free Text (roomId/#channel/@username)', value: 'text' },
					{ name: 'Pick a Room', value: 'pickerRoom' },
					{ name: 'Pick a User (@username)', value: 'pickerUser' },
				],
				displayOptions: { show: { operation: ['post', 'send', 'update', 'delete'] } },
			},
			{
				displayName: 'Target',
				name: 'target',
				type: 'string',
				default: '',
				placeholder: '#general or @username or roomId',
				description: 'If empty, uses Default Target from credentials',
				displayOptions: { show: { operation: ['post', 'send', 'update', 'delete'], targetMode: ['text'] } },
			},
			{
				displayName: 'Room',
				name: 'targetRoom',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'listRooms' },
				default: '',
				description: 'Pick a room (channel/group/DM)',
				displayOptions: { show: { operation: ['post', 'send', 'update', 'delete'], targetMode: ['pickerRoom'] } },
			},
			{
				displayName: 'User',
				name: 'targetUser',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'listUsers' },
				default: '',
				description: 'Pick a user to DM (@username)',
				displayOptions: { show: { operation: ['post', 'send', 'update', 'delete'], targetMode: ['pickerUser'] } },
			},

			/** Message payload */
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				displayOptions: { show: { operation: ['post', 'send', 'sendDm'] } },
			},
			{
				displayName: 'Thread ID (tmid)',
				name: 'tmid',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['post', 'send', 'sendDm'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['post', 'send', 'sendDm'] } },
				options: [
					{ displayName: 'Alias', name: 'alias', type: 'string', default: '' },
					{ displayName: 'Emoji Avatar', name: 'emoji', type: 'string', default: '' },
					{ displayName: 'Avatar URL', name: 'avatar', type: 'string', default: '' },
					{ displayName: 'Parse URLs', name: 'parseUrls', type: 'boolean', default: true },
					{
						displayName: 'Attachments (raw JSON array)',
						name: 'attachments',
						type: 'json',
						default: '[]',
					},
				],
			},

			/** Update/Delete specifics */
			{
				displayName: 'Message ID',
				name: 'msgId',
				type: 'string',
				default: '',
				description: 'The _id of the message to update/delete',
				displayOptions: { show: { operation: ['update', 'delete'] } },
			},
			{
				displayName: 'New Text',
				name: 'newText',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['update'] } },
			},

			/** DM helpers */
			{
				displayName: 'Username',
				name: 'dmUsername',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'listUsers' },
				default: '',
				description: 'User to open DM with',
				displayOptions: { show: { operation: ['openDm', 'sendDm'] } },
			},
		],
	};


	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;

			if (operation === 'post' || operation === 'send') {
				const rid = await resolveTargetRid.call(this, i);
				const text = this.getNodeParameter('text', i) as string;
				const tmid = this.getNodeParameter('tmid', i, '') as string;
				const additional = this.getNodeParameter('additionalFields', i, {}) as any;

				const body: any = { roomId: rid, text };
				if (tmid) body.tmid = tmid;
				if (additional.alias) body.alias = additional.alias;
				if (additional.emoji) body.emoji = additional.emoji;
				if (additional.avatar) body.avatar = additional.avatar;
				if (additional.parseUrls !== undefined) body.parseUrls = additional.parseUrls;
				if (additional.attachments) body.attachments = JSON.parse(additional.attachments);

				const endpoint = operation === 'post' ? '/api/v1/chat.postMessage' : '/api/v1/chat.sendMessage';
				const res = await rcApiRequest.call(this, 'POST', endpoint, body);
				returnData.push({ json: res });
			}

			if (operation === 'update') {
				const rid = await resolveTargetRid.call(this, i);
				const msgId = this.getNodeParameter('msgId', i) as string;
				const newText = this.getNodeParameter('newText', i) as string;
				const res = await rcApiRequest.call(this, 'POST', '/api/v1/chat.update', {
					roomId: rid,
					msgId,
					text: newText,
				});
				returnData.push({ json: res });
			}

			if (operation === 'delete') {
				const rid = await resolveTargetRid.call(this, i);
				const msgId = this.getNodeParameter('msgId', i) as string;
				const res = await rcApiRequest.call(this, 'POST', '/api/v1/chat.delete', {
					roomId: rid,
					msgId,
				});
				returnData.push({ json: res });
			}

			if (operation === 'openDm') {
				const username = this.getNodeParameter('dmUsername', i) as string;
				const res = await rcApiRequest.call(this, 'POST', '/api/v1/im.open', { username });
				returnData.push({ json: res });
			}

			if (operation === 'sendDm') {
				const username = this.getNodeParameter('dmUsername', i) as string;
				const text = this.getNodeParameter('text', i) as string;
				const tmid = this.getNodeParameter('tmid', i, '') as string;
				const additional = this.getNodeParameter('additionalFields', i, {}) as any;

				const dm = await rcApiRequest.call(this, 'POST', '/api/v1/im.open', { username });
				const rid = dm?.room?._id;
				if (!rid) throw new Error(`Could not open DM with @${username}`);

				const body: any = { roomId: rid, text };
				if (tmid) body.tmid = tmid;
				if (additional.alias) body.alias = additional.alias;
				if (additional.emoji) body.emoji = additional.emoji;
				if (additional.avatar) body.avatar = additional.avatar;
				if (additional.parseUrls !== undefined) body.parseUrls = additional.parseUrls;
				if (additional.attachments) body.attachments = JSON.parse(additional.attachments);

				const res = await rcApiRequest.call(this, 'POST', '/api/v1/chat.postMessage', body);
				returnData.push({ json: res });
			}
		}

		return this.prepareOutputData(returnData);
	}
}
