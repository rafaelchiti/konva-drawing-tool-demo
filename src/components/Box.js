export const Box = ({ name, children, preset, onClick, ...styles }) => {
  const presetStyles = PRESETS[preset];

  return (
    <div
      data-name={name}
      onClick={onClick}
      style={{ ...presetStyles, ...styles }}
    >
      {children}
    </div>
  );
};

Box.toolButtonPreset = "toolButton";

const PRESETS = {
  toolButton: {
    display: "inline-block",
    border: "1px solid gray",
    borderRadius: "6px",
    padding: "4px 10px",
    cursor: "pointer",
    fontSize: "12px",
    textAlign: "center",
  },
};
