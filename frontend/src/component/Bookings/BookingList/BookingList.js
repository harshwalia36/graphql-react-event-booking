import React from 'react';
import './BookingList.css';

const bookingList = props => (
    <React.Fragment>
        <h1 className="heading">Bookings Made By You</h1>
    <ul className="bookings__list">
        {props.bookings.map(booking => {
            return(
                <li key={booking._id} className="bookings__item">
                    <div className="booking__item-data">
                    {booking.event.title} -{' '}
                    {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                 <div className="bookings__item-actions">
                    <button className="btn" onClick={props.onDelete.bind(this, booking._id)}>Cancel</button>
                 </div>
                </li>
            )
        })}
    </ul>
    </React.Fragment>
)

export default bookingList;