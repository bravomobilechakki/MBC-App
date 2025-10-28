import React, { useState, useContext, useEffect } from "react";
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
import { UserContext } from "../../context/UserContext";
import SummaryApi from "../../common";
import axios from "axios";

const Address = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedItems, totalAmount } = route.params || {};
  const { user, token, fetchUserProfile } = useContext(UserContext);

  const [mode, setMode] = useState("list");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    isDefault: false,
  });

  useEffect(() => {
    if (user?.addresses) {
      const defaultAddress = user.addresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelected(defaultAddress._id);
      } else if (user.addresses.length > 0) {
        setSelected(user.addresses[0]._id);
      }
    }
  }, [user]);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSave = async () => {
    try {
      let response;
      if (mode === "add") {
        response = await axios.post(SummaryApi.addAddress.url, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (mode === "edit" && selected) {
        response = await axios.put(
          SummaryApi.updateAddress(selected).url,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      if (response.data.success) {
        await fetchUserProfile();
        setMode("list");
      } else {
        Alert.alert("Error", response.data.message || "Failed to save address.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while saving the address.");
      console.error(error);
    }
  };

  const handleEdit = (addr) => {
    setForm(addr);
    setSelected(addr._id);
    setMode("edit");
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(SummaryApi.deleteAddress(id).url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        await fetchUserProfile();
      } else {
        Alert.alert("Error", response.data.message || "Failed to delete address.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while deleting the address.");
      console.error(error);
    }
  };

  if (mode === "list") {
    const selectedAddress = user?.addresses.find((addr) => addr._id === selected);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Addresses</Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {user?.addresses?.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.card}
              onPress={() => setSelected(item._id)}
            >
              <View style={styles.row}>
                <Ionicons
                  name={selected === item._id ? "radio-button-on" : "radio-button-off"}
                  size={24}
                  color="#047857"
                  style={{ marginRight: 15 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{item.street}</Text>
                  <Text style={styles.details}>
                    {item.city} - {item.zipCode}, {item.state}
                  </Text>
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
                  onPress={() => handleDelete(item._id)}
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
            onPress={() => {
              setForm({
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "India",
                isDefault: false,
              });
              setMode("add");
            }}
          >
            <Ionicons name="add-circle-outline" size={22} color="#fff" />
            <Text style={styles.addText}>Add New Address</Text>
          </TouchableOpacity>
        </ScrollView>

        {selectedItems && (
          <TouchableOpacity
            style={styles.paymentBtn}
            onPress={() => {
              if (!selectedAddress) {
                Alert.alert("Please select an address.");
                return;
              }
              navigation.navigate("Payment", {
                selectedItems,
                totalAmount,
                address: selectedAddress,
              });
            }}
          >
            <Text style={styles.paymentText}>Proceed to Payment</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

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

      <Text style={styles.sectionTitle}>Address Info</Text>
      <TextInput
        placeholder="Street / Area"
        placeholderTextColor="#888"
        style={styles.input}
        value={form.street}
        onChangeText={(val) => handleChange("street", val)}
      />
      <TextInput
        placeholder="City"
        placeholderTextColor="#888"
        style={styles.input}
        value={form.city}
        onChangeText={(val) => handleChange("city", val)}
      />
      <TextInput
        placeholder="State"
        placeholderTextColor="#888"
        style={styles.input}
        value={form.state}
        onChangeText={(val) => handleChange("state", val)}
      />
      <TextInput
        placeholder="Pincode"
        placeholderTextColor="#888"
        style={styles.input}
        keyboardType="numeric"
        value={form.zipCode}
        onChangeText={(val) => handleChange("zipCode", val)}
      />
      <TextInput
        placeholder="Country"
        placeholderTextColor="#888"
        style={styles.input}
        value={form.country}
        onChangeText={(val) => handleChange("country", val)}
      />
      <View style={styles.defaultRow}>
        <Text>Set as default</Text>
        <TouchableOpacity onPress={() => setForm(prev => ({...prev, isDefault: !prev.isDefault}))}>
            <Ionicons name={form.isDefault ? "checkbox" : "square-outline"} size={24} color="#047857" />
        </TouchableOpacity>
      </View>

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
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#000",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  saveBtn: {
    backgroundColor: "#047857",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  paymentBtn: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#047857",
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
  defaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  }
});