import { useState, useCallback } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import CommentList from "./components/CommentList.jsx";
import Composer from "./components/Composer.jsx";
import CreateView from "./components/CreateView.jsx";

const STORAGE_KEY = "sayer-state-v2";

function makeFallback() {
  const items = [
    {
      id: crypto.randomUUID(),
      title: "First item with customized long title",
      comments: [
        { text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.", avatar: "" },
        { text: "Lorem Ipsum has a more-or-less normal distribution of letters, as opposed to using readable English.", avatar: "" },
      ],
    },
    { id: crypto.randomUUID(), title: "Second Item", comments: [] },
    {
      id: crypto.randomUUID(),
      title: "Third item (short one)",
      comments: [
        { text: "A short note for later.", avatar: "" },
        { text: "Remember to keep this item visible.", avatar: "" },
        { text: "Another saved comment.", avatar: "" },
      ],
    },
  ];
  return { mode: "detail", selectedId: items[0].id, items };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.items)) return saved;
  } catch {}

  try {
    const old = JSON.parse(localStorage.getItem("sayer-state-v1"));
    if (old && Array.isArray(old.items)) {
      old.items.forEach((item) => {
        if (item.comments.length && typeof item.comments[0] === "string") {
          item.comments = item.comments.map((t) => ({ text: t, avatar: "" }));
        }
      });
      return old;
    }
  } catch {}

  return makeFallback();
}

export default function App() {
  const [state, setState] = useState(loadState);

  const save = useCallback((next) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const activeItem = state.items.find((i) => i.id === state.selectedId) ?? state.items[0] ?? null;

  function selectItem(id) {
    save({ ...state, mode: "detail", selectedId: id });
  }

  function deleteItem(id) {
    const index = state.items.findIndex((i) => i.id === id);
    if (index === -1) return;
    const items = state.items.filter((i) => i.id !== id);
    const selectedId = items[Math.max(0, index - 1)]?.id ?? items[0]?.id ?? null;
    save({ ...state, items, selectedId, mode: items.length ? "detail" : "create" });
  }

  function startCreate() {
    save({ ...state, mode: "create" });
  }

  function createItem(title) {
    const item = { id: crypto.randomUUID(), title, comments: [] };
    save({ ...state, items: [...state.items, item], selectedId: item.id, mode: "detail" });
  }

  function renameItem(title) {
    save({
      ...state,
      items: state.items.map((i) => (i.id === state.selectedId ? { ...i, title } : i)),
    });
  }

  function addComment(text) {
    if (!activeItem) return;
    save({
      ...state,
      items: state.items.map((i) =>
        i.id === activeItem.id
          ? { ...i, comments: [...i.comments, { text, avatar: "" }] }
          : i
      ),
    });
  }

  function deleteComment(index) {
    if (!activeItem) return;
    const comments = activeItem.comments.filter((_, i) => i !== index);
    save({
      ...state,
      items: state.items.map((i) =>
        i.id === activeItem.id ? { ...i, comments } : i
      ),
    });
  }

  function updateComment(index, patch) {
    if (!activeItem) return;
    const comments = activeItem.comments.map((c, i) => (i === index ? { ...c, ...patch } : c));
    save({
      ...state,
      items: state.items.map((i) =>
        i.id === activeItem.id ? { ...i, comments } : i
      ),
    });
  }

  const isCreate = state.mode === "create";

  return (
    <div className="app">
      <Sidebar
        items={state.items}
        selectedId={isCreate ? null : state.selectedId}
        onSelect={selectItem}
        onDelete={deleteItem}
        onNew={startCreate}
      />
      <section className="content" aria-live="polite">
        <Topbar
          title={isCreate ? "Create new item" : (activeItem?.title ?? "")}
          isCreate={isCreate}
          onBack={() => {
            if (state.items.length) {
              save({ ...state, mode: "detail", selectedId: activeItem?.id ?? state.items[0].id });
            } else {
              save({ ...state, mode: "create" });
            }
          }}
          onRename={renameItem}
        />

        <div className="main" id="mainPanel">
          {isCreate ? (
            <CreateView onCreate={createItem} />
          ) : (
            <CommentList
              comments={activeItem?.comments ?? []}
              onDelete={deleteComment}
              onUpdate={updateComment}
            />
          )}
        </div>

        {!isCreate && (
          <Composer onAdd={addComment} />
        )}
      </section>
    </div>
  );
}