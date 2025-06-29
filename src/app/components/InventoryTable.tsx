"use client";
import { useContext, useEffect, useState } from "react";
import { InventoryContext } from "./ContextProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Item } from "../../types";
import {
  FaTrash,
  FaEdit,
  FaClone,
  FaWindowClose,
  FaCheck,
  FaTimes,
  FaRocket,
} from "react-icons/fa";

export default function InventoryTable() {
  const { items, setItems } = useContext(InventoryContext)!;
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Item>>({});

  const editableColumns: (keyof Item)[] = [
    "ticketType",
    "quantity",
    "category",
    "sectionBlock",
    "row",
    "seating",
  ];

  const { data } = useQuery({
    queryKey: ["inventory"],
    queryFn: (): Promise<Item[]> =>
      api.get("/inventory").then((res) => res.data),
  });

  const updateItem = useMutation({
    mutationFn: (item: Item) => api.put(`/inventory/${item.id}`, item),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });

  const deleteItem = useMutation({
    mutationFn: (id: number) => api.delete(`/inventory/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });

  useEffect(() => {
    if (data) setItems(data);
  }, [data, setItems]);

  return (
    <div>
      <div className="mt-5 p-6 overflow-x-auto w-full">
        <table className="w-full min-w-[900px] text-sm mb-20">
          <thead className="bg-blue-900 h-10 text-white">
            <tr>
              <th></th>
              <th>Event</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Category</th>
              <th>Block</th>
              <th>Row</th>
              <th>Seat</th>
              <th>Face Value</th>
              <th>Payout</th>
              <th>Ship Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {items.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <tr key={item.id} className="border-t text-black text-center">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={(e) =>
                        setSelectedIds((prev) =>
                          e.target.checked
                            ? [...prev, item.id]
                            : prev.filter((id) => id !== item.id)
                        )
                      }
                    />
                  </td>

                  <td className="p-2">{item.eventName || "—"}</td>

                  {editableColumns.map((col) => (
                    <td key={col} className="p-2">
                      {isEditing ? (
                        col === "ticketType" ? (
                          <select
                            value={editValues[col] ?? item[col]}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [col]: e.target.value,
                              }))
                            }
                            className="w-full p-1 border border-gray-300 rounded text-black"
                          >
                            <option value="">Select</option>
                            <option value="E-ticket">E-ticket</option>
                            <option value="Local Delivery">
                              Local Delivery
                            </option>
                          </select>
                        ) : col === "quantity" ? (
                          <select
                            value={editValues[col] ?? item[col]}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [col]: Number(e.target.value),
                              }))
                            }
                            className="w-full p-1 border border-gray-300 rounded text-black"
                          >
                            {[1, 2, 3, 5, 10].map((q) => (
                              <option key={q} value={q}>
                                {q}
                              </option>
                            ))}
                          </select>
                        ) : col === "category" ? (
                          <select
                            value={editValues[col] ?? item[col]}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [col]: e.target.value,
                              }))
                            }
                            className="w-full p-1 border border-gray-300 rounded text-black"
                          >
                            <option value="">Select</option>
                            <option value="Away Fans Section">
                              Away Fans Section
                            </option>
                            <option value="Near Fans Section">
                              Near Fans Section
                            </option>
                          </select>
                        ) : col === "sectionBlock" ? (
                          <select
                            value={editValues[col] ?? item[col]}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [col]: e.target.value,
                              }))
                            }
                            className="w-full p-1 border border-gray-300 rounded text-black"
                          >
                            <option value="">Select</option>
                            <option value="Longside lower tier">
                              Longside lower tier
                            </option>
                            <option value="Longside upper tier">
                              Longside upper tier
                            </option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={String(editValues[col] ?? item[col] ?? "")}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [col]: e.target.value,
                              }))
                            }
                            className="w-full p-1 border border-gray-300 rounded text-black"
                          />
                        )
                      ) : (
                        item[col]
                      )}
                    </td>
                  ))}

                  <td className="p-2">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editValues.faceValue ?? item.faceValue}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            faceValue: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full p-1 border border-gray-300 rounded text-black"
                      />
                    ) : (
                      item.faceValue
                    )}
                  </td>

                  <td className="p-2">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editValues.payoutPrice ?? item.payoutPrice}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            payoutPrice: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full p-1 border border-gray-300 rounded text-black"
                      />
                    ) : (
                      item.payoutPrice
                    )}
                  </td>

                  <td className="p-2">
                    {isEditing ? (
                      <input
                        type="date"
                        value={editValues.eventDate ?? item.eventDate}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            eventDate: e.target.value,
                          }))
                        }
                        className="w-full p-1 border border-gray-300 rounded text-black"
                      />
                    ) : (
                      item.eventDate
                    )}
                  </td>

                  <td className="p-2 space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => {
                            updateItem.mutate({
                              ...item,
                              ...editValues,
                            } as Item);
                            setEditingId(null);
                            setEditValues({});
                          }}
                          className="text-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setEditValues(item);
                          }}
                          className="text-blue-950"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            const clone = { ...item, id: Date.now() };
                            setItems((prev) => [...prev, clone]);
                          }}
                          className="text-blue-950"
                        >
                          <FaClone />
                        </button>
                        <button
                          onClick={() => deleteItem.mutate(item.id)}
                          className="text-blue-950"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="fixed bottom-0 w-full bg-white p-4 flex justify-around items-center border-t border-gray-200 z-50">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedIds(items.map((i) => i.id))}
            className="flex items-center px-3 py-2 bg-gray-200 text-blue-950 rounded"
          >
            <FaCheck />
            <span className="hidden sm:inline ml-1">Select All</span>
          </button>

          <button
            onClick={() => setSelectedIds([])}
            className="flex items-center px-3 py-2 bg-gray-300 text-blue-950 rounded"
          >
            <FaWindowClose />
            <span className="hidden sm:inline ml-1">Deselect</span>
          </button>

          <button
            onClick={() => {
              selectedIds.forEach((id) => deleteItem.mutate(id));
              setSelectedIds([]);
            }}
            className="flex items-center px-3 py-2 bg-gray-300 text-blue-950 rounded"
          >
            <FaTrash />
            <span className="hidden sm:inline ml-1">Delete</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center px-3 py-2 bg-gray-200 text-black rounded">
            <FaTimes />
            <span className="hidden sm:inline ml-1">Cancel</span>
          </button>

          <button className="flex items-center px-3 py-2 bg-green-600 text-white rounded">
            <FaRocket />
            <span className="hidden sm:inline ml-1">Publish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
