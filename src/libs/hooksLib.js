import { useState } from "react";

export function useFormFields(initialState) {
  const [fields, setValues] = useState(initialState);   // Create a state hook 
    // Return the same value that a state hook alone would return. ie. Return the
    // setValue function as the second argument and declare a custom function that
    // takes the "event" as an argument.
  return [
    fields,     // Return value of hook
    function(event) {       // Return state update function name
      setValues({
        ...fields,      // Make properties in fields accessible
        [event.target.id]: event.target.value   // Replace the prop corresponding to the target id
                                                // with the value of the target
      });
    }
  ];
}