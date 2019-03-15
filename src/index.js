import React from 'react';
import { render } from 'react-dom';
import * as analytics from './lib/analytics';
import 'bootstrap';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import '@geneontology/ribbon/lib/index.css';
import 'genomefeaturecomponent/src/GenomeFeatureViewer.css';
import './style.scss';

import ReactApp from './reactApplication';

function main() {
  render(
    <ReactApp />,
    document.getElementById('app')
  );
}

function browserSupportsAllFeatures() {
  return window.Promise && window.fetch && window.Symbol;
}

analytics.initialize();

if (browserSupportsAllFeatures()) {
  // Browsers that support all features run `main()` immediately.
  main();
} else {
  // All other browsers loads polyfills and then run `main()`.
  require(['babel-polyfill'], () => {
    main();
  });
}

if (module.hot) {
  module.hot.accept();
}
