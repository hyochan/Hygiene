import 'react-native';

import * as React from 'react';

import { RenderAPI, render, waitFor } from '@testing-library/react-native';
import { createTestElement, createTestProps } from '../../../../test/testUtils';

import StatusBar from '../StatusBar';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let props: any;
let component: React.ReactElement;
let testingLib: RenderAPI;
// let testingLib: RenderAPI;

describe('[StatusBar] render', () => {
  beforeEach(() => {
    props = createTestProps();
    component = createTestElement(<StatusBar {...props} />);
  });

  it('renders without crashing', async () => {
    testingLib = render(component);

    const baseElement = testingLib.toJSON();

    await waitFor(() => {
      expect(baseElement).toMatchSnapshot();
      expect(baseElement).toBeTruthy();
    });
  });

  // describe('interactions', () => {
  //   beforeEach(() => {
  //     testingLib = render(component);
  //   });

  //   it('should simulate onPress', () => {
  //     const btn = testingLib.queryByTestId('btn');
  //     act(() => {
  //       fireEvent.press(btn);
  //     });
  //     expect(cnt).toBe(3);
  //   });
  // });
});
