export default function Footer() {
  return (
    <footer style={{
      padding: '1rem 2rem',
      backgroundColor: '#D9D9D9',
      borderTop: '1px solid #ddd',
      textAlign: 'center'
    }}>
      <p>&copy; {new Date().getFullYear()} Grocery Helper. All rights reserved.</p>
    </footer>
  );
}