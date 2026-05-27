const { HTMLElement } = globalThis;

// Source: gh:deanilvincent/check-password-strength
const owaspSymbols = "!\"#$%&'()*+,-./\\:;<=>?@[]^_`{|}~";

/**
 * A custom HTML element to feed back to the user the strength of a potential password.
 * @customElement password-check
 */
export default class PasswordCheckElement extends HTMLElement {
  #testRegex = /^(uppercase|lowercase|minlength|special|number):(\d+)$/;
  #regexes = {
    lowercase: /^[a-z]*$/,
    uppercase: /^[A-Z]*$/,
    number: /^[0-9]*$/,
    special: ';.,$%_-'
  };
  #conditions = [];

  get value () { return this.#inputElement.value.trim(); }
  get met () { return this.#conditions.filter(({ met }) => met).length; }
  get unmet () { return this.#conditions.length - this.met; }
  get total () { return this.#conditions.length; }

  get valid () { return this.unmet === 0; }

  // Experimental!
  get #root () { return this.shadowRoot ?? this; }

  get #inputElement () { return this.#root.querySelector('input[ type = password ]'); }
  get #outputElement () { return this.#root.querySelector('output'); } // Was: shadowRoot.
  get #listContainer () { return this.#root.querySelector('ul'); }
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
    console.assert(this.#outputElement, 'Missing <output> child element');
    console.assert(this.#listContainer, 'Missing <ul> list container');
    console.assert(this.#conditionElements.length, 'Expecting a least one <li> condition element');
  }

  connectedCallback () {
    this.#expectations();
    this.#getConditions();

    this.#inputElement.addEventListener('input', (ev) => this.#onInput(ev));

    console.debug('password-check:', [this]);
  }

  reset (event) {
    this.#conditions.forEach((condition) => {
      condition.count = 0;
      condition.met = false;
      condition.el.setAttribute('part', 'cond');
    });

    this.#updateOutput();

    console.debug('reset:', this.met, this.unmet, this.#conditions, event);
  }

  #onInput (event) {
    // const { inputType } = event;
    const chars = this.value.split('');

    this.reset();

    this.#conditions.forEach((cond) => this.#testCondition(cond, chars));

    this.#inputElement.setAttribute('aria-invalid', !this.valid);
    this.#updateOutput();

    console.debug('input:', this.value, this.met, this.unmet, this.#conditions, event);
  }

  #testCondition (condition, chars) {
    const { pattern, name, min, el } = condition;
    if (name === 'minlength') {
      if (this.value.length > min) {
        condition.count = 1;
        condition.met = true;
      }
    } else {
      const match = chars.find((char) => pattern.test(char));
      condition.count += match ? 1 : 0;
      condition.met = condition.count >= min;
    }

    el.setAttribute('part', `cond ${condition.met ? 'met' : 'unmet'}`);
  }

  #updateOutput () {
    this.#outputElement.value = `${this.met} of ${this.total} conditions met.`;
  }
}
