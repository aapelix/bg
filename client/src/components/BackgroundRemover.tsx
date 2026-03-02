import { createSignal } from "solid-js";

export default function BackgroundRemover() {
  const [file, setFile] = createSignal<File | null>(null);
  const [resultUrl, setResultUrl] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(false);

  async function handleUpload(e: Event) {
    e.preventDefault();
    if (!file()) return;

    setLoading(true);
    const form = new FormData();
    form.append("file", file()!);

    try {
      const res = await fetch("http://localhost:8000/remove-bg", {
        method: "POST",
        body: form,
      });
      const blob = await res.blob();
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert("Failed to remove background");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div class="flex flex-col items-center gap-4 p-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.currentTarget.files?.[0] ?? null)}
      />
      <button
        onClick={handleUpload}
        disabled={!file() || loading()}
        class="px-4 py-2 bg-black text-white rounded"
      >
        {loading() ? "Processing..." : "Remove Background"}
      </button>

      {resultUrl() && (
        <div class="mt-4">
          <h3 class="mb-2">Result:</h3>
          <img src={resultUrl()!} alt="Background removed" class="max-w-md" />
        </div>
      )}
    </div>
  );
}
