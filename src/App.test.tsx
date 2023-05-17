import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './Store/Store';

test('renders app without crashing', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  // const linkElement = screen.getByText(/Maps With Friends/i);
  // expect(linkElement).toBeInTheDocument();
});
