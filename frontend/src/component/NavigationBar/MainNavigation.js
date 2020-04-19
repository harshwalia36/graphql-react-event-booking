import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import './MainNavigation.css';

const mainNavigation =  props => {
        return(
    <header className='main-navigation'>
        <div className="main-navigation_logo">
            <h1>EasyEvent</h1>
        </div>
        <div className="main-navigation_items">
            <ul>
                <li><NavLink to='/auth'> Authenticate</NavLink></li>
                <li><NavLink to='/events'>Events</NavLink></li>
                <li><NavLink to='/bookings'> Bookings</NavLink></li>
            </ul>

        </div>
    </header>
        );
};

export default mainNavigation;
