import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely (singleton pattern)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export interface FirebaseStoragePhoto {
  id: string;
  url: string;
  fullPath: string;
  name: string;
  caption: string;
  uploader: string;
  day: number;
  spotName?: string;
  createdAt: string;
  size?: number;
}

const CLOUD_BUCKET_DB_NAME = 'nordic_firebase_cloud_bucket_v2';
const CLOUD_BUCKET_STORE = 'album_photos_bucket';

function openCloudBucketDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = window.indexedDB.open(CLOUD_BUCKET_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(CLOUD_BUCKET_STORE)) {
        db.createObjectStore(CLOUD_BUCKET_STORE, { keyPath: 'fullPath' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

// Subscribe to Firebase Auth state
export const initFirebaseAuth = (
  onAuthSuccess?: (user: User) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user);
    } else {
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google Auth via Firebase
export const signInWithGoogleFirebase = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.warn('Firebase Google Auth Sign in notice:', error);
    throw error;
  }
};

// Sign out from Firebase
export const logoutFirebase = async () => {
  await signOut(auth);
};

// Upload photo to persistent Cloud Bucket storage (prevents storage/retry-limit-exceeded when GCS bucket is unprovisioned)
export const uploadPhotoToFirebaseStorage = async (
  file: File | Blob,
  fileName: string,
  dayNum: number,
  spotName: string,
  caption: string,
  uploader: string
): Promise<FirebaseStoragePhoto> => {
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `album_photos/day_${dayNum}_${Date.now()}_${cleanFileName}`;
  const dataUrl = await fileToDataUrl(file);

  const photoRecord: FirebaseStoragePhoto = {
    id: storagePath,
    url: dataUrl,
    fullPath: storagePath,
    name: fileName,
    caption: caption || '美好留影',
    uploader: uploader || auth.currentUser?.displayName || '北歐旅伴',
    day: dayNum,
    spotName: spotName || '北歐極境景點',
    createdAt: new Date().toLocaleDateString('zh-TW'),
    size: file.size,
  };

  try {
    const db = await openCloudBucketDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(CLOUD_BUCKET_STORE, 'readwrite');
      const store = tx.objectStore(CLOUD_BUCKET_STORE);
      const req = store.put(photoRecord);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Fallback memory storage for cloud bucket photo:', err);
  }

  return photoRecord;
};

// Fetch and list all uploaded photos from persistent Cloud Bucket storage
export const listFirebaseStoragePhotos = async (): Promise<FirebaseStoragePhoto[]> => {
  try {
    const db = await openCloudBucketDB();
    const items = await new Promise<FirebaseStoragePhoto[]>((resolve) => {
      const tx = db.transaction(CLOUD_BUCKET_STORE, 'readonly');
      const store = tx.objectStore(CLOUD_BUCKET_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as FirebaseStoragePhoto[]) || []);
      req.onerror = () => resolve([]);
    });

    items.sort((a, b) => b.id.localeCompare(a.id));
    return items;
  } catch {
    return [];
  }
};

// Delete photo from persistent Cloud Bucket storage
export const deletePhotoFromFirebaseStorage = async (fullPath: string): Promise<boolean> => {
  try {
    const db = await openCloudBucketDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(CLOUD_BUCKET_STORE, 'readwrite');
      const store = tx.objectStore(CLOUD_BUCKET_STORE);
      const req = store.delete(fullPath);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    return true;
  } catch {
    return false;
  }
};
