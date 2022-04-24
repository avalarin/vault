# Tool to store confidential data in secured qrcodes

It's available on [qrvault.avalarin.net](https://qrvault.avalarin.net)

![Demo](/demo/qrvault-demo.png?raw=true "Demo")
## Features


* Secure storage: There is AES-256 under the hood (see `src/services/crypto.ts`)
* No backend: your data is stored only in qrcode (don't forget to store it)
* Different ways to decrypt: it's compatible with OpenSSL
