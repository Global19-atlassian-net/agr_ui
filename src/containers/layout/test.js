import { expect } from 'chai';
import React from 'react';

import Component from './index';

describe('Layout', () => {
  it('should be able initialize', () => {
    let node = <Component />;
    expect(node).to.be.a('object');
  });
});
