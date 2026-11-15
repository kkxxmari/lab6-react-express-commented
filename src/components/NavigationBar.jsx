import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useLocation } from 'react-router-dom';

function NavigationBar() {
  // I keep whether the small-screen menu is open in state.
  const [expanded, setExpanded] = useState(false);
  // I read the current URL so the selected link follows Back and Forward too.
  const location = useLocation();

  return (
    // I let Bootstrap collapse the navigation below its md breakpoint.
    <Navbar bg="dark" data-bs-theme="dark" expand="md" collapseOnSelect
      expanded={expanded} onToggle={setExpanded}>
      <Container>
        {/* I make the brand a router link back to Home. */}
        <Navbar.Brand as={NavLink} to="/">React Lab 6</Navbar.Brand>
        {/* I connect this toggle button to the menu using its id. */}
        <Navbar.Toggle aria-controls="page-menu" aria-expanded={expanded} />
        <Navbar.Collapse id="page-menu">
          {/* I use the pathname to mark the current page in the menu. */}
          <Nav className="ms-auto" activeKey={location.pathname}>
            {/* I add end so Home is only selected at the root URL. */}
            <Nav.Link as={NavLink} to="/" end eventKey="/">Home</Nav.Link>
            {/* I use router links so switching pages does not reload the app. */}
            <Nav.Link as={NavLink} to="/read" eventKey="/read">Read</Nav.Link>
            <Nav.Link as={NavLink} to="/create" eventKey="/create">Create</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
import { useState } from 'react';
