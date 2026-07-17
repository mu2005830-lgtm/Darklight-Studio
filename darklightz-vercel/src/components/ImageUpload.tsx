import { useRef, useState } from "react"
import { Upload, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { customFetch } from "@/lib/api-client"

interface Props {
  value: string
  onChange: (url: string) => void
  placeholder?: string
}

export function ImageUpload({ value, onChange, placeholder = "https://…" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setError(null)
    const form = new FormData()
    form.append("file", file)
    try {
      const data = await customFetch<{ url: string }>("/api/admin/upload", {
        method: "POST",
        body: form,
      })
      onChange(data.url)
    } catch (e: any) {
      setError(e.message ?? "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && (
        <div className="relative w-full h-32 rounded-lg border border-white/10 overflow-hidden bg-black">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/70 rounded-full p-1 hover:bg-black"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      )}
      {/* Upload button + URL input row */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="border-white/10 text-white hover:bg-white/5 shrink-0"
        >
          <Upload className="w-3 h-3 mr-1.5" />
          {uploading ? "Uploading…" : "Upload"}
        </Button>
        <Input
          className="bg-black border-white/10 text-white text-sm"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = "" }}
      />
    </div>
  )
}
