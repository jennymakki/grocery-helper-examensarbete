export default function Home() {
  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontWeight: 400, }}>Welcome!</h1>
      <p style={{ }}>Save your favorite recipes and turn them into smart grocery lists in a tap.</p>

      {/* Button container */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <a
          href="/login"
          style={{
            padding: "0.6rem 1.4rem",
            backgroundColor: "#D3B898",
            textDecoration: "none",
            borderRadius: "6px",
          }}
        >
          Log In
        </a>

        <a
          href="/signup"
          style={{
            padding: "0.6rem 1.4rem",
            backgroundColor: "#D3B898",
            textDecoration: "none",
            borderRadius: "6px",
          }}
        >
          Sign Up
        </a>
      </div>
    </div>
  );
}