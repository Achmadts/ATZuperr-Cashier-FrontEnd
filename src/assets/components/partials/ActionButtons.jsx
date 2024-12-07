// eslint-disable-next-line no-unused-vars
import React from "react";
import Modal from "react-modal";

// eslint-disable-next-line react/prop-types
const ActionButtons = ({ openModal, setOpenModal }) => {
  return (
    <Modal
      isOpen={openModal}
      onRequestClose={() => setOpenModal(false)}
      contentLabel="Action Modal"
      className="bg-white p-4 rounded-md shadow-md w-[300px] mx-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-lg mb-4">Choose Action</h2>
      <div className="flex flex-col space-y-2">
        <button
          className="btn btn-primary"
          onClick={() => {
            setOpenModal(false);
            alert("Edit clicked");
          }}
        >
          Edit
        </button>
        <button
          className="btn btn-error"
          onClick={() => {
            setOpenModal(false);
            alert("Delete clicked");
          }}
        >
          Delete
        </button>
        <button
          className="btn btn-accent mt-4"
          onClick={() => setOpenModal(false)}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default ActionButtons;
