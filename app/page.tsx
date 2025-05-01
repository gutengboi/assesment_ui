// "use client"
// import Login from "@/pages/login";

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
//       <div className="w-full max-w-md">
//         <h1 className="text-3xl font-bold text-center mb-8">Department Management System</h1>

//         <Login />
//       </div>
//     </main>);
// }

import { redirect } from 'next/navigation';

export default function Home() {
  // Server-side redirect to login page
  redirect('/login');
}