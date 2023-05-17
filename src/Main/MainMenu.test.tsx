import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import { store } from '../Store/Store';
import MainMenu from './MainMenu';
import { BrowserRouter } from 'react-router-dom';

test('renders main menu without crashing', () => {
  render(
    <Provider store={store}>
        <BrowserRouter>
            <MainMenu />
        </BrowserRouter>
    </Provider>
  );

  expect(screen.getByText(/donate!/i)).toBeInTheDocument();
  // const linkElement = screen.getByText(/Maps With Friends/i);
  // expect(linkElement).toBeInTheDocument();
});