const saveTemplates = (filepath, templateTxt) => {
  window.sessionStorage.setItem(filepath, templateTxt);
  return templateTxt;
};

const getTemplates = async (filepath) => {
  const txt =
    // window.sessionStorage.getItem(filepath) ||
    saveTemplates(filepath, await (await fetch(filepath)).text());
  return new DOMParser().parseFromString(txt, "text/html");
};

const light = "light";
const night = "night";

const oppositeTheme = {
  [light]: night,
  [night]: light,
};

const setupTheme = () => {
  const currTheme = window.localStorage.getItem("theme") || light;
  document.querySelectorAll(`.${oppositeTheme[currTheme]}`).forEach((e) => {
    e.classList.toggle(oppositeTheme[currTheme], false);
    e.classList.toggle(currTheme, true);
  });
  document.getElementById("themeBtn1").innerText = oppositeTheme[currTheme];
};

const switchTheme = () => {
  const currTheme = window.localStorage.getItem("theme") || light;
  const nextTheme = oppositeTheme[currTheme] || night;
  window.localStorage.setItem("theme", nextTheme);
};

const activateButtons = (() => {
  const btnClassToAction = {
    frontBtn: "load_front",
    aboutBtn: "load_about",
    contactBtn: "load_contact",
    themeBtn: "change_theme",
    showDateTimeBtn: "show_date_time",
  };
  return (elem) => {
    Object.keys(btnClassToAction).forEach((btnClass) => {
      elem.querySelectorAll(`.${btnClass}`).forEach((btn) => {
        btn.addEventListener("click", getAction(btnClassToAction[btnClass]));
        btn.setAttribute("onclick", "return false;");
      });
    });
  };
})();

const stateChangeFn =
  (fn) =>
  (...args) => {
    Promise.resolve(fn(...args)).then(() => {
      activateButtons(document.body);
      setupTheme();
    });
  };

const nullCallback = () => {
  console.assert(false, "Callback is not defined");
};

const DATE_OR_TIME_TOKEN_KEY = "$2";
const showDateOrTime = () => {
  if (window.sessionStorage.getItem(DATE_OR_TIME_TOKEN_KEY)) {
    console.log("already showing");
    return;
  }
  window.sessionStorage.setItem(DATE_OR_TIME_TOKEN_KEY, "used");
  const mainLoop = async () => {
    while (true) {
      const radioBox = document.querySelector(
        'input[name="DateAndTime"]:checked'
      );
      if (!radioBox) {
        return;
      }
      const mode = radioBox.value;

      const today = new Date();
      const dateTextField = document.querySelector(".date-time-print");
      if (!dateTextField) {
        return;
      }
      if (mode === "date") {
        dateTextField.value = today.toLocaleDateString();
        return;
      } else if (mode === "time") {
        dateTextField.value = today.toLocaleTimeString();
        await new Promise((r) => setTimeout(r, 1000));
      } else {
        console.assert(false, "unsupported mode");
        return;
      }
    }
  };
  mainLoop().then(() =>
    window.sessionStorage.removeItem(DATE_OR_TIME_TOKEN_KEY)
  );
};

const [createAction, getAction, action] = (() => {
  const buttonOnClickCallbacks = {
    load_front: nullCallback,
    load_about: nullCallback,
    load_contact: nullCallback,
    change_theme: switchTheme,
    show_date_time: showDateOrTime,
  };

  const eventListeners = Object.keys(buttonOnClickCallbacks).reduce(
    (obj, curr) => {
      obj[curr] = stateChangeFn(() => {
        return buttonOnClickCallbacks[curr]();
      });
      return obj;
    },
    {}
  );

  return [
    (actionName, actionFn) => {
      buttonOnClickCallbacks[actionName] = actionFn;
    },
    (actionName) => {
      return eventListeners[actionName];
    },
    (actionName) => {
      eventListeners[actionName]();
    },
  ];
})();
