import * as React from 'react';

import { Button, View } from 'react-native';
import { FeedProvider, useFeedContext } from '../FeedProvider';
import { RenderResult, act, fireEvent, render } from '@testing-library/react-native';

const FakeChild = (): React.ReactElement => {
  const { setFeeds } = useFeedContext();
  return (
    <View>
      <Button
        testID="BUTTON"
        onPress={(): void =>
          setFeeds([])
        }
        title="Button"
      />
    </View>
  );
};

describe('Rendering', () => {
  const component = (
    <FeedProvider>
      <FakeChild />
    </FeedProvider>
  );
  const testingLib: RenderResult = render(component);

  it('component and snapshot matches', () => {
    const { baseElement } = testingLib;
    expect(baseElement).toMatchSnapshot();
    expect(baseElement).toBeTruthy();
  });
});

describe('Interactions', () => {
  it('should setUser', async () => {
    const { getByTestId } = render(
      <FeedProvider>
        <FakeChild />
      </FeedProvider>,
    );
    act(() => {
      fireEvent.press(getByTestId('BUTTON'));
    });
  });
});
