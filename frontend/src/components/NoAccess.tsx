import Link from "next/link";

export default function NoAccess() {
  return (
    <div className="text-center mt-16">
      <h1 className="text-2xl font-bold mb-2">You don&apos;t have access</h1>
      <Link href="/" className="text-teal-700">
        Back to home
      </Link>
    </div>
  );
}
