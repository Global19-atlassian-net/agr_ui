import { expect } from 'chai';
import {
  fromJS
} from 'immutable';

import {
  selectSearchDomain,
  selectSearch,
  selectErrorMessage,
  selectIsError,
  selectResults,
  selectTotal,
  selectPageSize,
  selectTotalPages,
  selectActiveCategory,
  selectAggregations,
} from '../searchSelectors';

describe('SearchSelectors', () => {
  it('selectSearchDomain', () => {
    const searchState = fromJS({
      isError: true,
      results: [],
    });
    const mockedState = {
      search: fromJS(searchState),
    };
    expect(selectSearchDomain(mockedState)).to.deep.equal(searchState);
  });

  it('selectSearch', () => {
    const searchState = {
      isError: true,
      results: [],
    };
    const mockedState = {
      search: fromJS(searchState),
    };
    expect(selectSearch(mockedState)).to.deep.equal(searchState);
  });

  it('selectResults', () => {
    const searchState = {
      results: [1, 2, 3, 4]
    };
    const mockedState = {
      search: fromJS(searchState),
    };
    expect(selectResults(mockedState)).to.deep.equal(searchState.results);
  });

  it('selectErrorMessage', () => {
    const searchState = {
      errorMessage: 'This is an error'
    };
    const mockedState = {
      search: fromJS(searchState),
    };
    expect(selectErrorMessage(mockedState)).to.equal(searchState.errorMessage);
  });

  it('selectIsError', () => {
    const searchState = {
      isError: true
    };
    const mockedState = {
      search: fromJS(searchState),
    };
    expect(selectIsError(mockedState)).to.equal(searchState.isError);
  });

  it('selectTotal', () => {
    const searchState = {
      total: 10
    };
    const mockedState = {
      search: fromJS(searchState),
    };
    expect(selectTotal(mockedState)).to.equal(searchState.total);
  });

  it('selectPageSize', () => {
    const searchState = {
      pageSize: 33
    };
    const mockedState = {
      search: fromJS(searchState),
    };
    expect(selectPageSize(mockedState)).to.equal(searchState.pageSize);
  });

  it('selectTotalPages', () => {
    let searchState = {
      total: 10,
      pageSize: 50
    };
    let mockedState = {
      search: fromJS(searchState),
    };
    expect(selectTotalPages(mockedState)).to.equal(1);

    searchState = {
      total: 101,
      pageSize: 50
    };
    mockedState = {
      search: fromJS(searchState),
    };
    expect(selectTotalPages(mockedState)).to.equal(3);
  });

  it('selectActiveCategory', () => {
    const searchState = {
      activeCategory: 'my category'
    };
    const mockedState = {
      search: fromJS(searchState),
    };
    expect(selectActiveCategory(mockedState)).to.equal(searchState.activeCategory);
  });

  it('selectAggregations', () => {
    const searchState = {
      aggregations: [{
        name: 'myagg1',
        displayName: 'My agg1'
      }, {
        name: 'myagg2',
        displayName: 'My agg2'
      }]
    };
    const mockedState = {
      search: fromJS(searchState),
    };
    expect(selectAggregations(mockedState)).to.deep.equal(searchState.aggregations);
  });
});
