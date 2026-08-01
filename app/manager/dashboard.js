import React, { useState, useCallback } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator
} from "react-native";

import {
  router,
  useFocusEffect
} from "expo-router";

import { supabase } from "../../services/supabase";


export default function ManagerDashboard() {

  const [loading, setLoading] = useState(true);

  const [businesses, setBusinesses] = useState([]);

  const [properties, setProperties] = useState([]);

  const [error, setError] = useState("");


  useFocusEffect(

    useCallback(() => {

      let screenActive = true;


      async function loadDashboard() {

        setLoading(true);

        setError("");


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

          setError("Your account details could not be checked.");

          setLoading(false);

          return;

        }


        const isManager = profile?.account_type === "manager";

        const isAdmin = profile?.is_admin === true;


        if (!profile || (!isManager && !isAdmin)) {

          setError(
            "You do not have permission to access the Manager Dashboard."
          );

          setLoading(false);

          return;

        }


        const {
          data: businessData,
          error: businessError
        } = await supabase

          .from("businesses")

          .select("*")

          .eq("owner_id", user.id)

          .order("created_at", {
            ascending: false
          });


        if (!screenActive) {

          return;

        }


        if (businessError) {

          console.log(businessError);

          setError("Your businesses could not be loaded.");

          setLoading(false);

          return;

        }


        const {
          data: propertyData,
          error: propertyError
        } = await supabase

          .from("properties")

          .select("*")

          .eq("owner_id", user.id)

          .order("created_at", {
            ascending: false
          });


        if (!screenActive) {

          return;

        }


        if (propertyError) {

          console.log(propertyError);

          setError("Your properties could not be loaded.");

          setLoading(false);

          return;

        }


        setBusinesses(businessData || []);

        setProperties(propertyData || []);

        setLoading(false);

      }


      loadDashboard();


      return () => {

        screenActive = false;

      };

    }, [])

  );


  if (loading) {

    return (

      <View style={styles.loading}>

        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading Dashboard...
        </Text>

      </View>

    );

  }


  if (error) {

    return (

      <View style={styles.errorContainer}>

        <Text style={styles.errorTitle}>
          Access denied
        </Text>

        <Text style={styles.errorText}>
          {error}
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

    >

      <Text style={styles.title}>
        Manager Dashboard
      </Text>

      <Text style={styles.subtitle}>
        Manage everything from one place.
      </Text>


      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          🏪 Businesses ({businesses.length})
        </Text>


        {businesses.length === 0 ? (

          <View style={styles.emptyCard}>

            <Text style={styles.emptyTitle}>
              No businesses yet
            </Text>

            <Text style={styles.emptyText}>
              Create your first business listing.
            </Text>

          </View>

        ) : (

          businesses.map((business) => (

            <View

              key={business.id}

              style={styles.card}

            >

              <Text style={styles.cardTitle}>
                {business.name}
              </Text>

              <Text style={styles.cardSub}>
                {business.category}
              </Text>

              <Pressable

                style={styles.button}

                onPress={() =>
                  router.push(`/business/edit/${business.id}`)
                }

              >

                <Text style={styles.buttonText}>
                  Manage Business
                </Text>

              </Pressable>


              <Pressable

                style={styles.button}

                onPress={() =>
                  router.push(`/business/${business.id}`)
                }

              >

                <Text style={styles.buttonText}>
                  View Public Profile
                </Text>

              </Pressable>

            </View>

          ))

        )}


        <Pressable

          style={styles.addButton}

          onPress={() => router.push("/business/add")}

        >

          <Text style={styles.buttonText}>
            ➕ Add Business
          </Text>

        </Pressable>

      </View>


      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          🏠 Properties ({properties.length})
        </Text>


        {properties.length === 0 ? (

          <View style={styles.emptyCard}>

            <Text style={styles.emptyTitle}>
              No properties yet
            </Text>

            <Text style={styles.emptyText}>
              Create your first property listing.
            </Text>

          </View>

        ) : (

          properties.map((property) => (

            <View

              key={property.id}

              style={styles.card}

            >

              <Text style={styles.cardTitle}>
                {property.name}
              </Text>

              <Text style={styles.cardSub}>
                {property.address}
              </Text>

              <Pressable

                style={styles.button}

                onPress={() =>
                  router.push(`/property/edit/${property.id}`)
                }

              >

                <Text style={styles.buttonText}>
                  Manage Property
                </Text>

              </Pressable>


              <Pressable

                style={styles.button}

                onPress={() =>
                  router.push(`/property/${property.id}`)
                }

              >

                <Text style={styles.buttonText}>
                  View Public Profile
                </Text>

              </Pressable>

            </View>

          ))

        )}


        <Pressable

          style={styles.addButton}

          onPress={() => router.push("/property/add")}

        >

          <Text style={styles.buttonText}>
            ➕ Add Property
          </Text>

        </Pressable>

      </View>


      <View style={styles.upgradeCard}>

        <Text style={styles.sectionTitle}>
          🎯 Activities
        </Text>

        <Text style={styles.emptyText}>
          Upgrade to unlock Activities.
        </Text>

      </View>


      <View style={styles.upgradeCard}>

        <Text style={styles.sectionTitle}>
          🎉 Events
        </Text>

        <Text style={styles.emptyText}>
          Upgrade to unlock Events.
        </Text>

      </View>


      <View style={styles.upgradeCard}>

        <Text style={styles.sectionTitle}>
          📈 Analytics
        </Text>

        <Text style={styles.emptyText}>
          Upgrade to unlock Analytics.
        </Text>

      </View>

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

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },

  loadingText: {
    marginTop: 20
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#f5f7fb"
  },

  errorTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12
  },

  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
    marginTop: 5
  },

  section: {
    marginBottom: 30
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15
  },

  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e5e5e5"
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold"
  },

  cardSub: {
    fontSize: 15,
    color: "#666",
    marginTop: 5,
    marginBottom: 15
  },

  button: {
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 10,
    marginTop: 10
  },

  addButton: {
    backgroundColor: "#0066ff",
    padding: 16,
    borderRadius: 12,
    marginTop: 10
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  },

  emptyCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e5e5"
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold"
  },

  emptyText: {
    fontSize: 15,
    color: "#666",
    marginTop: 8
  },

  upgradeCard: {
    backgroundColor: "#fff8e7",
    padding: 20,
    borderRadius: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#f0d78c"
  }

});