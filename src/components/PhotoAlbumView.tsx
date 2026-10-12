import React, { useState, useEffect, useCallback } from 'react';
import { DayPlan } from '../types/itinerary';
import { saveImageToDB, deleteImageFromDB } from '../utils/db';
import {
  initDriveAuth,
  signInWithGoogleDrive,
  getDriveAccessToken,
  logoutGoogleDrive,
  listDriveTripPhotos,
  uploadPhotoToDrive,
  deletePhotoFromDrive,
  findOrCreateTripFolder,
  DriveTripFile,
} from '../services/googleDriveService';
import {
  initFirebaseAuth,
  signInWithGoogleFirebase,
  logoutFirebase,
  uploadPhotoToFirebaseStorage,
  listFirebaseStoragePhotos,
  deletePhotoFromFirebaseStorage,
  FirebaseStoragePhoto,
} from '../services/firebaseStorageService';
import { User } from 'firebase/auth';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  Filter,
  User as UserIcon,
  Calendar,
  Trash2,
  Download,
  FolderUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Cloud,
  CloudOff,
  CloudUpload,
  RefreshCw,
  ExternalLink,
  Folder,
  AlertTriangle,
  LogIn,
  LogOut,
  Flame,
  HardDrive,
  Layers,
  Database,
  Link as LinkIcon,
  FolderSearch,
  FolderPlus,
  Plus,
  Globe,
} from 'lucide-react';

export interface AlbumPhoto {
  id: string;
  url: string;
  caption: string;
  uploader: string;
  day: number;
  spotName?: string;
  createdAt: string;
  storageType: 'firebase' | 'drive' | 'local';
  firebaseFullPath?: string;
  driveFileId?: string;
  driveWebViewLink?: string;
  localFolderPath?: string;
  sourceType?: 'upload' | 'url' | 'folder';
}

const ALBUM_STORAGE_KEY = 'nordic_album_photos_v1';

const INITIAL_PHOTOS: AlbumPhoto[] = [
  {
    id: 'sample-p0-slot',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Christiansborg_Slot_Copenhagen_2014_01.jpg/1280px-Christiansborg_Slot_Copenhagen_2014_01.jpg',
    caption: '登上克里斯蒂安堡宮塔樓俯瞰哥本哈根冬雪全景，宮殿氣勢磅礡！',
    uploader: '同學小涵',
    day: 2,
    spotName: '克里斯蒂安堡宮',
    createdAt: '2026-12-20',
    storageType: 'local',
  },
  {
    id: 'sample-p0-mermaid',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Petite_sir%C3%A8ne_de_Copenhague_%28conforme_%C3%A0_la_loi_danoise%29.JPG/1280px-Petite_sir%C3%A8ne_de_Copenhague_%28conforme_%C3%A0_la_loi_danoise%29.JPG',
    caption: '長堤公園吹著波羅的海冷風跟小美人魚合影，全體同學打卡成功！',
    uploader: '浩浩',
    day: 2,
    spotName: '小美人魚像',
    createdAt: '2026-12-20',
    storageType: 'local',
  },
  {
    id: 'sample-p1',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stortorget_2006.jpg/1280px-Stortorget_2006.jpg',
    caption: '斯德哥爾摩 Gamla Stan 大廣場雪夜聖誕樹合照！',
    uploader: '全體同學',
    day: 3,
    spotName: '大廣場聖誕市集',
    createdAt: '2026-12-21',
    storageType: 'local',
  },
  {
    id: 'sample-p2',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Wood_and_flowers.jpg/1280px-Wood_and_flowers.jpg',
    caption: '拉普蘭玻璃屋外的第一次極光爆發，漫天綠光超感動！',
    uploader: '旅伴阿明',
    day: 5,
    spotName: 'Kakslauttanen 極光玻璃屋',
    createdAt: '2026-12-23',
    storageType: 'local',
  },
  {
    id: 'sample-p-tromso',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Arctic_Cathedral.JPG/1280px-Arctic_Cathedral.JPG',
    caption: '特羅姆瑟北極大教堂跨海夜景，雪夜裡的發光冰山神聖純淨！',
    uploader: '班代冠宇',
    day: 11,
    spotName: '北極大教堂',
    createdAt: '2026-12-29',
    storageType: 'local',
  },
  {
    id: 'sample-p3',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Blue_lagoon%2C_Iceland_02.jpg',
    caption: '藍湖敷著白矽泥面膜泡在溫熱奶藍色泉水，零下溫度的天堂！',
    uploader: '小美',
    day: 12,
    spotName: '藍湖溫泉仙境',
    createdAt: '2026-12-30',
    storageType: 'local',
  },
  {
    id: 'sample-p4',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/26/NewYearFireworks-Reykjavik.jpg',
    caption: '雷克雅維克跨年夜全城狂歡！百萬煙火同時升空迎接新年！',
    uploader: 'Kaine',
    day: 13,
    spotName: '哈爾格林姆教堂跨年煙火',
    createdAt: '2026-12-31',
    storageType: 'local',
  },
];

