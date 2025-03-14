import is from '@sindresorhus/is';
import {Merge} from 'type-fest';

export default function merge<Target extends {[key: string]: any}, Source extends {[key: string]: any}>(target: Target, ...sources: Source[]): Merge<Source, Target> {
	for (const source of sources) {
		for (const [key, sourceValue] of Object.entries(source)) {
			const targetValue = target[key];

			if (is.urlInstance(targetValue) && is.string(sourceValue)) {
				// @ts-ignore
				target[key] = new URL(sourceValue, targetValue);
			} else if (is.plainObject(sourceValue)) {
				if (is.plainObject(targetValue)) {
					// @ts-ignore
					target[key] = merge({}, targetValue, sourceValue);
				} else {
					// @ts-ignore
					target[key] = merge({}, sourceValue);
				}
			} else if (is.array(sourceValue)) {
				// @ts-ignore
				target[key] = sourceValue.slice();
			} else {
				// @ts-ignore
				target[key] = sourceValue;
			}
		}
	}

	return target as Merge<Source, Target>;
}
