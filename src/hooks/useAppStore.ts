import { create } from 'zustand';

interface AppState {
  isProcessing: boolean;
  processingProgress: number;
  activeFiles: File[];
  processedUrl: string | null;
  extractedText: string | null;
  setIsProcessing: (status: boolean) => void;
  setProcessingProgress: (progress: number) => void;
  setActiveFiles: (files: File[]) => void;
  addActiveFiles: (files: File[]) => void;
  removeActiveFile: (index: number) => void;
  setProcessedUrl: (url: string | null) => void;
  setExtractedText: (text: string | null) => void;
  resetState: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isProcessing: false,
  processingProgress: 0,
  activeFiles: [],
  processedUrl: null,
  extractedText: null,
  setIsProcessing: (status) => set({ isProcessing: status }),
  setProcessingProgress: (progress) => set({ processingProgress: progress }),
  setActiveFiles: (files) => set({ activeFiles: files }),
  addActiveFiles: (files) => set((state) => ({ activeFiles: [...state.activeFiles, ...files] })),
  removeActiveFile: (index) => set((state) => ({ 
    activeFiles: state.activeFiles.filter((_, i) => i !== index) 
  })),
  setProcessedUrl: (url) => set({ processedUrl: url }),
  setExtractedText: (text) => set({ extractedText: text }),
  resetState: () => set({ isProcessing: false, processingProgress: 0, activeFiles: [], processedUrl: null, extractedText: null }),
}));