interface PhotoAlbumViewProps {
  dayPlans: DayPlan[];
}

export const PhotoAlbumView: React.FC<PhotoAlbumViewProps> = ({ dayPlans }) => {
  // Local Photos State
  const [localPhotos, setLocalPhotos] = useState<AlbumPhoto[]>(() => {
    try {
      const saved = localStorage.getItem(ALBUM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load album photos', e);
    }
    return INITIAL_PHOTOS;
  });

  // Auth State (Google Auth via Firebase / Drive)
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [isAuthConnecting, setIsAuthConnecting] = useState(false);

  // Firebase Storage Bucket Photos
  const [firebasePhotos, setFirebasePhotos] = useState<AlbumPhoto[]>([]);
  const [isLoadingFirebasePhotos, setIsLoadingFirebasePhotos] = useState(false);

  // Google Drive Photos
  const [drivePhotos, setDrivePhotos] = useState<AlbumPhoto[]>([]);
  const [isLoadingDrivePhotos, setIsLoadingDrivePhotos] = useState(false);

  // Filter & UI State
  const [sourceFilter, setSourceFilter] = useState<'all' | 'firebase' | 'drive' | 'local'>('all');
  const [filterDay, setFilterDay] = useState<number | 'all'>('all');
  const [filterFolder, setFilterFolder] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Upload Form State: file (本機檔案), folder (整包資料夾), url (圖片網址), path (本機路徑標記)
  const [uploadInputMode, setUploadInputMode] = useState<'file' | 'folder' | 'url' | 'path'>('file');
  const [uploadDestination, setUploadDestination] = useState<'firebase' | 'drive' | 'local'>('firebase');
  const [uploadDay, setUploadDay] = useState<number>(1);
  const [uploadSpot, setUploadSpot] = useState<string>('');
  const [uploadUploader, setUploadUploader] = useState<string>('');
  const [uploadCaption, setUploadCaption] = useState<string>('');
  const [inputImageUrl, setInputImageUrl] = useState<string>('');
  const [inputLocalFolderPath, setInputLocalFolderPath] = useState<string>('');
  const [detectedFolderName, setDetectedFolderName] = useState<string>('');
  const [selectedRawFiles, setSelectedRawFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');

  // Delete Confirmation Modal State (Mandatory Safety Protocol)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    photo: AlbumPhoto | null;
  }>({ isOpen: false, photo: null });

  // Init Firebase Auth Listener
  useEffect(() => {
    const unsubscribeFirebase = initFirebaseAuth(
      (user) => {
        setAuthUser(user);
        if (user.displayName && !uploadUploader) {
          setUploadUploader(user.displayName);
        }
      },
      () => {
        setAuthUser(null);
      }
    );

    const unsubscribeDrive = initDriveAuth(
      (user, token) => {
        setAuthUser(user);
        setDriveToken(token);
      },
      () => {
        setDriveToken(null);
      }
    );

    return () => {
      unsubscribeFirebase();
      unsubscribeDrive();
    };
  }, []);

  // Sync Local photos to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ALBUM_STORAGE_KEY, JSON.stringify(localPhotos));
    } catch {
      // LocalStorage protection
    }
  }, [localPhotos]);

  // Load Real-time Photos from Firebase Storage Bucket
  const refreshFirebaseStoragePhotos = useCallback(async () => {
    try {
      setIsLoadingFirebasePhotos(true);
      const fbItems = await listFirebaseStoragePhotos();
      const converted: AlbumPhoto[] = fbItems.map((item) => ({
        id: `fb-${item.fullPath}`,
        url: item.url,
        caption: item.caption,
        uploader: item.uploader,
        day: item.day,
        spotName: item.spotName,
        createdAt: item.createdAt,
        storageType: 'firebase',
        firebaseFullPath: item.fullPath,
      }));

      setFirebasePhotos(converted);
    } catch (err: any) {
      console.error('Failed to list Firebase storage photos:', err);
    } finally {
      setIsLoadingFirebasePhotos(false);
    }
  }, []);

  // Fetch Firebase Storage photos on component mount
  useEffect(() => {
    refreshFirebaseStoragePhotos();
  }, [refreshFirebaseStoragePhotos]);

  // Load photos from Google Drive when token is present
  const refreshDrivePhotos = useCallback(async (token: string) => {
    try {
      setIsLoadingDrivePhotos(true);
      const folderId = await findOrCreateTripFolder(token);
      const files = await listDriveTripPhotos(token, folderId);

      const converted: AlbumPhoto[] = files.map((file) => {
        let parsedDay = 1;
        let parsedSpot = '北歐極境景點';
        let parsedCaption = file.name;
        let parsedUploader = file.uploaderName || 'Google 雲端旅伴';

        if (file.description) {
          try {
            const meta = JSON.parse(file.description);
            if (meta.day) parsedDay = Number(meta.day);
            if (meta.spotName) parsedSpot = meta.spotName;
            if (meta.caption) parsedCaption = meta.caption;
            if (meta.uploader) parsedUploader = meta.uploader;
          } catch {
            parsedCaption = file.description || file.name;
          }
        }

        const photoUrl =
          file.thumbnailLink?.replace(/=s\d+/, '=s1600') ||
          file.webContentLink ||
          `https://drive.google.com/uc?export=view&id=${file.id}`;

        return {
          id: `drive-${file.id}`,
          url: photoUrl,
          caption: parsedCaption,
          uploader: parsedUploader,
          day: parsedDay,
          spotName: parsedSpot,
          createdAt: file.createdTime
            ? new Date(file.createdTime).toLocaleDateString('zh-TW')
            : '近期',
          storageType: 'drive',
          driveFileId: file.id,
          driveWebViewLink: file.webViewLink,
        };
      });

      setDrivePhotos(converted);
    } catch (err: any) {
      console.error('Failed to load drive photos', err);
    } finally {
      setIsLoadingDrivePhotos(false);
    }
  }, []);

  useEffect(() => {
    if (driveToken) {
      refreshDrivePhotos(driveToken);
    } else {
      setDrivePhotos([]);
    }
  }, [driveToken, refreshDrivePhotos]);

  // Google Login Handler via Firebase & Drive
  const handleGoogleSignIn = async () => {
    try {
      setIsAuthConnecting(true);
      const user = await signInWithGoogleFirebase();
      if (user) {
        setAuthUser(user);
        if (user.displayName) setUploadUploader(user.displayName);
        setToastMessage(`🔥 Google 登入成功！歡迎 ${user.displayName || '旅伴'}`);
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (err: any) {
      console.error('Google Sign in error:', err);
      setToastMessage(`⚠️ 登入失敗：${err.message || '請再試一次'}`);
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsAuthConnecting(false);
    }
  };

  // Google Drive Connection Handler
  const handleConnectDrive = async () => {
    try {
      setIsAuthConnecting(true);
      const res = await signInWithGoogleDrive();
      if (res) {
        setAuthUser(res.user);
        setDriveToken(res.accessToken);
        setToastMessage(`📁 已同步 Google 雲端硬碟共享資料夾！`);
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (err: any) {
      console.error('Drive connection error:', err);
    } finally {
      setIsAuthConnecting(false);
    }
  };

  // Logout Handler
  const handleSignOut = async () => {
    await logoutFirebase();
    await logoutGoogleDrive();
    setAuthUser(null);
    setDriveToken(null);
    setDrivePhotos([]);
    setToastMessage('已成功登出帳號');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Process raw file selection
  const processFiles = (files: FileList | File[], folderPathName?: string) => {
    const valid = Array.from(files).filter(
      (f) => f.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|heic)$/i.test(f.name)
    );
    if (valid.length === 0) {
      alert('請選擇有效的圖片檔案 (JPG / PNG / WebP / HEIC)');
      return;
    }

    setSelectedRawFiles((prev) => [...prev, ...valid]);

    valid.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadPreviews((prev) => [...prev, e.target?.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (folderPathName && !inputLocalFolderPath) {
      setInputLocalFolderPath(folderPathName);
    }
  };

  // Process folder upload using webkitdirectory
  const processFolderUpload = (files: FileList | File[]) => {
    const fileList = Array.from(files);
    const valid = fileList.filter(
      (f) => f.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|heic)$/i.test(f.name)
    );
    if (valid.length === 0) {
      alert('所選資料夾中未找到相容的圖片檔案 (JPG / PNG / WebP / HEIC)');
      return;
    }

    // Attempt to extract folder name from relative path
    const firstRel = (valid[0] as any)?.webkitRelativePath || '';
    let extractedFolder = '';
    if (firstRel) {
      const parts = firstRel.split('/');
      if (parts.length > 1) {
        extractedFolder = parts.slice(0, -1).join('/');
        setDetectedFolderName(extractedFolder);
        setInputLocalFolderPath(extractedFolder);
      }
    }

    processFiles(valid, extractedFolder);
    setToastMessage(`📁 已成功從資料夾讀取 ${valid.length} 張圖片！`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add Image URL(s) to upload queue
  const handleAddImageUrl = () => {
    if (!inputImageUrl.trim()) {
      alert('請輸入圖片網址');
      return;
    }
    const lines = inputImageUrl
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const validUrls = lines.filter((url) => /^https?:\/\//i.test(url) || url.startsWith('data:image/') || url.startsWith('/'));

    if (validUrls.length === 0) {
      alert('請輸入以 http:// 或 https:// 開頭的有效圖片網址');
      return;
    }

    setUploadPreviews((prev) => [...prev, ...validUrls]);
    setInputImageUrl('');
    setToastMessage(`🌐 已成功解析並加入 ${validUrls.length} 個相片網址！`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Submit Upload (Firebase Storage / Google Drive / Local)
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadPreviews.length === 0) {
      alert('請先選擇至少一張相片！');
      return;
    }

    setIsUploading(true);

    try {
      if (uploadDestination === 'firebase' && selectedRawFiles.length > 0) {
        // 1. Upload to Firebase Storage Bucket
        for (let i = 0; i < selectedRawFiles.length; i++) {
          const file = selectedRawFiles[i];
          setUploadProgressText(`正在上傳第 ${i + 1} / ${selectedRawFiles.length} 張相片至 Firebase Storage...`);

          await uploadPhotoToFirebaseStorage(
            file,
            file.name,
            uploadDay,
            uploadSpot.trim() || `Day ${uploadDay} 行程`,
            uploadCaption.trim() || `北歐極境留影 #${i + 1}`,
            uploadUploader.trim() || authUser?.displayName || '北歐旅伴'
          );
        }

        await refreshFirebaseStoragePhotos();
        setToastMessage(`🔥 成功上傳 ${selectedRawFiles.length} 張相片至 Firebase Storage 專屬儲存桶！`);
      } else if (uploadDestination === 'drive' && selectedRawFiles.length > 0) {
        // 2. Upload to Google Drive Shared Folder
        let token = driveToken;
        if (!token) {
          const driveRes = await signInWithGoogleDrive();
          if (driveRes) {
            token = driveRes.accessToken;
            setDriveToken(token);
          } else {
            throw new Error('未取得 Google 雲端硬碟授權');
          }
        }

        for (let i = 0; i < selectedRawFiles.length; i++) {
          const file = selectedRawFiles[i];
          setUploadProgressText(`正在上傳第 ${i + 1} / ${selectedRawFiles.length} 張相片至 Google Drive...`);

          await uploadPhotoToDrive(
            token,
            file,
            file.name,
            uploadDay,
            uploadSpot.trim() || `Day ${uploadDay} 行程`,
            uploadCaption.trim() || `北歐極境留影 #${i + 1}`,
            uploadUploader.trim() || authUser?.displayName || '北歐旅伴'
          );
        }

        await refreshDrivePhotos(token);
        setToastMessage(`📁 成功上傳 ${selectedRawFiles.length} 張相片至 Google 雲端硬碟！`);
      } else {
        // 3. Save to Local Photos (supports local file previews, folder batch, and direct URLs)
        const newLocal: AlbumPhoto[] = [];
        const folderTag = inputLocalFolderPath.trim() || (detectedFolderName ? detectedFolderName : undefined);
        const sourceMode = uploadInputMode === 'url' ? 'url' : uploadInputMode === 'folder' ? 'folder' : 'upload';

        for (let i = 0; i < uploadPreviews.length; i++) {
          const preview = uploadPreviews[i];
          const photoId = `local_photo_${Date.now()}_${i}`;
          if (preview.startsWith('data:image')) {
            try {
              await saveImageToDB(photoId, preview);
            } catch {
              // DB fallback
            }
          }

          newLocal.push({
            id: photoId,
            url: preview,
            caption: uploadCaption.trim() || `北歐留影 #${i + 1}`,
            uploader: uploadUploader.trim() || (authUser?.displayName || '本機旅伴'),
            day: uploadDay,
            spotName: uploadSpot.trim() || `Day ${uploadDay} 行程`,
            createdAt: new Date().toLocaleDateString('zh-TW'),
            storageType: 'local',
            localFolderPath: folderTag,
            sourceType: sourceMode,
          });
        }
        setLocalPhotos((prev) => [...newLocal, ...prev]);
        setToastMessage(
          sourceMode === 'url'
            ? `🌐 成功儲存 ${newLocal.length} 張網路相片網址！`
            : sourceMode === 'folder'
            ? `📁 成功儲存資料夾【${folderTag || '本機資料夾'}】中的 ${newLocal.length} 張相片！`
            : `✨ 成功儲存 ${newLocal.length} 張相片至本機相簿！`
        );
      }

      // Reset form
      setIsUploadModalOpen(false);
      setSelectedRawFiles([]);
      setUploadPreviews([]);
      setUploadCaption('');
      setUploadSpot('');
      setInputImageUrl('');
      setInputLocalFolderPath('');
      setDetectedFolderName('');
    } catch (err: any) {
      console.error('Upload failed:', err);
      alert(`上傳失敗：${err.message || '請檢查網路連線'}`);
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Trigger Delete Confirmation Modal
  const requestDeletePhoto = (photo: AlbumPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmation({ isOpen: true, photo });
  };

  // Confirm Delete Operation (Required safety protocol for Firebase / Drive Data)
  const executeDeletePhoto = async () => {
    const photo = deleteConfirmation.photo;
    if (!photo) return;

    try {
      if (photo.storageType === 'firebase' && photo.firebaseFullPath) {
        await deletePhotoFromFirebaseStorage(photo.firebaseFullPath);
        setFirebasePhotos((prev) => prev.filter((p) => p.id !== photo.id));
        setToastMessage('🗑️ 已從 Firebase Storage 儲存桶中刪除該相片');
      } else if (photo.storageType === 'drive' && photo.driveFileId) {
        if (!driveToken) {
          alert('請先連線 Google 雲端硬碟才能刪除雲端相片。');
          return;
        }
        await deletePhotoFromDrive(driveToken, photo.driveFileId);
        setDrivePhotos((prev) => prev.filter((p) => p.id !== photo.id));
        setToastMessage('🗑️ 已從 Google 雲端硬碟刪除該相片');
      } else {
        await deleteImageFromDB(photo.id);
        setLocalPhotos((prev) => prev.filter((p) => p.id !== photo.id));
        setToastMessage('🗑️ 已刪除本機相片');
      }

      if (activeLightboxIndex !== null) {
        setActiveLightboxIndex(null);
      }
    } catch (err: any) {
      alert(`刪除失敗：${err.message || '請再試一次'}`);
    } finally {
      setDeleteConfirmation({ isOpen: false, photo: null });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Combined photo list based on active tab and day filter
  const allMergedPhotos = [...firebasePhotos, ...drivePhotos, ...localPhotos];

  const availableFolders = Array.from(
    new Set(allMergedPhotos.map((p) => p.localFolderPath).filter(Boolean) as string[])
  );

  const displayedPhotos = allMergedPhotos.filter((photo) => {
    // Source filter
    if (sourceFilter === 'firebase' && photo.storageType !== 'firebase') return false;
    if (sourceFilter === 'drive' && photo.storageType !== 'drive') return false;
    if (sourceFilter === 'local' && photo.storageType !== 'local') return false;

    // Day filter
    if (filterDay !== 'all' && photo.day !== filterDay) return false;

    // Folder filter
    if (filterFolder !== 'all' && photo.localFolderPath !== filterFolder) return false;

    return true;
  });

  const activePhoto =
    activeLightboxIndex !== null ? displayedPhotos[activeLightboxIndex] : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900/95 text-white font-bold rounded-2xl shadow-2xl border border-orange-500/50 backdrop-blur-xl animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs sm:text-sm">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner & Firebase Storage + Google Auth Control Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Firebase Storage 專屬雲端儲存桶 · 共 {displayedPhotos.length} 張 (Firebase {firebasePhotos.length} / Drive {drivePhotos.length} / 本機 {localPhotos.length})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
            北歐 15 天極境共享相簿 & Firebase 雲端儲存桶
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            登入 Google 帳號即可將旅途照片實時同步至專屬的 <strong className="text-amber-300">Firebase Storage 儲存桶</strong> (`gen-lang-client-0068568449.firebasestorage.app`)，所有旅伴皆可即時查看與下載原畫質照片！
          </p>
        </div>

        {/* Google Auth Status & Account Control */}
        <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {authUser ? (
            <div className="flex items-center gap-2.5 bg-slate-950/80 border border-amber-500/40 p-2 pl-3 rounded-2xl shadow-lg backdrop-blur-md">
              {authUser.photoURL ? (
                <img
                  src={authUser.photoURL}
                  alt={authUser.displayName || 'Google User'}
                  className="w-8 h-8 rounded-full border border-amber-400"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                  {authUser.displayName?.[0] || 'G'}
                </div>
              )}
              <div className="text-left">
                <span className="text-xs font-bold text-white block truncate max-w-[130px]">
                  {authUser.displayName || 'Google 旅伴'}
                </span>
                <span className="text-[10px] text-amber-400 flex items-center gap-1 font-mono">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>Firebase Storage 已同步</span>
                </span>
              </div>

              <button
                onClick={handleSignOut}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors ml-1"
                title="登出 Google 帳號"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Google Sign-In Official Material Button */
            <button
              onClick={handleGoogleSignIn}
              disabled={isAuthConnecting}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95 border border-slate-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isAuthConnecting ? '登入中...' : 'Google 帳號快速登入'}</span>
            </button>
          )}

          {/* Direct PNG / JPG File Selector Button */}
          <label className="cursor-pointer px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 whitespace-nowrap">
            <FolderUp className="w-4 h-4 text-slate-950" />
            <span>📸 上傳 PNG / JPG 照片</span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/heic, image/*"
              multiple
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  processFiles(e.target.files);
                  setUploadDestination('firebase');
                  setIsUploadModalOpen(true);
                }
              }}
              className="hidden"
            />
          </label>

          {/* Primary Upload Button */}
          <button
            onClick={() => {
              setUploadDestination('firebase');
              setIsUploadModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:opacity-95 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <CloudUpload className="w-4 h-4 text-slate-950" />
            <span>開啟雲端工作室</span>
          </button>
        </div>
      </div>

      {/* 2. Source Tabs & Day Filter Strip */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Source Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: `全部相片 (${allMergedPhotos.length})`, icon: Sparkles },
            { id: 'firebase', label: `🔥 Firebase Storage (${firebasePhotos.length})`, icon: Flame },
            { id: 'drive', label: `📁 Google Drive (${drivePhotos.length})`, icon: Cloud },
            { id: 'local', label: `📸 本機相簿 (${localPhotos.length})`, icon: Folder },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSourceFilter(tab.id as 'all' | 'firebase' | 'drive' | 'local')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  sourceFilter === tab.id
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              refreshFirebaseStoragePhotos();
              if (driveToken) refreshDrivePhotos(driveToken);
            }}
            disabled={isLoadingFirebasePhotos || isLoadingDrivePhotos}
            className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl transition-colors"
            title="重新實時同步雲端儲存桶"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFirebasePhotos || isLoadingDrivePhotos ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>

        {/* 15 Days Filter Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterDay('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
              filterDay === 'all'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            全 15 天
          </button>
          {dayPlans.map((dp) => (
            <button
              key={dp.dayNumber}
              onClick={() => setFilterDay(dp.dayNumber)}
              className={`px-2.5 py-1 rounded-xl text-xs shrink-0 transition-colors font-mono ${
                filterDay === dp.dayNumber
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              D{dp.dayNumber}
            </button>
          ))}

          {/* Local Folder Filter */}
          {availableFolders.length > 0 && (
            <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-slate-800">
              <FolderSearch className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <select
                value={filterFolder}
                onChange={(e) => setFilterFolder(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-1 focus:outline-none"
              >
                <option value="all">全部資料夾 ({availableFolders.length})</option>
                {availableFolders.map((f) => (
                  <option key={f} value={f}>
                    📁 {f}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 3. Photo Cards Masonry Grid */}
      {displayedPhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayedPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setActiveLightboxIndex(index)}
              className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Container with Badges */}
              <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-950">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Day Badge */}
                <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/80 text-[10px] font-mono font-bold text-amber-300">
                  Day {photo.day}
                </div>

                {/* Storage Type Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  {photo.storageType === 'firebase' ? (
                    <span className="bg-amber-950/85 backdrop-blur-md px-2 py-1 rounded-full border border-amber-500/50 text-[9px] font-mono font-bold text-amber-300 flex items-center gap-1 shadow-md">
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>Firebase Storage</span>
                    </span>
                  ) : photo.storageType === 'drive' ? (
                    <span className="bg-emerald-950/85 backdrop-blur-md px-2 py-1 rounded-full border border-emerald-500/40 text-[9px] font-mono font-bold text-emerald-300 flex items-center gap-1 shadow-md">
                      <Cloud className="w-3 h-3" />
                      <span>Google Drive</span>
                    </span>
                  ) : (
                    <span className="bg-slate-950/85 backdrop-blur-md px-2 py-1 rounded-full border border-slate-700 text-[9px] font-mono font-bold text-slate-300 flex items-center gap-1">
                      <Folder className="w-3 h-3" />
                      <span>本機</span>
                    </span>
                  )}
                </div>

                {/* Spot Tag on Image Bottom */}
                {photo.spotName && (
                  <span className="absolute bottom-2 left-3 text-xs font-serif font-bold text-amber-200 truncate max-w-[85%] drop-shadow-md">
                    📍 {photo.spotName}
                  </span>
                )}
              </div>

              {/* Photo Description & Details */}
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed line-clamp-2">
                    {photo.caption}
                  </p>

                  {/* Local Folder / URL Source Tag */}
                  {photo.localFolderPath && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded-md border border-purple-800/40 truncate font-mono" title={`本機資料夾：${photo.localFolderPath}`}>
                      <FolderSearch className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate">{photo.localFolderPath}</span>
                    </div>
                  )}
                  {photo.sourceType === 'url' && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded-md border border-cyan-800/40 truncate font-mono">
                      <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">外部網址相片</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 truncate max-w-[120px]">
                    <UserIcon className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{photo.uploader}</span>
                  </span>

                  <div className="flex items-center gap-1 shrink-0">
                    {photo.driveWebViewLink && (
                      <a
                        href={photo.driveWebViewLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-slate-400 hover:text-amber-400 rounded transition-colors"
                        title="在 Google Drive 中開啟"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={(e) => requestDeletePhoto(photo, e)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      title="刪除相片"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <ImageIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-white">
              目前尚無符合篩選條件的相片
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              點擊右上角「上傳雲端相片」即可同步上傳至 Firebase Storage 專屬儲存桶！
            </p>
          </div>
        </div>
      )}

      {/* 4. Fullscreen Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActiveLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in select-none"
        >
          {/* Lightbox Top Header */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl flex items-center justify-between text-white"
          >
            <div className="flex items-center gap-3">
              <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-mono font-bold border border-amber-500/40">
                Day {activePhoto.day} · {activePhoto.spotName || '北歐景點'}
              </span>
              {activePhoto.storageType === 'firebase' ? (
                <span className="text-xs text-amber-400 flex items-center gap-1 font-mono">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Firebase Storage 專屬儲存桶</span>
                </span>
              ) : activePhoto.storageType === 'drive' ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Google Drive 雲端硬碟</span>
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              {activePhoto.driveWebViewLink && (
                <a
                  href={activePhoto.driveWebViewLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>在 Google 雲端硬碟開啟</span>
                </a>
              )}
              <button
                onClick={() => setActiveLightboxIndex(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Image Preview with Prev/Next buttons */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto max-w-5xl max-h-[75vh] flex items-center justify-center"
          >
            {activeLightboxIndex !== null && activeLightboxIndex > 0 && (
              <button
                onClick={() => setActiveLightboxIndex(activeLightboxIndex - 1)}
                className="absolute -left-12 sm:-left-16 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white shadow-xl transition-transform hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={activePhoto.url}
              alt={activePhoto.caption}
              className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />

            {activeLightboxIndex !== null &&
              activeLightboxIndex < displayedPhotos.length - 1 && (
                <button
                  onClick={() => setActiveLightboxIndex(activeLightboxIndex + 1)}
                  className="absolute -right-12 sm:-right-16 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white shadow-xl transition-transform hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
          </div>

          {/* Lightbox Bottom Footer Caption */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl text-center bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl"
          >
            <p className="text-sm sm:text-base font-serif text-white leading-relaxed">
              {activePhoto.caption}
            </p>
            <span className="text-xs text-slate-400 font-sans mt-1 block">
              由 {activePhoto.uploader} 於 {activePhoto.createdAt} 上傳
            </span>

            {activePhoto.localFolderPath && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-purple-300 bg-purple-950/60 border border-purple-800/60 px-3 py-1 rounded-full font-mono">
                <FolderSearch className="w-3.5 h-3.5 text-purple-400" />
                <span>本機存放資料夾：{activePhoto.localFolderPath}</span>
              </div>
            )}
            {activePhoto.sourceType === 'url' && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full font-mono">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate max-w-sm">相片網路來源：{activePhoto.url}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Upload Modal Studio */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
                  <CloudUpload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    上傳相片至雲端與共享相簿
                  </h3>
                  <span className="text-xs text-slate-400">
                    支援直傳 Firebase Storage 儲存桶、Google Drive 或儲存於本機
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Destination Radio Choice */}
              <div>
                <label className="text-xs font-mono font-bold text-amber-400 block mb-2">
                  選擇上傳儲存目的地：
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setUploadDestination('firebase')}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      uploadDestination === 'firebase'
                        ? 'bg-amber-500/20 border-amber-400 text-white ring-2 ring-amber-400/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Flame className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">Firebase Storage</span>
                      <span className="text-[9px] text-slate-400 block">
                        專屬 GCP 雲端儲存桶
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadDestination('drive')}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      uploadDestination === 'drive'
                        ? 'bg-emerald-500/20 border-emerald-400 text-white ring-2 ring-emerald-400/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Cloud className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">Google Drive</span>
                      <span className="text-[9px] text-slate-400 block">
                        共享資料夾
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadDestination('local')}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      uploadDestination === 'local'
                        ? 'bg-purple-500/20 border-purple-400 text-white ring-2 ring-purple-400/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Folder className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">本機相簿</span>
                      <span className="text-[9px] text-slate-400 block">
                        瀏覽器快取
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Source Input Mode Switcher: 檔案上傳 / 整包資料夾 / 圖片網址 / 本機路徑標記 */}
              <div>
                <label className="text-xs font-mono font-bold text-amber-400 block mb-2">
                  相片來源模式：
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setUploadInputMode('file')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      uploadInputMode === 'file'
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <FolderUp className="w-3.5 h-3.5" />
                    <span>本機檔案上傳</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadInputMode('folder')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      uploadInputMode === 'folder'
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>選擇本機資料夾</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadInputMode('url')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      uploadInputMode === 'url'
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>網路相片網址</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadInputMode('path')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      uploadInputMode === 'path'
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <FolderSearch className="w-3.5 h-3.5" />
                    <span>本機路徑標記</span>
                  </button>
                </div>

                {/* Mode 1: File Upload */}
                {uploadInputMode === 'file' && (
                  <div className="border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-2xl p-6 text-center bg-slate-950/60 transition-colors">
                    <input
                      type="file"
                      id="album-file-input"
                      multiple
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/heic, image/*"
                      onChange={(e) => {
                        if (e.target.files) processFiles(e.target.files);
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="album-file-input"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center">
                        <FolderUp className="w-6 h-6" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white">
                        點擊或拖曳選擇單張或多張相片 (PNG / JPG / JPEG / WebP)
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {uploadPreviews.length > 0
                          ? `已選擇 ${uploadPreviews.length} 張照片 (準備上傳)`
                          : '支援高畫質原檔與批量選擇'}
                      </span>
                    </label>
                  </div>
                )}

                {/* Mode 2: Folder Upload */}
                {uploadInputMode === 'folder' && (
                  <div className="border-2 border-dashed border-purple-500/50 hover:border-purple-400 rounded-2xl p-6 text-center bg-purple-950/20 transition-colors">
                    <input
                      type="file"
                      id="album-folder-input"
                      {...({ webkitdirectory: '', directory: '', multiple: true } as any)}
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          processFolderUpload(e.target.files);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="album-folder-input"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-purple-900/50 text-purple-300 flex items-center justify-center">
                        <FolderPlus className="w-6 h-6" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white">
                        選擇整包本機相簿資料夾 (自動讀取內含所有照片)
                      </span>
                      <span className="text-[11px] text-purple-300 font-mono">
                        {detectedFolderName
                          ? `已偵測資料夾：${detectedFolderName} (共載入 ${uploadPreviews.length} 張照片)`
                          : '瀏覽器將讀取資料夾內所有 JPG / PNG / WebP 照片並保留目錄名稱'}
                      </span>
                    </label>
                  </div>
                )}

                {/* Mode 3: Web Image URL Input */}
                {uploadInputMode === 'url' && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <span>輸入網路相片網址 (支援多筆換行或逗號分隔)</span>
                      </span>
                      <span className="text-[10px] text-slate-400">支援 Unsplash, CDN, 外部圖床</span>
                    </div>
                    <textarea
                      rows={3}
                      value={inputImageUrl}
                      onChange={(e) => setInputImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-1517411032315...&#10;https://example.com/photo2.jpg"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>解析並加入預覽列表</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Mode 4: Local Folder Path Reference */}
                {uploadInputMode === 'path' && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <FolderSearch className="w-4 h-4 text-purple-400" />
                        <span>本機存放資料夾路徑標記 (Local Directory Path)</span>
                      </span>
                      <span className="text-[10px] text-slate-400">方便日後追蹤高解析 RAW 備份硬碟</span>
                    </div>
                    <input
                      type="text"
                      value={inputLocalFolderPath}
                      onChange={(e) => setInputLocalFolderPath(e.target.value)}
                      placeholder="例如：D:\Travel\2026_Nordic_Xmas\ 或 /Users/kaine/Pictures/Lapland/"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                      <span>快速常用範例：</span>
                      {[
                        'D:\\Photos\\Nordic2026\\',
                        '/Users/Photos/Lapland/',
                        'DCIM/Nordic_Xmas/',
                        '本機相簿/北歐15日極境/',
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setInputLocalFolderPath(preset)}
                          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 font-mono transition-colors"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Previews Strip */}
              {uploadPreviews.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-950 rounded-2xl border border-slate-800">
                  {uploadPreviews.map((url, idx) => (
                    <div key={idx} className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden group">
                      <img src={url} alt="預覽" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadPreviews((prev) => prev.filter((_, i) => i !== idx));
                          setSelectedRawFiles((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-1 right-1 bg-black/80 rounded-full p-0.5 text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Metadata Fields: Day, Spot, Uploader, Caption */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    旅程天數：
                  </label>
                  <select
                    value={uploadDay}
                    onChange={(e) => setUploadDay(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {dayPlans.map((dp) => (
                      <option key={dp.dayNumber} value={dp.dayNumber}>
                        Day {dp.dayNumber} - {dp.title.split(' ')[0]} ({dp.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    景點名稱：
                  </label>
                  <input
                    type="text"
                    value={uploadSpot}
                    onChange={(e) => setUploadSpot(e.target.value)}
                    placeholder="如：新港運河、玻璃屋、極光..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  上傳者暱稱：
                </label>
                <input
                  type="text"
                  value={uploadUploader}
                  onChange={(e) => setUploadUploader(e.target.value)}
                  placeholder="如：Kaine、小明..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  相片故事與心得描述：
                </label>
                <textarea
                  rows={3}
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="寫下這張照片拍攝時的難忘心情或趣事..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none"
                />
              </div>

              {/* Submit Button & Progress */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUploading || uploadPreviews.length === 0}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:opacity-95 text-slate-950 font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{uploadProgressText || '正在上傳處理中...'}</span>
                    </>
                  ) : (
                    <>
                      <CloudUpload className="w-4 h-4" />
                      <span>
                        確認上傳 {uploadPreviews.length} 張相片至{' '}
                        {uploadDestination === 'firebase'
                          ? 'Firebase Storage 儲存桶'
                          : uploadDestination === 'drive'
                          ? 'Google 雲端硬碟'
                          : '本機相簿'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Mandatory Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && deleteConfirmation.photo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-white">
                確定要刪除這張相片嗎？
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {deleteConfirmation.photo.storageType === 'firebase'
                ? '此操作將直接從專屬 Firebase Storage 儲存桶中永久移除該相片，無法復原。'
                : deleteConfirmation.photo.storageType === 'drive'
                ? '此操作將從 Google 雲端硬碟共享資料夾中永久移除該相片。'
                : '此操作將從本機相簿中移除該照片。'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmation({ isOpen: false, photo: null })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={executeDeletePhoto}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>確認刪除</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
