const { HTMLElement } = globalThis;

export default class PasswordCheckElement extends HTMLElement {
  #testRegex = /^(uppercase|lowercase|minlength|special|number):(\d+)$/;
  #regexes = {
    lowercase: /^[a-z]*$/,
    uppercase: /^[A-Z]*$/,
    number: /^[0-9]*$/,
    special: '._$%\-'
  };
  #conditions = [];

  get met () { return this.#conditions.filter(({ met }) => met).length; }
  get unmet () { return this.#conditions.length - this.met; }

  get #inputElement () { return this.querySelector('input[ type = password ]'); }
  get #outputElement () { return this.shadowRoot.querySelector('output'); }
  get #listContainer () { return this.shadowRoot.querySelector('ul'); }
  get #conditionElements () { return this.#listContainer.querySelectorAll('li[ data-test ]'); }

  #getConditions () {
    this.#conditions = [...this.#conditionElements].map((el) => {
      const attribute = el.dataset.test;
      const patternAttr = el.dataset.pattern;
      const M = attribute.match(this.#testRegex);
      console.assert(M, `Unexpected data-test attribute: ${attribute}`);
      const name = M[1];
      const min = parseInt(M[2]);
      const text = el.textContent;
      const pattern = this.#getPattern(name, min, patternAttr);

      el.setAttribute('part', 'cond');

      return { met: false, count: 0, name, min, text, pattern, el };
    });
  }

  #getPattern (name, length, patternAttr) {
    let pattern;
    if (name === 'special') {
      const defPattern = this.#regexes[name];
      pattern = new RegExp(`^[${patternAttr ?? defPattern}]*$`);
    }
    else if (name === 'minlength') {
      pattern = new RegExp(`^.{${length},}$`);
    }
    else if (this.#regexes[name]) {
      pattern = this.#regexes[name];
    } else {
      console.assert(false, 'Error!');
    }
    return pattern;
  }

  #expectations () {
    console.assert(this.#inputElement, 'Missing <input type=password> child element');
  }

  connectedCallback () {
    this.#expectations();
    this.#getConditions();

    this.#inputElement.addEventListener('input', (ev) => this.#onInput(ev));

    console.debug('password-check:', [this]);
  }

  reset () {
    this.#conditions.forEach((condition) => {
      condition.count = 0;
      condition.met = false;
      condition.el.setAttribute('part', 'cond');
    });

    this.#outputElement.value = `met: ${this.met}; unmet: ${this.unmet}`;

    console.debug('reset:', this.met, this.unmet, this.#conditions, event);
  }

  #onInput (event) {
    const candidate = event.target.value.trim();
    const chars = candidate.split('');

    this.#conditions.forEach((condition) => {
      const { pattern, name, min, el } = condition;
      if (name === 'minlength') {
        if (candidate.length > min) {
          condition.count = 1;
          condition.met = true;
        }
      } else {
        const match = chars.find((char) => pattern.test(char));
        condition.count += match ? 1 : 0;
        condition.met = condition.count >= min;
      }
      // console.debug(name, match, pattern);

      el.setAttribute('part', `cond ${condition.met ? 'met' : 'unmet'}`);
    });

    // const met = this.#conditions.filter(({ met }) => met);
    // const unmet = this.#conditions.filter(({ met }) => !met);

    this.#outputElement.value = `met: ${this.met}; unmet: ${this.unmet}`;

    console.debug('input:', candidate, this.met, this.unmet, this.#conditions, event);
  }
}
