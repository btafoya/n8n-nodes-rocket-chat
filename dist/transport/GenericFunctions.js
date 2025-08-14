"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rcApiRequest = rcApiRequest;
exports.rcApiRequestForm = rcApiRequestForm;
exports.rcApiRequestAllItems = rcApiRequestAllItems;
exports.toUnixOrDate = toUnixOrDate;
exports.resolveRoomId = resolveRoomId;
exports.resolveTargetRid = resolveTargetRid;
async function rcApiRequest(method, endpoint, body = {}, qs = {}, options = {}) {
    var _a, _b;
    const credentials = await this.getCredentials('rocketChatPat');
    const baseUrl = credentials.baseUrl.replace(/\/+$/, '');
    const uri = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = {
        'X-Auth-Token': credentials.authToken,
        'X-User-Id': credentials.userId,
        'Content-Type': 'application/json',
        ...((_a = options.headers) !== null && _a !== void 0 ? _a : {}),
    };
    const requestOptions = {
        method,
        uri,
        headers,
        qs,
        body: Object.keys(body || {}).length ? body : undefined,
        json: true,
        timeout: (_b = credentials.timeout) !== null && _b !== void 0 ? _b : 30000,
    };
    Object.assign(requestOptions, options);
    // @ts-ignore
    return await this.helpers.request(requestOptions);
}
async function rcApiRequestForm(endpoint, formData, qs = {}, options = {}) {
    var _a, _b;
    const credentials = await this.getCredentials('rocketChatPat');
    const baseUrl = credentials.baseUrl.replace(/\/+$/, '');
    const uri = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = {
        'X-Auth-Token': credentials.authToken,
        'X-User-Id': credentials.userId,
        ...((_a = options.headers) !== null && _a !== void 0 ? _a : {}),
    };
    const requestOptions = {
        method: 'POST',
        uri,
        headers,
        qs,
        formData,
        json: true,
        timeout: (_b = credentials.timeout) !== null && _b !== void 0 ? _b : 30000,
    };
    Object.assign(requestOptions, options);
    // @ts-ignore
    return await this.helpers.request(requestOptions);
}
/** Pulls all items across Rocket.Chat paginated endpoints that support `count`+`offset`. */
async function rcApiRequestAllItems(endpoint, listKey, query = {}, max = 500) {
    var _a;
    const out = [];
    let offset = 0;
    const count = 100;
    while (out.length < max) {
        const res = await rcApiRequest.call(this, 'GET', endpoint, {}, { ...query, offset, count });
        const chunk = ((_a = res === null || res === void 0 ? void 0 : res[listKey]) !== null && _a !== void 0 ? _a : []);
        out.push(...chunk);
        if (!chunk.length || chunk.length < count)
            break;
        offset += count;
    }
    return out.slice(0, max);
}
/** Normalize date-like values to ISO string */
function toUnixOrDate(val) {
    if (!val)
        return undefined;
    const d = typeof val === 'number' ? new Date(val) : new Date(val);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
}
/** Resolve a roomId from various targets: roomId | #channel | @username (DM via im.open) */
async function resolveRoomId(target) {
    var _a, _b, _c, _d;
    if (!target)
        throw new Error('Target required');
    // If the target looks like a Mongo/ID-ish string, just return it:
    if (!target.startsWith('#') && !target.startsWith('@'))
        return target;
    if (target.startsWith('#')) {
        // channels.info by roomName
        const roomName = target.slice(1);
        const info = await rcApiRequest.call(this, 'GET', '/api/v1/channels.info', {}, { roomName });
        const rid = ((_a = info === null || info === void 0 ? void 0 : info.channel) === null || _a === void 0 ? void 0 : _a._id) || ((_b = info === null || info === void 0 ? void 0 : info.room) === null || _b === void 0 ? void 0 : _b._id);
        if (!rid)
            throw new Error(`Channel not found: ${target}`);
        return rid;
    }
    // @username → open DM to get rid
    if (target.startsWith('@')) {
        const username = target.slice(1);
        const dm = await rcApiRequest.call(this, 'POST', '/api/v1/im.open', { username });
        const rid = ((_c = dm === null || dm === void 0 ? void 0 : dm.room) === null || _c === void 0 ? void 0 : _c._id) || ((_d = dm === null || dm === void 0 ? void 0 : dm.room) === null || _d === void 0 ? void 0 : _d._id);
        if (!rid)
            throw new Error(`Could not open DM with ${target}`);
        return rid;
    }
    throw new Error(`Unsupported target: ${target}`);
}
async function resolveTargetRid(i) {
    var _a;
    const mode = this.getNodeParameter('targetMode', i);
    const creds = await this.getCredentials('rocketChatPat');
    if (mode === 'pickerRoom') {
        const rid = this.getNodeParameter('targetRoom', i);
        if (!rid)
            throw new Error('Room is required');
        return rid;
    }
    if (mode === 'pickerUser') {
        const username = this.getNodeParameter('targetUser', i);
        if (!username)
            throw new Error('User is required');
        // open DM to ensure rid
        const dm = await rcApiRequest.call(this, 'POST', '/api/v1/im.open', { username });
        const rid = (_a = dm === null || dm === void 0 ? void 0 : dm.room) === null || _a === void 0 ? void 0 : _a._id;
        if (!rid)
            throw new Error(`Could not open DM with @${username}`);
        return rid;
    }
    // text mode
    const textTarget = this.getNodeParameter('target', i, '') || creds.defaultTarget;
    if (!textTarget)
        throw new Error('Target is required (channel, @user, or roomId)');
    return await resolveRoomId.call(this, textTarget);
}
