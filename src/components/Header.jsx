// I leave this component available even though App does not currently render it.
function Header() {
  // I keep this heading component from the earlier exercise.
  return (
    // I use a header element to group the heading for this component.
    <header>
      {/* I show the original exercise text as the main heading. */}
      <h1>My Header in another component</h1>
    </header>
  );
}

// I export the component so another file can import it if needed.
// I do not need props or state here because the heading text is fixed.
export default Header;
