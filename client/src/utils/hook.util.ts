export interface ActionReducer<T extends string, P> {
  type: T;
  payload: Partial<P>;
}

export type HandlerReducer<T extends string, P> = {
  [K in T]: (state: P, payload: Partial<P>) => P;
};

export const createReducerHook = <T extends string, P>(handlers: HandlerReducer<T, P>) => {
  const reducer = (state: P, action: ActionReducer<keyof typeof handlers, P>): P => {
    const { type, payload } = action;
    return handlers[type] ? handlers[type](state, payload) : state;
  };
  return reducer;
};
