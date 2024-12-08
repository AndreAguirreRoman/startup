import React, { useEffect, useState } from 'react';

const EventComments = ({ eventId, user }) => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const ws = React.useRef(null);

  useEffect(() => {
    // Establish WebSocket connection
    ws.current = new WebSocket('ws://localhost:4000');

    ws.current.onopen = () => {
      console.log('WebSocket connected!');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'comment' && message.payload.eventId === eventId) {
        setComments((prev) => [...prev, message.payload.comment]);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      // Cleanup WebSocket on component unmount
      ws.current.close();
    };
  }, [eventId]);

  const sendComment = () => {
    if (commentInput.trim() && ws.current) {
      ws.current.send(
        JSON.stringify({
          type: 'comment',
          payload: {
            eventId,
            comment: commentInput,
          },
          user,
        })
      );
      setCommentInput(''); // Clear input
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      <div>
        {comments.map((comment, index) => (
          <div key={index}>
            <strong>{comment.user}:</strong> {comment.comment}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
        placeholder="Add a comment"
      />
      <button onClick={sendComment}>Send</button>
    </div>
  );
};

export default EventComments;
