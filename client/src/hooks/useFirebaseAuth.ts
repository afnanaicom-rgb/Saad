import { useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '@/lib/firebase';

export interface AuthUser extends User {
  credits?: number;
  isPro?: boolean;
}

export function useFirebaseAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          // Fetch user credits and pro status from backend
          const response = await fetch('/api/auth/user-profile', {
            headers: {
              'Authorization': `Bearer ${await currentUser.getIdToken()}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser({
              ...currentUser,
              credits: userData.credits,
              isPro: userData.isPro,
            });
          } else {
            setUser(currentUser as AuthUser);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setUser(currentUser as AuthUser);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Save user to backend
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          provider: 'google',
        }),
      });

      return result.user;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to login with Google';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGithub = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithPopup(auth, githubProvider);
      
      // Save user to backend
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          provider: 'github',
        }),
      });

      return result.user;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to login with GitHub';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to logout';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    loginWithGoogle,
    loginWithGithub,
    logout,
    isAuthenticated: !!user,
  };
}
