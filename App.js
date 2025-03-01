import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import AwesomeTabs from "./components/views/navigation/AwesomeTabs";

export default function App() {
  return (
      <NavigationContainer>
        <AwesomeTabs />
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
