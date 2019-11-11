import { Middleware } from 'redux';
/**
 * Returns true if the passed value is "plain", i.e. a value that is either
 * directly JSON-serializable (boolean, number, string, array, plain object)
 * or `undefined`.
 *
 * @param val The value to check.
 */
export declare function isPlain(val: any): boolean;
interface NonSerializableValue {
    keyPath: string;
    value: unknown;
}
export declare function findNonSerializableValue(value: unknown, path?: ReadonlyArray<string>, isSerializable?: (value: unknown) => boolean, getEntries?: (value: unknown) => [string, any][]): NonSerializableValue | false;
/**
 * Options for `createSerializableStateInvariantMiddleware()`.
 */
export interface SerializableStateInvariantMiddlewareOptions {
    /**
     * The function to check if a value is considered serializable. This
     * function is applied recursively to every value contained in the
     * state. Defaults to `isPlain()`.
     */
    isSerializable?: (value: any) => boolean;
    /**
     * The function that will be used to retrieve entries from each
     * value.  If unspecified, `Object.entries` will be used. Defaults
     * to `undefined`.
     */
    getEntries?: (value: any) => [string, any][];
    /**
     * An array of action types to ignore when checking for serializability, Defaults to []
     */
    ignoredActions?: string[];
}
/**
 * Creates a middleware that, after every state change, checks if the new
 * state is serializable. If a non-serializable value is found within the
 * state, an error is printed to the console.
 *
 * @param options Middleware options.
 */
export declare function createSerializableStateInvariantMiddleware(options?: SerializableStateInvariantMiddlewareOptions): Middleware;
export {};
