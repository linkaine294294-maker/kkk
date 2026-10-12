import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  Plus,
  Trash2,
  Sparkles,
  Info,
  CheckCircle2,
  Shield,
  Plane,
  Building,
  Utensils,
  Ticket,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import {
  BUDGET_CATEGORIES,
  DAILY_BUDGET_DATA,
  CLASS_SIZE,
  TOTAL_BUDGET_PER_PERSON,
  TOTAL_BUDGET_CLASS,
  BudgetCategory,
  DailyBudgetExpense,
} from '../data/budgetData';

interface UserExpenseItem {
  id: string;
  day: number;
  category: string;
  note: string;
  amountNTD: number;
  date: string;
}

const USER_EXPENSES_KEY = 'nordic_user_actual_expenses_v1';

export const BudgetTrackerView: React.FC = () => {
  // Mode: 'person' (每人均攤) | 'class' (全班 33 人總額)
  const [viewScope, setViewScope] = useState<'person' | 'class'>('person');
  // Sub-tab: 'charts' | 'daily' | 'categories' | 'actual'
  const [activeSubTab, setActiveSubTab] = useState<'charts' | 'daily' | 'categories' | 'actual'>('charts');
  const [selectedDayHover, setSelectedDayHover] = useState<DailyBudgetExpense | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>('accommodation');

  // Actual User Expense Tracker State
  const [userExpenses, setUserExpenses] = useState<UserExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem(USER_EXPENSES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'exp-1',
        day: 2,
        category: '紀念品',
        note: 'Tivoli 聖誕限定小木偶與皇家哥本哈根瓷器',
        amountNTD: 2400,
        date: '2026-12-20',
      },
      {
        id: 'exp-2',
        day: 5,
        category: '極地裝備',
        note: '拉普蘭極地專業保暖手套與羊毛襪',
        amountNTD: 1850,
        date: '2026-12-23',
      },
    ];
  });

  // New Expense Form State
  const [newExpDay, setNewExpDay] = useState<number>(1);
  const [newExpCategory, setNewExpCategory] = useState<string>('個人餐飲');
  const [newExpNote, setNewExpNote] = useState<string>('');
  const [newExpAmount, setNewExpAmount] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(USER_EXPENSES_KEY, JSON.stringify(userExpenses));
    } catch {
      // storage protection
    }
  }, [userExpenses]);

  const multiplier = viewScope === 'person' ? 1 : CLASS_SIZE;

  const formatNTD = (num: number) => {
    return 'NT$ ' + Math.round(num * multiplier).toLocaleString('zh-TW');
  };

  const formatRawNTD = (num: number) => {
    return 'NT$ ' + Math.round(num).toLocaleString('zh-TW');
  };

  // Add User Expense Handler
  const handleAddUserExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newExpAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('請輸入有效金額！');
      return;
    }

    const newItem: UserExpenseItem = {
      id: `exp-${Date.now()}`,
      day: newExpDay,
      category: newExpCategory,
      note: newExpNote.trim() || `${newExpCategory} 支出`,
      amountNTD: amt,
      date: new Date().toISOString().split('T')[0],
    };

    setUserExpenses((prev) => [newItem, ...prev]);
    setNewExpNote('');
    setNewExpAmount('');
    setToastMessage('💰 已成功記錄一筆實際個人支出！');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteUserExpense = (id: string) => {
    setUserExpenses((prev) => prev.filter((item) => item.id !== id));
    setToastMessage('🗑️ 已刪除此筆記帳');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const totalUserActualSpent = userExpenses.reduce((sum, item) => sum + item.amountNTD, 0);

  // Export CSV Report
  const handleExportCSV = () => {
    let csvContent = '\uFEFF'; // UTF-8 BOM for Excel
    csvContent += '類別,每人金額(NT$),全班33人總額(NT$),占比(%)\n';
    BUDGET_CATEGORIES.forEach((cat) => {
      csvContent += `"${cat.name}",${cat.amountPerPerson},${cat.classTotal},${cat.percentage}%\n`;
    });
    csvContent += `\n"總計",${TOTAL_BUDGET_PER_PERSON},${TOTAL_BUDGET_CLASS},100%\n\n`;

    csvContent += '天數,日期,城市,國家,住宿飯店,住宿費用(NT$),午餐費用(NT$),晚餐費用(NT$),餐食說明,交通費用(NT$),活動門票(NT$),當日合計(NT$),累積消耗(NT$)\n';
    DAILY_BUDGET_DATA.forEach((d) => {
      csvContent += `${d.day},"${d.date}","${d.city}","${d.country}","${d.hotelName}",${d.hotelCost},${d.lunchCost},${d.dinnerCost},"${d.mealNote}",${d.transportCost},${d.activityCost},${d.dailyTotal},${d.cumulativeTotal}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `北歐15日極境之旅_預算消耗報表_${viewScope === 'person' ? '個人均攤' : '全班總額'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage('📥 已匯出完整預算報表 CSV！');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Find max daily cost for chart scaling
  const maxDailyCost = Math.max(...DAILY_BUDGET_DATA.map((d) => d.dailyTotal));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white font-bold rounded-2xl shadow-2xl border border-emerald-500/50 backdrop-blur-xl animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner & Scope Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              北歐 15 天奢華極境預算追蹤與消耗分析 · 全班 33 人核定精算版
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
            <span>預算消耗與財務儀表板</span>
            <span className="text-xs font-mono font-normal text-slate-400 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
              17 間雙人奢華套房 · 14 晚頂級宿所
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            完整整合國際航段、極地轉機、五星宮殿與玻璃屋、米其林星級晚宴、全額申根保險與 5% 彈性應急預備金。
          </p>
        </div>

        {/* Action Controls: Scope Switcher & Export */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Scope Toggle: Person vs Class */}
          <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center">
            <button
              onClick={() => setViewScope('person')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewScope === 'person'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              每人均攤 (NT$)
            </button>
            <button
              onClick={() => setViewScope('class')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewScope === 'class'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              全班 33 人總預算 (NT$)
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            title="匯出預算表為 CSV 檔案"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">匯出報表</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/40 shadow-lg">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
            {viewScope === 'person' ? '每人總預算 (PER PERSON)' : '全班總預算 (CLASS 33 PPL)'}
          </span>
          <div className="text-xl sm:text-2xl font-mono font-black text-white">
            {viewScope === 'person' ? formatRawNTD(TOTAL_BUDGET_PER_PERSON) : formatRawNTD(TOTAL_BUDGET_CLASS)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {viewScope === 'person' ? '包含 5% 彈性預備金 NT$ 26,322' : '約 1,824 萬新台幣 (含 86.8 萬預備金)'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/40 shadow-lg">
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block mb-1">
            住宿佔比最高 (45.2%)
          </span>
          <div className="text-xl sm:text-2xl font-mono font-black text-purple-300">
            {formatNTD(250120)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            14 晚頂級住宿（玻璃屋＋藍湖套房）
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-lg">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
            交通總支出 (23.7%)
          </span>
          <div className="text-xl sm:text-2xl font-mono font-black text-cyan-300">
            {formatNTD(131141)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            長程機票＋6 段歐洲內陸與包車
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-lg">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
            餐食美饌總計 (14.2%)
          </span>
          <div className="text-xl sm:text-2xl font-mono font-black text-amber-300">
            {formatNTD(78750)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            含平安夜晚宴＋星級盛宴＋跨年套餐
          </span>
        </div>
      </div>

      {/* 3. Sub-Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('charts')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'charts'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>每日預算消耗圖表</span>
        </button>

        <button
          onClick={() => setActiveSubTab('daily')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'daily'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>十五日花費時間軸</span>
        </button>

        <button
          onClick={() => setActiveSubTab('categories')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'categories'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>七大分類詳細明細</span>
        </button>

        <button
          onClick={() => setActiveSubTab('actual')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'actual'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>個人實際記帳本 ({userExpenses.length})</span>
        </button>
      </div>

      {/* 4. SUB-TAB 1: 每日與總行程預算消耗圖表 (CHARTS) */}
      {activeSubTab === 'charts' && (
        <div className="space-y-6">
          {/* Chart Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            <div>
              <h3 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2">
                <span>15 天每日預算消耗分佈柱狀圖</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                  每日支出柱高代表當日加總費用
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                滑鼠懸停於長條柱上即可即時查看該天住宿、午晚餐、交通與門票分項花費。
              </p>
            </div>

            {/* Color Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-purple-300">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>住宿</span>
              </span>
              <span className="flex items-center gap-1 text-cyan-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span>交通</span>
              </span>
              <span className="flex items-center gap-1 text-amber-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>餐食</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>活動門票</span>
              </span>
            </div>
          </div>

          {/* Interactive Stacked Bar Chart */}
          <div className="bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-800 relative">
            <div className="h-64 sm:h-72 w-full flex items-end justify-between gap-1 sm:gap-2 pt-6 pb-2">
              {DAILY_BUDGET_DATA.map((dayItem) => {
                const heightPercent = Math.round((dayItem.dailyTotal / maxDailyCost) * 100);
                const isHovered = selectedDayHover?.day === dayItem.day;

                // Segments percentages
                const hHotel = (dayItem.hotelCost / dayItem.dailyTotal) * 100;
                const hTransport = (dayItem.transportCost / dayItem.dailyTotal) * 100;
                const hMeal = ((dayItem.lunchCost + dayItem.dinnerCost) / dayItem.dailyTotal) * 100;
                const hActivity = (dayItem.activityCost / dayItem.dailyTotal) * 100;

                return (
                  <div
                    key={dayItem.day}
                    onMouseEnter={() => setSelectedDayHover(dayItem)}
                    onMouseLeave={() => setSelectedDayHover(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  >
                    {/* Amount Label on Top */}
                    <span
                      className={`text-[9px] font-mono font-bold mb-1 transition-all ${
                        isHovered ? 'text-amber-300 scale-110' : 'text-slate-500 opacity-0 sm:opacity-100'
                      }`}
                    >
                      {Math.round((dayItem.dailyTotal * multiplier) / (viewScope === 'person' ? 1000 : 10000))}
                      {viewScope === 'person' ? 'k' : '萬'}
                    </span>

                    {/* Stacked Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[34px] rounded-t-lg overflow-hidden flex flex-col-reverse transition-all duration-300 ${
                        isHovered
                          ? 'ring-2 ring-amber-400 scale-105 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                          : 'opacity-90 hover:opacity-100'
                      }`}
                    >
                      {/* 1. Hotel Segment (Bottom) */}
                      <div
                        style={{ height: `${hHotel}%` }}
                        className="w-full bg-purple-600 transition-all hover:bg-purple-500"
                        title={`住宿: NT$ ${Math.round(dayItem.hotelCost * multiplier).toLocaleString()}`}
                      />
                      {/* 2. Transport Segment */}
                      <div
                        style={{ height: `${hTransport}%` }}
                        className="w-full bg-cyan-600 transition-all hover:bg-cyan-500"
                        title={`交通: NT$ ${Math.round(dayItem.transportCost * multiplier).toLocaleString()}`}
                      />
                      {/* 3. Meals Segment */}
                      <div
                        style={{ height: `${hMeal}%` }}
                        className="w-full bg-amber-500 transition-all hover:bg-amber-400"
                        title={`餐食: NT$ ${Math.round((dayItem.lunchCost + dayItem.dinnerCost) * multiplier).toLocaleString()}`}
                      />
                      {/* 4. Activity Segment (Top) */}
                      <div
                        style={{ height: `${hActivity}%` }}
                        className="w-full bg-emerald-500 transition-all hover:bg-emerald-400"
                        title={`活動: NT$ ${Math.round(dayItem.activityCost * multiplier).toLocaleString()}`}
                      />
                    </div>

                    {/* Day X Label */}
                    <span
                      className={`text-[10px] font-mono mt-2 transition-colors ${
                        isHovered ? 'text-emerald-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      D{dayItem.day}
                    </span>
                    <span className="text-[9px] text-slate-500 hidden sm:block">
                      {dayItem.date}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Hover Tooltip Card */}
            {selectedDayHover && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-amber-500/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40">
                      Day {selectedDayHover.day} · {selectedDayHover.date}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {selectedDayHover.city} ({selectedDayHover.country})
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans">
                    🏨 住宿：{selectedDayHover.hotelName} ({formatNTD(selectedDayHover.hotelCost)}) · 🍽️ 餐食：{selectedDayHover.mealNote} ({formatNTD(selectedDayHover.lunchCost + selectedDayHover.dinnerCost)})
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block font-mono">當日總花費</span>
                  <span className="text-lg font-mono font-black text-amber-300">
                    {formatNTD(selectedDayHover.dailyTotal)}
                  </span>
                </div>
              </div>
            )}
          </div>


          {/* Donut / Category Breakdown Summary Bar */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-xs sm:text-sm font-serif font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" />
              <span>七大預算類別全景佔比 (Category Distribution)</span>
            </h4>

            {/* Horizontal Stacked Bar */}
            <div className="w-full h-5 rounded-full overflow-hidden flex shadow-inner">
              {BUDGET_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  className="h-full transition-transform hover:opacity-90"
                  title={`${cat.name}: ${cat.percentage}% (${formatNTD(cat.amountPerPerson)})`}
                />
              ))}
            </div>

            {/* Category Chips Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
              {BUDGET_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs font-bold text-slate-200 truncate">{cat.name}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-white">
                    {formatNTD(cat.amountPerPerson)}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                    {cat.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. SUB-TAB 2: 十五日花費時間軸 (DAILY TIMELINE TABLE) */}
      {activeSubTab === 'daily' && (
        <div className="space-y-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono">
                <th className="p-3">天數</th>
                <th className="p-3">日期</th>
                <th className="p-3">城市 / 國家</th>
                <th className="p-3">住宿飯店</th>
                <th className="p-3 text-right">住宿費</th>
                <th className="p-3 text-right">午餐</th>
                <th className="p-3 text-right">晚餐</th>
                <th className="p-3">餐食備註</th>
                <th className="p-3 text-right">交通</th>
                <th className="p-3 text-right">活動門票</th>
                <th className="p-3 text-right text-emerald-400 font-bold">當日合計</th>
                <th className="p-3 text-right text-amber-400 font-bold">累積費用</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {DAILY_BUDGET_DATA.map((d) => (
                <tr key={d.day} className="hover:bg-slate-950/60 transition-colors">
                  <td className="p-3 font-bold text-amber-400">Day {d.day}</td>
                  <td className="p-3 text-slate-300">{d.date}</td>
                  <td className="p-3 font-sans font-bold text-white">
                    {d.city} <span className="text-slate-400 text-[10px]">({d.country})</span>
                  </td>
                  <td className="p-3 font-sans text-purple-300 truncate max-w-[140px]" title={d.hotelName}>
                    {d.hotelName}
                  </td>
                  <td className="p-3 text-right text-slate-300">{formatNTD(d.hotelCost)}</td>
                  <td className="p-3 text-right text-slate-400">{formatNTD(d.lunchCost)}</td>
                  <td className="p-3 text-right text-slate-300">{formatNTD(d.dinnerCost)}</td>
                  <td className="p-3 font-sans text-slate-300 text-[11px] truncate max-w-[160px]" title={d.mealNote}>
                    {d.mealNote}
                  </td>
                  <td className="p-3 text-right text-cyan-300">{formatNTD(d.transportCost)}</td>
                  <td className="p-3 text-right text-emerald-300">{formatNTD(d.activityCost)}</td>
                  <td className="p-3 text-right font-black text-emerald-400">
                    {formatNTD(d.dailyTotal)}
                  </td>
                  <td className="p-3 text-right font-black text-amber-300">
                    {formatNTD(d.cumulativeTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. SUB-TAB 3: 七大分類詳細明細 (CATEGORIES ACCORDION) */}
      {activeSubTab === 'categories' && (
        <div className="space-y-4">
          {BUDGET_CATEGORIES.map((cat) => {
            const isExpanded = expandedCategoryId === cat.id;
            return (
              <div
                key={cat.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedCategoryId(isExpanded ? null : cat.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-serif font-bold text-white">
                          {cat.name}
                        </h4>
                        <span
                          style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                        >
                          {cat.percentage}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 font-sans">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-sm sm:text-base font-mono font-black text-white block">
                        {formatNTD(cat.amountPerPerson)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        全班 {formatRawNTD(cat.classTotal)}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Accordion Detail Table */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-slate-800/80 bg-slate-900/40 animate-in fade-in">
                    <div className="space-y-2.5">
                      {cat.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                              {item.note}
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs sm:text-sm font-mono font-bold text-emerald-300 block">
                              {formatNTD(item.perPerson)}
                            </span>
                            {item.classTotal && (
                              <span className="text-[10px] text-slate-400 font-mono block">
                                全班小計 {formatRawNTD(item.classTotal)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 7. SUB-TAB 4: 個人實際記帳本 (ACTUAL EXPENSE TRACKER) */}
      {activeSubTab === 'actual' && (
        <div className="space-y-6">
          {/* Add Expense Form Card */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>記錄個人額外實際花費 (Personal Extra Expenses)</span>
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/40">
                目前額外累積：NT$ {totalUserActualSpent.toLocaleString()}
              </span>
            </div>

            <form onSubmit={handleAddUserExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                  旅程天數：
                </label>
                <select
                  value={newExpDay}
                  onChange={(e) => setNewExpDay(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      Day {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                  花費類別：
                </label>
                <select
                  value={newExpCategory}
                  onChange={(e) => setNewExpCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="個人餐飲">個人餐飲 (酒水/咖啡/點心)</option>
                  <option value="紀念品">紀念品特產</option>
                  <option value="額外活動">額外自費活動</option>
                  <option value="極地裝備">防寒衣物與器材</option>
                  <option value="個人交通">個人計程車/地鐵</option>
                  <option value="其他雜支">其他雜支</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                  消費項目說明：
                </label>
                <input
                  type="text"
                  required
                  value={newExpNote}
                  onChange={(e) => setNewExpNote(e.target.value)}
                  placeholder="如：哥本哈根手沖咖啡、明信片郵票..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                  金額 (NT$)：
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    min={1}
                    value={newExpAmount}
                    onChange={(e) => setNewExpAmount(e.target.value)}
                    placeholder="如：1200"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shrink-0 cursor-pointer transition-colors"
                  >
                    新增
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* User Expenses List */}
          <div className="space-y-2">
            {userExpenses.length > 0 ? (
              userExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                      D{exp.day}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{exp.note}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {exp.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{exp.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-black text-amber-300">
                      NT$ {exp.amountNTD.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDeleteUserExpense(exp.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                      title="刪除此筆記帳"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
                目前尚無個人自費記帳，點擊上方表單即可隨時記帳追蹤！
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
