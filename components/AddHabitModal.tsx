import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
};

export default function AddHabitModal({ visible, onClose, onCreate }: Props) {
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name.trim());
    setName("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.6)",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#1c1c1e",
            padding: 20,
            borderRadius: 16,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Nuevo hábito
          </Text>

          <TextInput
            placeholder="Ej: Gimnasio"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
            style={{
              backgroundColor: "#2c2c2e",
              color: "white",
              padding: 12,
              borderRadius: 10,
              marginBottom: 15,
            }}
          />

          <Pressable
            onPress={handleCreate}
            style={{
              backgroundColor: "#22c55e",
              padding: 12,
              borderRadius: 10,
            }}
          >
            <Text style={{ textAlign: "center", fontWeight: "600" }}>
              Crear
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
