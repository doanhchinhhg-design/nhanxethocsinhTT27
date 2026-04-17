import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  FileSpreadsheet, 
  History, 
  Download, 
  Trash2, 
  Sparkles, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronRight,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType } from 'docx';
import { Level, SUBJECTS, CommentHistory, AssessmentPeriod, PERIODS } from './types';
import { QUICK_COMMENTS } from './constants';
import { generateComment } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'create' | 'excel' | 'history'>('create');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [grade, setGrade] = useState('1');
  const [period, setPeriod] = useState<AssessmentPeriod>(PERIODS[3]); // Default to Cuối năm
  const [comment, setComment] = useState('');
  const [generatedLevel, setGeneratedLevel] = useState<Level | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<CommentHistory[]>([]);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('comment_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('comment_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async (level: Level) => {
    setIsGenerating(true);
    setGeneratedLevel(level);
    try {
      const previousComments = history
        .filter(h => h.subject === subject && h.level === level)
        .map(h => h.comment);
      
      const newComment = await generateComment(subject, level, grade, period, previousComments);
      setComment(newComment);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToHistory = () => {
    if (!comment) return;
    
    const newEntry: CommentHistory = {
      id: crypto.randomUUID(),
      studentName: '-',
      className: `Lớp ${grade}`,
      subject,
      level: generatedLevel || 'Đạt',
      period,
      comment,
      createdAt: new Date().toISOString()
    };
    
    setHistory([newEntry, ...history]);
    setComment('');
    setGeneratedLevel(null);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(history.filter(h => h.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setExcelData(data);
      setActiveTab('excel');
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const templateData = [
      { 'STT': 1, 'Họ và tên': 'Nguyễn Văn A', 'Lớp': '1A', 'Mức độ': 'T' },
      { 'STT': 2, 'Họ và tên': 'Trần Thị B', 'Lớp': '1A', 'Mức độ': 'H' },
      { 'STT': 3, 'Họ và tên': 'Lê Văn C', 'Lớp': '1A', 'Mức độ': 'C' },
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Mau_nhan_xet_hoc_sinh.xlsx");
  };

  const processExcelComments = async () => {
    if (excelData.length === 0) return;
    setIsProcessingExcel(true);
    setProcessingProgress(0);

    const newData = [...excelData];
    const previousComments: string[] = [];
    
    // Parallel processing for speed
    const processRow = async (i: number) => {
      if (i >= newData.length) return;
      
      const row = newData[i];
      let level: Level = 'Đạt';
      
      // Find the level column (could be "Mức độ", "Mức đạt được", "Đánh giá", "Xếp loại", etc.)
      const levelKey = Object.keys(row).find(k => {
        const key = k.toLowerCase();
        return key.includes('mức') || key.includes('đánh giá') || key.includes('xếp loại') || key.includes('level');
      });
      
      // Find the subject column (could be "Môn học", "Môn", "Subject", etc.)
      const subjectKey = Object.keys(row).find(k => {
        const key = k.toLowerCase();
        return key.includes('môn') || key.includes('subject');
      });
      
      const rowSubject = String(row[subjectKey || ''] || subject).trim();
      
      const rawLevel = String(row[levelKey || ''] || row['Mức độ'] || row['Mức đạt được'] || '').trim();
      const levelVal = rawLevel.toUpperCase();
      
      if (levelVal === 'T' || levelVal.includes('TỐT') || levelVal.includes('HOÀN THÀNH TỐT')) {
        level = 'Tốt';
      } else if (levelVal === 'C' || levelVal.includes('CHƯA') || levelVal.includes('CỐ GẮNG') || levelVal.includes('CHƯA HOÀN THÀNH')) {
        level = 'Chưa hoàn thành';
      } else {
        level = 'Đạt'; // Default for 'H', 'ĐẠT', 'HOÀN THÀNH'
      }

      const comment = await generateComment(rowSubject, level, grade, period, previousComments);
      newData[i]['Nhận xét'] = comment;
      newData[i]['Thời điểm'] = period;
      newData[i]['Môn học'] = rowSubject;
      previousComments.push(comment);
      
      setProcessingProgress(Math.round(((i + 1) / newData.length) * 100));
    };

    // Process in larger batches for maximum speed
    const batchSize = 15;
    for (let i = 0; i < newData.length; i += batchSize) {
      const batch = [];
      for (let j = 0; j < batchSize && (i + j) < newData.length; j++) {
        batch.push(processRow(i + j));
      }
      await Promise.all(batch);
      setExcelData([...newData]);
      
      // Minimal delay to prevent rate limiting while maintaining high speed
      if (i + batchSize < newData.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    setProcessingProgress(100);
    setIsProcessingExcel(false);
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Nhận xét");
    XLSX.writeFile(wb, `Nhan_xet_${subject}_${new Date().toLocaleDateString()}.xlsx`);
  };

  const exportToWord = async () => {
    if (history.length === 0) return;

    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("STT")] }),
            new TableCell({ children: [new Paragraph("Họ và tên")] }),
            new TableCell({ children: [new Paragraph("Lớp")] }),
            new TableCell({ children: [new Paragraph("Môn học")] }),
            new TableCell({ children: [new Paragraph("Mức độ")] }),
            new TableCell({ children: [new Paragraph("Thời điểm")] }),
            new TableCell({ children: [new Paragraph("Nhận xét")] }),
          ],
        }),
        ...history.map((h, index) => new TableRow({
          children: [
            new TableCell({ children: [new Paragraph((index + 1).toString())] }),
            new TableCell({ children: [new Paragraph(h.studentName)] }),
            new TableCell({ children: [new Paragraph(h.className)] }),
            new TableCell({ children: [new Paragraph(h.subject)] }),
            new TableCell({ children: [new Paragraph(h.level)] }),
            new TableCell({ children: [new Paragraph(h.period)] }),
            new TableCell({ children: [new Paragraph(h.comment)] }),
          ],
        })),
      ],
    });

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "BÁO CÁO NHẬN XÉT HỌC SINH", heading: "Heading1", alignment: "center" }),
          new Paragraph({ text: `Ngày tạo: ${new Date().toLocaleDateString()}`, alignment: "center" }),
          new Paragraph({ text: "" }),
          table,
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Bao_cao_nhan_xet_${new Date().getTime()}.docx`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#212529] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">AI Nhận Xét <span className="text-blue-600">TT27</span></h1>
          </div>
          <nav className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {[
              { id: 'create', icon: Plus, label: 'Tạo mới' },
              { id: 'excel', icon: FileSpreadsheet, label: 'Excel' },
              { id: 'history', icon: History, label: 'Lịch sử' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.id 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Panel: Settings (Common for Create & Excel) */}
          {(activeTab === 'create' || activeTab === 'excel') && (
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Cấu hình</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lớp</label>
                    <select 
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      {['1', '2', '3', '4', '5'].map(g => <option key={g} value={g}>Lớp {g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Môn học</label>
                    <select 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời điểm đánh giá</label>
                    <select 
                      value={period}
                      onChange={(e) => setPeriod(e.target.value as AssessmentPeriod)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl border border-dashed border-gray-300 transition-all text-sm font-medium"
                    >
                      <Upload className="w-4 h-4" />
                      Tải lên file Excel
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept=".xlsx, .xls" 
                      className="hidden" 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-blue-600 w-5 h-5 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900">Hướng dẫn nhanh</h3>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                      Chọn môn học, sau đó nhấn vào mức độ đánh giá để AI tạo nhận xét. Bạn có thể sửa trực tiếp nội dung trước khi lưu.
                    </p>
                    <button 
                      onClick={downloadTemplate}
                      className="mt-3 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Tải file mẫu Excel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={cn(
            "space-y-6 transition-all duration-300",
            (activeTab === 'create' || activeTab === 'excel') ? "md:col-span-2" : "md:col-span-3"
          )}>
            <AnimatePresence mode="wait">
              {activeTab === 'create' && (
                <motion.div
                  key="create"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <Sparkles className="text-blue-600 w-5 h-5" />
                      Tạo nhận xét AI
                    </h2>

                    <div className="grid grid-cols-3 gap-3 mb-8">
                      {[
                        { level: 'Tốt', label: 'Hoàn thành tốt (T)', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' },
                        { level: 'Đạt', label: 'Hoàn thành (H)', color: 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100' },
                        { level: 'Chưa hoàn thành', label: 'Chưa hoàn thành (C)', color: 'bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100' }
                      ].map((btn) => (
                        <button
                          key={btn.level}
                          onClick={() => handleGenerate(btn.level as Level)}
                          disabled={isGenerating}
                          className={cn(
                            "py-4 px-2 rounded-xl border text-sm font-bold transition-all flex flex-col items-center gap-2",
                            btn.color,
                            isGenerating && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {btn.label}
                          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Nội dung nhận xét sẽ xuất hiện ở đây..."
                          className="w-full h-40 bg-gray-50 border border-gray-200 rounded-2xl p-6 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none leading-relaxed"
                        />
                        {isGenerating && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                            <div className="flex flex-col items-center gap-3">
                              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                              <span className="text-sm font-medium text-blue-600">AI đang suy nghĩ...</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setComment('');
                            setGeneratedLevel(null);
                          }}
                          className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-all"
                        >
                          Xóa trắng
                        </button>
                        <button
                          onClick={handleSaveToHistory}
                          disabled={!comment}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:shadow-none"
                        >
                          <Save className="w-4 h-4" />
                          Lưu vào lịch sử
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Comments */}
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Nhận xét nhanh (1-Click)</h2>
                    <div className="space-y-6">
                      {(() => {
                        const subjectComments = QUICK_COMMENTS[subject] || QUICK_COMMENTS['Chung'];
                        return (Object.entries(subjectComments) as [Level, string[]][]).map(([level, comments]) => (
                          <div key={level}>
                            <h3 className={cn(
                              "text-xs font-bold mb-3 px-2 py-1 rounded inline-block",
                              level === 'Tốt' ? "bg-emerald-100 text-emerald-700" :
                              level === 'Đạt' ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                            )}>
                              {level === 'Tốt' ? 'Hoàn thành tốt (T)' : level === 'Đạt' ? 'Hoàn thành (H)' : 'Chưa hoàn thành (C)'}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {comments.map((c, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setComment(c);
                                    setGeneratedLevel(level);
                                  }}
                                  className="text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-lg text-gray-600 transition-all"
                                >
                                  {c}
                                </button>
                              ))}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'excel' && (
                <motion.div
                  key="excel"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold">Xử lý file Excel</h2>
                      <p className="text-sm text-gray-500">Tự động điền nhận xét cho danh sách học sinh</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={processExcelComments}
                        disabled={isProcessingExcel || excelData.length === 0}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                      >
                        {isProcessingExcel ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang xử lý ({processingProgress}%)
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Tự động điền nhận xét
                          </>
                        )}
                      </button>
                      <button
                        onClick={downloadExcel}
                        disabled={excelData.length === 0}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" />
                        Tải về Excel
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4">STT</th>
                          <th className="px-6 py-4">Họ và tên</th>
                          <th className="px-6 py-4">Lớp</th>
                          <th className="px-6 py-4">Môn học</th>
                          <th className="px-6 py-4">Mức đạt được</th>
                          <th className="px-6 py-4">Thời điểm</th>
                          <th className="px-6 py-4">Nhận xét</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {excelData.length > 0 ? (
                          excelData.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                              <td className="px-6 py-4 font-medium">{row['Họ và tên'] || row['Tên'] || row['Họ tên'] || '-'}</td>
                              <td className="px-6 py-4 text-gray-500">{row['Lớp'] || '-'}</td>
                              <td className="px-6 py-4 text-gray-500 text-xs">{row['Môn học'] || subject}</td>
                              <td className="px-6 py-4">
                                {(() => {
                                  const levelKey = Object.keys(row).find(k => {
                                    const key = k.toLowerCase();
                                    return key.includes('mức') || key.includes('đánh giá') || key.includes('xếp loại');
                                  });
                                  const rawVal = String(row[levelKey || ''] || row['Mức độ'] || row['Mức đạt được'] || '').trim();
                                  const upperVal = rawVal.toUpperCase();
                                  
                                  const isT = upperVal === 'T' || upperVal.includes('TỐT');
                                  const isC = upperVal === 'C' || upperVal.includes('CHƯA') || upperVal.includes('CỐ GẮNG');
                                  const isH = upperVal === 'H' || upperVal.includes('ĐẠT') || upperVal.includes('HOÀN THÀNH');
                                  
                                  return (
                                    <span className={cn(
                                      "px-2 py-1 rounded text-[10px] font-bold uppercase min-w-[24px] inline-block text-center",
                                      isT ? "bg-emerald-100 text-emerald-700" :
                                      isC ? "bg-orange-100 text-orange-700" : 
                                      isH ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                                    )}>
                                      {rawVal || '-'}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className="px-6 py-4 text-gray-500 text-xs">{row['Thời điểm'] || period}</td>
                              <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{row['Nhận xét'] || <span className="text-gray-300 italic">Chưa có nhận xét</span>}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-6 py-20 text-center">
                              <div className="flex flex-col items-center gap-3">
                                <FileSpreadsheet className="w-12 h-12 text-gray-200" />
                                <p className="text-gray-400">Chưa có dữ liệu. Vui lòng tải lên file Excel ở bảng Cấu hình.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <History className="text-blue-600 w-5 h-5" />
                      Lịch sử nhận xét
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={exportToWord}
                        disabled={history.length === 0}
                        className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        Xuất Word
                      </button>
                      <button
                        onClick={() => setHistory([])}
                        disabled={history.length === 0}
                        className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa tất cả
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {history.length > 0 ? (
                      history.map((item) => (
                        <motion.div
                          layout
                          key={item.id}
                          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between gap-4 group"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{item.subject}</span>
                              <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.period}</span>
                              <span className={cn(
                                "text-[10px] font-bold px-2 py-1 rounded uppercase",
                                item.level === 'Tốt' ? "bg-emerald-100 text-emerald-700" :
                                item.level === 'Đạt' ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                              )}>
                                {item.level}
                              </span>
                              <span className="text-[10px] text-gray-400">{new Date(item.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-gray-800 leading-relaxed">{item.comment}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteHistory(item.id)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))
                    ) : (
                      <div className="bg-white py-20 rounded-2xl border border-dashed border-gray-200 text-center">
                        <History className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400">Chưa có lịch sử nhận xét nào.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-sm text-gray-400">
          © 2026 AI Nhận Xét Học Sinh - Hỗ trợ Thông tư 27/2020/TT-BGDĐT
        </p>
      </footer>
    </div>
  );
}
