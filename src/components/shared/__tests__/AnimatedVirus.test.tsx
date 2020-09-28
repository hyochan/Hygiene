import 'react-native';

import * as React from 'react';

import {
  RenderAPI,
  cleanup,
  render,
} from '@testing-library/react-native';
import { createTestElement, createTestProps } from '../../../../test/testUtils';

import Shared from '../AnimatedVirus';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let props: any;
let component: React.ReactElement;
let testingLib: RenderAPI;

describe('Rendering', () => {
  beforeEach(() => {
    props = createTestProps();
    component = createTestElement(<Shared {...props} />);
    testingLib = render(component);
  });

  afterEach(cleanup);

  it('renders without crashing', () => {
    const baseElement = testingLib.toJSON();

    expect(baseElement).toMatchSnapshot();
    expect(baseElement).toBeTruthy();
  });
});

describe('Interaction', () => {
  beforeEach(() => {
    testingLib = render(component);
  });

  afterEach(cleanup);

  it('should simulate onClick', () => {
    const baseElement = testingLib.toJSON();

    expect(baseElement).toMatchSnapshot();
    // const btn = testingLib.queryByTestId('btn');
    // act(() => {
    //   fireEvent.press(btn);
    // });
    // expect(cnt).toBe(3);
  });
});
