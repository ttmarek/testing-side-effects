const nock = require('nock');
const ReduxThunk = require('redux-thunk').default;
const configureStore = require('redux-mock-store').default;

const { deal } = require('../thunks');
const {
  DECK,
  CARD_KH,
  CARD_8C,
} = require('../__mocks__/deckofcardsapi');

afterEach(() => {
  nock.cleanAll();
});

let store;

describe('deal', () => {
  test('without deck', () => {
    store = configureStore([ReduxThunk])();

    nock('https://deckofcardsapi.com')
      .get('/api/deck/new/shuffle/?deck_count=1')
      .reply(200, DECK);

    nock('https://deckofcardsapi.com')
      .get('/api/deck/3p40paa87x90/draw/?count=1')
      .reply(200, CARD_KH);

    return store.dispatch(deal())
      .then(() => {
        expect(store.getActions()).toEqual([
          { type: 'REQUEST_PENDING' },
          { type: 'DECK_RETRIEVED', payload: '3p40paa87x90' },
          { type: 'REQUEST_PENDING' },
          {
            type: 'CARD_RETRIEVED',
            payload: {
              'image': 'https://deckofcardsapi.com/static/img/KH.png',
              'value': 'KING',
              'suit': 'HEARTS',
              'code': 'KH',
            },
          },
        ]);
      });
  });

  test('with deck', () => {
    store = configureStore([ReduxThunk])({ deckId: '3p40paa87x90' });

    nock('https://deckofcardsapi.com')
      .get('/api/deck/3p40paa87x90/draw/?count=1')
      .reply(200, CARD_8C);

    return store.dispatch(deal())
      .then(() => {
        expect(store.getActions()).toEqual([
          { type: 'REQUEST_PENDING' },
          {
            type: 'CARD_RETRIEVED',
            payload: {
              "image": "https://deckofcardsapi.com/static/img/8C.png",
              "value": "8",
              "suit": "CLUBS",
              "code": "8C",
            },
          },
        ]);
      });
  });
});
