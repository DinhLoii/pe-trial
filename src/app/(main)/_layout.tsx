import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function MainLayout() {
  const { user, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/');
    }
  }, [user, authLoading]);

  if (!user) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="list" />
      <Stack.Screen name="book/[id]" />
    </Stack>
  );
}
