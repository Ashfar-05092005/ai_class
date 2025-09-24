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

  const API_BASE = process.env.REACT_APP_API_BASE || window.location.origin;

  const handleSummarize = async () => {
    if (!text.trim()) { setError("Enter text"); return; }

    setLoading(true); setError(""); setSummary("");

    try {
      const response = await fetch(`${API_BASE}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone }),
      });

      const rawText = await response.text();
      const data = rawText ? JSON.parse(rawText) : {};

      if (!response.ok) throw new Error(data.error || "Server error");
      setSummary(data.summary || "No summary generated.");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div style={{
        backgroundImage: `url(${GAL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div className="card shadow-lg p-4 text-light" style={{ width: "800px", backgroundColor: "rgba(23, 13, 88, 0.85)" }}>
          <h3 className="text-center fw-bold mb-4">Quick Note</h3>

          <textarea
            className="form-control text-dark bg-light mb-3"
            rows="6"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type your text here..."
          />

          <select className="form-select bg-light text-dark mb-3" value={tone} onChange={e => setTone(e.target.value)}>
            <option value="Professional">Professional</option>
            <option value="Casual">Casual</option>
            <option value="Enthusiastic">Enthusiastic</option>
            <option value="Formal">Formal</option>
          </select>

          <button className="btn btn-info fw-semibold w-100 mb-3" onClick={handleSummarize} disabled={loading}>
            {loading ? "Summarizing..." : "Generate Summary"}
          </button>

          {summary && <div className="p-3 rounded bg-light text-dark" style={{ maxHeight: "300px", overflowY: "auto" }}>
            <h5 className="fw-bold">Summary:</h5>
            <ul className="mb-0">{summary.split(/\n|•|-/).map((line, idx) => line.trim()).filter(Boolean).map((line, idx) => <li key={idx}>{line}</li>)}</ul>
          </div>}

          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>

      <Card.Footer className="text-light text-center" style={{ background: "#424040" }}>
        © Developed by <a href="https://www.linkedin.com/in/mohammed-ashfar-meeran-b4a492311" style={{ textDecoration: "none" }}>Mohammed ASHFAR.M</a>
      </Card.Footer>
    </>
  );
}

export default QuickNote;
