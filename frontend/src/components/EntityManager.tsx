import React, { useState, useEffect } from "react";
import axios from "axios";

interface Entity {
  id: number;
  [key: string]: any;
}

interface EntityManagerProps {
  entityName: string;
}

const EntityManager: React.FC<EntityManagerProps> = ({ entityName }) => {
  const [entries, setEntries] = useState<Entity[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [newEntry, setNewEntry] = useState<any>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingEntry, setEditingEntry] = useState<any>({});

  const fetchEntries = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/${entityName}`
      );
      const fetchedEntries = response.data;

      if (fetchedEntries.length > 0) {
        const fieldNames = Object.keys(fetchedEntries[0]);
        setFields(fieldNames);
      } else {
        setFields(["id", "name", "email", "mobileNumber", "dateOfBirth"]);
      }

      setEntries(fetchedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEditing = false
  ) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingEntry({ ...editingEntry, [name]: value });
    } else {
      setNewEntry({ ...newEntry, [name]: value });
    }
  };

  const createEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/${entityName}`, newEntry);
      fetchEntries();
      setNewEntry({});
    } catch (error) {
      console.error("Error creating entry:", error);
    }
  };

  const updateEntry = async (id: number) => {
    try {
      await axios.put(
        `http://localhost:5000/api/${entityName}/${id}`,
        editingEntry
      );
      fetchEntries();
      setEditingId(null);
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  const deleteEntry = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/${entityName}/${id}`);
      fetchEntries();
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [entityName]);

  return (
    <div className="space-y-4">
      <form className="space-y-4" onSubmit={createEntry}>
        {fields
          .filter((key) => key !== "id")
          .map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium">{field}</label>
              <input
                type={field === "dateOfBirth" ? "date" : "text"}
                name={field}
                className="block w-full px-3 py-2 border rounded-md"
                value={newEntry[field] || ""}
                onChange={(e) => handleChange(e, false)}
              />
            </div>
          ))}
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Create Entry
        </button>
      </form>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            {fields.map((field) => (
              <th key={field} className="px-4 py-2 border">
                {field}
              </th>
            ))}
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              {fields.map((field) => (
                <td key={field} className="px-4 py-2 border">
                  {editingId === entry.id ? (
                    <input
                      type={
                        field === "dateOfBirth"
                          ? "date"
                          : field === "mobileNumber"
                          ? "tel"
                          : "text"
                      }
                      name={field}
                      value={editingEntry[field] || ""}
                      onChange={(e) => handleChange(e, true)}
                      className="w-full px-2 py-1 border rounded-md"
                    />
                  ) : (
                    entry[field]
                  )}
                </td>
              ))}
              <td className="px-4 py-2 border">
                {editingId === entry.id ? (
                  <>
                    <button
                      onClick={() => updateEntry(entry.id)}
                      className="mr-2 px-2 py-1 bg-blue-500 text-white rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2 py-1 bg-gray-500 text-white rounded-md"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(entry.id);
                        setEditingEntry(entry);
                      }}
                      className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EntityManager;
