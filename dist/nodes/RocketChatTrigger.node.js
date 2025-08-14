"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketChatTrigger = void 0;
const ws_1 = __importDefault(require("ws"));
const GenericFunctions_1 = require("../transport/GenericFunctions");
class RocketChatTrigger {
    constructor() {
        this.description = {
            displayName: 'Rocket.Chat: Trigger',
            name: 'rocketChatTrigger',
            group: ['trigger'],
            version: 2,
            description: 'Receive Rocket.Chat messages via Webhook, Polling, or Realtime',
            defaults: { name: 'Rocket.Chat Trigger' },
            inputs: [],
            outputs: ["main" /* NodeConnectionType.Main */],
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
    }
    // WEBHOOK handler
    async webhook() {
        const ack = this.getNodeParameter('ack');
        const body = this.getBodyData();
        if (ack) {
            return { workflowData: [this.helpers.returnJsonArray([body])] };
        }
        return { noWebhookResponse: true };
    }
    // POLLING / REALTIME start/stop
    async trigger() {
        const mode = this.getNodeParameter('mode');
        if (mode === 'polling') {
            const rid = this.getNodeParameter('pollRoom');
            const intervalSec = this.getNodeParameter('interval');
            const self = this;
            async function pollOnce() {
                var _a;
                const sinceIso = self.getWorkflowStaticData('node').lastTs;
                let qs = { count: 50, unreads: true };
                if (sinceIso)
                    qs.oldest = sinceIso;
                // channels.history is fine for channels; for groups/DMs, Rocket.Chat also accepts /groups.history and /im.history.
                // Simpler approach: try channels.history, then groups.history, then im.history until one works.
                const endpoints = ['/api/v1/channels.history', '/api/v1/groups.history', '/api/v1/im.history'];
                let res = null;
                for (const ep of endpoints) {
                    try {
                        res = await GenericFunctions_1.rcApiRequest.call(self, 'GET', ep, {}, { ...qs, roomId: rid });
                        if ((res === null || res === void 0 ? void 0 : res.messages) !== undefined)
                            break;
                    }
                    catch { /* try next */ }
                }
                const messages = (res === null || res === void 0 ? void 0 : res.messages) || [];
                if (messages.length) {
                    messages.reverse().forEach((m) => self.emit([self.helpers.returnJsonArray([m])]));
                    const newestTs = (_a = messages[messages.length - 1]) === null || _a === void 0 ? void 0 : _a.ts;
                    if (newestTs)
                        self.getWorkflowStaticData('node').lastTs = (0, GenericFunctions_1.toUnixOrDate)(newestTs);
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
            const baseUrl = creds.baseUrl.replace(/\/+$/, '');
            const roomId = this.getNodeParameter('rtRoomId');
            if (!roomId)
                throw new Error('Room ID is required for realtime mode');
            const wsUrl = baseUrl.replace(/^http/, 'ws') + '/websocket';
            const ws = new ws_1.default(wsUrl);
            const self = this;
            function send(obj) {
                ws.send(JSON.stringify(obj));
            }
            ws.on('open', () => {
                send({ msg: 'connect', version: '1', support: ['1'] });
            });
            ws.on('message', (data) => {
                var _a;
                let msg;
                try {
                    msg = JSON.parse(data.toString());
                }
                catch {
                    return;
                }
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
                    const args = ((_a = msg.fields) === null || _a === void 0 ? void 0 : _a.args) || [];
                    args.forEach((m) => self.emit([self.helpers.returnJsonArray([m])]));
                }
            });
            async function closeFunction() {
                try {
                    ws.close();
                }
                catch { }
            }
            return { closeFunction };
        }
        return { closeFunction: async () => { } };
    }
}
exports.RocketChatTrigger = RocketChatTrigger;
