import 'react-native';

import React, { ReactElement } from 'react';
import { RenderAPI, render } from '@testing-library/react-native';
import { createTestElement, createTestProps } from '../../../../test/testUtils';

import { CategoryType } from '../../../types';
import Screen from '../PostActivity';
import { categoryMap } from '../../../utils/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let props: any;
let component: ReactElement;
let testingLib: RenderAPI;

describe('Rendering', () => {
  beforeEach(() => {
    props = createTestProps({
      route: {
        params: {
          category: categoryMap[CategoryType.HandWash],
        },
      },
    });

    component = createTestElement(<Screen {...props} />);
    testingLib = render(component);
  });

  it('renders without crashing', () => {
    const baseElement = testingLib.toJSON();

    expect(baseElement).toMatchSnapshot();
    expect(baseElement).toBeTruthy();
  });
});

describe('Interaction', () => {
  beforeEach(() => {
    props = createTestProps({
      route: {
        params: {
          category: categoryMap[CategoryType.HandWash],
        },
      },
    });

    component = createTestElement(<Screen {...props} />);
    testingLib = render(component);
  });

  it('should simulate onClick', () => {
    const baseElement = testingLib.toJSON();

    expect(baseElement).toMatchSnapshot();
    // const btn = testingLib.queryByTestId('btn');
    // act(() => {
    //   fireEvent.press(btn);
    //   fireEvent.press(btn);
    // });
    // expect(cnt).toBe(3);
  });
});
