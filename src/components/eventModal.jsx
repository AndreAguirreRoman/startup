import '../design/app.scss'

import React, { useEffect, useState } from 'react';

const EventModal = ({ eventId, onClose }) => {
  const [event, setEvent] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]); // Manage comments locally

  useEffect(() => {
    const fetchEventAndAddress = async () => {
      try {
        // Fetch event details
        const eventResponse = await fetch(`/api/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event details');
        }

        const eventData = await eventResponse.json();
        setEvent(eventData);
        setComments(eventData.comments); // Initialize comments

        // Reverse geocode to get the address
        const address = await reverseGeocode(eventData.location.lat, eventData.location.lng);
        setAddress(address);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndAddress();
  }, [eventId]);

  const handlePostComment = async (comment) => {
    try {
      // Retrieve user info from localStorage (ensure it's stored when the user logs in)
      const user = JSON.parse(localStorage.getItem('user')) || { firstName: 'Guest', lastName: '' };
  
      const newComment = {
        user: `${user.firstName} ${user.lastName}`, // Use user's full name
        comment: comment.trim(),
        timestamp: new Date().toISOString(),
      };
  
      // Optimistically update the comments in the UI
      setComments((prevComments) => [...prevComments, newComment]);
  
      // Post the new comment to the API
      const response = await fetch(`/api/event/${eventId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ comment }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to post comment');
      }
  
      // Notify WebSocket about the new comment
      ws.send(
        JSON.stringify({
          type: 'new_comment',
          eventId,
          comment: newComment,
        })
      );
  
      // Fetch updated comments for consistency
      const updatedEventResponse = await fetch(`/api/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
  
      if (updatedEventResponse.ok) {
        const updatedEvent = await updatedEventResponse.json();
        setComments(updatedEvent.comments); // Update the comments list with the latest data
      }
    } catch (err) {
      console.error('Error posting or updating comments:', err.message);
    }
  };
  
  
  

  const reverseGeocode = async (lat, lng) => {
    const apiKey = 'AIzaSyBnOXew-3iQOkCV2EZWNKalALeOI2zoRjQ'; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address; // Return the first formatted address
      } else {
        return 'Address not found';
      }
    } catch (error) {
      console.error('Error:', error.message);
      return 'Address not found';
    }
  };

  if (loading) return <div className="modal">Loading event details...</div>;
  if (error) return <div className="modal">Error: {error}</div>;

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h1>{event.info}</h1>
        <p>
          <strong>Date:</strong> {new Date(event.date).toLocaleString()}
        </p>
        <p>
          <strong>Location:</strong> {event.location.lat}, {event.location.lng}
        </p>
        <p>
          <strong>Address:</strong> {address || 'Fetching address...'}
        </p>
        <p>
          <strong>Age Restriction:</strong> {event.ageRestriction}
        </p>
        <p>
          <strong>Gender Restriction:</strong> {event.genderRestriction}
        </p>
        <h2>Comments</h2>
        <div className="comments-wrapper">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index}>
                <strong>{comment.user}:</strong> {comment.comment}
                <p>{new Date(comment.timestamp).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
          <textarea id="new-comment" placeholder="Add your comment here..."></textarea>
          <button
            onClick={() => {
              const comment = document.getElementById('new-comment').value.trim();
              if (comment) {
                handlePostComment(comment);
                document.getElementById('new-comment').value = ''; // Clear the textarea
              }
            }}
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
