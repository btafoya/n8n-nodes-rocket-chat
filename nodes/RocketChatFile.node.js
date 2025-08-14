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
exports.RocketChatFile = void 0;
var GenericFunctions_1 = require("../transport/GenericFunctions");
var RocketChatFile = /** @class */ (function () {
    function RocketChatFile() {
        this.description = {
            displayName: 'Rocket.Chat: File',
            name: 'rocketChatFile',
            group: ['output'],
            version: 2,
            description: 'Upload a file to a room (with optional message)',
            defaults: { name: 'Rocket.Chat File' },
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
                },
            },
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
    RocketChatFile.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, returnData, i, targetMode, freeRoom, pickedRoom, roomTarget, binaryPropertyName, msg, description, tmid, binaryData, buffer, fileName, mimeType, rid, formData, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = this.getInputData();
                        returnData = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < items.length)) return [3 /*break*/, 6];
                        targetMode = this.getNodeParameter('targetMode', i);
                        freeRoom = this.getNodeParameter('room', i, '');
                        pickedRoom = this.getNodeParameter('roomPicker', i, '');
                        roomTarget = targetMode === 'pickerRoom' ? pickedRoom : freeRoom;
                        binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                        msg = this.getNodeParameter('msg', i, '');
                        description = this.getNodeParameter('description', i, '');
                        tmid = this.getNodeParameter('tmid', i, '');
                        if (!items[i].binary || !items[i].binary[binaryPropertyName]) {
                            throw new Error("Item ".concat(i, " is missing binary property: ").concat(binaryPropertyName));
                        }
                        binaryData = items[i].binary[binaryPropertyName];
                        return [4 /*yield*/, this.helpers.getBinaryDataBuffer(i, binaryPropertyName)];
                    case 2:
                        buffer = _a.sent();
                        fileName = binaryData.fileName || 'upload.bin';
                        mimeType = binaryData.mimeType || 'application/octet-stream';
                        return [4 /*yield*/, GenericFunctions_1.resolveRoomId.call(this, roomTarget)];
                    case 3:
                        rid = _a.sent();
                        formData = __assign(__assign(__assign({ file: {
                                value: buffer,
                                options: {
                                    filename: fileName,
                                    contentType: mimeType,
                                },
                            } }, (msg ? { msg: msg } : {})), (description ? { description: description } : {})), (tmid ? { tmid: tmid } : {}));
                        return [4 /*yield*/, GenericFunctions_1.rcApiRequestForm.call(this, "/api/v1/rooms.upload/".concat(encodeURIComponent(rid)), formData)];
                    case 4:
                        res = _a.sent();
                        returnData.push({ json: res });
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, this.prepareOutputData(returnData)];
                }
            });
        });
    };
    return RocketChatFile;
}());
exports.RocketChatFile = RocketChatFile;
