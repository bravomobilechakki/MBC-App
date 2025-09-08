import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Search = () => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", query);
    // API call / filter products here
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        {/* ✅ Logo inside search bar */}
        <Image
          source={require("../../images/logo2.png")} // path relative to Search.js
          style={styles.logo}
          resizeMode="contain"
        />

        
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />

        {query.length > 0 && (
  <TouchableOpacity onPress={() => setQuery("")}>
    <Icon name="close-circle" size={20} color="#777" />
  </TouchableOpacity>
)}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F9F9",
    padding: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    elevation: 2,
  },
  logo: {
    width: 32,   // adjust size
    height: 36,
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 10,
  },
});

export default Search;
