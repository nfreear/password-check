import PasswordCheckElement from 'password-check';

demoApp();

function demoApp () {
  customElements.define('password-check', PasswordCheckElement);

  const FORM = document.querySelector('form');
  const passwordCheck = document.querySelector('password-check');

  FORM.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const password = ev.target.elements.password.value;

    console.debug('submit:', password, ev);
  });

  FORM.addEventListener('reset', (ev) => {
    passwordCheck.reset(ev);
  });

  FORM.elements.showButton.addEventListener('click', (ev) => {
    const TYPE = FORM.elements.password.type;
    FORM.elements.password.type = TYPE === 'password' ? 'text' : 'password';
  });
}
