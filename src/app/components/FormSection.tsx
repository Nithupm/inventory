"use client";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { InventoryContext } from "./ContextProvider";
import { api } from "../../lib/api";
import type { Item } from "../../types";
import {
  FaUpload,
  FaComment,
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import TextField from "@mui/material/TextField";
import { Checkbox, FormControlLabel, MenuItem } from "@mui/material";

type FormInputs = {
  ticketType: string;
  eventId: string;
  eventName?: string;
  eventTime?: string;
  eventDay?: string;
  venue?: string;
  quantity: string;
  splitType: string;
  seatingArrangement: string;
  maxDisplayQty: string;
  fanArea: string;
  category: string;
  sectionBlock: string;
  row: string;
  seating: string;
  faceValue: string;
  payoutPrice: string;
  benefits: string;
  restrictions: string;
  eventDate: string;
  ticketsInHand: boolean;
  uploadTickets: FileList;
};

export default function FormSection() {
  const { setActiveEventId } = useContext(InventoryContext)!;
  const events = [
    {
      id: "event1",
      name: "Concert A",
      date: "Mon, 26th July 2024",
      time: "19:00",
      venue: "Stamford bridge, London, United Kingdom",
    },
    {
      id: "event2",
      name: "Concert B",
      date: "Sun, 26th Nov 2024",
      time: "17:30",
      venue: "Madison Square Garden, US",
    },
    {
      id: "event3",
      name: "Premier League",
      date: "Wed, 1st Jan 2025",
      time: "18:45",
      venue: "Long Beach Arena, LA",
    },
  ];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      eventId: "",
      eventName: "",
      eventTime: "",
      eventDay: "",
      venue: "",
      ticketType: "",
      quantity: "",
      splitType: "",
      seatingArrangement: "",
      maxDisplayQty: "",
      fanArea: "",
      category: "",
      sectionBlock: "",
      row: "",
      seating: "",
      faceValue: "",
      payoutPrice: "",
      benefits: "",
      restrictions: "",
      eventDate: "",
      ticketsInHand: false,
      uploadTickets: undefined as unknown as FileList,
    },
  });

  const selectedEventId = watch("eventId");
  const selectedEvent = events.find((e) => e.id === selectedEventId);

  useEffect(() => {
    if (selectedEventId) setActiveEventId(selectedEventId);
  }, [selectedEventId, setActiveEventId]);

  const queryClient = useQueryClient();
  const createItem = useMutation({
    mutationFn: (item: Omit<Item, "id">) => api.post("/inventory", item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  const onSubmit = (data: FormInputs) => {
    const sel = events.find((e) => e.id === data.eventId);

    const payload: Omit<Item, "id"> = {
      ...data,
      eventName: sel?.name || "",
      eventTime: sel?.time || "",
      venue: sel?.venue || "",
      eventDay: sel?.date || "",
      quantity: Number(data.quantity),
      maxDisplayQty: Number(data.maxDisplayQty),
      payoutPrice: Number(data.payoutPrice),
      faceValue: Number(data.faceValue),
      uploadTickets: data.uploadTickets?.[0]?.name || "",
    };

    createItem.mutate(payload);
    reset();
    setActiveEventId(data.eventId);
  };

  return (
    <div className="bg-white ">
      <div className="flex justify-between items-center p-5">
        <h1 className="text-lg md:text-2xl font-semibold text-black">
          Add Inventory
        </h1>
        <div className="flex items-center space-x-4">
          <button className="border border-blue-800 text-[14px] md:text-base rounded-md w-30 p-1.5 md:w-40 h-10 text-blue-700">
            Request Event
          </button>
          <FaComment className="text-[#00c2f4] text-xl" />
        </div>
      </div>
      <hr className="text-gray-300" />
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 rounded shadow">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-6">
          <div className="lg:col-span-2">
            <TextField
              select
              label="Choose Match Event *"
              fullWidth
              size="small"
              InputProps={{ sx: { fontSize: "14px" } }}
              variant="outlined"
              {...register("eventId", { required: "Event is required" })}
              error={!!errors.eventId}
              helperText={errors.eventId?.message}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">Select</MenuItem>
              {events.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.name}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {selectedEvent ? (
            <>
              <div className="lg:col-span-1 flex gap-2 border-r border-gray-300 mt-2">
                <FaCalendar className="mt-0.5 text-[#00c2f4]" />
                <p className="text-sm text-gray-700">{selectedEvent.date}</p>
              </div>
              <div className="lg:col-span-1 flex gap-2 border-r border-gray-300 mt-2">
                <FaClock className="mt-0.5 text-[#00c2f4]" />
                <p className="text-sm text-gray-700">{selectedEvent.time}</p>
              </div>
              <div className="lg:col-span-2 flex gap-2 mt-2">
                <FaMapMarkerAlt className="mt-0.5 text-[#00c2f4]" />
                <p className="text-sm text-gray-700">{selectedEvent.venue}</p>
              </div>
            </>
          ) : (
            <>
              <div className="lg:col-span-1" />
              <div className="lg:col-span-1" />
              <div className="lg:col-span-2" />
            </>
          )}

          <div className="lg:col-span-6">
            <hr className="border-gray-300 my-2" />
          </div>

          <div className="mb-2">
            <TextField
              select
              label="Ticket Type*"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  fontSize: "14px",
                },
              }}
              {...register("ticketType", {
                required: "Ticket type is required",
              })}
              error={!!errors.ticketType}
              helperText={errors.ticketType?.message}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="E-ticket">E-ticket</MenuItem>
              <MenuItem value="Local Delivery">Local Delivery</MenuItem>
            </TextField>
          </div>

          <div className="mb-2">
            <TextField
              select
              label="Quantity*"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  fontSize: "14px",
                },
              }}
              {...register("quantity", {
                required: "quantity is required",
              })}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="10">10</MenuItem>
            </TextField>
          </div>

          <div className="mb-2">
            <TextField
              select
              label="Split Type"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  fontSize: "14px",
                },
              }}
              {...register("splitType")}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Any">Any</MenuItem>
            </TextField>
          </div>

          <div className="mb-2">
            <TextField
              select
              label="Seating Arrangement*"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  fontSize: "14px",
                },
              }}
              {...register("seatingArrangement", {
                required: "Seating Arrangement is required",
              })}
              error={!!errors.seatingArrangement}
              helperText={errors.seatingArrangement?.message}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Seated together">Seated together</MenuItem>
              <MenuItem value="Not seated together">
                Not seated together
              </MenuItem>
            </TextField>
          </div>

          <div className="mb-2">
            <TextField
              select
              label=" Max Display Quantity"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  fontSize: "14px",
                },
              }}
              {...register("maxDisplayQty")}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="20">20</MenuItem>
              <MenuItem value="30">30</MenuItem>
            </TextField>
          </div>

          <div className="mb-2">
            <TextField
              select
              label="Fan Area"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  fontSize: "14px",
                },
              }}
              {...register("fanArea")}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Any">Any</MenuItem>
              <MenuItem value="Home">Home</MenuItem>
            </TextField>
          </div>

          <div className="mb-2">
            <TextField
              select
              label="Category*"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  fontSize: "14px",
                },
              }}
              {...register("category", {
                required: "Category is required",
              })}
              error={!!errors.category}
              helperText={errors.category?.message}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Away Fans Section">Away Fans Section</MenuItem>
              <MenuItem value="Near Fans Section">Near Fans Section</MenuItem>
            </TextField>
          </div>

          <div className="mb-2">
            <TextField
              select
              label="Section/Block"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  fontSize: "14px",
                },
              }}
              {...register("sectionBlock")}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Longside lower tier">
                Longside lower tier
              </MenuItem>
              <MenuItem value="longside upper tier">
                longside upper tier
              </MenuItem>
            </TextField>
          </div>

          <div className="mb-2">
            <TextField
              label="Row"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  fontSize: "14px",
                },
              }}
              {...register("row")}
              InputLabelProps={{ shrink: true }}
            />
          </div>

          <div className="mb-2">
            <TextField
              label="First Seat"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  fontSize: "14px",
                },
              }}
              {...register("seating")}
              InputLabelProps={{ shrink: true }}
            />
          </div>

          <div className="mb-2">
            <TextField
              label="Face Value *"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  fontSize: "14px",
                },
              }}
              {...register("faceValue", {
                valueAsNumber: true,
              })}
              InputLabelProps={{ shrink: true }}
            />
          </div>

          <div className="mb-2">
            <TextField
              label="Payout Price *"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  fontSize: "14px",
                },
              }}
              {...register("payoutPrice", {
                required: "Payout Price is required",
                valueAsNumber: true,
              })}
              InputLabelProps={{ shrink: true }}
              error={!!errors.faceValue}
              helperText={errors.faceValue?.message}
            />
          </div>

          <div>
            <TextField
              select
              label="Benefits"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  fontSize: "14px",
                },
              }}
              {...register("benefits")}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Any">Any</MenuItem>
              <MenuItem value="None">None</MenuItem>
            </TextField>
          </div>

          <div>
            <TextField
              select
              label="Restrictions"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  fontSize: "14px",
                },
              }}
              {...register("restrictions")}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="None">None</MenuItem>
            </TextField>
          </div>

          <div>
            <TextField
              type="date"
              label="Date to ship *"
              fullWidth
              size="small"
              variant="outlined"
              {...register("eventDate", { required: true })}
              error={!!errors.eventDate}
              helperText={errors.eventDate ? "Required" : ""}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: {
                  fontSize: "14px",
                },
              }}
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded px-3 py-2 h-[38px] bg-white">
            <FormControlLabel
              control={<Checkbox {...register("ticketsInHand")} size="small" />}
              label=""
            />
            <input
              type="text"
              placeholder="Ticket in hand"
              readOnly
              className="flex-1 text-sm outline-none text-black bg-transparent border-none"
            />
          </div>
          <div>
            <label className="flex items-center justify-between w-full p-2 border border-gray-300 text-gray-500 rounded cursor-pointer bg-white hover:border-blue-500 h-[38px]">
              <span className="flex gap-5">
                <FaUpload />
                <span className="text-sm">Upload tickets</span>
              </span>
              <input
                type="file"
                {...register("uploadTickets")}
                accept=".pdf,.jpg,.png"
                className="hidden "
              />
            </label>
          </div>
        </div>
        <hr className="w-full text-gray-300" />
        <div className="flex justify-end mt-5">
          <button
            type="submit"
            className="w-40 bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-900"
          >
            + Add Listing
          </button>
        </div>
      </form>
    </div>
  );
}
