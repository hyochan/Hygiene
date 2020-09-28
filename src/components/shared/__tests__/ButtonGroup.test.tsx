import 'react-native';

import * as React from 'react';

import { RenderAPI, act, fireEvent, render } from '@testing-library/react-native';

import ButtonGroup from '../ButtonGroup';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let props: any;
let component: React.ReactElement;
let testingLib: RenderAPI;

const createTestProps = (obj: Record<string, unknown>): Record<string, unknown> => ({
  navigation: {
    navigate: jest.fn(),
  },
  ...obj,
});

describe('[ButtonGroup] render', () => {
  beforeEach(() => {
    props = createTestProps({});
    component = <ButtonGroup {...props} />;
  });

  it('renders without crashing', () => {
    const rendered: renderer.ReactTestRendererJSON = renderer
      .create(component)
      .toJSON();

    expect(rendered).toMatchSnapshot();
    expect(rendered).toBeTruthy();
  });

  describe('interactions', () => {
    beforeEach(() => {
      testingLib = render(component);
    });

    it('should simulate onPress', () => {
      const btn1 = testingLib.queryByTestId('CHILD_1');

      act(() => {
        fireEvent.press(btn1);
      });
    });
  });
});
