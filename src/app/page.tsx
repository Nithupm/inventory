"use client";
import FormSection from "./components/FormSection";
import InventoryTable from "./components/InventoryTable";

export default function AddInventoryPage() {
  return (
    <main className=" bg-gray-100 min-h-screen">
      <FormSection />
      <InventoryTable />
    </main>
  );
}
