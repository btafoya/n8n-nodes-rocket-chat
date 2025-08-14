import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	ITriggerFunctions,
} from 'n8n-workflow';
import type { OptionsWithUri } from 'request';

type ThisCtx = IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | ITriggerFunctions;

export async function rcApiRequest(
	this: ThisCtx,
	method: string,
	endpoint: string,
	body: any = {},
	qs: Record<string, any> = {},
	options: Partial<OptionsWithUri> = {},
) {
	const credentials = await this.getCredentials('rocketChatPat');
	const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, '');
	const uri = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

	const headers = {
		'X-Auth-Token': credentials.authToken as string,
		'X-User-Id': credentials.userId as string,
		'Content-Type': 'application/json',
		...(options.headers ?? {}),
	};

	const requestOptions: OptionsWithUri = {
		method,
		uri,
		headers,
		qs,
		body: Object.keys(body || {}).length ? body : undefined,
		json: true,
		timeout: (credentials.timeout as number) ?? 30000,
	};

	Object.assign(requestOptions, options);

	// @ts-ignore
	return await this.helpers.request!(requestOptions);
}

export async function rcApiRequestForm(
	this: ThisCtx,
	endpoint: string,
	formData: any,
	qs: Record<string, any> = {},
	options: Partial<OptionsWithUri> = {},
) {
	const credentials = await this.getCredentials('rocketChatPat');
	const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, '');
	const uri = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

	const headers = {
		'X-Auth-Token': credentials.authToken as string,
		'X-User-Id': credentials.userId as string,
		...(options.headers ?? {}),
	};

	const requestOptions: OptionsWithUri = {
		method: 'POST',
		uri,
		headers,
		qs,
		formData,
		json: true,
		timeout: (credentials.timeout as number) ?? 30000,
	};

	Object.assign(requestOptions, options);

	// @ts-ignore
	return await this.helpers.request!(requestOptions);
}

/** Pulls all items across Rocket.Chat paginated endpoints that support `count`+`offset`. */
export async function rcApiRequestAllItems<T = any>(
	this: ThisCtx,
	endpoint: string,
	listKey: string,
	query: Record<string, any> = {},
	max = 500,
): Promise<T[]> {
	const out: T[] = [];
	let offset = 0;
	const count = 100;

	while (out.length < max) {
		const res = await rcApiRequest.call(this, 'GET', endpoint, {}, { ...query, offset, count });
		const chunk: T[] = (res?.[listKey] ?? []) as T[];
		out.push(...chunk);
		if (!chunk.length || chunk.length < count) break;
		offset += count;
	}
	return out.slice(0, max);
}

/** Normalize date-like values to ISO string */
export function toUnixOrDate(val?: string | number | Date) {
	if (!val) return undefined;
	const d = typeof val === 'number' ? new Date(val) : new Date(val);
	return isNaN(d.getTime()) ? undefined : d.toISOString();
}

/** Resolve a roomId from various targets: roomId | #channel | @username (DM via im.open) */
export async function resolveRoomId(
	this: ThisCtx,
	target: string,
): Promise<string> {
	if (!target) throw new Error('Target required');
	// If the target looks like a Mongo/ID-ish string, just return it:
	if (!target.startsWith('#') && !target.startsWith('@')) return target;

	if (target.startsWith('#')) {
		// channels.info by roomName
		const roomName = target.slice(1);
		const info = await rcApiRequest.call(this, 'GET', '/api/v1/channels.info', {}, { roomName });
		const rid = info?.channel?._id || info?.room?._id;
		if (!rid) throw new Error(`Channel not found: ${target}`);
		return rid;
	}

	// @username → open DM to get rid
	if (target.startsWith('@')) {
		const username = target.slice(1);
		const dm = await rcApiRequest.call(this, 'POST', '/api/v1/im.open', { username });
		const rid = dm?.room?._id || dm?.room?._id;
		if (!rid) throw new Error(`Could not open DM with ${target}`);
		return rid;
	}

	throw new Error(`Unsupported target: ${target}`);
}

export async function resolveTargetRid(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | ITriggerFunctions,
	i: number
): Promise<string> {
	const mode = this.getNodeParameter('targetMode', i) as string;
	const creds = await this.getCredentials('rocketChatPat');
	if (mode === 'pickerRoom') {
		const rid = this.getNodeParameter('targetRoom', i) as string;
		if (!rid) throw new Error('Room is required');
		return rid;
	}
	if (mode === 'pickerUser') {
		const username = this.getNodeParameter('targetUser', i) as string;
		if (!username) throw new Error('User is required');
		// open DM to ensure rid
		const dm = await rcApiRequest.call(this, 'POST', '/api/v1/im.open', { username });
		const rid = dm?.room?._id;
		if (!rid) throw new Error(`Could not open DM with @${username}`);
		return rid;
	}
	// text mode
	const textTarget = (this.getNodeParameter('target', i, '') as string) || (creds.defaultTarget as string);
	if (!textTarget) throw new Error('Target is required (channel, @user, or roomId)');
	return await resolveRoomId.call(this, textTarget);
}
