import { expect } from 'chai';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

import ReactApp from '../reactApplication';

describe('ReactApp', () => {
  it('should be able to render to an HTML string', () => {
    let htmlString = renderToString(
      <ReactApp router={MemoryRouter} />
    );
    expect(htmlString).to.be.a('string');
  });
});
