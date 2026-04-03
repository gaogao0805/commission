import { Platform } from 'react-native';
import { registerRootComponent } from 'expo';

import App from './App';

if (Platform.OS === 'web') {
  document.body.style.overflow = 'auto';
}

registerRootComponent(App);
