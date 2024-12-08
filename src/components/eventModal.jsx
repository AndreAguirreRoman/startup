import React, { useEffect, useState } from "react";

const EventModal = ({ eventId, onClose }) => {
  const [comments, setComments] = useState([]); // Store comments
  const [newComment, setNewComment] = useState(""); // Input for new comment
  const [socket, setSocket] = useState(null); // WebSocket connection
  const [status, setStatus] = useState("Disconnected"); // Connection status

  useEffect(() => {
    // Establish WebSocket connection
    const protocol = window.location.protocol === "http:" ? "ws" : "wss";
    const ws = new WebSocket(`${protocol}://${window.location.host}/ws`);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setStatus("Connected");
      ws.send(JSON.stringify({ type: "subscribe", eventId })); // Subscribe to this event
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_comment" && data.eventId === eventId) {
          setComments((prev) => [...prev, data.comment]); // Append new comment
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setStatus("Disconnected");
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [eventId]);

  useEffect(() => {
    // Fetch initial comments when the modal opens
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        const data = await response.json();
        setComments(data.comments || []); // Initialize comments
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, [eventId]);

  
  const handlePostComment = async () => {
    if (!newComment.trim()) return; // Do not allow empty comments
  
    try {
      // POST the new comment to the server
      const response = await fetch(`/api/event/${eventId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ comment: newComment.trim() }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to post comment");
      }
  
      const user = "Test User"; // Replace with actual user information
      const timestamp = new Date().toISOString();
  
      // Optimistically update the comments in the UI
      setComments((prevComments) => [
        ...prevComments,
        { user, comment: newComment.trim(), timestamp },
      ]);
  
      // Send a WebSocket message to notify others about the new comment
      socket.send(
        JSON.stringify({
          type: "new_comment",
          payload: {
            eventId,
            comment: { user, comment: newComment.trim(), timestamp },
          },
        })
      );
  
      setNewComment(""); // Clear the input field
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };
  

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h1>Event Comments</h1>
        <p>WebSocket Status: {status}</p>
        <div
          className="comments-section"
          style={{ overflowY: "scroll", maxHeight: "300px" }}
        >
          {comments.map((comment, index) => (
            <div key={index}>
              <strong>{comment.user}:</strong> {comment.comment}
              <p>{new Date(comment.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your comment here..."
        />
        <button onClick={handlePostComment}>Post Comment</button>
      </div>
    </div>
  );
};

export default EventModal;
