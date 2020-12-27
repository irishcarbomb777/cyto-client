import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { Auth } from 'aws-amplify';
import { useAppContext } from "../libs/contextLib";
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import "./Login.css";
import { useFormFields } from "../libs/hooksLib";

export default function Login() {
  // Special Hooks
  const { userHasAuthenticated } = useAppContext();   // Pull context from App.js
  const history = useHistory();   // Initiate the useHistory React Hook

  // State Hooks
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();   // Stop page from reloading on submit (React Built in)

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password); // Send User Pool login credentials to Auth
      userHasAuthenticated(true);         // Set User Session context flag to true
      history.push("/");                  // Push the "/" path to history to redirect          
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </Form>
    </div>
  );
}