import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Dog } from "../types";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedDog: Dog | null;
}

export const MatchModal = ({
  isOpen,
  onClose,
  matchedDog,
}: MatchModalProps) => {
  if (!matchedDog) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold text-center mb-4"
                >
                  It's a Match! 🎉
                </Dialog.Title>

                <div className="mt-2">
                  <div className="relative h-64 mb-4">
                    <img
                      src={matchedDog.img}
                      alt={matchedDog.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">
                    {matchedDog.name}
                  </h3>
                  <div className="text-center text-gray-600">
                    <p className="mb-1">{matchedDog.breed}</p>
                    <p className="mb-1">{matchedDog.age} years old</p>
                    <p>ZIP: {matchedDog.zip_code}</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
