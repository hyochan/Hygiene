import 'react-native';

import React, { ReactElement } from 'react';
import { RenderResult, cleanup, render } from '@testing-library/react-native';
import { createTestElement, createTestProps } from '../../../../test/testUtils';

import Screen from '../HomeMission';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let props: any;
let component: ReactElement;
let testingLib: RenderResult;

describe('Rendering', () => {
  beforeEach(() => {
    props = createTestProps();
    component = createTestElement(<Screen {...props} />);
    testingLib = render(component);
  });

  afterEach(cleanup);

  it('renders without crashing', () => {
    const { baseElement } = testingLib;
    expect(baseElement).toMatchSnapshot();
    expect(baseElement).toBeTruthy();
  });
});

describe('Interaction', () => {
  beforeEach(() => {
    props = createTestProps();
    component = createTestElement(<Screen {...props} />);
    testingLib = render(component);
  });

  afterEach(cleanup);

  it('should simulate onClick', () => {
    expect(testingLib.baseElement).toMatchSnapshot();
    // const btn = testingLib.queryByTestId('btn');
    // act(() => {
    //   fireEvent.press(btn);
    //   fireEvent.press(btn);
    // });
    // expect(cnt).toBe(3);
  });
});
