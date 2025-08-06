<h2>How to build</h2>

<h3>Prepare env</h3>
<code>npx expo install expo@latest</code>
<p></p>
<code>npx expo install --fix</code> also run <code>npx expo-doctor</code>
<p></p>
<code>npm install -g expo-cli</code> better to install local instead
<p></p>
<code>npx expo prebuild</code> may fail for Android, it's fine
<p></p>
<code>npx pod-install</code>
<p></p>

<h3>Run locally in Expo wrapper</h3>
<code>npm run</code>

<h3>Build a preview</h3>
<code>eas build --platform ios --profile preview --local</code> for the first time
<br>
or
<br>
<code>**eas build --platform ios --profile preview --local --non-interactive**
</code>
<br>
or
<br>
<code>eas build --platform ios --profile preview --local --clear-cache --non-interactive
</code> usually, this one is not needed