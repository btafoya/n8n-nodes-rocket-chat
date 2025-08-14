import type { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, ITriggerFunctions } from 'n8n-workflow';
import type { OptionsWithUri } from 'request';
type ThisCtx = IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | ITriggerFunctions;
export declare function rcApiRequest(this: ThisCtx, method: string, endpoint: string, body?: any, qs?: Record<string, any>, options?: Partial<OptionsWithUri>): Promise<any>;
export declare function rcApiRequestForm(this: ThisCtx, endpoint: string, formData: any, qs?: Record<string, any>, options?: Partial<OptionsWithUri>): Promise<any>;
/** Pulls all items across Rocket.Chat paginated endpoints that support `count`+`offset`. */
export declare function rcApiRequestAllItems<T = any>(this: ThisCtx, endpoint: string, listKey: string, query?: Record<string, any>, max?: number): Promise<T[]>;
/** Normalize date-like values to ISO string */
export declare function toUnixOrDate(val?: string | number | Date): string;
/** Resolve a roomId from various targets: roomId | #channel | @username (DM via im.open) */
export declare function resolveRoomId(this: ThisCtx, target: string): Promise<string>;
export declare function resolveTargetRid(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | ITriggerFunctions, i: number): Promise<string>;
export {};
