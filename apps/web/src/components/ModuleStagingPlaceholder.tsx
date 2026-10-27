import React, { useState } from 'react';
import { Sparkles, Copy, Check, FileCode, CheckCircle2, ArrowRight, ShieldCheck, Terminal } from 'lucide-react';

interface ModuleStagingPlaceholderProps {
  moduleNumber: string;
  moduleName: string;
  targetFilePath: string;
  workflows: string[];
  claudePrompt: string;
  onOpenClaudeModal: () => void;
}

export const ModuleStagingPlaceholder: React.FC<ModuleStagingPlaceholderProps> = ({
  moduleNumber,
  moduleName,
  targetFilePath,
  workflows,
  claudePrompt,
  onOpenClaudeModal,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(claudePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5DFD7] p-8 shadow-sm space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5DFD7]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#682038]/10 text-[#682038]">
              {moduleNumber}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              Contract Verified & Ready for Claude
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#242424]">{moduleName}</h2>
          <p className="text-xs text-[#6E6862]">
            This modular workspace is staged for drop-in generation. Use the prompt below with Claude to generate the production-ready component.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#682038] hover:bg-[#54192D] text-white text-xs font-bold shadow-sm transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Prompt Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Prompt for Claude</span>
              </>
            )}
          </button>
          <button
            onClick={onOpenClaudeModal}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F4ECE2] text-[#6E6862] text-xs font-semibold border border-[#E5DFD7] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>View All Prompts</span>
          </button>
        </div>
      </div>

      {/* Target Destination & Integration Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E5DFD7] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#242424]">
            <FileCode className="w-4 h-4 text-[#8B5E3C]" />
            <span>Target File Destination</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-[#E5DFD7] font-mono text-xs text-[#682038] flex items-center justify-between">
            <span>{targetFilePath}</span>
            <span className="text-[10px] text-[#6E6862] font-sans">Drop-in ready</span>
          </div>
          <div className="text-xs text-[#6E6862] space-y-1.5">
            <p className="font-semibold text-[#242424]">How to integrate:</p>
            <ol className="list-decimal list-inside space-y-1 text-[11px]">
              <li>Click <strong>Copy Prompt for Claude</strong> above.</li>
              <li>Paste into Claude. Claude will generate the complete, self-contained TSX component.</li>
              <li>Save the generated file at <code className="text-[#682038] font-mono">{targetFilePath}</code>.</li>
              <li>Vite will instantly hot-reload and render the live interactive workspace here.</li>
            </ol>
          </div>
        </div>

        <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E5DFD7] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#242424]">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Architectural & Business Workflows Specified in Prompt</span>
          </div>
          <ul className="space-y-2 text-xs text-[#242424]">
            {workflows.map((wf, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>{wf}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Embedded Prompt Snippet Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#6E6862]">
          <span className="font-semibold text-[#242424] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>Prompt Contract Preview (Zero-Hallucination)</span>
          </span>
          <span className="font-mono text-[10px]">Pure Tailwind + Lucide React</span>
        </div>
        <div className="bg-[#1C1917] p-4 rounded-xl text-xs font-mono text-[#F5F5F4] overflow-x-auto max-h-48 border border-[#292524] leading-relaxed">
          <pre className="whitespace-pre-wrap">{claudePrompt.slice(0, 500)}... (click 'Copy Prompt for Claude' to copy all {claudePrompt.length} characters)</pre>
        </div>
      </div>
    </div>
  );
};
