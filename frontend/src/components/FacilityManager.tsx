"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { api } from "@/libs/api";
import { Facility } from "@/types";
import { sports } from "@/sports";

export default function FacilityManager({
  facilities,
  token,
}: {
  facilities: Facility[];
  token: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Facility | "new" | null>(null);
  const [deleting, setDeleting] = useState<Facility | null>(null);
  const [error, setError] = useState("");

  const editing = form && form !== "new" ? form : null;

  function close() {
    setForm(null);
    setDeleting(null);
    setError("");
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await api(editing ? `/facilities/${editing._id}` : "/facilities", {
        method: editing ? "PUT" : "POST",
        token,
        body,
      });
      close();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function remove() {
    await api(`/facilities/${deleting!._id}`, { method: "DELETE", token });
    close();
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Facilities</h1>
        <Button variant="contained" color="secondary" onClick={() => setForm("new")}>
          + Add facility
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-500">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Sport type</th>
              <th className="p-4">Location</th>
              <th className="p-4">Capacity</th>
              <th className="p-4">Rate</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((f) => (
              <tr key={f._id} className="border-t border-gray-200">
                <td className="p-4 font-semibold">{f.name}</td>
                <td className="p-4">{f.sportType}</td>
                <td className="p-4">{f.location}</td>
                <td className="p-4">{f.capacity}</td>
                <td className="p-4">฿{f.hourlyRate} / hour</td>
                <td className="p-4">
                  <button
                    onClick={() => setForm(f)}
                    className="text-teal-700 font-medium mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleting(f)}
                    className="text-red-600 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <Dialog open onClose={close} fullWidth maxWidth="xs">
          <form onSubmit={save}>
            <DialogTitle>{editing ? "Edit facility" : "Add facility"}</DialogTitle>
            <DialogContent className="flex flex-col gap-4 !pt-2">
              <TextField name="name" label="Name" defaultValue={editing?.name} required />
              <TextField
                name="sportType"
                label="Sport type"
                defaultValue={editing?.sportType ?? sports[0]}
                select
                slotProps={{ select: { native: true } }}
              >
                {sports.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </TextField>
              <TextField name="location" label="Location" defaultValue={editing?.location} required />
              <TextField
                name="capacity"
                label="Capacity"
                type="number"
                defaultValue={editing?.capacity}
                required
                slotProps={{ htmlInput: { min: 1 } }}
              />
              <TextField
                name="hourlyRate"
                label="Hourly rate"
                type="number"
                defaultValue={editing?.hourlyRate}
                required
                slotProps={{ htmlInput: { min: 0 } }}
              />
              {error && (
                <p className="text-red-600 text-sm bg-red-50 rounded p-3">{error}</p>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={close}>Cancel</Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}

      <Dialog open={!!deleting} onClose={close}>
        <DialogTitle>Remove this facility?</DialogTitle>
        <DialogContent>
          <p className="text-gray-500">
            Remove {deleting?.name} from the facilities directory. This cannot be
            undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button color="error" variant="contained" onClick={remove}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
