// I import useState to keep the opening time between renders.
import { useState } from 'react';

function Content() {
  // I save the time when this page opens, so it stays the same on a rerender.
  const [openedAt] = useState(() => new Date());

  // I return the welcome message and the time together in one wrapper.
  return (
    <div>
      {/* I keep the original greeting as the main heading on Home. */}
      <h1>Hello World!</h1>
      {/* I format the saved time using the browser locale. */}
      <h2>It is {openedAt.toLocaleTimeString()}.</h2>
    </div>
  );
}

// I export this page so App can display it for the Home route.
export default Content;
