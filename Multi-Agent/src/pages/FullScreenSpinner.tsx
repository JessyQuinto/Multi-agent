import { Spinner } from "@fluentui/react-components";

const FullScreenSpinner = ({ tip }: { tip?: string }) => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spinner size="large" label={tip || "Cargando..."} />
    </div>
  );
}
export default FullScreenSpinner;  