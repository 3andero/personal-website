const pageToButtonName = {
  front: "frontBtn",
  about: "aboutBtn",
  contact: "contactBtn",
};

const [getCurrentPage, setCurrentPage] = (() => {
  const CURRENT_PAGE_KEY = "$1";

  return [
    () => {
      return window.sessionStorage.getItem(CURRENT_PAGE_KEY) || "front";
    },
    (pageName) => {
      window.sessionStorage.setItem(CURRENT_PAGE_KEY, pageName);
    },
  ];
})();

const changeButtonState = () => {
  const nav = document.querySelector(".navigation");
  const currPage = getCurrentPage();
  nav
    .querySelector(`.${pageToButtonName.front}`)
    .classList.toggle("hidden", currPage === "front");

  nav.querySelectorAll(".navigation-items").forEach((a) => {
    a.classList.toggle(
      "highlighted",
      a.classList.contains(pageToButtonName[currPage])
    );
  });
};

const loadFromTemplate = (template) => {
  document.head.querySelector("title").innerText =
    template.head.querySelector("title").innerText;

  const newMain = document.querySelector("main");
  newMain.innerHTML = template.body.querySelector("main").innerHTML;

  document.head.querySelectorAll("link[href*='.css']").forEach((e) => {
    if (!e.href.includes("common")) {
      e.remove();
    }
  });
  template.head.querySelectorAll("link[href*='.css']").forEach((e) => {
    document.head.appendChild(e);
  });
};

const PagePath = {
  front: "templates/front.html",
  about: "templates/about.html",
  contact: "templates/contact.html",
};

const createActionLoadingPage = () =>
  Object.keys(PagePath).forEach((pageName) =>
    createAction(`load_${pageName}`, async () => {
      const pagePath = PagePath[pageName];
      setCurrentPage(pageName);
      const template = await getTemplates(pagePath);
      loadFromTemplate(template);
      changeButtonState();
    })
  );
createActionLoadingPage();

action(`load_${getCurrentPage()}`);
