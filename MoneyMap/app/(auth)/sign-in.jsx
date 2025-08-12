import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import { styles } from "../../assets/styles/auth.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (err.errors) {
        const message = err.errors.map((e) => {
          if (e.code === "form_identifier_not_found")
            return "Email not found register first.";
          if (e.code === "form_password_length_too_short")
            return "Password must be 8+ characters.";
          if (e.code === "too_many_requests")
            return "Too many requests. Please try again in a bit.";
          if (e.code === "form_param_nil") {
            return "Please fill all the fields";
          }
          if (e.code === "form_password_incorrect") {
            return "Password is incorrect. Try again.";
          }
        });
        const uniqueMessage = [...new Set(message)];
        setError(uniqueMessage.join(" "));
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableAutomaticScroll={true}
      enableOnAndroid={true}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/login.png")}
          style={styles.illustration}
        />
        <Text style={styles.title}>Welcome Back</Text>
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor={COLORS.textLight}
          onChangeText={(email) => setEmailAddress(email)}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.navigate("/sign-up")}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
