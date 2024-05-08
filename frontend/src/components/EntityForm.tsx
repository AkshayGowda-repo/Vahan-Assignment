// components/EntityForm.tsx
import React, { useState } from "react";
import axios from "axios";

interface Attribute {
  name: string;
  type: string;
}

const EntityForm: React.FC = () => {
  const [entityName, setEntityName] = useState("");
  const [attributes, setAttributes] = useState<Attribute[]>([
    { name: "", type: "STRING" },
  ]);

  const handleAttributeChange = (
    index: number,
    field: keyof Attribute,
    value: string
  ) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const addAttribute = () =>
    setAttributes([...attributes, { name: "", type: "STRING" }]);

  const removeAttribute = (index: number) =>
    setAttributes(attributes.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/entity", {
        entityName,
        attributes,
      });
      alert("Entity created successfully");
      setEntityName("");
      setAttributes([{ name: "", type: "STRING" }]);
    } catch (error) {
      console.error(error);
      alert("Error creating entity");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium">Entity Name</label>
        <input
          type="text"
          className="block w-full px-3 py-2 border rounded-md"
          value={entityName}
          onChange={(e) => setEntityName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Attributes</label>
        {attributes.map((attr, index) => (
          <div key={index} className="flex space-x-4 mb-2">
            <input
              type="text"
              className="block w-1/2 px-3 py-2 border rounded-md"
              placeholder="Attribute Name"
              value={attr.name}
              onChange={(e) =>
                handleAttributeChange(index, "name", e.target.value)
              }
            />
            <select
              className="block w-1/2 px-3 py-2 border rounded-md"
              value={attr.type}
              onChange={(e) =>
                handleAttributeChange(index, "type", e.target.value)
              }
            >
              <option value="STRING">String</option>
              <option value="INTEGER">Integer</option>
              <option value="FLOAT">Float</option>
              <option value="DATE">Date</option>
              <option value="BOOLEAN">Boolean</option>
              <option value="BIGINT">BigInt</option>
            </select>
            <button
              type="button"
              onClick={() => removeAttribute(index)}
              className="px-2 text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addAttribute}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Add Attribute
        </button>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Create Entity
      </button>
    </form>
  );
};

export default EntityForm;
