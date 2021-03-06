import StreetSuggester from '../components/suggesters/StreetSuggester'
import PlaceSuggester from '../components/suggesters/PlaceSuggester'
import {STREET_URL, PLACE_URL, DETAILS_URL} from '../constants/ApiUrls'

import {SELECT_PLACE, INPUT_CHANGE,SAVE_SUGGESTION, RECEIVE_PLACE_DATA,RECEIVE_SUGGESTIONS,REQUEST_SUGGESTIONS, DELETE_PLACE, STREET_TYPE, PLACE_TYPE, REQUEST_PLACE_DATA, DIRECTION_TYPE, CLEAR_SUGGESTIONS} from '../constants/ActionTypes'

const suggesters = [
    new StreetSuggester("street", {maxSuggestions: 10}, STREET_URL, STREET_TYPE),
    new PlaceSuggester("place", {maxSuggestions: 10}, PLACE_URL, PLACE_TYPE)
];

export const selectSuggestion = place => ({
    type: SELECT_PLACE,
    selectedPlace: place
});

export const inputChange = text => ({
    type: INPUT_CHANGE,
    text: text
});

export const saveSuggestion = suggestion => (dispatch, getState) => {
    console.log ("saving");
    dispatch(requestPlaceData());
    // The street suggestions already contain the coordinates, but the places suggestions don't
    if (suggestion.coordinates) {
        const detailsUrl = `${DETAILS_URL}x=${suggestion.coordinates.x}&y=${suggestion.coordinates.y}`;
        return getDetails(detailsUrl, suggestion, dispatch);
    }
    // We need the suggestion id to get its coordinates
    if (suggestion.id) {
        const contentUrl =`${PLACE_URL}getObjectContent?id=${suggestion.id}`;
        return fetch (contentUrl)
            .then (response => response.json())
            .then (json => {
                suggestion.coordinates = getCoordinatesFromPoint(json.ubicacion.centroide);
                const detailsUrl = `${DETAILS_URL}x=${suggestion.coordinates.x}&y=${suggestion.coordinates.y}`;
                return getDetails(detailsUrl, suggestion, dispatch);
            })
    }
    // For directions type, go fetch its coordinates if the suggestion doesn't have them already
    else if (suggestion.subTitle === DIRECTION_TYPE){
        const contentUrl =`${STREET_URL}direccion=${suggestion.title}`;
        return fetch (contentUrl)
            .then (response => response.json())
            .then (json => {
                if (json.direccionesNormalizadas.length !== 0 && json.direccionesNormalizadas[0].coordenadas){
                    suggestion.coordinates = json.direccionesNormalizadas[0].coordenadas;
                    const detailsUrl = `${DETAILS_URL}x=${suggestion.coordinates.x}&y=${suggestion.coordinates.y}`;
                    return getDetails(detailsUrl, suggestion, dispatch);
                }
                dispatch({
                    type: SAVE_SUGGESTION,
                    suggestion: suggestion
                });
            })
    }
    // If the suggestion doesn't have id nor coordinates, just save it.
    dispatch({
        type: SAVE_SUGGESTION,
        suggestion: suggestion
    });
};
// The getObjectContent API returns a POINT string with the coordinates in it.
const getCoordinatesFromPoint = (pointString) => {
    const parenthesisSplit = pointString.split("(")[1].split(")")[0].split(" ");
    return {
        x: parenthesisSplit[0],
        y: parenthesisSplit[1],
    }
};

const getDetails = (url, suggestion, dispatch) => {
    return fetch(url)
        .then(response => response.json())
        .then(json => {
            suggestion.details = json;
            dispatch({
                type: SAVE_SUGGESTION,
                suggestion: suggestion
            })
        })
};

export const receivePlaceData = details => ({
    type: RECEIVE_PLACE_DATA,
    details: details
});
export const requestPlaceData = () => ({
    type: REQUEST_PLACE_DATA,
});
export const requestSuggestions = (text, type, index) => ({
    type: REQUEST_SUGGESTIONS,
    text: text,
    suggesterType: type,
    requestIndex: index,
});

export const receiveSuggestions = (text, json, type, index) => ({
  type: RECEIVE_SUGGESTIONS,
  text: text,
  suggestions: json,
  receivedAt: Date.now(),
    suggesterType: type,
    requestIndex: index,
});

export const clearSuggestions = (text) => ({
    type: CLEAR_SUGGESTIONS,
    text: text,
    suggestions: [],
    receivedAt: Date.now(),
});

export const fetchSuggestions = (text, type) => (dispatch, getState) => {
    const reqIndex = getState().suggestions.requestIndex + 1;
    suggesters.forEach((suggester) => {
        if (suggester.getType() === type) {
            dispatch(requestSuggestions(text, type, reqIndex));
            suggester.getSuggestions(text, (text, items, type) => {dispatch(receiveSuggestions(text, items, type, reqIndex))});
        }
    });
};

export const selectPlace = place => ({
    type: SELECT_PLACE,
    selectedPlace: place
});

export const deletePlace = place => ({
    type: DELETE_PLACE,
    selectedPlace: place
});



