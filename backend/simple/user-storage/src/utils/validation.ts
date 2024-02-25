import * as grpc from '@grpc/grpc-js';

/**
 * Checks if the provided value is null or undefined.
 * @param value The value to check.
 * @returns Error if the value is null or undefined, otherwise null.
 */
export const isNullOrUndefined = (value: any): any => {
    if (value === null || value === undefined) {
        const error = {
            code: grpc.status.PERMISSION_DENIED,
            message: 'Unauthorized'
        };
        return error;
    }
    return null;
}

/**
 * Checks if two values match.
 * @param value1 The first value.
 * @param value2 The second value.
 * @returns Error if the values match, otherwise null.
 */
export const matches = (value1: any, value2: any): any => {
    if (value1 === value2) {
        const error = {
            code: grpc.status.PERMISSION_DENIED,
            message: 'Unauthorized'
        };
        return error;
    }
    return null;
}