import is from '@sindresorhus/is';
import {Timings} from '@szmarczak/http-timer';
import {ErrorCode, Response, NormalizedOptions} from './utils/types';
import {TimeoutError as TimedOutError} from './utils/timed-out';

export class GotError extends Error {
	code?: ErrorCode;
	declare readonly options: NormalizedOptions;

	constructor(message: string, error: (Error & {code?: ErrorCode}) | {code?: ErrorCode}, options: NormalizedOptions) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.name = 'GotError';

		if (!is.undefined(error.code)) {
			this.code = error.code;
		}

		Object.defineProperty(this, 'options', {
			value: options
		});
	}
}

export class CacheError extends GotError {
	constructor(error: Error, options: NormalizedOptions) {
		super(error.message, error, options);
		this.name = 'CacheError';
	}
}

export class RequestError extends GotError {
	constructor(error: Error, options: NormalizedOptions) {
		super(error.message, error, options);
		this.name = 'RequestError';
	}
}

export class ReadError extends GotError {
	constructor(error: Error, options: NormalizedOptions) {
		super(error.message, error, options);
		this.name = 'ReadError';
	}
}

export class ParseError extends GotError {
	declare readonly response: Response;

	constructor(error: Error, response: Response, options: NormalizedOptions) {
		super(`${error.message} in "${options.url.toString()}"`, error, options);
		this.name = 'ParseError';

		Object.defineProperty(this, 'response', {
			value: response
		});
	}
}

export class HTTPError extends GotError {
	declare readonly response: Response;

	constructor(response: Response, options: NormalizedOptions) {
		super(`Response code ${response.statusCode} (${response.statusMessage})`, {}, options);
		this.name = 'HTTPError';

		Object.defineProperty(this, 'response', {
			value: response
		});
	}
}

export class MaxRedirectsError extends GotError {
	declare readonly response: Response;

	constructor(response: Response, maxRedirects: number, options: NormalizedOptions) {
		super(`Redirected ${maxRedirects} times. Aborting.`, {}, options);
		this.name = 'MaxRedirectsError';

		Object.defineProperty(this, 'response', {
			value: response
		});
	}
}

export class UnsupportedProtocolError extends GotError {
	constructor(options: NormalizedOptions) {
		super(`Unsupported protocol "${options.url.protocol}"`, {}, options);
		this.name = 'UnsupportedProtocolError';
	}
}

export class TimeoutError extends GotError {
	timings: Timings;
	event: string;

	constructor(error: TimedOutError, timings: Timings, options: NormalizedOptions) {
		super(error.message, {code: 'ETIMEDOUT'}, options);
		this.name = 'TimeoutError';
		this.event = error.event;
		this.timings = timings;
	}
}

export {CancelError} from 'p-cancelable';
