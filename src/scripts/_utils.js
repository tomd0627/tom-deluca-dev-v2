export const initializeUtills = () => {
  const body = document.body;

  // Toggle body class on scroll
  let prevScrollpos = window.pageYOffset;

  const scrollBody = () => {
    const currentScrollPos = window.pageYOffset;

    if (prevScrollpos < currentScrollPos) {
      body.classList.add('body-scroll-down');
      body.classList.remove('body-scroll-up');
    } else {
      body.classList.add('body-scroll-up');
      body.classList.remove('body-scroll-down');
    }

    prevScrollpos = currentScrollPos;
  };

  document.addEventListener(
    'scroll',
    () => {
      scrollBody();
    },
    { passive: true }
  );
};
