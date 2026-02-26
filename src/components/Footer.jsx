export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-gray-600 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} The Jewel Heritage. All rights reserved.</p>
        <p className="text-gray-500">Paro, Changsima • Bhutan</p>
      </div>
    </footer>
  );
}