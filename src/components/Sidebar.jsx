export default function Sidebar({ items, selectedId, onSelect, onDelete, onNew }) {
  return (
    <aside className="sidebar" aria-label="Елементи">
      <header className="brand">
        <h1>Sayer</h1>
        <p>World's most used time waster</p>
      </header>

      <div className="items" id="items">
        {items.map((item) => {
          const isActive = item.id === selectedId;
          return (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: isActive ? "1fr auto" : "1fr",
              }}
            >
              <button
                className={`item-row${isActive ? " is-active" : ""}`}
                type="button"
                onClick={() => onSelect(item.id)}
              >
                <span className="item-title">{item.title}</span>
                <span className="count">{item.comments.length}</span>
              </button>
              {isActive && (
                <button
                  className="delete-row"
                  type="button"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        className="add-item"
        id="newItemButton"
        type="button"
        aria-label="Створити елемент"
        onClick={onNew}
      />
    </aside>
  );
}