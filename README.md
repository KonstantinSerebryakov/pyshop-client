URL: https://pyshop-konstantin-serebryakov-8ebd937f65cc.herokuapp.com/#/signin

# Description

Quasar client for [task](https://jl.pyshop.ru/tasks/typescript-dev/).

**_Note_**: It is not relevant to Delete user info with 1:1 relation, so it simply clears fields, reducing requests and fixing rows track changes problem.
**_Note_**: Because no email confirmation is needed, when user successfully signup, system automatically sends authentification request and navigate user to the main page.
**_Note:_** CI/CD configured with Github Actions: client automatically injected from main branch to server and to heroku;

### Features

- Non blocking.
- Layout designed for all screens.
- Authentification:
  - JWT with implementation of refresh tokens
  - tokens logic handled by axios interceptors.
    - refresh token refreshes with access token for security purposes
- Pinia storage:
  - synchronization with browser storages and server.
- Axios with interceptors
- Custom throttling and debouncing
- Phone input:
  - npm package [flag-icons](https://www.npmjs.com/package/flag-icons) used for country icons.
  - npm package [libphonenumber-js](https://www.npmjs.com/package/libphonenumber-js) used for validating phone numbers.
- Yandex Maps for picking address
  - **!Warning**: may not work if daily limit of free api key calls reached
  - **Note**: newest version [api **V3**](https://yandex.ru/dev/jsapi30/doc/ru/dg/concepts/typescript) used. It is not stable and may have bugs. During development I sent some bug reports and they have been fixed.

## Install the dependencies

```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
npm run lint
```

### Format the files

```bash
npm run format
```

### Build the app for production

```bash
npm run build
```
.
