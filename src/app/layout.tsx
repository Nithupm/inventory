"use client";
import "../styles/globals.css";
import Sidebar from "./components/Sidebar";
import { InventoryProvider } from "./components/ContextProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/react-query";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <QueryClientProvider client={queryClient}>
          <InventoryProvider>
            <div className="grid grid-cols-[69px_1fr] w-full h-screen">
              <Sidebar />
              <main className="overflow-x-hidden overflow-y-auto bg-gray-100">
                {children}
              </main>
            </div>

            {/* </div> */}
          </InventoryProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
