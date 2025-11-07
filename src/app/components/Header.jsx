export default function Header() {
  return (
    <header style={{
      padding: '1rem 2rem',
      backgroundColor: '#A1C89C',
      borderBottom: '1px solid #ddd',
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <h1 style={{ backgroundColor: '#A1C89C', fontWeight: '200', fontSize: '3rem' }}>Grocery Helper</h1>
    </header>
  );
}