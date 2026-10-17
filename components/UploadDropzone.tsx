'use client';

import React, { useCallback, useState } from 'react';
import { uploadFileToS3 } from '@/lib/upload-file';

export function UploadDropzone({ onChange, max = 3 }: { onChange: (keys: string[]) => void; max?: number }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setErrors(null);
      const selected = Array.from(e.target.files || []).slice(0, max - files.length);
      if (selected.length === 0) return;

      setUploading(true);
      try {
        const uploadedKeys: string[] = [];
        for (const f of selected) {
          const { key } = await uploadFileToS3(f);
          uploadedKeys.push(key);
        }

        const newFiles = [...files, ...selected].slice(0, max);
        setFiles(newFiles);
        onChange(uploadedKeys);
      } catch (err: any) {
        console.error(err);
        setErrors(String(err?.message || err));
      } finally {
        setUploading(false);
      }
    },
    [files, max, onChange]
  );

  return (
    <div className="space-y-2">
      <label className="mb-2 block text-sm text-slate-300">Screenshots (upload up to {max})</label>
      <div className="flex items-center gap-4">
        <input disabled={uploading} type="file" accept="image/*" multiple onChange={onFileChange} />
        {uploading && <div className="text-sm text-slate-400">Uploading...</div>}
      </div>
      {errors ? <div className="text-sm text-rose-400">{errors}</div> : null}
      <div className="mt-3 flex gap-3">
        {files.map((f, i) => (
          <div key={i} className="rounded border border-white/10 p-1">
            <img src={URL.createObjectURL(f)} alt={f.name} className="h-24 w-36 object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
