const headerLoader = (templates) => {
  const header = document.querySelector("header");
  header.innerHTML = templates.querySelector("#header").innerHTML;
  const headingArea = header.querySelector(".heading-area");
  header.querySelector(
    "#header-placeholder"
  ).style.height = `${headingArea.offsetHeight}px`;
  document.addEventListener("scroll", (_e) => {
    headingArea.classList.toggle("box-shadowed", window.scrollY > 10);
  });
};

const footerLoader = (templates) => {
  document.querySelector("footer").innerHTML =
    templates.querySelector("#footer").innerHTML;
};

const templateLoaders = [headerLoader, footerLoader];

getTemplates("templates/header_footer.html").then((templates) => {
  templateLoaders.forEach((templateLoader) => {
    templateLoader(templates);
  });
});
