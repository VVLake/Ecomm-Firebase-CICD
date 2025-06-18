import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import { fetchUserProfile, updateUserProfile, deleteUserAccount } from '../utils/userService';

const Profile = () => {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const data = await fetchUserProfile(user.uid);
          setProfile(data);
          setFormData({
            name: data.name || '',
            address: data.address || '',
          });
        } catch (err) {
          console.error('Error loading profile:', err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await updateUserProfile(user.uid, formData);
      alert('Profile updated!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action is permanent.')) {
      try {
        await deleteUserAccount(user);
        alert('Your account has been deleted.');
        window.location.href = '/'; // Redirect to homepage or login
      } catch (error) {
        console.error(error);
        alert('Failed to delete account. You may need to log in again.');
      }
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>👤 User Profile</h2>

      {profile ? (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Address:</strong> {profile.address}</p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3>Edit Profile</h3>
            <label>
              Name: <input name="name" value={formData.name} onChange={handleChange} />
            </label>
            <br />
            <label>
              Address: <input name="address" value={formData.address} onChange={handleChange} />
            </label>
            <br />
            <button onClick={handleUpdate} style={{ marginTop: '1rem' }}>Save Changes</button>
          </div>

          <button
            onClick={handleDeleteAccount}
            style={{ color: 'white', backgroundColor: 'red', border: 'none', padding: '0.5rem 1rem', marginTop: '2rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            Delete My Account
          </button>
        </>
      ) : (
        <p>No profile data found.</p>
      )}
    </div>
  );
};

export default Profile;
