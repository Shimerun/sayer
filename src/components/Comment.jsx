import { useRef } from "react";

export default function Comment({ comment, index, onDelete, onUpdate }) {
  const uploaderRef = useRef(null);

  function handleAvatarClick() {
    uploaderRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onUpdate({ avatar: ev.target.result });
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleBlur(e) {
    const text = e.currentTarget.textContent.trim();
    if (text) {
      onUpdate({ text });
    } else {
      e.currentTarget.textContent = comment.text;
    }
  }

  return (
    <article className="comment">
      <div
        className={index % 2 ? "avatar alt" : "avatar"}
        title="Натисніть, щоб змінити аватар"
        style={comment.avatar ? { backgroundImage: `url(${comment.avatar})` } : undefined}
        onClick={handleAvatarClick}
      />
      <input
        ref={uploaderRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <p
        className="comment-text"
        contentEditable
        suppressContentEditableWarning
        spellCheck
        aria-label="Редагувати коментар"
        onBlur={handleBlur}
        onInput={(e) => onUpdate({ text: e.currentTarget.textContent.trim() })}
      >
        {comment.text}
      </p>
      <button
        className="comment-delete"
        type="button"
        aria-label="Видалити коментар"
        title="Видалити коментар"
        onClick={onDelete}
      />
    </article>
  );
}