import React, { useReducer } from 'react';

import { User } from '../types';
import createCtx from '../utils/createCtx';

interface Context {
  state: State;
  setAppLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
  setUserPoint: (point: number) => void;
  resetUser: () => void;
  callDefault: () => void;
}

const [useCtx, Provider] = createCtx<Context>();

export enum ActionType {
  SetAppLoading = 'set-app-loading',
  ResetUser = 'reset-user',
  SetUser = 'set-user',
  SetUserPoint = 'set-user-point',
  CallDefault = 'call-default',
}

export interface State {
  appLoading?: boolean;
  user: User | null;
}

const initialState: State = {
  user: null,
};

interface SetAppLoadingAction {
  type: ActionType.SetAppLoading;
  payload: boolean;
}

interface SetUserAction {
  type: ActionType.SetUser;
  payload: User;
}

interface SetUserPointAction {
  type: ActionType.SetUserPoint;
  payload: number;
}

interface ResetUserAction {
  type: ActionType.ResetUser;
}

interface GetStateAction {
  type: ActionType.CallDefault;
}

type Action = SetAppLoadingAction | SetUserAction | SetUserPointAction | ResetUserAction | GetStateAction;

interface Props {
  children?: React.ReactElement;
}

type Reducer = (state: State, action: Action) => State;

const callDefault = (dispatch: React.Dispatch<GetStateAction>) => (): void => {
  dispatch({
    type: ActionType.CallDefault,
  });
};

const setAppLoading = (dispatch: React.Dispatch<SetAppLoadingAction>) => (
  loading: boolean,
): void => {
  dispatch({
    type: ActionType.SetAppLoading,
    payload: loading,
  });
};

const setUser = (dispatch: React.Dispatch<SetUserAction>) => (
  user: User,
): void => {
  dispatch({
    type: ActionType.SetUser,
    payload: user,
  });
};

const setUserPoint = (dispatch: React.Dispatch<SetUserPointAction>) => (
  point: number,
): void => {
  dispatch({
    type: ActionType.SetUserPoint,
    payload: point,
  });
};

const resetUser = (dispatch: React.Dispatch<ResetUserAction>) => (): void => {
  dispatch({
    type: ActionType.ResetUser,
  });
};

const reducer: Reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'reset-user':
      return initialState;
    case 'set-user':
      return { ...state, user: action.payload };
    case 'set-user-point':
      if (!state.user) {
        return state;
      }

      return {
        ...state,
        user: {
          ...state.user,
          point: action.payload,
        },
      };
    case 'set-app-loading':
      return { ...state, appLoading: action.payload };
    default:
      return state;
  }
};

function AppProvider(props: Props): React.ReactElement {
  const [state, dispatch] = useReducer<Reducer>(reducer, initialState);

  const actions = {
    setAppLoading: setAppLoading(dispatch),
    setUser: setUser(dispatch),
    setUserPoint: setUserPoint(dispatch),
    resetUser: resetUser(dispatch),
    callDefault: callDefault(dispatch),
  };

  return <Provider value={{ state, ...actions }}>{props.children}</Provider>;
}

export { useCtx as useAppContext, AppProvider };
