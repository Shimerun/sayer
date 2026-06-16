import { useState } from "react";

export default function CreateView({ onCreate }) {
  const [title, setTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onCreate(trimmed);
  }

  return (
    <div className="create-view">
      <form className="create-form" onSubmit={handleSubmit} autoComplete="off">
        <label className="visually-hidden" htmlFor="titleInput">
          Назва елемента
        </label>
        <input
          id="titleInput"
          name="title"
          placeholder="New item title..."
          maxLength={80}
          required
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="send arrow-right" type="submit" aria-label="Створити елемент" />
      </form>
    </div>
  );
}