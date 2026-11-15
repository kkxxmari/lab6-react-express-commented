import { useState } from 'react';

function Content() {
  // I save the time when this page opens, so it stays the same on a rerender.
  const [openedAt] = useState(() => new Date());

  return (
    <div>
      <h1>Hello World!</h1>
      {/* I format the saved time using the browser locale. */}
      <h2>It is {openedAt.toLocaleTimeString()}.</h2>
    </div>
  );
}

export default Content;
