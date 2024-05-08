import React, { useState } from "react";
import EntityForm from "../components/EntityForm";
import EntityManager from "../components/EntityManager";

const HomePage: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const handleEntitySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEntity(e.target.value);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Basic Headless CMS</h1>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Create Table</h2>
          <EntityForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Entries</h2>
          <input
            type="text"
            className="block w-full px-3 py-2 border rounded-md mb-4"
            placeholder="Enter entity name"
            value={selectedEntity || ""}
            onChange={handleEntitySelect}
          />
          {selectedEntity && <EntityManager entityName={selectedEntity} />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
