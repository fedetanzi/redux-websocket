/**
 * Created by federuiz on 7/3/17.
 */
import suggestions from './suggestions'
import * as types from '../constants/ActionTypes'

describe ("suggestions reducer", () => {
    it('should handle empty initial state', () => {
        expect(
            suggestions(undefined, {})
        ).toEqual({
                currentSuggestions: [],
                currentText: "",
                currentSearch: "",
                maxSuggestions: 10,
                loadingSuggestions: false,
            }
        )
    });

    it('should handle INPUT_CHANGE', () => {
        expect(
            suggestions({
                currentSuggestions: [],
                currentText: "",
                currentSearch: ""
            }, {
                type: types.INPUT_CHANGE,
                text: "libertador"
            })
        ).toEqual({
            currentSuggestions: [],
            currentText: "libertador",
            currentSearch: ""
        })
    });

    it('should handle REQUEST_SUGGESTIONS', () => {
        expect(
            suggestions({
                currentSuggestions: [],
                currentText: "libertador",
                currentSearch: ""
            }, {
                type: types.REQUEST_SUGGESTIONS,
                text: "libertador"
            })
        ).toEqual({
            currentSuggestions: [],
            currentText: "libertador",
            currentSearch: "",
            loadingSuggestions: true,
        })
    });

    it('should handle RECEIVE_SUGGESTIONS', () => {
        // Add a suggestion with empty list.
        expect(
            suggestions({
                currentSuggestions: [],
                currentText: "libertador",
                currentSearch: "libertador"
            }, {
                type: types.RECEIVE_SUGGESTIONS,
                suggestions: [
                    {
                        title: 'My address 123',
                        subtitle: "My region"
                    }
                ],
                text: "libertador"
            })
        ).toEqual({
            currentSuggestions: [{
                title: 'My address 123',
                subtitle: "My region"
            }],
            currentText: "libertador",
            currentSearch: "libertador",
            loadingSuggestions: false,
        });
        // Add a suggestion with existing current suggestions.
        expect(
            suggestions({
                currentSuggestions: [{
                    title: 'My address 123',
                    subtitle: "My region"
                }],
                currentText: "libertador",
                currentSearch: "libertador"
            }, {
                type: types.RECEIVE_SUGGESTIONS,
                suggestions: [
                    {
                        title: 'My address 1234',
                        subtitle: "My region"
                    }
                ],
                text: "libertador"
            })
        ).toEqual({
            currentSuggestions: [
                {
                    title: 'My address 123',
                    subtitle: "My region"
                },
                {
                    title: 'My address 1234',
                    subtitle: "My region"
                }],
            currentText: "libertador",
            currentSearch: "libertador",
            loadingSuggestions: false,
        });
        // Reset the suggestions to an empty list.
        expect(
            suggestions({
                currentSuggestions: [
                    {
                    title: 'My address 1234',
                    subtitle: "My region"
                }],
                currentText: "",
                currentSearch: ""
            }, {
                type: types.RECEIVE_SUGGESTIONS,
                suggestions: [
                ],
                text: ""
            })
        ).toEqual({
            currentSuggestions: [],
            currentText: "",
            currentSearch: "",
            loadingSuggestions: false,
        });
        // Try to add a suggestion when currentText is different than the action text.
        expect(
            suggestions({
                currentSuggestions: [],
                currentText: "libertador",
                currentSearch: "libertador"
            }, {
                type: types.RECEIVE_SUGGESTIONS,
                suggestions: [
                    {
                        title: 'My address 1234',
                        subtitle: "My region"
                    }
                ],
                text: "santa fe"
            })
        ).toEqual({
            currentSuggestions: [],
            currentText: "libertador",
            currentSearch: "libertador",
            loadingSuggestions: false,
        });
        // Try to add more suggestions than the limit.
        expect(
            suggestions({
                currentSuggestions: [],
                currentText: "libertador",
                currentSearch: "libertador",
                maxSuggestions: 2,
            }, {
                type: types.RECEIVE_SUGGESTIONS,
                suggestions: [
                    {
                        title: 'My address 1234',
                        subtitle: "My region"
                    },
                    {
                        title: 'My address 1234',
                        subtitle: "My region"
                    },
                    {
                        title: 'My address 1234',
                        subtitle: "My region"
                    },
                    {
                        title: 'My address 1234',
                        subtitle: "My region"
                    }
                ],
                text: "libertador"
            })
        ).toEqual({
            currentSuggestions: [{
                title: 'My address 1234',
                subtitle: "My region"
            },
                {
                    title: 'My address 1234',
                    subtitle: "My region"
                }],
            currentText: "libertador",
            currentSearch: "libertador",
            maxSuggestions: 2,
            loadingSuggestions: false,
        })
    });
});
