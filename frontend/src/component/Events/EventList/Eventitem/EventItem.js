import React from 'react';
import './eventItem.css';

const eventItem = props => {
    <li key={props.event._id} className="event_list-item">
    {props.event.title}
  </li>
}

export default eventItem;