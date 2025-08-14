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
exports.rcApiRequest = rcApiRequest;
exports.rcApiRequestForm = rcApiRequestForm;
exports.rcApiRequestAllItems = rcApiRequestAllItems;
exports.toUnixOrDate = toUnixOrDate;
exports.resolveRoomId = resolveRoomId;
function rcApiRequest(method_1, endpoint_1) {
    return __awaiter(this, arguments, void 0, function (method, endpoint, body, qs, options) {
        var credentials, baseUrl, uri, headers, requestOptions;
        var _a, _b;
        if (body === void 0) { body = {}; }
        if (qs === void 0) { qs = {}; }
        if (options === void 0) { options = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, this.getCredentials('rocketChatPat')];
                case 1:
                    credentials = _c.sent();
                    baseUrl = credentials.baseUrl.replace(/\/+$/, '');
                    uri = "".concat(baseUrl).concat(endpoint.startsWith('/') ? endpoint : "/".concat(endpoint));
                    headers = __assign({ 'X-Auth-Token': credentials.authToken, 'X-User-Id': credentials.userId, 'Content-Type': 'application/json' }, ((_a = options.headers) !== null && _a !== void 0 ? _a : {}));
                    requestOptions = {
                        method: method,
                        uri: uri,
                        headers: headers,
                        qs: qs,
                        body: Object.keys(body || {}).length ? body : undefined,
                        json: true,
                        timeout: (_b = credentials.timeout) !== null && _b !== void 0 ? _b : 30000,
                    };
                    Object.assign(requestOptions, options);
                    return [4 /*yield*/, this.helpers.request(requestOptions)];
                case 2: 
                // @ts-ignore
                return [2 /*return*/, _c.sent()];
            }
        });
    });
}
function rcApiRequestForm(endpoint_1, formData_1) {
    return __awaiter(this, arguments, void 0, function (endpoint, formData, qs, options) {
        var credentials, baseUrl, uri, headers, requestOptions;
        var _a, _b;
        if (qs === void 0) { qs = {}; }
        if (options === void 0) { options = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, this.getCredentials('rocketChatPat')];
                case 1:
                    credentials = _c.sent();
                    baseUrl = credentials.baseUrl.replace(/\/+$/, '');
                    uri = "".concat(baseUrl).concat(endpoint.startsWith('/') ? endpoint : "/".concat(endpoint));
                    headers = __assign({ 'X-Auth-Token': credentials.authToken, 'X-User-Id': credentials.userId }, ((_a = options.headers) !== null && _a !== void 0 ? _a : {}));
                    requestOptions = {
                        method: 'POST',
                        uri: uri,
                        headers: headers,
                        qs: qs,
                        formData: formData,
                        json: true,
                        timeout: (_b = credentials.timeout) !== null && _b !== void 0 ? _b : 30000,
                    };
                    Object.assign(requestOptions, options);
                    return [4 /*yield*/, this.helpers.request(requestOptions)];
                case 2: 
                // @ts-ignore
                return [2 /*return*/, _c.sent()];
            }
        });
    });
}
/** Pulls all items across Rocket.Chat paginated endpoints that support `count`+`offset`. */
function rcApiRequestAllItems(endpoint_1, listKey_1) {
    return __awaiter(this, arguments, void 0, function (endpoint, listKey, query, max) {
        var out, offset, count, res, chunk;
        var _a;
        if (query === void 0) { query = {}; }
        if (max === void 0) { max = 500; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    out = [];
                    offset = 0;
                    count = 100;
                    _b.label = 1;
                case 1:
                    if (!(out.length < max)) return [3 /*break*/, 3];
                    return [4 /*yield*/, rcApiRequest.call(this, 'GET', endpoint, {}, __assign(__assign({}, query), { offset: offset, count: count }))];
                case 2:
                    res = _b.sent();
                    chunk = ((_a = res === null || res === void 0 ? void 0 : res[listKey]) !== null && _a !== void 0 ? _a : []);
                    out.push.apply(out, chunk);
                    if (!chunk.length || chunk.length < count)
                        return [3 /*break*/, 3];
                    offset += count;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, out.slice(0, max)];
            }
        });
    });
}
/** Normalize date-like values to ISO string */
function toUnixOrDate(val) {
    if (!val)
        return undefined;
    var d = typeof val === 'number' ? new Date(val) : new Date(val);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
}
/** Resolve a roomId from various targets: roomId | #channel | @username (DM via im.open) */
function resolveRoomId(target) {
    return __awaiter(this, void 0, void 0, function () {
        var roomName, info, rid, username, dm, rid;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!target)
                        throw new Error('Target required');
                    // If the target looks like a Mongo/ID-ish string, just return it:
                    if (!target.startsWith('#') && !target.startsWith('@'))
                        return [2 /*return*/, target];
                    if (!target.startsWith('#')) return [3 /*break*/, 2];
                    roomName = target.slice(1);
                    return [4 /*yield*/, rcApiRequest.call(this, 'GET', '/api/v1/channels.info', {}, { roomName: roomName })];
                case 1:
                    info = _e.sent();
                    rid = ((_a = info === null || info === void 0 ? void 0 : info.channel) === null || _a === void 0 ? void 0 : _a._id) || ((_b = info === null || info === void 0 ? void 0 : info.room) === null || _b === void 0 ? void 0 : _b._id);
                    if (!rid)
                        throw new Error("Channel not found: ".concat(target));
                    return [2 /*return*/, rid];
                case 2:
                    if (!target.startsWith('@')) return [3 /*break*/, 4];
                    username = target.slice(1);
                    return [4 /*yield*/, rcApiRequest.call(this, 'POST', '/api/v1/im.open', { username: username })];
                case 3:
                    dm = _e.sent();
                    rid = ((_c = dm === null || dm === void 0 ? void 0 : dm.room) === null || _c === void 0 ? void 0 : _c._id) || ((_d = dm === null || dm === void 0 ? void 0 : dm.room) === null || _d === void 0 ? void 0 : _d._id);
                    if (!rid)
                        throw new Error("Could not open DM with ".concat(target));
                    return [2 /*return*/, rid];
                case 4: throw new Error("Unsupported target: ".concat(target));
            }
        });
    });
}
