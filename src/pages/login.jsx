

import React from 'react';
import { Unauthenticated } from '../components/login/unauthenticated';
import { AuthState } from '../components/login/authState';

export function Login({ userName, authState, onAuthChange }) { 

  console.log("Props", {userName}, authState)
console.log("Current authState:", authState);
  return (

      <div>
        {(authState === AuthState.Unknown || authState === AuthState.Unauthenticated) &&  (
        <Unauthenticated userName={userName} onLogin={(loginUserName) => { console.log("Logging in with user:", loginUserName); onAuthChange(loginUserName, AuthState.Authenticated);
          }}
        />
        )}
      </div>
  );
}

export default Login;