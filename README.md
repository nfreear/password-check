
# password-check

> Experimental — not for production!

A custom HTML element `<password-check>` to feed back to the user the strength of a potential password.

## Usage

Example HTML:
```html
<password-check>
  <label>Password
    <input type="password" autocomplete="new-password" aria-describedby="outputID listID">
  </label>
  <output id="outputID"></output>

  <ul id="listID">
    <li data-test="uppercase:1">One uppercase</li>
    <li data-test="lowercase:1">One lowercase</li>
    <li data-test="minlength:8">Min 8 characters</li>
    <li data-test="special:1" data-pattern=";.,$%_-">One special character</li>
    <li data-test="number:1">One number</li>
  </ul>
</password-check>
```

* CDN: https://esm.sh/gh/nfreear/password-check
* Pen: https://codepen.io/nfreear/pen/ogYGKJY

## Useful resources

* https://www.npmjs.com/package/@edgeguideab/password-check
* https://github.com/deanilvincent/check-password-strength.git
* https://github.com/dropbox/zxcvbn.git (Dan Wheeler)
* https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/wheeler | https://youtu.be/vf37jh3dV2I (2016)

---
