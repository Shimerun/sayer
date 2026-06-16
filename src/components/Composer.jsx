import { useState } from "react";

export default function Composer({ onAdd }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  }

  return (
    <form className="composer" onSubmit={handleSubmit} autoComplete="off">
      <label className="visually-hidden" htmlFor="commentInput">
        Новий коментар
      </label>
      <input
        id="commentInput"
        name="comment"
        placeholder="New comment goes here..."
        maxLength={320}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="send arrow-right" type="submit" aria-label="Додати коментар" />
    </form>
  );
}