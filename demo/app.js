import PasswordCheckElement from '../src/password-check.js';

export default function demoApp (showHide = false) {
  customElements.define('password-check', PasswordCheckElement);

  const FORM = document.querySelector('form');
  const passwordCheck = FORM.querySelector('password-check');

  FORM.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const password = ev.target.elements.password.value;

    console.debug('submit:', password, ev);
  });

  FORM.addEventListener('reset', (ev) => {
    passwordCheck.reset(ev);
  });

  if (showHide) {
    showHidePassword(FORM);
  }
}

export function showHidePassword (FORM) {
  const showButton = FORM.elements.showButton;

  showButton.addEventListener('click', (ev) => {
    ev.preventDefault();
    const isPassword = FORM.elements.password.type === 'password';
    FORM.elements.password.type = isPassword ? 'text' : 'password';
    showButton.textContent = isPassword ? 'hide' : 'show';
  });
}
