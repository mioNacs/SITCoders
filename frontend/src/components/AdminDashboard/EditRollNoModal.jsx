import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

const EditRollNoModal = ({ isOpen, onClose, onSave, user }) => {
  const [rollNo, setRollNo] = useState("");

  useEffect(() => {
    if (user) {
      setRollNo(user.rollNo);
    }
  }, [user]);

  const handleSave = () => {
    onSave(rollNo);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-20">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-xl font-semibold text-gray-800">
            Edit Roll Number for {user?.name}
          </Dialog.Title>
          <div className="mt-4">
            <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700">
              New Roll Number
            </label>
            <input
              type="text"
              id="rollNo"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-md border border-transparent bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditRollNoModal;