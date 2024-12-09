import React, { useEffect, useState } from "react";

const EventModal = ({ eventId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
   
    const protocol = window.location.protocol === "http:" ? "ws" : "wss";
    const ws = new WebSocket(`${protocol}://${window.location.host}/ws`);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setStatus("Connected");
      ws.send(JSON.stringify({ type: "subscribe", eventId }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_comment" && data.eventId === eventId) {
          setComments((prev) => [...prev, data.comment]);
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
   
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }

        const data = await response.json();
        setEventDetails(data);
        setComments(data.comments || []);
      } catch (err) {
        console.error("Error fetching event details:", err);
      }
    };

    fetchEventDetails();
  }, [eventId]);


  useEffect(() => {
   
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
        setComments(data.comments || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, [eventId]);

  
  const handlePostComment = async () => {
    if (!newComment.trim()) return;
  
    try {
     
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
  
      const user = "Test User";
      const timestamp = new Date().toISOString();
  
     
      setComments((prevComments) => [
        ...prevComments,
        { user, comment: newComment.trim(), timestamp },
      ]);
  
     
      socket.send(
        JSON.stringify({
          type: "new_comment",
          payload: {
            eventId,
            comment: { user, comment: newComment.trim(), timestamp },
          },
        })
      );
  
      setNewComment("");
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
        <h1>Event Details</h1>
        {eventDetails ? (
          <div>
            <h2>{eventDetails.info}</h2>
            <p><strong>Start Time:</strong> {new Date(eventDetails.date).toLocaleString()}</p>
          </div>
        ) : (
          <p>Loading event details...</p>
        )}
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
