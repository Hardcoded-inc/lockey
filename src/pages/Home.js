import { View } from "react-native";
import { Text, Stack, Button, Divider } from "@react-native-material/core";

const Home = ({ navigation: { navigate } }) => {
  return (
    <View style={{ flex: 1 }}>
      <Stack m={12} spacing={12}>
        <Text variant="h5">Skan QR</Text>
        <Text variant="subtitle1">
          Zeksanuj kod QR umieszczony bezpośrednio obok wejścia, a aplikacja
          automatycznie przeniesie Cię do konkretnych drzwi.
        </Text>
        <Button title="Uruchom skaner QR" onPress={() => navigate("QR")} />
        <Divider style={{ marginTop: 12 }} color="green" />
      </Stack>
    </View>
  );
};

export default Home;
