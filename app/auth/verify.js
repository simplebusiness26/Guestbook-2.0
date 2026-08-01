import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator
} from "react-native";

import { router } from "expo-router";

import { supabase } from "../../services/supabase";


export default function Verify() {

  const [checking, setChecking] = useState(true);

  const [message, setMessage] = useState(
    "Please check your email and tap the confirmation link."
  );


  useEffect(() => {

    // Check immediately — the user may have already confirmed and returned
    // to the app with an active session (e.g. via deep link on mobile).
    supabase.auth.getSession().then(({ data: { session } }) => {

      if (session) {

        // Already confirmed and logged in — go straight to the app.
        router.replace("/");

      } else {

        setChecking(false);

      }

    });


    // Listen for the moment Supabase processes the confirmation token
    // (SIGNED_IN fires after the user clicks the email link).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {

        if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) {

          router.replace("/");

        }

      }
    );


    return () => subscription.unsubscribe();

  }, []);


  if (checking) {

    return (

      <View style={styles.container}>

        <ActivityIndicator size="large" color="#222" />

      </View>

    );

  }


  return (

    <View style={styles.container}>


      <Text style={styles.title}>
        Check your email
      </Text>


      <Text style={styles.body}>
        {message}
      </Text>


      <Text style={styles.hint}>
        Once you tap the link in the email, you will be signed in automatically.
        If the link has expired, sign up again with the same email address.
      </Text>


      <Pressable
        style={styles.button}
        onPress={() => router.replace("/auth/login")}
      >

        <Text style={styles.buttonText}>
          Back to Login
        </Text>

      </Pressable>


    </View>

  );

}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center"
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20
  },

  body: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24
  },

  hint: {
    fontSize: 14,
    color: "#666",
    marginBottom: 40,
    lineHeight: 22
  },

  button: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },

  buttonText: {
    color: "white",
    fontWeight: "bold"
  }

});
