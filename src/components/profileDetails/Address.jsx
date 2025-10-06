import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";

const Address = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedItems, totalAmount } = route.params || {};
  const [mode, setMode] = useState("list");
  
  const [showSuccess, setShowSuccess] = useState(false);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: "Home",
      name: "Monika Rathore",
      phone: "+91 9876543210",
      house: "123",
      street: "Green Street",
      landmark: "Near Metro Station",
      city: "New Delhi",
      pincode: "110001",
      state: "Delhi",
    },
  ]);
  const [selected, setSelected] = useState(addresses.length > 0 ? addresses[0].id : null);

  const [form, setForm] = useState({
    label: "",
    customLabel: "",
    name: "",
    phone: "",
    house: "",
    street: "",
    landmark: "",
    city: "",
    pincode: "",
    state: "",
  });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSave = () => {
    const finalLabel =
      form.label === "Other" && form.customLabel
        ? form.customLabel
        : form.label;

    const newForm = { ...form, label: finalLabel };

    if (mode === "add") {
      const newAddress = { ...newForm, id: Date.now() };
      setAddresses([...addresses, newAddress]);
    } else if (mode === "edit" && selected) {
      setAddresses(
        addresses.map((addr) =>
          addr.id === selected.id ? { ...newForm, id: addr.id } : addr
        )
      );
    }

    // ✅ Show success and go back to list
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setMode("list");
    }, 1500);
  };

  const handleEdit = (addr) => {
    setForm({ ...addr, customLabel: "" });
    setSelected(addr.id);
    setMode("edit");
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  // --- LIST SCREEN ---
  if (mode === "list") {
    const selectedAddress = addresses.find(addr => addr.id === selected);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Addresses</Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {addresses.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card} onPress={() => setSelected(item.id)}>
              <View style={styles.row}>
                <Ionicons
                  name={selected === item.id ? "radio-button-on" : "radio-button-off"}
                  size={24}
                  color="#860f33ff"
                  style={{ marginRight: 15 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.details}>
                    {item.house}, {item.street}, {item.landmark}
                  </Text>
                  <Text style={styles.details}>
                    {item.city} - {item.pincode}, {item.state}
                  </Text>
                  <Text style={styles.phone}>{item.phone}</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleEdit(item)}
                >
                  <Ionicons name="create-outline" size={18} color="#5dad28ff" />
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleDelete(item.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="red" />
                  <Text style={[styles.actionText, { color: "red" }]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setMode("add")}
          >
            <Ionicons name="add-circle-outline" size={22} color="#fff" />
            <Text style={styles.addText}>Add New Address</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ✅ Proceed to Payment Button */}
        <TouchableOpacity
          style={styles.paymentBtn}
          onPress={() => {
            if (!selectedAddress) {
              Alert.alert("Please select an address.");
              return;
            }
            navigation.navigate("Payment", { selectedItems, totalAmount, address: selectedAddress });
          }}
        >
          <Text style={styles.paymentText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- ADD / EDIT FORM ---
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMode("list")}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === "add" ? "Add New Address" : "Edit Address"}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Address Label</Text>
      <View style={styles.labelRow}>
        {["Home", "Work", "Other"].map((lbl) => (
          <TouchableOpacity
            key={lbl}
            style={[
              styles.labelOption,
              form.label === lbl && { backgroundColor: "#860f33ff" },
            ]}
            onPress={() => handleChange("label", lbl)}
          >
            <Text
              style={[
                styles.labelText,
                form.label === lbl && { color: "#fff" },
              ]}
            >
              {lbl}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {form.label === "Other" && (
        <TextInput
          placeholder="Enter Custom Label"
          style={styles.input}
          value={form.customLabel}
          onChangeText={(val) => handleChange("customLabel", val)}
        />
      )}

      <Text style={styles.sectionTitle}>Contact Info</Text>
      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={form.name}
        onChangeText={(val) => handleChange("name", val)}
      />
      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(val) => handleChange("phone", val)}
      />

      <Text style={styles.sectionTitle}>Address Info</Text>
      <TextInput
        placeholder="House / Flat / Building No."
        style={styles.input}
        value={form.house}
        onChangeText={(val) => handleChange("house", val)}
      />
      <TextInput
        placeholder="Street / Area"
        style={styles.input}
        value={form.street}
        onChangeText={(val) => handleChange("street", val)}
      />
      <TextInput
        placeholder="Landmark"
        style={styles.input}
        value={form.landmark}
        onChangeText={(val) => handleChange("landmark", val)}
      />
      <TextInput
        placeholder="City"
        style={styles.input}
        value={form.city}
        onChangeText={(val) => handleChange("city", val)}
      />
      <TextInput
        placeholder="Pincode"
        style={styles.input}
        keyboardType="numeric"
        value={form.pincode}
        onChangeText={(val) => handleChange("pincode", val)}
      />
      <TextInput
        placeholder="State"
        style={styles.input}
        value={form.state}
        onChangeText={(val) => handleChange("state", val)}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>
          {mode === "add" ? "Save Address" : "Update Address"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Address;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: "600", marginLeft: 12, color: "#333" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "flex-start" },
  label: { fontSize: 16, fontWeight: "600", color: "#222" },
  details: { fontSize: 14, color: "#555", marginTop: 4 },
  phone: { fontSize: 13, color: "#777", marginTop: 2 },
  actionRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "flex-end",
  },
  actionBtn: { flexDirection: "row", alignItems: "center", marginLeft: 20 },
  actionText: { fontSize: 14, marginLeft: 4, color: "#20c048ff" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222119ff",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  addText: { color: "#fff", fontSize: 16, marginLeft: 6, fontWeight: "600" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
    color: "#333",
  },
  labelRow: { flexDirection: "row", marginBottom: 16 },
  labelOption: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  labelText: { fontSize: 14, color: "#181313ff" },
  input: {
    backgroundColor: "#eeeeeeff",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#222",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  saveBtn: {
    backgroundColor: "#860f33ff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  // ✅ New Payment Button Styles
  paymentBtn: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#860f33ff",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    elevation: 4,
  },
  paymentText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
