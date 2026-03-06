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

  const handleClose = () => {
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
          {/* Header con título e ícono de cierre */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
              }}
            >
              Nuevo hábito
            </Text>

            <Pressable
              onPress={handleClose}
              style={({ pressed }) => ({
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: pressed ? "#3a3a3c" : "#2c2c2e",
                justifyContent: "center",
                alignItems: "center",
              })}
            >
              <Text style={{ color: "#aaa", fontSize: 16, lineHeight: 18 }}>
                ✕
              </Text>
            </Pressable>
          </View>

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
