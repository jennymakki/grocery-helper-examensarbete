export default function LoadingSkeleton({ width = "100%", height = "1rem", style = {} }) {
  return <div className="loading-skeleton" style={{ width, height, ...style }} />;
}