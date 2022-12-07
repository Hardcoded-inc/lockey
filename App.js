import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from './src/components/Nav'
import GlobalStyles from './src/components/GlobalStyles';
import Register from './src/pages/Register';

export default function App() {
  return (
    <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
      {/* <TopBar /> */}
      <Register />
    </SafeAreaView>
  );
}

