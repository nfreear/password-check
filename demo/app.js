import commonPasswords from '@edgeguideab/password-check/passwords.json' with {type:'json'};
import { passwordStrength } from 'check-password-strength';
import 'zxcvbn';
import PasswordCheckElement from 'local:password-check';

console.debug('Common passwords:', commonPasswords.list);

demoApp();

function demoApp () {
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

  FORM.elements.showButton.addEventListener('click', (ev) => {
    const TYPE = FORM.elements.password.type;
    FORM.elements.password.type = TYPE === 'password' ? 'text' : 'password';
  });

  FORM.elements.password.addEventListener('input', (ev) => {
    const password = ev.target.value;

    const result = passwordStrength(password);
    console.debug('strength:', result);

    const resultZ = zxcvbn(password);
    console.debug('zxcvbn:', resultZ);
  });
}

/** @see https://github.com/dropbox/zxcvbn#readme
 */
function zxcvbn (password, user_inputs = []) {
  const zxcvbnFunction = globalThis.zxcvbn;
  return zxcvbnFunction(password, user_inputs);
}
