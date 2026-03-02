import { createSignal } from "solid-js";
import { Motion } from "solid-motionone";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Home() {
  let input!: HTMLInputElement;

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
      const res = await fetch(`${API_URL}/remove-bg`, {
        method: "POST",
        body: form,
      });
      const blob = await res.blob();
      setResultUrl(URL.createObjectURL(blob));
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to remove background");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main class="flex flex-col items-center justify-center gap-6 p-6 h-screen bg-[#0f0f0f] text-white font-sans">
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 class="text-3xl font-bold">bg.aapelix.dev</h1>
      </Motion.div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.currentTarget.files?.[0] ?? null)}
        style={{ display: "none" }}
      />

      <Motion.button
        onClick={() => input.click()}
        class="px-5 py-2 w-56 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white text-sm font-medium shadow-sm cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden"
        hover={{ scale: 1.05 }}
      >
        {file() ? file()!.name : "Select Image"}
      </Motion.button>

      <Motion.button
        onClick={handleUpload}
        disabled={!file() || loading()}
        class="px-5 py-2 w-56 rounded-xl -mt-4 bg-black hover:bg-gray-900 transition-colors duration-300 text-white text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        hover={{ scale: 1.03 }}
      >
        {loading() ? "Processing..." : "Remove Background"}
      </Motion.button>

      {resultUrl() && (
        <>
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            class="mt-6 p-4 rounded-xl flex flex-col items-center gap-4 border border-[#1f1f1f]"
          >
            <img
              src={resultUrl()!}
              alt="Background removed"
              class="max-w-3xl rounded-lg"
            />
          </Motion.div>
          <Motion.button
            onClick={() => {
              const a = document.createElement("a");
              a.href = resultUrl()!;
              a.download = "result.png";
              a.click();
            }}
            class="px-4 py-2 w-56 rounded-xl bg-green-500 hover:bg-green-600 transition-colors duration-300 text-white text-sm font-medium shadow-sm cursor-pointer"
            hover={{ scale: 1.03 }}
          >
            Download
          </Motion.button>
        </>
      )}
    </main>
  );
}
