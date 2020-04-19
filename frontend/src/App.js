import React, { Component } from 'react';
import {BrowserRouter,Route,Redirect,Switch} from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventPage from './pages/Event';
import BookingPage from './pages/Booking';
import MainNavigation from './component/NavigationBar/MainNavigation';
import './App.css';

class App extends Component {
 render() { 
   return (
    <BrowserRouter>
    <React.Fragment>
    <MainNavigation/>
    <main className='main-content'>
    <Switch>
      <Redirect exact from="/" to='/auth' />
      <Route  path="/auth" component={AuthPage}/>
      <Route  path="/events" component={EventPage}/>
      <Route  path="/bookings" component={BookingPage}/>
    </Switch>
    </main>
    </React.Fragment>
    </BrowserRouter>
  );
}
}

export default App;
