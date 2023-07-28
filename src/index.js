import ParseAndHighlight from '../src/survey-exp-manager/parser-highlighter';
import evaluateExpression from '../src/survey-exp-manager/parser';
import {
    CallExpression,
    Identifier,
    Suffix,
    AdvQuota,
    Operator,
    Literal,
    EXP_FUNCTIONS,
    TOKENS,
    SUFFIXES
  } from '../src/survey-exp-manager/constants';
import { EventEmitter } from 'events';
import { isEmpty } from '../utility/utils'

import CodeMirror from '../codemirror-5.43.0/lib/codemirror.js';
import '../codemirror-5.43.0/lib/codemirror.css';
import '../codemirror-5.43.0/mode/javascript/javascript.js';
import '../codemirror-5.43.0/lib/codemirror.js';
import '../codemirror-5.43.0/addon/edit/matchbrackets.js';
import '../codemirror-5.43.0/addon/display/placeholder.js';

// Number of suggestions to show to users when they are in the middle of typing some Identifiers
// const MAX_SUGGESTIONS_COUNT = 10;

function searchSuggestions(baseList = [], searchTerm, results) {
    searchTerm = searchTerm.toLowerCase();
    var vars = Object.keys(baseList);
    //T2765
    if (searchTerm.endsWith('.✖')) {
        searchTerm = searchTerm.slice(0, -2);
    }
    vars.forEach((name/*, index*/) => {
        let item = baseList[name],
            nameLC = name.toLowerCase(),
            displayFor = item.displayFor && item.displayFor.toLowerCase(),
            hideFor = item.hideFor && item.hideFor.toLowerCase(),
            nameMatches = nameLC.startsWith(searchTerm),
            // Find if the search term has a direct match with the name
            straightMatch = !displayFor && nameMatches,
            // Find if the content in displayFor is present in the searchTerm and has a straight match
            customMatch = searchTerm.startsWith(displayFor) && nameMatches,
            // Find if the content of hideFor is present in the searchTerm
            forceHide = searchTerm.startsWith(hideFor),
            // Check if the item is already fully typed by user
            itemCompleted = (nameLC + (item.appendRight ? item.appendRight : '')) === searchTerm;

        if ((straightMatch || customMatch) && !forceHide && !itemCompleted) {
            let result = { name, ...item }
            results.push(result);
        }
    });
}
function createExpressionManager(config) {
    let { placeholder, readOnly, identifiers, expFunctions, textBox, suffixes } = config;
    if (!textBox) {
        return {};
    } 
    if (isEmpty(expFunctions)) {
        expFunctions = EXP_FUNCTIONS;
    }
    if (isEmpty(identifiers)) {
        identifiers = TOKENS;
    }
    if (isEmpty(suffixes)) {
        suffixes = SUFFIXES;
    }
    if (readOnly === undefined) {
        readOnly = false;
    }
    CodeMirror.defineMode('multiText', function() {
        return {
            token: function(stream) {
                stream.next();
                return null;
            }
        }
    });
    class expressionManager extends EventEmitter {
        constructor() {
            super(...arguments);
            this.currentSuggestions = [];
            this.identifiers = identifiers;
            this.suffixes = suffixes;
            this.expFunctions = expFunctions;
            let codeMirror = CodeMirror.fromTextArea(textBox, {
                mode: "multiText",
                viewportMargin: Infinity,
                matchBrackets: true,
                lineWrapping: true,
                placeholder: placeholder,
                readOnly: readOnly ? 'nocursor' : false
            });
        
            codeMirror.on('focus', this.editStart.bind(this));
            codeMirror.on('change', this.changeListener.bind(this));
            codeMirror.on('blur', this.editEnd.bind(this));


            codeMirror.setOption("extraKeys", {
                Up: function(/*cm*/) {
                    let suggestionsCount = this.currentSuggestions.length;
                    if (this.activeSuggestionIndex === 0) {
                        this.activeSuggestionIndex = suggestionsCount - 1;
                        return;
                    }
                    this.activeSuggestionIndex--;
                    this.emit('updateSuggestionIndex', this.activeSuggestionIndex);
                }.bind(this),
                Down: function(/*cm*/) {
                    let suggestionsCount = this.currentSuggestions.length;
                    if (this.activeSuggestionIndex === suggestionsCount - 1) {
                        this.activeSuggestionIndex = 0;
                        return;
                    }
                    this.activeSuggestionIndex++;
                    this.emit('updateSuggestionIndex', this.activeSuggestionIndex);
                }.bind(this),
                Enter: function(/*cm*/) {
                    this.replaceSuggestion();
                }.bind(this),
                'Shift-Enter': function(/*cm*/) {
                    // Doing nothing here.
                    // Just making sure codemirror does not add new lines
                }.bind(this),
                'Ctrl-Enter': function(/*cm*/) {
                    this.editEnd();
                    this.$('.CodeMirror-focused textarea').blur();
                }.bind(this),
                'Tab': function(/*cm*/) {
                    // do nothing here
                }.bind(this)
            });

            this.codeMirror = codeMirror;
            this.changeListener();
        }
        replaceSuggestion() {
            var helpFor = this.helpFor;
            var suggestion = this.currentSuggestions[this.activeSuggestionIndex];
            if (helpFor && suggestion) {
                this.chooseSuggestion(helpFor, suggestion);
            }
        }
        editStart() {
            var codeMirror = this.codeMirror,
                expression = codeMirror.getValue();
            this.codeMirror.focus();
            this.emit('onFocus', expression);
        }
        editEnd() {
            var codeMirror = this.codeMirror,
                expression = codeMirror.getValue();            
            this.emit('onBlur', expression);
        }
        updateReadOnly(readOnly) {
            this.codeMirror.doc.cm.toTextArea();
            this.readOnly = readOnly;
            this.codeMirror.setOption('readOnly', this.readOnly);
        }
        changeListener() {
            var validIdentifiers = {},
                codeMirror = this.codeMirror,
                expression = codeMirror.getValue(),
                results,
                helpFor;
            // Filter identifiers that should only be used for suggestions
            Object.keys(this.identifiers).forEach(name => {
                let identifier = this.identifiers[name];
                if (!identifier.suggestionOnly) {
                    validIdentifiers[name] = identifier;
                }
            });
            results = evaluateExpression(expression, validIdentifiers, this.suffixes);
            let options = {
                bufferHighlight: results.length > 1000,
            }
            helpFor = ParseAndHighlight(expression, results, codeMirror, options);
            
            // Set the function or variable for which description needs to be shown
            if (helpFor && helpFor.type === CallExpression) {
                helpFor = { ...helpFor, ...this.expFunctions[helpFor.name] };
            } else if (helpFor && helpFor.type === Identifier) {
                helpFor = { ...helpFor, ...validIdentifiers[helpFor.name] };
            }
            this.isLastSuffixShown = helpFor && helpFor.isLastSuffixShown;
            this.lastIdentifier = helpFor && helpFor.lastIdentifier;

            this.resultsArray = results;
            this.helpFor = helpFor;
            this.activeSuggestionIndex = 0;
            let suggestions = helpFor && this.getSuggestions(helpFor.name, helpFor.type);
            setTimeout(() => {
                this.emit('suggestionsListener', {
                    currentSuggestions: suggestions,
                    helpFor: helpFor,
                    activeSuggestionIndex: this.activeSuggestionIndex
                });
            });

        }
        getSuggestions(searchTerm, type) {
            var validIdentifiers = this.identifiers;
            var results = [];
            // Acorn parser return name as "✖" when nothing is there. 
            // Replace it with '' to produce search results containing all the items
            if (searchTerm === '✖') {
                searchTerm = '';
            }
            let searchRhsSuggestions = (searchTerm = '') => {
                if (
                    !this.lastIdentifier
                    || !validIdentifiers[this.lastIdentifier.name]
                    || !validIdentifiers[this.lastIdentifier.name].rhsSuggestions
                    || (
                        this.isLastSuffixShown
                        && !validIdentifiers[this.lastIdentifier.name].isSingleChoiceQtype
                    )
                ) {
                    return;
                }
                searchTerm = searchTerm.toLowerCase().trim();
                validIdentifiers[this.lastIdentifier.name].rhsSuggestions
                    .forEach(suggestion => {
                        let suggestionString = suggestion.name.toLowerCase();
                        let suggestionData = {
                                name: `"${suggestion.name}"`,
                                description: suggestion.description
                            }
                        if (this.isLastSuffixShown) {
                            suggestionString = suggestion.description.toLowerCase();
                            suggestionData = { name: `"${suggestion.description}"` }
                        }
                        if (!searchTerm 
                            || (
                                suggestionString.startsWith(searchTerm) 
                                && suggestionString !== searchTerm
                            )
                        ) {
                            results.push(suggestionData);
                        } 
                    });
            }
            // If the user is typing a suffix, then it is nice to show only all the suffixes
            switch(type) {
                case Suffix:
                    // Search through suffixes
                    searchSuggestions(this.suffixes, searchTerm, results);
                    break;
                case Identifier:
                case CallExpression:
                    searchRhsSuggestions();
                    // Search through variables
                    searchSuggestions(validIdentifiers, searchTerm, results);
                    // Search through functions
                    searchSuggestions(this.expFunctions, searchTerm, results);
                    break;
                case AdvQuota:
                    searchSuggestions(this.suffixes, searchTerm, results);
                    break;
                case Operator:
                    searchRhsSuggestions();
                    // Search through functions
                    searchSuggestions(this.expFunctions, '', results);
                    break;
                case Literal:
                    searchRhsSuggestions(searchTerm);
            }

            const compareNames = (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase());

            results.sort(compareNames);
            this.currentSuggestions = results;
            return results;
        }
        focus() {
            this.codeMirror.focus();
        }
        updateActiveSuggestionIndex(index) {
            this.activeSuggestionIndex = index;
        }
        removeChangeListener() {
            if (this.codeMirror) {
                this.codeMirror.off('change', this.changeListener.bind(this));
            }
        }
        updateIndentifier(identifiers) {
            if (typeof identifiers === 'object') {
                this.identifiers = identifiers;
                this.changeListener();
            }
        }
        chooseSuggestion(helpFor, suggestion) {
            var codeMirror = this.codeMirror;
            var replaceText = suggestion.name;
            var startPosition = {
                line: 0,
                ch: helpFor.start
            }
            var endPosition = {
                line: 0,
                ch: helpFor.end
            }
            if (replaceText in expFunctions) {
                replaceText += '(';
            } else if (suggestion.appendRight) {
                replaceText += suggestion.appendRight;
            }
            if (helpFor.type === Operator) {
                codeMirror.replaceRange(
                    replaceText,
                    endPosition
                );
            } else {
                codeMirror.replaceRange(
                    replaceText,
                    startPosition,
                    endPosition
                );
            }
            codeMirror.focus();
            this.activeSuggestionIndex = 0;
            this.emit('updateSuggestionIndex', 0);
        }
    }
    let expReference = new expressionManager();
    return expReference;
}

export { createExpressionManager };
export * from './survey-exp-manager/constants';
