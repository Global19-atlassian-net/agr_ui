import { expect } from 'chai';
import configureStore from '../configureStore';

describe('Store', () => {
  it('can be initialized to an object', () => {
    let store = configureStore();
    expect(store).to.be.a('object');
  });

  it('can getState() and return an object', () => {
    let store = configureStore();
    let state = store.getState();
    expect(state).to.be.a('object');
  });
});
