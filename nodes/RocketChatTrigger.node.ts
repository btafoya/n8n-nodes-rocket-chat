import type {
	IWebhookFunctions,
	ITriggerResponse,
	ITriggerFunctions,
	INodeType,
	INodeTypeDescription,
	ILoadOptionsFunctions,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import WebSocket from 'ws';
import { rcApiRequest, rcApiRequestAllItems, toUnixOrDate } from '../transport/GenericFunctions';

export class RocketChatTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Rocket.Chat: Trigger',
		name: 'rocketChatTrigger',
		group: ['trigger'],
		version: 2,
		description: 'Receive Rocket.Chat messages via Webhook, Polling, or Realtime',
		defaults: { name: 'Rocket.Chat Trigger' },
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [{ name: 'rocketChatPat', required: true }],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'rocketchat',
			},
		],
		// methods: {
		// 	loadOptions: {
		// 		async listRooms(this: ILoadOptionsFunctions) {
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
		// 	},
		// },
		properties: [
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				default: 'webhook',
				options: [
					{ name: 'Webhook', value: 'webhook' },
					{ name: 'Polling', value: 'polling' },
					{ name: 'Realtime (WebSocket)', value: 'realtime' },
				],
			},

			// Webhook
			{
				displayName: 'Acknowledge Immediately',
				name: 'ack',
				type: 'boolean',
				default: true,
				displayOptions: { show: { mode: ['webhook'] } },
			},

			// Polling
			{
				displayName: 'Room',
				name: 'pollRoom',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'listRooms' },
				default: '',
				description: 'Room to poll (uses channels.history or groups/im equivalents)',
				displayOptions: { show: { mode: ['polling'] } },
			},
			{
				displayName: 'Interval (seconds)',
				name: 'interval',
				type: 'number',
				default: 15,
				typeOptions: { minValue: 5 },
				displayOptions: { show: { mode: ['polling'] } },
			},

			// Realtime
			{
				displayName: 'Room',
				name: 'rtRoomId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'listRooms' },
				default: '',
				description: 'Room ID to subscribe to via stream-room-messages',
				displayOptions: { show: { mode: ['realtime'] } },
			},
		],
	};

	// WEBHOOK handler
	async webhook(this: IWebhookFunctions) {
		const ack = this.getNodeParameter('ack') as boolean;
		const body = this.getBodyData();
		if (ack) {
			return { workflowData: [this.helpers.returnJsonArray([body])] };
		}
		return { noWebhookResponse: true };
	}

	// POLLING / REALTIME start/stop
	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const mode = this.getNodeParameter('mode') as string;

		if (mode === 'polling') {
			const rid = this.getNodeParameter('pollRoom') as string;
			const intervalSec = this.getNodeParameter('interval') as number;
			const self = this;

			async function pollOnce() {
				const sinceIso = (self.getWorkflowStaticData('node') as any).lastTs as string | undefined;

				let qs: any = { count: 50, unreads: true };
				if (sinceIso) qs.oldest = sinceIso;

				// channels.history is fine for channels; for groups/DMs, Rocket.Chat also accepts /groups.history and /im.history.
				// Simpler approach: try channels.history, then groups.history, then im.history until one works.
				const endpoints = ['/api/v1/channels.history', '/api/v1/groups.history', '/api/v1/im.history'];
				let res: any = null;
				for (const ep of endpoints) {
					try {
						res = await rcApiRequest.call(self, 'GET', ep, {}, { ...qs, roomId: rid });
						if (res?.messages !== undefined) break;
					} catch { /* try next */ }
				}
				const messages = res?.messages || [];
				if (messages.length) {
					messages.reverse().forEach((m: any) => self.emit([self.helpers.returnJsonArray([m])]));
					const newestTs = messages[messages.length - 1]?.ts;
					if (newestTs) (self.getWorkflowStaticData('node') as any).lastTs = toUnixOrDate(newestTs);
				}
			}

			const interval = setInterval(pollOnce, Math.max(5, intervalSec) * 1000);
			await pollOnce();

			async function closeFunction() {
				clearInterval(interval);
			}

			return { closeFunction };
		}

		if (mode === 'realtime') {
			const creds = await this.getCredentials('rocketChatPat');
			const baseUrl = (creds.baseUrl as string).replace(/\/+$/, '');
			const roomId = this.getNodeParameter('rtRoomId') as string;
			if (!roomId) throw new Error('Room ID is required for realtime mode');

			const wsUrl = baseUrl.replace(/^http/, 'ws') + '/websocket';
			const ws = new WebSocket(wsUrl);
			const self = this;

			function send(obj: any) {
				ws.send(JSON.stringify(obj));
			}

			ws.on('open', () => {
				send({ msg: 'connect', version: '1', support: ['1'] });
			});

			ws.on('message', (data) => {
				let msg: any;
				try { msg = JSON.parse(data.toString()); } catch { return; }

				if (msg.msg === 'connected') {
					send({
						msg: 'method',
						method: 'login',
						id: 'login',
						params: [{ resume: creds.authToken }],
					});
				}

				if (msg.msg === 'result' && msg.id === 'login') {
					send({
						msg: 'sub',
						id: 'sub-room',
						name: 'stream-room-messages',
						params: [roomId, false],
					});
				}

				if (msg.msg === 'changed' && msg.collection === 'stream-room-messages') {
					const args = msg.fields?.args || [];
					args.forEach((m: any) => self.emit([self.helpers.returnJsonArray([m])]));
				}
			});

			async function closeFunction() {
				try { ws.close(); } catch {}
			}

			return { closeFunction };
		}

		return { closeFunction: async () => {} };
	}
}
