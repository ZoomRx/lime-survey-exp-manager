# Survey Expression Manager Node Module
The survey Expression Manager is a js module that provides functionality for parsing and highlighting expressions in a text area. It can be used to provide suggestions to users while they are typing identifiers, function names, and suffixes in an expression.

## Installation
  To use the Expression Manager in your project, you need to install it using npm. Open your terminal or command prompt and run the following command:
```bash
  npm install survey-exp-manager
```

## Usage
  To use the Expression Manager, you need to import the createExpressionManager function from the module. It takes an object as an argument with the following properties:

  **placeholder (optional):** The placeholder text to be displayed in the text editor when it is empty.  
  **readOnly (optional):** A boolean value to specify if the text editor should be read-only or editable. Default value is false.  
  **identifiers (optional):** Object containing all the different identifiers that can be written in the expression  
    &emsp;**Format:** { name: { description: "Description text" } }  
    &emsp;**options:**
        &emsp;&emsp;1. description (String) - Description to shown for the identifier in suggestion  
        &emsp;&emsp;2. suggestionOnly (Bool) - The identifier will only be used for showing suggestions (if true)  
        &emsp;&emsp;3. displayFor (String) - Match string for which the identifier can be shown in the suggestion  
        &emsp;&emsp;4. hideFor (String) - Match string for which the identifier should not be shown in the suggestion  
        &emsp;&emsp;5. returnType (*) - Type of the value the variable can have during runtime  
        &emsp;&emsp;6. customHTML (String) - Custom text to be shown instead of the name   
  **expFunctions (optional):** Functions to be supported inside the autocomplete field  
  **textBox:** The text area or text editor element that you want to attach the Expression Manager to.  
  **suffixes (optional):** These will be displayed in the suggestion when the user types a "."
      Anything that the user types after the "." will be considered a suffix and the corresponding list 
      will alone be searched.  
#### Listeners
  The suggestionListener emits three parameters:  
  **helpFor:** This refers to the element for which suggestions need to be shown.  
  **currentSuggestions:** It represents a list of suggestions (identifiers, suffixes, and expFunctions) that are matched for the element specified by the helpFor.  
  **activeSuggestionIndex:** It represents the index of the currently active suggestion in the currentSuggestions list.

Here is an example of how to use the Expression Manager:
```javascript
  import { createExpressionManager, expFunctions } from 'survey-exp-manager';

  // Get the text area element
  const textBoxElement = document.getElementById('myTextArea');

  // Define identifiers, expression functions, and suffixes (optional)
  const identifiers = { 
      // ... 
  };
  const expFunctions = expFunctions;
  const suffixes = {
      // ...
  };

  // Create the Expression Manager
  const expressionManager = createExpressionManager({
      placeholder: 'Type your expression here...',
      readOnly: false,
      identifiers,
      expFunctions,
      textBox: textBoxElement,
      suffixes,
  });

  // Listen for events (optional)
  expressionManager.on('onFocus', (expression) => {
      // Handle focus event
  });

  expressionManager.on('onBlur', (expression) => {
      // Handle blur event
  });

  expressionManager.on('suggestionsListener', ({ currentSuggestions, helpFor, activeSuggestionIndex }) => {
      // Handle suggestion changes
  });

  expressionManager.on('updateSuggestionIndex', (activeIndex) => {
        // Handle suggestion index
  });
  // You can also update identifiers or read-only mode dynamically
  expressionManager.updateIndentifier(identifiers);
  expressionManager.updateReadOnly(true);

  // To remove the change listener
  expressionManager.removeChangeListener();
  ```
## Dependencies
  The Expression Manager has the following dependencies, which will be automatically installed when you install the module:

  **events**: Node's event emitter for all engines.

  **acorn-loose**: This parser will parse any text into an ESTree syntax tree that is a reasonable approximation of what it might mean as a JavaScript program.

  **acorn-walk**: An abstract syntax tree walker for the ESTree format.

## License
  This project is licensed under the MIT License - see the LICENSE file for details.
