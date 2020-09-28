import 'react-native';

import * as React from 'react';

import {
  RenderAPI,
  render,
} from '@testing-library/react-native';
import { createTestElement, createTestProps } from '../../../../test/testUtils';

import Shared from '../FeedListItem';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let props: any;
let component: React.ReactElement;
let testingLib: RenderAPI;

jest.mock('../../../services/firebaseService', () => {
  return {
    getUserById: jest
      .fn()
      .mockImplementation(() => {
        return new Promise((resolve) => {
          resolve(true);
        });
      }),
  };
});

describe('Rendering', () => {
  beforeEach(() => {
    props = createTestProps({
      activity: {
        id: 'string',
        writerId: 'string',
        message: 'string',
        urls: [
          'url1',
          'url2',
        ],
        category: 'string',
      },
    });

    component = createTestElement(<Shared {...props} />);
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
    testingLib = render(component);
  });

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
