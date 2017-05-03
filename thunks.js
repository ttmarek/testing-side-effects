const fetch = require('isomorphic-fetch');

const dealCard = (dispatch, deckId) => {
  dispatch({ type: 'REQUEST_PENDING' });
  return fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    .then(resp => resp.json())
    .then(resp => resp.cards[0])
    .then(card => {
      dispatch({ type: 'CARD_RETRIEVED', payload: card });
    });
};

const deal = () => (dispatch, getState) => {
  const state = getState();
  if (state.deckId) {
    return dealCard(dispatch, state.deckId);
  } else {
    dispatch({ type: 'REQUEST_PENDING' });
    return fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(resp => resp.json())
      .then(resp => resp.deck_id)
      .then(deckId => {
        dispatch({ type: 'DECK_RETRIEVED', payload: deckId });
        return deckId;
      })
    .then(dealCard.bind(null, dispatch));
  }
};

module.exports = { deal };
