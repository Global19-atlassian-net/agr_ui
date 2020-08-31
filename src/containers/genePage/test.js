import { expect } from 'chai';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import configureStore from '../../lib/configureStore';

import GenePage from './index';

describe('GenePage', () => {
  it('should be able to render to an HTML string', () => {
    let store = configureStore();
    let htmlString = renderToString(
      <Provider store={store}>
        <GenePage geneId='WB:WBGene00197647' />
      </Provider>
    );
    expect(typeof htmlString).to.be.a('string');
  });
});
