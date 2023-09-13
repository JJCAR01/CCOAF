window.addEventListener(
    "message",
    (event) => {
      if (event.origin !== "http://localhost:8080") return;
  
      // …
    },
    false,
  );