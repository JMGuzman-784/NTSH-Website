// assets/js/state.js
window.NTSH_STATE = {
  user: null,
  profile: null,
  role: "viewer"
};

window.setState = (data) => {
  Object.assign(window.NTSH_STATE, data);
};

window.clearState = () => {
  window.NTSH_STATE = {
    user: null,
    profile: null,
    role: "viewer"
  };
};
