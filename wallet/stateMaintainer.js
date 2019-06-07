const PROTOTYPE = {
  step: null,
  wallet: null,
  type: null,
  subType: null,
}

class StateMaintainer {
  constructor() {
    // Empty constructor
  }

  set(newState) {
    let data = {};
    Object.keys(PROTOTYPE).forEach(key => {
      data[key] = newState[key];
    });
    window.sessionStorage.setItem('StateMaintainer', JSON.stringify(data));
  }

  get() {
    let data = window.sessionStorage.getItem('StateMaintainer');
    if (!data) return null;
    return JSON.parse(data);
  }
}

export default StateMaintainer;