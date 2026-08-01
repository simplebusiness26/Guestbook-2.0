import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from "react-native";

import {
  router,
  useLocalSearchParams
} from "expo-router";

import { supabase } from "../../../services/supabase";


export default function EditPropertyById() {

  const { id } = useLocalSearchParams();

  const propertyId = Array.isArray(id) ? id[0] : id;

  const [property, setProperty] = useState(null);

  const [userId, setUserId] = useState(null);

  const [name, setName] = useState("");

  const [host, setHost] = useState("");

  const [description, setDescription] = useState("");

  const [bookingUrl, setBookingUrl] = useState("");

  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");


  useEffect(() => {

    if (propertyId) {

      loadProperty();

    } else {

      setError("No property was selected.");

      setLoading(false);

    }

  }, [propertyId]);


  async function loadProperty() {

    setLoading(true);

    setError("");


    const {
      data: {
        user
      },
      error: userError
    } = await supabase.auth.getUser();


    if (userError || !user) {

      console.log(userError);

      setError("You must be logged in to edit this property.");

      setLoading(false);

      return;

    }


    setUserId(user.id);


    const {
      data,
      error: propertyError
    } = await supabase

      .from("properties")

      .select("*")

      .eq("id", propertyId)

      .eq("owner_id", user.id)

      .maybeSingle();


    if (propertyError) {

      console.log(propertyError);

      setError("The property could not be loaded.");

      setLoading(false);

      return;

    }


    if (!data) {

      setError(
        "Property not found, or you do not have permission to edit it."
      );

      setLoading(false);

      return;

    }


    setProperty(data);

    setName(data.name || "");

    setHost(data.host || "");

    setDescription(data.description || "");

    setBookingUrl(data.booking_url || "");

    setAddress(data.address || "");

    setLoading(false);

  }


  async function save() {

    if (!property || !userId || saving) {

      return;

    }


    if (!name.trim()) {

      setError("Please enter a property name.");

      return;

    }


    setSaving(true);

    setError("");


    const {
      data,
      error: updateError
    } = await supabase

      .from("properties")

      .update({

        name: name.trim(),

        host: host.trim(),

        description: description.trim(),

        booking_url: bookingUrl.trim(),

        address: address.trim()

      })

      .eq("id", property.id)

      .eq("owner_id", userId)

      .select("id")

      .maybeSingle();


    if (updateError) {

      console.log(updateError);

      setError("The property could not be saved.");

      setSaving(false);

      return;

    }


    if (!data) {

      setError(
        "The property was not updated because ownership could not be verified."
      );

      setSaving(false);

      return;

    }


    router.replace("/manager/dashboard");

  }


  if (loading) {

    return (

      <View style={styles.centered}>

        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading property...
        </Text>

      </View>

    );

  }


  if (error && !property) {

    return (

      <View style={styles.centered}>

        <Text style={styles.errorTitle}>
          Unable to edit property
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.replace("/manager/dashboard")}
        >

          <Text style={styles.buttonText}>
            Back to Dashboard
          </Text>

        </Pressable>

      </View>

    );

  }


  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >

      <Text style={styles.title}>
        Edit Property
      </Text>


      {error ? (

        <Text style={styles.formError}>
          {error}
        </Text>

      ) : null}


      <TextInput

        style={styles.input}

        placeholder="Property name"

        value={name}

        onChangeText={setName}

      />


      <TextInput

        style={styles.input}

        placeholder="Host name"

        value={host}

        onChangeText={setHost}

      />


      <TextInput

        style={[styles.input, styles.multilineInput]}

        placeholder="Description"

        value={description}

        onChangeText={setDescription}

        multiline

        textAlignVertical="top"

      />


      <TextInput

        style={styles.input}

        placeholder="Booking URL"

        value={bookingUrl}

        onChangeText={setBookingUrl}

        autoCapitalize="none"

        keyboardType="url"

      />


      <TextInput

        style={styles.input}

        placeholder="Address"

        value={address}

        onChangeText={setAddress}

      />


      <Pressable

        style={[
          styles.button,
          saving && styles.buttonDisabled
        ]}

        onPress={save}

        disabled={saving}

      >

        <Text style={styles.buttonText}>

          {saving ? "Saving..." : "Save Changes"}

        </Text>

      </Pressable>


      <Pressable

        style={styles.secondaryButton}

        onPress={() => router.replace("/manager/dashboard")}

        disabled={saving}

      >

        <Text style={styles.secondaryButtonText}>
          Cancel
        </Text>

      </Pressable>

    </ScrollView>

  );

}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f7fb"
  },

  content: {
    padding: 20,
    paddingBottom: 40
  },

  centered: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    alignItems: "center"
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16
  },

  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12
  },

  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24
  },

  formError: {
    backgroundColor: "#ffe8e8",
    color: "#9b1c1c",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d7dce5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },

  multilineInput: {
    minHeight: 120
  },

  button: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },

  buttonDisabled: {
    opacity: 0.6
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  },

  secondaryButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#222"
  },

  secondaryButtonText: {
    color: "#222",
    fontWeight: "bold"
  }

});