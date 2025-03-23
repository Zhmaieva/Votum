import React, {useEffect} from "react";
import { NavigationContainer } from '@react-navigation/native';
import {AppState, StyleSheet} from 'react-native';
import AwesomeTabs from "./components/views/navigation/AwesomeTabs";
import StackNav from "./components/views/navigation/StackNav";
import {login} from "./shared/api/apiClient";

/*SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();*/

export default function App() {

    useEffect(() => {
        // Automatically attempt to login when the app comes back from the background
        const subscription = AppState.addEventListener('change', async (nextAppState) => {
            if (nextAppState === 'active') {
                //await login(); // Attempt login when app goes back to active state
            }
        });

        // return () => {
        //     subscription.remove();
        // };
    }, []);

    return (
      <NavigationContainer>
        <AwesomeTabs />
        {/*<StackNav />*/}
      </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
