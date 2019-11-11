import { Middleware } from 'redux';
import { SerializableStateInvariantMiddlewareOptions } from './serializableStateInvariantMiddleware';
interface ThunkOptions<E = any> {
    extraArgument: E;
}
interface ImmutableStateInvariantMiddlewareOptions {
    isImmutable?: (value: any) => boolean;
    ignore?: string[];
}
interface GetDefaultMiddlewareOptions {
    thunk?: boolean | ThunkOptions;
    immutableCheck?: boolean | ImmutableStateInvariantMiddlewareOptions;
    serializableCheck?: boolean | SerializableStateInvariantMiddlewareOptions;
}
/**
 * Returns any array containing the default middleware installed by
 * `configureStore()`. Useful if you want to configure your store with a custom
 * `middleware` array but still keep the default set.
 *
 * @return The default middleware used by `configureStore()`.
 */
export declare function getDefaultMiddleware<S = any>(options?: GetDefaultMiddlewareOptions): Middleware<{}, S>[];
export {};
