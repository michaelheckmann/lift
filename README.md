<p align="center">
<img src="./screenshots/lift-light.png#gh-light-mode-only">
<img src="./screenshots/lift-dark.png#gh-dark-mode-only">

# Lift 🏋️💪

The Lift repository contains the frontend code for the React Native app. The app is built using [expo](https://expo.dev/).

## Installation

### Package Manager

The repository uses `yarn` as the package manager. To check whether `yarn` is already installed, run this command in your terminal:

```bash
yarn --version
```

If it is not yet installed, you can install it with this command:

```bash
npm install --global yarn
```

[Learn more here about yarn.](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

### Dependencies

Install all the required dependencies by running this command in the project directory:

```bash
yarn
```

### Environment Variables

Add the necessary environment variables to the project.

```bash
cp .env.example .env
```

### Start the development server

To start up the dev server, run this command in the project directory:

```bash‚
yarn start
```

[Learn more about the installation process here.](https://docs.expo.dev/get-started/installation/)

## Troubleshooting

### ApiV2Error: Entity Not Authorized.

If you get this error when running `yarn start`, try logging out of expo `expo logout` and logging back in `npx expo login`.
  
## Todos

- [ ] Include Realm
- [ ] Include Tamagui
- [ ] Upgrade Expo & Reanimated
