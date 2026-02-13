import { Redirect } from 'expo-router';

export default function Index() {
    // In Phase 2, check auth state here
    // For now, redirect to login
    return <Redirect href="/(auth)/login" />;
}
