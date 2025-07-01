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
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdRadioButtonChecked } from "react-icons/md";
import NoData from "./common/NoData";

function groupItemsByEvent(items: Item[]) {
  const grouped = items.reduce((acc: Record<string, Item[]>, item) => {
    const key = item.eventId?.toString() ?? "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  return Object.values(grouped).map((groupItems) => {
    const first = groupItems[0];
    return {
      eventId: first.eventId,
      eventName: first.eventName ?? "",
      eventDay: first.eventDay ?? "",
      venue: first.venue ?? "",
      eventTime: first.eventTime ?? "",
      items: groupItems,
    };
  });
}

export default function InventoryTable() {
  const { items, setItems, activeEventId } = useContext(InventoryContext)!;
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Item>>({});
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [bulkEditValues, setBulkEditValues] = useState<
    Record<number, Partial<Item>>
  >({});

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
  const matchingGroups = groupItemsByEvent(items).filter(
    (group) => group.eventId === activeEventId
  );

  useEffect(() => {
    if (data) setItems(data);
  }, [data, setItems]);

  return (
    <div>
      {!activeEventId && (
        <div className="text-center h-screen text-gray-600 my-10 text-lg">
          Please select a Match event to add or view inventory
        </div>
      )}

      {activeEventId && matchingGroups.length === 0 && <NoData />}
      {matchingGroups.map((group, idx) => (
        <div key={idx} className="mt-5 p-6 overflow-x-auto w-full">
          <table className="w-full min-w-[900px] text-sm mb-20">
            <thead>
              <tr className="bg-[#15005E] text-white text-sm">
                <td colSpan={12} className="p-3">
                  <div className="flex flex-wrap gap-36  items-center mb-2">
                    <span className="font-medium flex gap-8">
                      <MdRadioButtonChecked className="mt-1" />{" "}
                      {group.eventName || "Event Name"}
                    </span>
                    <div className="flex gap-10 items-center text-sm text-white">
                      <div className="flex items-center gap-2">
                        <FaCalendar /> {group?.eventDay || "Date"}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock /> {group.eventTime || "Time"}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt /> {group?.venue || "Venue"}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>

            <thead className=" h-12 text-gray-600">
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Ticket Type</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Section/Block</th>
                <th>Row</th>
                <th>First Seat</th>
                <th>Face Value</th>
                <th>Payout Price</th>
                <th>Ship Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {group.items.map((item) => {
                const isRowEditing = isBulkEditing || editingId === item.id;
                const editSource = isBulkEditing
                  ? bulkEditValues[item.id] ?? {}
                  : editValues;

                return (
                  <tr
                    key={item.id}
                    className={`border-t text-black text-center ${
                      selectedIds.includes(item.id)
                        ? "bg-indigo-100"
                        : "bg-white"
                    }`}
                  >
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

                    {editableColumns.map((col) => (
                      <td key={col} className="p-2">
                        {isRowEditing ? (
                          col === "ticketType" ? (
                            <select
                              value={String(editSource[col] ?? item[col] ?? "")}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (isBulkEditing) {
                                  setBulkEditValues((prev) => ({
                                    ...prev,
                                    [item.id]: {
                                      ...(prev[item.id] || {}),
                                      [col]: value,
                                    },
                                  }));
                                } else {
                                  setEditValues((prev) => ({
                                    ...prev,
                                    [col]: value,
                                  }));
                                }
                              }}
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
                              value={Number(editSource[col] ?? item[col] ?? 0)}
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                if (isBulkEditing) {
                                  setBulkEditValues((prev) => ({
                                    ...prev,
                                    [item.id]: {
                                      ...(prev[item.id] || {}),
                                      [col]: value,
                                    },
                                  }));
                                } else {
                                  setEditValues((prev) => ({
                                    ...prev,
                                    [col]: value,
                                  }));
                                }
                              }}
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
                              value={String(editSource[col] ?? item[col] ?? "")}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (isBulkEditing) {
                                  setBulkEditValues((prev) => ({
                                    ...prev,
                                    [item.id]: {
                                      ...(prev[item.id] || {}),
                                      [col]: value,
                                    },
                                  }));
                                } else {
                                  setEditValues((prev) => ({
                                    ...prev,
                                    [col]: value,
                                  }));
                                }
                              }}
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
                              value={String(editSource[col] ?? item[col] ?? "")}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (isBulkEditing) {
                                  setBulkEditValues((prev) => ({
                                    ...prev,
                                    [item.id]: {
                                      ...(prev[item.id] || {}),
                                      [col]: value,
                                    },
                                  }));
                                } else {
                                  setEditValues((prev) => ({
                                    ...prev,
                                    [col]: value,
                                  }));
                                }
                              }}
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
                              value={String(editSource[col] ?? item[col] ?? "")}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (isBulkEditing) {
                                  setBulkEditValues((prev) => ({
                                    ...prev,
                                    [item.id]: {
                                      ...(prev[item.id] || {}),
                                      [col]: value,
                                    },
                                  }));
                                } else {
                                  setEditValues((prev) => ({
                                    ...prev,
                                    [col]: value,
                                  }));
                                }
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-black"
                            />
                          )
                        ) : (
                          item[col]
                        )}
                      </td>
                    ))}

                    <td className="p-2">
                      {isRowEditing ? (
                        <input
                          type="text"
                          step="0.01"
                          value={editSource.faceValue ?? item.faceValue}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (isBulkEditing) {
                              setBulkEditValues((prev) => ({
                                ...prev,
                                [item.id]: {
                                  ...(prev[item.id] || {}),
                                  faceValue: value,
                                },
                              }));
                            } else {
                              setEditValues((prev) => ({
                                ...prev,
                                faceValue: value,
                              }));
                            }
                          }}
                          className="w-full p-1 border border-gray-300 rounded text-black"
                        />
                      ) : (
                        item.faceValue
                      )}
                    </td>

                    <td className="p-2">
                      {isRowEditing ? (
                        <input
                          type="text"
                          step="0.01"
                          value={editSource.payoutPrice ?? item.payoutPrice}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (isBulkEditing) {
                              setBulkEditValues((prev) => ({
                                ...prev,
                                [item.id]: {
                                  ...(prev[item.id] || {}),
                                  payoutPrice: value,
                                },
                              }));
                            } else {
                              setEditValues((prev) => ({
                                ...prev,
                                payoutPrice: value,
                              }));
                            }
                          }}
                          className="w-full p-1 border border-gray-300 rounded text-black"
                        />
                      ) : (
                        item.payoutPrice
                      )}
                    </td>

                    <td className="p-2">
                      {isRowEditing ? (
                        <input
                          type="date"
                          value={editSource.eventDate ?? item.eventDate}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (isBulkEditing) {
                              setBulkEditValues((prev) => ({
                                ...prev,
                                [item.id]: {
                                  ...(prev[item.id] || {}),
                                  eventDate: value,
                                },
                              }));
                            } else {
                              setEditValues((prev) => ({
                                ...prev,
                                eventDate: value,
                              }));
                            }
                          }}
                          className="w-full p-1 border border-gray-300 rounded text-black"
                        />
                      ) : (
                        item.eventDate
                      )}
                    </td>

                    <td className="p-2 space-x-2">
                      {!isBulkEditing ? (
                        isRowEditing ? (
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
                        )
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      <div className=" sticky bottom-0 bg-white p-4 flex justify-between items-center border-t border-gray-200 z-50">
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
          <div className="flex gap-2">
            {!isBulkEditing ? (
              <>
                <button
                  className="flex items-center px-3 py-2 bg-gray-200 text-black rounded"
                  onClick={() => setIsBulkEditing(true)}
                >
                  <FaEdit />
                  <span className="hidden sm:inline ml-1">Edit</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    selectedIds.forEach((id) => {
                      if (bulkEditValues[id]) {
                        const item = items.find((i) => i.id === id);
                        if (item) {
                          updateItem.mutate({ ...item, ...bulkEditValues[id] });
                        }
                      }
                    });
                    setIsBulkEditing(false);
                    setBulkEditValues({});
                    setSelectedIds([]);
                  }}
                  className="flex items-center px-3 py-2 bg-gray-200 text-blue-950 rounded"
                >
                  <FaCheck />
                  <span className="hidden sm:inline ml-1">Save edit</span>
                </button>
                <button
                  onClick={() => {
                    setIsBulkEditing(false);
                    setBulkEditValues({});
                  }}
                  className="flex items-center px-3 py-2 bg-gray-300 text-blue-950 rounded"
                >
                  <FaTimes />
                  <span className="hidden sm:inline ml-1">Cancel</span>
                </button>
              </>
            )}
          </div>
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
