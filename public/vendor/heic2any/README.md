# heic2any 0.0.4

Source: https://github.com/alexcorvi/heic2any (MIT, LICENSE.txt).
The original distribution is taken from Muse Studio's installed client dependency.

Local CSP compatibility patch: four Embind wrappers generated using `new Function`
are replaced with static closures. Two wrappers retain `this`/`arguments` forwarding;
the third binds the raw function pointer before calling `dynCall`. The fourth preserves Embind wire conversion and destructor cleanup using a generic static invoker. Cosmetic generated
function names are omitted. No decoder arithmetic or image data is changed.

Rebuild with `node scripts/patch-heic-csp.mjs <upstream heic2any.min.js>`.
The patch asserts the exact known wrapper count and refuses unfamiliar versions.
Regression check: real HEIC → JPEG under the production Worker's CSP using
`scripts/verify-free-tools-production.cjs`. The page never enables unsafe-eval.
