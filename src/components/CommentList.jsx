import Comment from "./Comment.jsx";

export default function CommentList({ comments, onDelete, onUpdate }) {
  if (comments.length === 0) {
    return (
      <div className="empty">
        Коментарів поки немає. Додайте перший запис, і він збережеться для наступного відкриття.
      </div>
    );
  }

  return (
    <div className="comments">
      {comments.map((comment, index) => (
        <Comment
          key={index}
          comment={comment}
          index={index}
          onDelete={() => onDelete(index)}
          onUpdate={(patch) => onUpdate(index, patch)}
        />
      ))}
    </div>
  );
}