import 'react-native';

import * as React from 'react';

import {
  RenderResult,
  render,
} from '@testing-library/react-native';
import { createTestElement, createTestProps } from '../../../../test/testUtils';

import { CategoryType } from '../../../types';
import Shared from '../CategoryItem';
import { categoryMap } from '../../../utils/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let props: any;
let component: React.ReactElement;
let testingLib: RenderResult;

describe('Rendering', () => {
  beforeEach(() => {
    props = createTestProps({
      category: categoryMap[CategoryType.HandWash],
    });
    component = createTestElement(<Shared {...props} />);
    testingLib = render(component);
  });

  it('renders without crashing', () => {
    const { baseElement } = testingLib;
    expect(baseElement).toMatchSnapshot();
    expect(baseElement).toBeTruthy();
  });
});

describe('Interaction', () => {
  beforeEach(() => {
    testingLib = render(component);
  });

  it('should simulate onClick', () => {
    expect(testingLib.baseElement).toMatchSnapshot();
    // const btn = testingLib.queryByTestId('btn');
    // act(() => {
    //   fireEvent.press(btn);
    // });
    // expect(cnt).toBe(3);
  });
});
