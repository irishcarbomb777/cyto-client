import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import "./App.css";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { onError } from "./libs/errorLib";

function App() {
  const history = useHistory(); // Initiate the useHistory React Hook

  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();         // Signs user out of AWS Auth
    
    userHasAuthenticated(false);  // Signs user out of React App

    history.push("/login")        // Push the "/login" path to history to redirect
  }

  return (
    !isAuthenticating && (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
          <LinkContainer to="/">
            <Navbar.Brand href="/" className="font-weight-bold text-muted">
              CytoDynamic Solutions
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              ) : (
                // Note the below <> is called a fragment component. It solves the
                // problem of needing an extra <div> container when you want to place
                // more than one React Component.
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider value={{isAuthenticated, userHasAuthenticated}}>
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;
