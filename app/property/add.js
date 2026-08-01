import React, {
  useCallback,
  useState
} from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";

import {
  router,
  useFocusEffect
} from "expo-router";

import { supabase } from "../../services/supabase";


export default function AddProperty() {

  const [name, setName] = useState("");

  const [host, setHost] = useState("");

  const [description, setDescription] = useState("");

  const [bookingUrl, setBookingUrl] = useState("");

  const [address, setAddress] = useState("");

  const [latitude, setLatitude] = useState("");

  const [longitude, setLongitude] = useState("");

  const [userId, setUserId] = useState(null);

  const [checkingAccess, setCheckingAccess] = useState(true);

  const [authorised, setAuthorised] = useState(false);

  const [accessError, setAccessError] = useState("");

  const [loading, setLoading] = useState(false);


  useFocusEffect(

    useCallback(() => {

      let screenActive = true;


      async function checkAccess() {

        setCheckingAccess(true);

        setAccessError("");


        const {
          data: {
            user
          },
          error: userError
        } = await supabase.auth.getUser();


        if (!screenActive) {

          return;

        }


        if (userError || !user) {

          router.replace("/auth/login");

          return;

        }


        const {
          data: profile,
          error: profileError
        } = await supabase

          .from("profiles")

          .select("account_type,is_admin")

          .eq("id", user.id)

          .maybeSingle();


        if (!screenActive) {

          return;

        }


        if (profileError) {

          console.log(profileError);

          setAccessError(
            "Your account details could not be checked."
          );

          setCheckingAccess(false);

          return;

        }


        const allowedAccountTypes = [
          "manager",
          "host"
        ];


        const canAddProperty =
          profile?.is_admin === true ||
          allowedAccountTypes.includes(
            profile?.account_type
          );


        if (!canAddProperty) {

          setAccessError(
            "Your account does not have permission to add a property."
          );

          setAuthorised(false);

          setCheckingAccess(false);

          return;

        }


        setUserId(user.id);

        setAuthorised(true);

        setCheckingAccess(false);

      }


      checkAccess();


      return () => {

        screenActive = false;

      };

    }, [])

  );


  async function addProperty() {

    if (loading || !authorised || !userId) {

      return;

    }


    if (!name.trim()) {

      Alert.alert(
        "Error",
        "Property name is required"
      );

      return;

    }


    if (!address.trim()) {

      Alert.alert(
        "Error",
        "Address is required"
      );

      return;

    }


    const latitudeNumber = Number(latitude);

    const longitudeNumber = Number(longitude);


    if (
      !latitude.trim() ||
      Number.isNaN(latitudeNumber)
    ) {

      Alert.alert(
        "Error",
        "Latitude must be a number"
      );

      return;

    }


    if (
      !longitude.trim() ||
      Number.isNaN(longitudeNumber)
    ) {

      Alert.alert(
        "Error",
        "Longitude must be a number"
      );

      return;

    }


    if (
      latitudeNumber < -90 ||
      latitudeNumber > 90
    ) {

      Alert.alert(
        "Error",
        "Latitude must be between -90 and 90"
      );

      return;

    }


    if (
      longitudeNumber < -180 ||
      longitudeNumber > 180
    ) {

      Alert.alert(
        "Error",
        "Longitude must be between -180 and 180"
      );

      return;

    }


    setLoading(true);


    try {

      const {
        data: {
          user
        },
        error: userError
      } = await supabase.auth.getUser();


      if (userError || !user) {

        router.replace("/auth/login");

        return;

      }


      if (user.id !== userId) {

        Alert.alert(
          "Error",
          "Your login session has changed. Please reopen this page."
        );

        return;

      }


      const {
        data: profile,
        error: profileError
      } = await supabase

        .from("profiles")

        .select("account_type,is_admin")

        .eq("id", user.id)

        .maybeSingle();


      if (profileError) {

        throw profileError;

      }


      const allowedAccountTypes = [
        "manager",
        "host"
      ];


      const stillAuthorised =
        profile?.is_admin === true ||
        allowedAccountTypes.includes(
          profile?.account_type
        );


      if (!stillAuthorised) {

        Alert.alert(
          "Access denied",
          "Your account does not have permission to add a property."
        );

        return;

      }


      const {
        error
      } = await supabase

        .from("properties")

        .insert({

          name: name.trim(),

          host: host.trim(),

          description: description.trim(),

          booking_url: bookingUrl.trim(),

          address: address.trim(),

          latitude: latitudeNumber,

          longitude: longitudeNumber,

          owner_id: user.id

        });


      if (error) {

        console.log(error);

        Alert.alert(
          "Database Error",
          error.message
        );

        return;

      }


      Alert.alert(
        "Property created",
        "Your property listing has been created."
      );


      router.replace("/manager/dashboard");

    }
    catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        error?.message ||
        "The property could not be created."
      );

    }
    finally {

      setLoading(false);

    }

  }


  if (checkingAccess) {

    return (

      <View style={styles.centered}>

        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Checking your account...
        </Text>

      </View>

    );

  }


  if (!authorised) {

    return (

      <View style={styles.centered}>

        <Text style={styles.accessTitle}>
          Access denied
        </Text>

        <Text style={styles.accessText}>
          {accessError}
        </Text>

        <Pressable

          style={styles.button}

          onPress={() => router.replace("/")}

        >

          <Text style={styles.buttonText}>
            Return Home
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
        Add Property
      </Text>


      <TextInput

        style={styles.input}

        placeholder="Property Name *"

        value={name}

        onChangeText={setName}

      />


      <TextInput

        style={styles.input}

        placeholder="Host Name"

        value={host}

        onChangeText={setHost}

      />


      <TextInput

        style={[
          styles.input,
          styles.multilineInput
        ]}

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

        placeholder="Address *"

        value={address}

        onChangeText={setAddress}

      />


      <TextInput

        style={styles.input}

        placeholder="Latitude *"

        value={latitude}

        onChangeText={setLatitude}

        keyboardType="numbers-and-punctuation"

      />


      <TextInput

        style={styles.input}

        placeholder="Longitude *"

        value={longitude}

        onChangeText={setLongitude}

        keyboardType="numbers-and-punctuation"

      />


      <Pressable

        style={[
          styles.button,
          loading && styles.disabled
        ]}

        disabled={loading}

        onPress={addProperty}

      >

        {loading ? (

          <ActivityIndicator color="white" />

        ) : (

          <Text style={styles.buttonText}>
            Create Property Listing
          </Text>

        )}

      </Pressable>


      <Pressable

        style={styles.cancelButton}

        disabled={loading}

        onPress={() =>
          router.replace("/manager/dashboard")
        }

      >

        <Text style={styles.cancelButtonText}>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#f5f7fb"
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16
  },

  accessTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12
  },

  accessText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },

  multilineInput: {
    minHeight: 120
  },

  button: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 10,
    alignItems: "center"
  },

  disabled: {
    opacity: 0.6
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },

  cancelButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#222"
  },

  cancelButtonText: {
    color: "#222",
    fontWeight: "bold"
  }

});