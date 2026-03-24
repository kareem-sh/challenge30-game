export default function Popup({ open, text }) {
  if (!open) return null;

  return (
    <div
      dir="rtl"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 40,
        color: "white",
      }}
    >
      {text}
    </div>
  );
}
