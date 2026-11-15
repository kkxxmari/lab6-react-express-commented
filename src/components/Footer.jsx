// I make the footer a separate component that App can reuse.
function Footer() {
  // I keep the footer text here so I do not repeat it on each page.
  return (
    // I use page-footer to apply the footer styles from App.css.
    <footer className="page-footer">
      {/* I use the Bootstrap container to line up this text with the page content. */}
      <div className="container">
        {/* I keep the existing author and lab information in the footer. */}
        <small>Mariia Chalyk | Data Representation &amp; Querying | Lab 6</small>
      </div>
    </footer>
  );
}

// I export Footer so App can place it below the main page content.
export default Footer;
