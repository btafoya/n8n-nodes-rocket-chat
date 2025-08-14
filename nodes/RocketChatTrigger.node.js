"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.RocketChatTrigger = void 0;
var ws_1 = require("ws");
var GenericFunctions_1 = require("../transport/GenericFunctions");
var RocketChatTrigger = /** @class */ (function () {
    function RocketChatTrigger() {
        this.description = {
            displayName: 'Rocket.Chat: Trigger',
            name: 'rocketChatTrigger',
            group: ['trigger'],
            version: 2,
            description: 'Receive Rocket.Chat messages via Webhook, Polling, or Realtime',
            defaults: { name: 'Rocket.Chat Trigger' },
            inputs: [],
            outputs: ['main'],
            credentials: [{ name: 'rocketChatPat', required: true }],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'rocketchat',
                },
            ],
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
                },
            },
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
    RocketChatTrigger.prototype.webhook = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ack, body;
            return __generator(this, function (_a) {
                ack = this.getNodeParameter('ack');
                body = this.getBodyData();
                if (ack) {
                    return [2 /*return*/, { workflowData: [this.helpers.returnJsonArray([body])] }];
                }
                return [2 /*return*/, { noWebhookResponse: true }];
            });
        });
    };
    // POLLING / REALTIME start/stop
    RocketChatTrigger.prototype.trigger = function () {
        return __awaiter(this, void 0, void 0, function () {
            function pollOnce() {
                return __awaiter(this, void 0, void 0, function () {
                    var sinceIso, qs, endpoints, res, _i, endpoints_1, ep, _a, messages, newestTs;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                sinceIso = self_1.getWorkflowStaticData('node').lastTs;
                                qs = { count: 50, unreads: true };
                                if (sinceIso)
                                    qs.oldest = sinceIso;
                                endpoints = ['/api/v1/channels.history', '/api/v1/groups.history', '/api/v1/im.history'];
                                res = null;
                                _i = 0, endpoints_1 = endpoints;
                                _c.label = 1;
                            case 1:
                                if (!(_i < endpoints_1.length)) return [3 /*break*/, 6];
                                ep = endpoints_1[_i];
                                _c.label = 2;
                            case 2:
                                _c.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, GenericFunctions_1.rcApiRequest.call(self_1, 'GET', ep, {}, __assign(__assign({}, qs), { roomId: rid_1 }))];
                            case 3:
                                res = _c.sent();
                                if ((res === null || res === void 0 ? void 0 : res.messages) !== undefined)
                                    return [3 /*break*/, 6];
                                return [3 /*break*/, 5];
                            case 4:
                                _a = _c.sent();
                                return [3 /*break*/, 5];
                            case 5:
                                _i++;
                                return [3 /*break*/, 1];
                            case 6:
                                messages = (res === null || res === void 0 ? void 0 : res.messages) || [];
                                if (messages.length) {
                                    messages.reverse().forEach(function (m) { return self_1.emit([self_1.helpers.returnJsonArray([m])]); });
                                    newestTs = (_b = messages[messages.length - 1]) === null || _b === void 0 ? void 0 : _b.ts;
                                    if (newestTs)
                                        self_1.getWorkflowStaticData('node').lastTs = (0, GenericFunctions_1.toUnixOrDate)(newestTs);
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            }
            function closeFunction() {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        clearInterval(interval_1);
                        return [2 /*return*/];
                    });
                });
            }
            function send(obj) {
                ws_2.send(JSON.stringify(obj));
            }
            function closeFunction() {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        try {
                            ws_2.close();
                        }
                        catch (_b) { }
                        return [2 /*return*/];
                    });
                });
            }
            var mode, rid_1, intervalSec, self_1, interval_1, creds_1, baseUrl, roomId_1, wsUrl, ws_2, self_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mode = this.getNodeParameter('mode');
                        if (!(mode === 'polling')) return [3 /*break*/, 2];
                        rid_1 = this.getNodeParameter('pollRoom');
                        intervalSec = this.getNodeParameter('interval');
                        self_1 = this;
                        interval_1 = setInterval(pollOnce, Math.max(5, intervalSec) * 1000);
                        return [4 /*yield*/, pollOnce()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { closeFunction: closeFunction }];
                    case 2:
                        if (!(mode === 'realtime')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getCredentials('rocketChatPat')];
                    case 3:
                        creds_1 = _a.sent();
                        baseUrl = creds_1.baseUrl.replace(/\/+$/, '');
                        roomId_1 = this.getNodeParameter('rtRoomId');
                        if (!roomId_1)
                            throw new Error('Room ID is required for realtime mode');
                        wsUrl = baseUrl.replace(/^http/, 'ws') + '/websocket';
                        ws_2 = new ws_1.default(wsUrl);
                        self_2 = this;
                        ws_2.on('open', function () {
                            send({ msg: 'connect', version: '1', support: ['1'] });
                        });
                        ws_2.on('message', function (data) {
                            var _a;
                            var msg;
                            try {
                                msg = JSON.parse(data.toString());
                            }
                            catch (_b) {
                                return;
                            }
                            if (msg.msg === 'connected') {
                                send({
                                    msg: 'method',
                                    method: 'login',
                                    id: 'login',
                                    params: [{ resume: creds_1.authToken }],
                                });
                            }
                            if (msg.msg === 'result' && msg.id === 'login') {
                                send({
                                    msg: 'sub',
                                    id: 'sub-room',
                                    name: 'stream-room-messages',
                                    params: [roomId_1, false],
                                });
                            }
                            if (msg.msg === 'changed' && msg.collection === 'stream-room-messages') {
                                var args = ((_a = msg.fields) === null || _a === void 0 ? void 0 : _a.args) || [];
                                args.forEach(function (m) { return self_2.emit([self_2.helpers.returnJsonArray([m])]); });
                            }
                        });
                        return [2 /*return*/, { closeFunction: closeFunction }];
                    case 4: return [2 /*return*/, { closeFunction: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/];
                            }); }); } }];
                }
            });
        });
    };
    return RocketChatTrigger;
}());
exports.RocketChatTrigger = RocketChatTrigger;
