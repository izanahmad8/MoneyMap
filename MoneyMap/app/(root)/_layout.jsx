import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function layout() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null; //it does not show the login page if u already logged in
  if (!isSignedIn) return <Redirect href={"/sign-in"} />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
