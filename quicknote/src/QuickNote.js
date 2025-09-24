import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./QuickNote.css";
import GAL from "./images/250542.jpg";
import { Card } from "react-bootstrap";

function QuickNote() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const API_BASE =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_API_BASE
      : window.location.origin;

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await fetch(`${API_BASE}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone }),
      });

      // Read raw response text first
      const rawText = await response.text();

      let data;
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch (err) {
        console.error("Failed to parse JSON:", rawText);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong on the server");
      }

      setSummary(data.summary || "No summary generated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="d-flex align-items-center justify-content-center vh-100"
        style={{
          backgroundImage: `url(${GAL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100vh",
        }}
      >
        <div
          className="card shadow-lg p-4 text-light"
          style={{ width: "800px", backgroundColor: "rgba(23, 13, 88, 0.8)" }}
        >
          <div className="text-center mb-4">
            <h3 className="fw-bold">Quick Note</h3>
          </div>

          <div className="mb-3">
            <textarea
              className="form-control text-dark bg-light custom-textarea"
              rows="6"
              placeholder="Type your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <select
              className="form-select bg-light text-dark border"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="Professional">Professional</option>
              <option value="Casual">Casual</option>
              <option value="Enthusiastic">Enthusiastic</option>
              <option value="Formal">Formal</option>
            </select>
          </div>

          <div className="d-grid">
            <button
              className="btn btn-info fw-semibold"
              onClick={handleSummarize}
              disabled={loading}
            >
              {loading ? "Summarizing..." : "Generate Summary"}
            </button>
          </div>

          {summary && (
            <div className="mt-4 p-3 rounded bg-light text-dark">
              <h5 className="fw-bold text-dark">Summary:</h5>
              <ul className="mb-0">
                {summary.split("\n").map((line, index) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;

                  // Remove any leading bullet markers like *, -, or •
                  const content = trimmed.replace(/^[-•*]\s*/, "");
                  return <li key={index}>{content}</li>;
                })}
              </ul>
            </div>
          )}

          {error && <div className="mt-3 alert alert-danger">{error}</div>}
        </div>
      </div>

      <Card.Footer
        className="text-light"
        style={{ textAlign: "center", background: "#424040" }}
      >
        © Developed by{" "}
        <a
          href="https://www.linkedin.com/in/mohammed-ashfar-meeran-b4a492311"
          style={{ textDecoration: "none" }}
        >
          Mohammed ASHFAR.M
        </a>
      </Card.Footer>
    </>
  );
}

export default QuickNote;
