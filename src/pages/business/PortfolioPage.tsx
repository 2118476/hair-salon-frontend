import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessAdminApi } from '../../api/businessAdmin';
import { useBusinessOutlet } from '../../hooks/useBusinessOutlet';
import { useToast } from '../../context/toast-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function PortfolioPage() {
  const { businessId } = useBusinessOutlet();
  const qc = useQueryClient();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState('');
  const [consent, setConsent] = useState(false);

  const { data } = useQuery({ queryKey: ['ba-portfolio', businessId], queryFn: () => businessAdminApi.listPortfolio(businessId) });

  const upload = useMutation({
    mutationFn: () => {
      const file = fileRef.current?.files?.[0];
      if (!file) throw new Error('no file');
      const form = new FormData();
      form.append('file', file);
      form.append('caption', caption);
      form.append('consent', String(consent));
      return businessAdminApi.uploadPortfolio(businessId, form);
    },
    onSuccess: () => { toast.show('Image uploaded', 'success'); setCaption(''); setConsent(false); if (fileRef.current) fileRef.current.value = ''; qc.invalidateQueries({ queryKey: ['ba-portfolio', businessId] }); },
    onError: () => toast.show('Upload failed (type/size/consent)', 'error'),
  });

  const archive = useMutation({
    mutationFn: (id: string) => businessAdminApi.archivePortfolio(businessId, id),
    onSuccess: () => { toast.show('Image archived', 'info'); qc.invalidateQueries({ queryKey: ['ba-portfolio', businessId] }); },
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-ink">Portfolio</h1>

      <Card className="mb-8">
        <CardHeader><CardTitle>Upload an image</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); upload.mutate(); }} className="flex flex-wrap items-end gap-3">
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" required aria-label="Image file"
              className="text-sm" />
            <Input id="cap" label="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} className="w-auto" />
            <label className="flex items-center gap-2 text-sm text-text-primary">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> Photo consent given
            </label>
            <Button type="submit" isLoading={upload.isPending} disabled={!consent}>Upload</Button>
          </form>
          <p className="mt-2 text-xs text-text-secondary">JPEG, PNG, WebP or AVIF · up to 10 MB · consent required.</p>
        </CardContent>
      </Card>

      {data?.length === 0 && <p className="text-text-secondary">No images yet.</p>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {data?.map((img) => (
          <div key={img.id} className="group relative overflow-hidden rounded-lg border border-gray-200">
            <img src={img.url} alt={img.caption ?? 'Portfolio image'} className="aspect-square w-full object-cover" loading="lazy" />
            {img.caption && <p className="truncate px-2 py-1 text-xs text-text-secondary">{img.caption}</p>}
            <button onClick={() => archive.mutate(img.id)}
              className="absolute right-2 top-2 rounded bg-ink/70 px-2 py-1 text-xs text-ivory opacity-0 transition-opacity group-hover:opacity-100">
              Archive
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
