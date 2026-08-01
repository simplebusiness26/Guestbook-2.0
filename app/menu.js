import React,{useEffect,useState} from "react";

import {
View,
Text,
StyleSheet,
Pressable,
ScrollView
} from "react-native";

import {router} from "expo-router";

import {supabase} from "../services/supabase";

export default function Menu(){

const [userType,setUserType]=useState(null);
const [loggedIn,setLoggedIn]=useState(false);

useEffect(()=>{
loadUser();
},[]);

async function loadUser(){

const {
data:{user}
}=await supabase.auth.getUser();

if(!user){
setLoggedIn(false);
return;
}

setLoggedIn(true);

const {data}=await supabase
.from("profiles")
.select("account_type,is_admin")
.eq("id",user.id)
.single();

if(data){

if(data.is_admin){
setUserType("admin");
}else{
setUserType(data.account_type);
}

}

}

async function logout(){

await supabase.auth.signOut();

router.replace("/");

}

function MenuCard(title,subtitle,onPress){

return(

<Pressable
style={styles.card}
onPress={onPress}
>

<Text style={styles.cardTitle}>
{title}
</Text>

<Text style={styles.cardSubtitle}>
{subtitle}
</Text>

</Pressable>

);

}

return(

<ScrollView
style={styles.container}
contentContainerStyle={{
paddingBottom:40
}}
>

<Text style={styles.title}>
Guestbook
</Text>

<Text style={styles.subtitle}>
Where would you like to go?
</Text>

{MenuCard(
"🗺 Explore Map",
"Discover businesses, properties and more.",
()=>router.push("/map")
)}

{loggedIn && MenuCard(
"👤 My Profile",
"View your reviews and profile.",
()=>router.push("/profile")
)}

{userType==="manager" && MenuCard(
"📊 Manager Dashboard",
"Manage your businesses and properties.",
()=>router.push("/manager/dashboard")
)}

{userType==="admin" && MenuCard(
"⚙ Admin Dashboard",
"Review claims and manage the platform.",
()=>router.push("/admin/claims")
)}

{!loggedIn && MenuCard(
"🔑 Login",
"Sign in to your account.",
()=>router.push("/auth/login")
)}

{!loggedIn && MenuCard(
"✨ Create Account",
"Join Guestbook today.",
()=>router.push("/auth/signup")
)}

{loggedIn &&

<Pressable
style={styles.logout}
onPress={logout}
>

<Text style={styles.logoutText}>
🚪 Logout
</Text>

</Pressable>

}

</ScrollView>

);

}

const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:"#f5f7fb",
padding:20
},

title:{
fontSize:34,
fontWeight:"bold",
marginTop:15
},

subtitle:{
fontSize:16,
color:"#666",
marginBottom:30,
marginTop:5
},

card:{
backgroundColor:"white",
padding:20,
borderRadius:16,
marginBottom:15,
borderWidth:1,
borderColor:"#e5e5e5"
},

cardTitle:{
fontSize:22,
fontWeight:"bold",
marginBottom:6
},

cardSubtitle:{
fontSize:15,
color:"#666"
},

logout:{
backgroundColor:"#d32f2f",
padding:18,
borderRadius:16,
marginTop:20
},

logoutText:{
color:"white",
fontWeight:"bold",
textAlign:"center",
fontSize:17
}

});