export const Box = ({ name, children, nodeProps = {}, preset, ...styles }) => {
  const presetStyles = PRESETS[preset];

  return (
    <div data-name={name} style={{ ...presetStyles, ...styles }} {...nodeProps}>
      {children}
    </div>
  );
};

Box.toolButtonPreset = "toolButton";

const PRESETS = {
  toolButton: {
    border: "1px solid gray",
    borderRadius: "6px",
    padding: "4px",
    cursor: "pointer",
    fontSize: "12px",
    textAlign: "center",
  },
};
