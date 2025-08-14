"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketChatMessage = void 0;
var GenericFunctions_1 = require("../transport/GenericFunctions");
var RocketChatMessage = /** @class */ (function () {
    function RocketChatMessage() {
        this.description = {
            displayName: 'Rocket.Chat: Message',
            name: 'rocketChatMessage',
            group: ['output'],
            version: 2,
            description: 'Send, update, delete messages; DM helpers',
            defaults: { name: 'Rocket.Chat Message' },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [{ name: 'rocketChatPat', required: true }],
            methods: {
                loadOptions: {
                    listRooms: function () {
                        return __awaiter(this, void 0, void 0, function () {
                            var chans, groups, dms, opts, _i, chans_1, c, _a, groups_1, g, _b, dms_1, dm, uname;
                            var _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, GenericFunctions_1.rcApiRequestAllItems.call(this, '/api/v1/channels.list.joined', 'channels', {}, 500)];
                                    case 1:
                                        chans = _d.sent();
                                        return [4 /*yield*/, GenericFunctions_1.rcApiRequestAllItems.call(this, '/api/v1/groups.list', 'groups', {}, 500).catch(function () { return []; })];
                                    case 2:
                                        groups = _d.sent();
                                        return [4 /*yield*/, GenericFunctions_1.rcApiRequestAllItems.call(this, '/api/v1/im.list', 'ims', {}, 500).catch(function () { return []; })];
                                    case 3:
                                        dms = _d.sent();
                                        opts = [];
                                        for (_i = 0, chans_1 = chans; _i < chans_1.length; _i++) {
                                            c = chans_1[_i];
                                            opts.push({ name: "#".concat(c.name), value: c._id, description: 'Channel' });
                                        }
                                        for (_a = 0, groups_1 = groups; _a < groups_1.length; _a++) {
                                            g = groups_1[_a];
                                            opts.push({ name: "(Private) ".concat(g.name), value: g._id, description: 'Private Group' });
                                        }
                                        for (_b = 0, dms_1 = dms; _b < dms_1.length; _b++) {
                                            dm = dms_1[_b];
                                            uname = ((_c = dm === null || dm === void 0 ? void 0 : dm.user) === null || _c === void 0 ? void 0 : _c.username) || (dm === null || dm === void 0 ? void 0 : dm.username) || (dm === null || dm === void 0 ? void 0 : dm.fname) || (dm === null || dm === void 0 ? void 0 : dm.name) || (dm === null || dm === void 0 ? void 0 : dm._id);
                                            opts.push({ name: "DM: @".concat(uname), value: dm._id, description: 'Direct Message' });
                                        }
                                        return [2 /*return*/, opts.sort(function (a, b) { return a.name.localeCompare(b.name); })];
                                }
                            });
                        });
                    },
                    listUsers: function () {
                        return __awaiter(this, void 0, void 0, function () {
                            var users;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, GenericFunctions_1.rcApiRequestAllItems.call(this, '/api/v1/users.list', 'users', {}, 1000)];
                                    case 1:
                                        users = _a.sent();
                                        return [2 /*return*/, users
                                                .filter(function (u) { return !!u.username; })
                                                .map(function (u) { return ({ name: "".concat(u.name || u.username, " (@").concat(u.username, ")"), value: u.username }); })
                                                .sort(function (a, b) { return a.name.localeCompare(b.name); })];
                                }
                            });
                        });
                    },
                },
            },
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
    }
    RocketChatMessage.prototype.resolveTargetRid = function (thisCtx, i) {
        return __awaiter(this, void 0, void 0, function () {
            var mode, creds, rid, username, dm, rid, textTarget;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mode = thisCtx.getNodeParameter('targetMode', i);
                        return [4 /*yield*/, thisCtx.getCredentials('rocketChatPat')];
                    case 1:
                        creds = _b.sent();
                        if (mode === 'pickerRoom') {
                            rid = thisCtx.getNodeParameter('targetRoom', i);
                            if (!rid)
                                throw new Error('Room is required');
                            return [2 /*return*/, rid];
                        }
                        if (!(mode === 'pickerUser')) return [3 /*break*/, 3];
                        username = thisCtx.getNodeParameter('targetUser', i);
                        if (!username)
                            throw new Error('User is required');
                        return [4 /*yield*/, GenericFunctions_1.rcApiRequest.call(thisCtx, 'POST', '/api/v1/im.open', { username: username })];
                    case 2:
                        dm = _b.sent();
                        rid = (_a = dm === null || dm === void 0 ? void 0 : dm.room) === null || _a === void 0 ? void 0 : _a._id;
                        if (!rid)
                            throw new Error("Could not open DM with @".concat(username));
                        return [2 /*return*/, rid];
                    case 3:
                        textTarget = thisCtx.getNodeParameter('target', i, '') || creds.defaultTarget;
                        if (!textTarget)
                            throw new Error('Target is required (channel, @user, or roomId)');
                        return [4 /*yield*/, GenericFunctions_1.resolveRoomId.call(thisCtx, textTarget)];
                    case 4: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    RocketChatMessage.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, returnData, i, operation, rid, text, tmid, additional, body, endpoint, res, rid, msgId, newText, res, rid, msgId, res, username, res, username, text, tmid, additional, dm, rid, body, res;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        items = this.getInputData();
                        returnData = [];
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < items.length)) return [3 /*break*/, 16];
                        operation = this.getNodeParameter('operation', i);
                        if (!(operation === 'post' || operation === 'send')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.resolveTargetRid(this, i)];
                    case 2:
                        rid = _b.sent();
                        text = this.getNodeParameter('text', i);
                        tmid = this.getNodeParameter('tmid', i, '');
                        additional = this.getNodeParameter('additionalFields', i, {});
                        body = { roomId: rid, text: text };
                        if (tmid)
                            body.tmid = tmid;
                        if (additional.alias)
                            body.alias = additional.alias;
                        if (additional.emoji)
                            body.emoji = additional.emoji;
                        if (additional.avatar)
                            body.avatar = additional.avatar;
                        if (additional.parseUrls !== undefined)
                            body.parseUrls = additional.parseUrls;
                        if (additional.attachments)
                            body.attachments = JSON.parse(additional.attachments);
                        endpoint = operation === 'post' ? '/api/v1/chat.postMessage' : '/api/v1/chat.sendMessage';
                        return [4 /*yield*/, GenericFunctions_1.rcApiRequest.call(this, 'POST', endpoint, body)];
                    case 3:
                        res = _b.sent();
                        returnData.push({ json: res });
                        _b.label = 4;
                    case 4:
                        if (!(operation === 'update')) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.resolveTargetRid(this, i)];
                    case 5:
                        rid = _b.sent();
                        msgId = this.getNodeParameter('msgId', i);
                        newText = this.getNodeParameter('newText', i);
                        return [4 /*yield*/, GenericFunctions_1.rcApiRequest.call(this, 'POST', '/api/v1/chat.update', {
                                roomId: rid,
                                msgId: msgId,
                                text: newText,
                            })];
                    case 6:
                        res = _b.sent();
                        returnData.push({ json: res });
                        _b.label = 7;
                    case 7:
                        if (!(operation === 'delete')) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.resolveTargetRid(this, i)];
                    case 8:
                        rid = _b.sent();
                        msgId = this.getNodeParameter('msgId', i);
                        return [4 /*yield*/, GenericFunctions_1.rcApiRequest.call(this, 'POST', '/api/v1/chat.delete', {
                                roomId: rid,
                                msgId: msgId,
                            })];
                    case 9:
                        res = _b.sent();
                        returnData.push({ json: res });
                        _b.label = 10;
                    case 10:
                        if (!(operation === 'openDm')) return [3 /*break*/, 12];
                        username = this.getNodeParameter('dmUsername', i);
                        return [4 /*yield*/, GenericFunctions_1.rcApiRequest.call(this, 'POST', '/api/v1/im.open', { username: username })];
                    case 11:
                        res = _b.sent();
                        returnData.push({ json: res });
                        _b.label = 12;
                    case 12:
                        if (!(operation === 'sendDm')) return [3 /*break*/, 15];
                        username = this.getNodeParameter('dmUsername', i);
                        text = this.getNodeParameter('text', i);
                        tmid = this.getNodeParameter('tmid', i, '');
                        additional = this.getNodeParameter('additionalFields', i, {});
                        return [4 /*yield*/, GenericFunctions_1.rcApiRequest.call(this, 'POST', '/api/v1/im.open', { username: username })];
                    case 13:
                        dm = _b.sent();
                        rid = (_a = dm === null || dm === void 0 ? void 0 : dm.room) === null || _a === void 0 ? void 0 : _a._id;
                        if (!rid)
                            throw new Error("Could not open DM with @".concat(username));
                        body = { roomId: rid, text: text };
                        if (tmid)
                            body.tmid = tmid;
                        if (additional.alias)
                            body.alias = additional.alias;
                        if (additional.emoji)
                            body.emoji = additional.emoji;
                        if (additional.avatar)
                            body.avatar = additional.avatar;
                        if (additional.parseUrls !== undefined)
                            body.parseUrls = additional.parseUrls;
                        if (additional.attachments)
                            body.attachments = JSON.parse(additional.attachments);
                        return [4 /*yield*/, GenericFunctions_1.rcApiRequest.call(this, 'POST', '/api/v1/chat.postMessage', body)];
                    case 14:
                        res = _b.sent();
                        returnData.push({ json: res });
                        _b.label = 15;
                    case 15:
                        i++;
                        return [3 /*break*/, 1];
                    case 16: return [2 /*return*/, this.prepareOutputData(returnData)];
                }
            });
        });
    };
    return RocketChatMessage;
}());
exports.RocketChatMessage = RocketChatMessage;
