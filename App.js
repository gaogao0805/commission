import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider } from './data/AppContext';

import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import NewCandidatesScreen from './screens/NewCandidatesScreen';
import DecisionScreen from './screens/DecisionScreen';
import CategoryScreen from './screens/CategoryScreen';
import CandidateScreen from './screens/CandidateScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#f2f2f7' } }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="NewCandidates" component={NewCandidatesScreen} />
          <Stack.Screen name="Decision" component={DecisionScreen} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen name="Candidate" component={CandidateScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
