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

// All Google Drive Scopes for the Trip Album
export const WORKSPACE_DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.activity',
  'https://www.googleapis.com/auth/drive.activity.readonly',
  'https://www.googleapis.com/auth/drive.install',
  'https://www.googleapis.com/auth/drive.meet.readonly',
  'https://www.googleapis.com/auth/drive.scripts',
  'https://www.googleapis.com/auth/drive.apps.readonly',
];

const provider = new GoogleAuthProvider();
WORKSPACE_DRIVE_SCOPES.forEach((scope) => {
  provider.addScope(scope);
});
provider.setCustomParameters({
  prompt: 'select_account',
});

// In-memory token management (Never stored in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token needs re-authorization on fresh refresh
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const signInWithGoogleDrive = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('無法從 Google 授權取得 Access Token，請確認已核准 Google 雲端硬碟權限。');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Drive Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getDriveAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogleDrive = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface DriveTripFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  description?: string;
  createdTime?: string;
  size?: string;
  uploaderName?: string;
}

const TRIP_FOLDER_NAME = '北歐15天奢華聖誕跨年之旅_共享相簿';

/**
 * Find or create the dedicated Nordic Trip Shared Album folder in the user's Google Drive root
 */
export const findOrCreateTripFolder = async (
  token: string
): Promise<string> => {
  try {
    // 1. Check if folder already exists
    const query = encodeURIComponent(
      `name = '${TRIP_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    );
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.files && data.files.length > 0) {
        return data.files[0].id;
      }
    }

    // 2. Create the folder if not found
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: TRIP_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
        description: '北歐 15 天奢華聖誕跨年之旅 (2026-2027) 旅伴專屬雲端硬碟共享相簿',
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      throw new Error(err.error?.message || '建立 Google Drive 相簿資料夾失敗');
    }

    const createdData = await createRes.json();
    return createdData.id;
  } catch (err) {
    console.error('findOrCreateTripFolder error:', err);
    throw err;
  }
};

/**
 * List all photos in the Nordic Trip Shared Album folder
 */
export const listDriveTripPhotos = async (
  token: string,
  folderId?: string
): Promise<DriveTripFile[]> => {
  try {
    let targetFolderId = folderId;
    if (!targetFolderId) {
      targetFolderId = await findOrCreateTripFolder(token);
    }

    const query = encodeURIComponent(
      `'${targetFolderId}' in parents and mimeType contains 'image/' and trashed = false`
    );
    const fields = encodeURIComponent(
      'files(id,name,mimeType,thumbnailLink,webViewLink,webContentLink,description,createdTime,size,owners)'
    );

    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=createdTime desc&pageSize=100`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || '讀取 Google Drive 相片失敗');
    }

    const data = await res.json();
    const files: DriveTripFile[] = (data.files || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      thumbnailLink: f.thumbnailLink,
      webViewLink: f.webViewLink,
      webContentLink: f.webContentLink,
      description: f.description || '',
      createdTime: f.createdTime,
      size: f.size,
      uploaderName: f.owners && f.owners[0] ? f.owners[0].displayName : '旅伴',
    }));

    return files;
  } catch (err) {
    console.error('listDriveTripPhotos error:', err);
    throw err;
  }
};

/**
 * Upload an image file directly to the user's Google Drive Shared Folder using multipart upload
 */
export const uploadPhotoToDrive = async (
  token: string,
  file: File | Blob,
  fileName: string,
  dayNum: number,
  spotName: string,
  caption: string,
  uploader: string
): Promise<DriveTripFile> => {
  try {
    const folderId = await findOrCreateTripFolder(token);

    // Build structured description with day, spot, caption, uploader
    const descriptionJson = JSON.stringify({
      day: dayNum,
      spotName: spotName || '北歐景點',
      caption: caption || '',
      uploader: uploader || '北歐旅伴',
      uploadedAt: new Date().toISOString(),
    });

    const metadata = {
      name: fileName,
      mimeType: file.type || 'image/jpeg',
      parents: [folderId],
      description: descriptionJson,
    };

    const form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    form.append('file', file);

    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,thumbnailLink,webViewLink,webContentLink,description,createdTime,size',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || '上傳相片至 Google Drive 失敗');
    }

    const uploaded = await res.json();
    return {
      id: uploaded.id,
      name: uploaded.name,
      mimeType: uploaded.mimeType,
      thumbnailLink: uploaded.thumbnailLink,
      webViewLink: uploaded.webViewLink,
      webContentLink: uploaded.webContentLink,
      description: uploaded.description || descriptionJson,
      createdTime: uploaded.createdTime,
      size: uploaded.size,
      uploaderName: uploader,
    };
  } catch (err) {
    console.error('uploadPhotoToDrive error:', err);
    throw err;
  }
};

/**
 * Delete a photo from Google Drive with mandatory safety
 */
export const deletePhotoFromDrive = async (
  token: string,
  fileId: string
): Promise<boolean> => {
  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok && res.status !== 204) {
      const err = await res.json();
      throw new Error(err.error?.message || '刪除雲端硬碟相片失敗');
    }

    return true;
  } catch (err) {
    console.error('deletePhotoFromDrive error:', err);
    throw err;
  }
};
