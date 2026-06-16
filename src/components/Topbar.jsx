import { useState, useEffect } from "react";

export default function Topbar({ title, isCreate, onBack, onRename }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);

  useEffect(() => {
    setDraft(title);
    setEditing(false);
  }, [title]);

  function startEdit() {
    setDraft(title);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function submitEdit(e) {
    e?.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onRename(trimmed);
    setEditing(false);
  }

  return (
    <header className="topbar">
      <button
        className="icon-button arrow-left"
        type="button"
        aria-label="Повернутися до списку"
        onClick={onBack}
      />
      <div className="title-area">
        {!editing && <h2 id="screenTitle">{title}</h2>}
        {!editing && !isCreate && (
          <button
            className="title-action"
            id="editTitleButton"
            type="button"
            aria-label="Редагувати назву"
            onClick={startEdit}
          />
        )}
        {editing && (
          <form
            className="title-edit-form"
            onSubmit={submitEdit}
            autoComplete="off"
          >
            <label className="visually-hidden" htmlFor="titleEditInput">
              Нова назва
            </label>
            <input
              id="titleEditInput"
              name="title"
              maxLength={80}
              placeholder="Item title..."
              required
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && cancelEdit()}
            />
            <button className="mini-action" type="submit" aria-label="Зберегти назву">
              ✓
            </button>
            <button
              className="mini-action cancel"
              type="button"
              aria-label="Скасувати редагування"
              onClick={cancelEdit}
            >
              ×
            </button>
          </form>
        )}
      </div>
    </header>
  );
}