import React, { useState } from 'react';

import { Activity } from '../types';
import createCtx from '../utils/createCtx';

interface Context {
  feeds: Activity[];
  setFeeds: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const [useCtx, Provider] = createCtx<Context>();

interface Props {
  children?: React.ReactElement;
}

function FeedProvider({ children }: Props): React.ReactElement {
  const [feeds, setFeeds] = useState<Activity[]>([]);

  return (
    <Provider
      value={{
        feeds,
        setFeeds,
      }}
    >
      {children}
    </Provider>
  );
}

export { useCtx as useFeedContext, FeedProvider };
