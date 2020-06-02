import React from 'react';
import {NavLink} from 'react-router-dom';
import './MainNavigation.css';
import AuthContext from '../../context/auth-context';

const mainNavigation =  props => (  //this is a functional component so static thing doesn't work here
    <AuthContext.Consumer>         
        { (context) =>{
                return(
                    <header className='main-navigation'>
                        <div className="main-navigation_logo">
                            <h1 className="main-heading">EasyEvent</h1>
                        </div>
                        <div className="main-navigation_items">
                            <ul>
                                {!context.token&& <li><NavLink to='/auth'> Authenticate</NavLink></li>}  {/*authenticate is only rendered when u are not logged in*/}
                                <li><NavLink to='/events'>Events</NavLink></li>
                                {context.token&&(
                                    <React.Fragment>
                                      <li><NavLink to='/bookings'> Bookings</NavLink></li>
                                     <li>
                                     <button onClick={context.logout}>Logout</button>
                                     </li>
                                    </React.Fragment>
                                 )}
                            </ul>
                
                        </div>
                    </header>
                        );
            }
        }
    </AuthContext.Consumer>
        
);

export default mainNavigation;
