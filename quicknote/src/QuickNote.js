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

  // Use environment variable for API base
  const API_BASE = process.env.REACT_APP_API_BASE || window.location.origin;

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Server error");
      }

      setSummary(data.summary || "No summary generated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (summary) navigator.clipboard.writeText(summary);
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
          style={{ width: "800px", backgroundColor: "rgba(23, 13, 88, 0.85)" }}
        >
          <div className="text-center mb-4">
            <h3 className="fw-bold">Quick Note</h3>
          </div>

          <textarea
            className="form-control text-dark bg-light mb-3"
            rows="6"
            placeholder="Type your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <select
            className="form-select bg-light text-dark mb-3"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="Professional">Professional</option>
            <option value="Casual">Casual</option>
            <option value="Enthusiastic">Enthusiastic</option>
            <option value="Formal">Formal</option>
          </select>

          <div className="d-grid mb-3">
            <button
              className="btn btn-info fw-semibold"
              onClick={handleSummarize}
              disabled={loading}
            >
              {loading ? "Summarizing..." : "Generate Summary"}
            </button>
          </div>

          {summary && (
            <div
              className="mt-4 p-3 rounded bg-light text-dark"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              <h5 className="fw-bold">Summary:</h5>
              <ul className="mb-0">
                {summary
                  .split(/\n|•|-/)
                  .map((line) => line.trim())
                  .filter((line) => line)
                  .map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
              </ul>
              <button
                className="btn btn-sm btn-secondary mt-2"
                onClick={handleCopy}
              >
                Copy to Clipboard
              </button>
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
