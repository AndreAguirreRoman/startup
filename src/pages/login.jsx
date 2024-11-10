

import React from 'react';
import { Unauthenticated } from '../components/login/unauthenticated';
import { Authenticated } from '../components/login/authenticated';
import { AuthState } from '../components/login/authState';

export function Login({ userName, authState, onAuthChange }) { 
  return (
    <main className='container-fluid bg-secondary text-center'>
      <div>
        {authState !== AuthState.Unknown && <Unauthenticated
            userName={userName}
            onLogin={(loginUserName) => {
              onAuthChange(loginUserName, AuthState.Authenticated);
            }}
          />}
        {authState === AuthState.Authenticated && (
          <Authenticated
            userName={userName}
            onLogout={() => onAuthChange(userName, AuthState.Unauthenticated)}
          />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            onLogin={(loginUserName) => {
              onAuthChange(loginUserName, AuthState.Authenticated);
            }}
          />
        )}
      </div>
    </main>
  );
}

export default Login;