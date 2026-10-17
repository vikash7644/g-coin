'use client';

import React, { useState } from 'react';
import { UploadDropzone } from '@/components/UploadDropzone';

export default function SubmitWorkForm() {
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [techStackUsed, setTechStackUsed] = useState('');
  const [videoDemoUrl, setVideoDemoUrl] = useState('');
  const [s3Keys, setS3Keys] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      // Prepare screenshots as URLs served through app proxy
      const base = process.env.NEXT_PUBLIC_APP_URL || '';
      const screenshotUrls = s3Keys.map((k) => `${base}/_s3/${encodeURIComponent(k)}`);

      const form = new FormData();
      form.append('projectTitle', projectTitle);
      form.append('description', description);
      form.append('githubRepoUrl', githubRepoUrl);
      form.append('liveDemoUrl', liveDemoUrl);
      form.append('techStackUsed', techStackUsed);
      form.append('videoDemoUrl', videoDemoUrl);
      form.append('screenshots', screenshotUrls.join('\n'));

      const res = await fetch('/api/submissions', { method: 'POST', body: form });
      if (!res.ok) {
        setMessage('Submission failed');
      } else {
        setMessage('Submitted for verification — good job!');
        // Clear form
        setProjectTitle('');
        setDescription('');
        setGithubRepoUrl('');
        setLiveDemoUrl('');
        setTechStackUsed('');
        setVideoDemoUrl('');
        setS3Keys([]);
      }
    } catch (err) {
      console.error(err);
      setMessage('Error submitting');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm text-slate-300">Project title</label>
        <input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="Example: G-COIN Dashboard" />
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-sm text-slate-300">Description (500 words max)</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} required className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="Explain what was built, why it matters, and how it works." />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">GitHub repository URL</label>
        <input value={githubRepoUrl} onChange={(e) => setGithubRepoUrl(e.target.value)} type="url" required className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="https://github.com/your/repo" />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">Live demo URL</label>
        <input value={liveDemoUrl} onChange={(e) => setLiveDemoUrl(e.target.value)} type="url" required className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="https://your-app.vercel.app" />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">Tech stack used</label>
        <input value={techStackUsed} onChange={(e) => setTechStackUsed(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="Next.js, Tailwind, Prisma" />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">Video demo URL (optional)</label>
        <input value={videoDemoUrl} onChange={(e) => setVideoDemoUrl(e.target.value)} type="url" className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="https://youtube.com/..." />
      </div>

      <div className="md:col-span-2">
        <UploadDropzone onChange={(keys) => setS3Keys((prev) => [...prev, ...keys])} max={3} />
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button disabled={submitting} type="submit" className="rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-slate-900 hover:bg-yellow-300">
          {submitting ? 'Submitting...' : 'Submit for verification'}
        </button>
      </div>

      {message ? <div className="md:col-span-2 text-sm text-slate-300">{message}</div> : null}
    </form>
  );
}
