import StreetSuggester from '../components/suggesters/StreetSuggester'

export const REQUEST_SUGGESTIONS = 'REQUEST_SUGGESTIONS';
export const RECEIVE_SUGGESTIONS = 'RECEIVE_SUGGESTIONS';
export const SAVE_SUGGESTION = 'SAVE_SUGGESTION';
export const SELECT_PLACE = 'SELECT_PLACE';
export const RECEIVE_PLACE_DATA = 'RECEIVE_PLACE_DATA';

const suggesters = [new StreetSuggester("street", {}, "http://servicios.usig.buenosaires.gob.ar/normalizar/?")];

export const selectSuggestion = place => ({
    type: SELECT_PLACE,
    selectedPlace: place
});

export const saveSuggestion = suggestion => ({
    type: SAVE_SUGGESTION,
    suggestion: suggestion
});

export const receivePlaceData = details => ({
    type: RECEIVE_PLACE_DATA,
    details: details
});

export const requestSuggestions = text => ({
  type: REQUEST_SUGGESTIONS,
  text: text
});

export const receiveSuggestions = (text, json) => ({
  type: RECEIVE_SUGGESTIONS,
  text: text,
  suggestions: json,
  receivedAt: Date.now()
});

export const fetchSuggestions = text => dispatch => {
    dispatch(requestSuggestions(text));
    suggesters.forEach((suggester) => {
        suggester.getSuggestions(text, (text, items) => {dispatch(receiveSuggestions(text, items))}, 10);
    });

};

