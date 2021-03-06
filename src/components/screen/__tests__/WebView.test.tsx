import 'react-native';

import * as React from 'react';

import {
  RenderAPI,
  render,
} from '@testing-library/react-native';
import { createTestElement, createTestProps } from '../../../../test/testUtils';

import WebView from '../WebView';

jest.useFakeTimers();

// eslint-disable-next-line
let props: any;
let component: React.ReactElement;
let testingLib: RenderAPI;

describe('[WebView] screen', () => {
  beforeEach(() => {
    props = createTestProps({
      route: {
        params: {
          uri: 'https://dooboolab.com',
        },
      },
    });

    component = createTestElement(<WebView {...props} />);
    testingLib = render(component);
  });

  it('renders without crashing', () => {
    const baseElement = testingLib.toJSON();

    expect(baseElement).toMatchSnapshot();
  });
});
