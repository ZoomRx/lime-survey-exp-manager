# Expression Manager Node Module
The Expression Manager is a js module that provides functionality for parsing and highlighting expressions in a text editor or text area. It can be used to provide suggestions to users while they are typing identifiers, function names, and suffixes in an expression.

## Installation
  To use the Expression Manager in your project, you need to install it using npm. Open your terminal or command prompt and run the following command:
```bash
  npm install survey-exp-manager
```

## Usage
  To use the Expression Manager, you need to import the createExpressionManager function from the module. It takes an object as an argument with the following properties:

  **placeholder (optional):** The placeholder text to be displayed in the text editor when it is empty.  
  **readOnly (optional):** A boolean value to specify if the text editor should be read-only or editable. Default value is false.  
  **identifiers (optional):** An object that contains valid identifiers and their details, used for suggestions.  
  **expFunctions (optional):** An object that contains valid expression functions and their details, used for suggestions.  
  **textBox:** The text area or text editor element that you want to attach the Expression Manager to.  
  **suffixes (optional):** An object that contains valid suffixes and their details, used for suggestions.  

Here is an example of how to use the Expression Manager:
```javascript
  import { createExpressionManager, expFunctions } from 'expression-manager';

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
  expressionManager.on('onFocus', ({ expression }) => {
      // Handle focus event
  });

  expressionManager.on('onBlur', ({ expression }) => {
      // Handle blur event
  });

  expressionManager.on('suggestionsListener', ({ currentSuggestions, helpFor, activeSuggestionIndex }) => {
      // Handle suggestion changes
  });

  // You can also update identifiers or read-only mode dynamically
  expressionManager.updateIndentifier(identifiers);
  expressionManager.updateReadOnly(true);

  // To remove the change listener
  expressionManager.removeChangeListener();
  ```
## Dependencies
  The Expression Manager has the following dependencies, which will be automatically installed when you install the module:

  events: Node's event emitter for all engines.

## License
  This project is licensed under the MIT License - see the LICENSE file for details.
