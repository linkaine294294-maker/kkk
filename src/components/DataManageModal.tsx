import React, { useRef, useState } from 'react';
import { Spot, DayPlan } from '../types/itinerary';
import {
  Download,
  Upload,
  RotateCcw,
  X,
  AlertTriangle,
  FileJson,
  CheckCircle2,
} from 'lucide-react';

interface DataManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  spots: Spot[];
  dayPlans: DayPlan[];
  onImportSpots: (newSpots: Spot[]) => void;
  onResetToDefault: () => void;
}

export const DataManageModal: React.FC<DataManageModalProps> = ({
  isOpen,
  onClose,
  spots,
  dayPlans,
  onImportSpots,
  onResetToDefault,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Export JSON
  const handleExportJSON = () => {
    const exportData = {
      title: '北歐奢華聖誕跨年之旅 (15天行程)',
      exportedAt: new Date().toISOString(),
      version: '1.0',
      totalSpots: spots.length,
      spots,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `nordic_trip_itinerary_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSuccessMsg('已成功匯出 JSON 行程檔案，可傳送分享給旅伴！');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // Import JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && Array.isArray(json.spots)) {
          if (
            confirm(
              `檔案包含 ${json.spots.length} 個景點，是否確認匯入並更新目前行程？`
            )
          ) {
            onImportSpots(json.spots);
            setSuccessMsg(`成功匯入 ${json.spots.length} 個景點！`);
            setTimeout(() => {
              setSuccessMsg(null);
              onClose();
            }, 1200);
          }
        } else if (Array.isArray(json)) {
          if (
            confirm(
              `檔案包含 ${json.length} 個景點，是否確認匯入並更新目前行程？`
            )
          ) {
            onImportSpots(json);
            setSuccessMsg(`成功匯入 ${json.length} 個景點！`);
            setTimeout(() => {
              setSuccessMsg(null);
              onClose();
            }, 1200);
          }
        } else {
          alert('匯入失敗：JSON 格式不符，缺少 spots 清單。');
        }
      } catch (err) {
        console.error('Import parse error:', err);
        alert('檔案解析錯誤，請確認檔案為正確格式的 JSON 檔案。');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileJson className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                行程備份與組員分享管理
              </h3>
              <p className="text-xs text-slate-400">
                匯出或匯入 JSON，隨時同步彼此客製化修改後的精彩景點
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback message */}
        {successMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Action Options */}
        <div className="space-y-3 text-sm font-sans">
          {/* Export */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-white">匯出行程 JSON 檔案</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                將目前的 {spots.length} 個景點與自訂路線完整備份儲存成 .json 檔
              </p>
            </div>
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>匯出 JSON</span>
            </button>
          </div>

          {/* Import */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-white">匯入組員的行程 JSON</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                選擇旅伴傳送給您的行程 .json 檔進行載入與整合
              </p>
            </div>
            <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>選擇檔案匯入</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-rose-300">重設為官方預設行程</h4>
              <p className="text-xs text-rose-400/80 mt-0.5">
                清空所有自行增刪的景點，還原至出廠設定的 15 天奢華北歐行程
              </p>
            </div>
            <button
              onClick={() => setResetConfirmOpen(true)}
              className="px-3.5 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-800 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>重設行程</span>
            </button>
          </div>
        </div>

        {/* Secondary Confirmation Dialog for Reset */}
        {resetConfirmOpen && (
          <div className="p-4 rounded-xl bg-rose-950/90 border border-rose-500/80 text-rose-100 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-rose-200">
                  二次確認：確定要重設行程嗎？
                </h5>
                <p className="text-xs text-rose-300 mt-1">
                  這將會清除您新增、修改過的所有景點，此動作無法復原！
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onResetToDefault();
                  setResetConfirmOpen(false);
                  setSuccessMsg('已成功還原為預設行程！');
                  setTimeout(() => {
                    setSuccessMsg(null);
                    onClose();
                  }, 1200);
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
              >
                確認重設為預設
              </button>
            </div>
          </div>
        )}

        {/* Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
