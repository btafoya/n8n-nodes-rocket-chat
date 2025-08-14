"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketChatFile = void 0;
const GenericFunctions_1 = require("../transport/GenericFunctions");
class RocketChatFile {
    constructor() {
        this.description = {
            displayName: 'Rocket.Chat: File',
            name: 'rocketChatFile',
            group: ['output'],
            version: 2,
            description: 'Upload a file to a room (with optional message)',
            defaults: { name: 'Rocket.Chat File' },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            credentials: [{ name: 'rocketChatPat', required: true }],
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
                    displayName: 'Target Mode',
                    name: 'targetMode',
                    type: 'options',
                    default: 'text',
                    options: [
                        { name: 'Free Text (roomId/#channel/@username)', value: 'text' },
                        { name: 'Pick a Room', value: 'pickerRoom' },
                    ],
                },
                {
                    displayName: 'Room',
                    name: 'room',
                    type: 'string',
                    default: '',
                    placeholder: 'roomId or #channel or @username',
                    description: 'Free text target',
                    displayOptions: { show: { targetMode: ['text'] } },
                },
                {
                    displayName: 'Room',
                    name: 'roomPicker',
                    type: 'options',
                    typeOptions: { loadOptionsMethod: 'listRooms' },
                    default: '',
                    description: 'Pick a room (channel/group/DM)',
                    displayOptions: { show: { targetMode: ['pickerRoom'] } },
                },
                {
                    displayName: 'Binary Property',
                    name: 'binaryPropertyName',
                    type: 'string',
                    default: 'data',
                    description: 'Input item binary property name containing the file',
                },
                {
                    displayName: 'Message (optional)',
                    name: 'msg',
                    type: 'string',
                    default: '',
                },
                {
                    displayName: 'Description (optional)',
                    name: 'description',
                    type: 'string',
                    default: '',
                },
                {
                    displayName: 'Thread ID (tmid)',
                    name: 'tmid',
                    type: 'string',
                    default: '',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const targetMode = this.getNodeParameter('targetMode', i);
            const freeRoom = this.getNodeParameter('room', i, '');
            const pickedRoom = this.getNodeParameter('roomPicker', i, '');
            const roomTarget = targetMode === 'pickerRoom' ? pickedRoom : freeRoom;
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
            const msg = this.getNodeParameter('msg', i, '');
            const description = this.getNodeParameter('description', i, '');
            const tmid = this.getNodeParameter('tmid', i, '');
            if (!items[i].binary || !items[i].binary[binaryPropertyName]) {
                throw new Error(`Item ${i} is missing binary property: ${binaryPropertyName}`);
            }
            const binaryData = items[i].binary[binaryPropertyName];
            const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
            const fileName = binaryData.fileName || 'upload.bin';
            const mimeType = binaryData.mimeType || 'application/octet-stream';
            const rid = await GenericFunctions_1.resolveRoomId.call(this, roomTarget);
            const formData = {
                file: {
                    value: buffer,
                    options: {
                        filename: fileName,
                        contentType: mimeType,
                    },
                },
                ...(msg ? { msg } : {}),
                ...(description ? { description } : {}),
                ...(tmid ? { tmid } : {}),
            };
            const res = await GenericFunctions_1.rcApiRequestForm.call(this, `/api/v1/rooms.upload/${encodeURIComponent(rid)}`, formData);
            returnData.push({ json: res });
        }
        return this.prepareOutputData(returnData);
    }
}
exports.RocketChatFile = RocketChatFile;
