import { Dog } from "../types";

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDogs: Dog[];
  onRemove: (dogItem: Dog) => void;
  onFindMatch: () => void;
}

export const FavoritesDrawer = ({
  isOpen,
  onClose,
  selectedDogs,
  onRemove,
  onFindMatch,
}: FavoritesDrawerProps) => {
  return (
    <div
      className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Favorites ({selectedDogs.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        <button
          onClick={onFindMatch}
          disabled={selectedDogs.length === 0}
          className={`w-full py-2 px-4 rounded-md text-white transition-colors
              ${
                selectedDogs.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }
            `}
        >
          Find Perfect Match
        </button>

        <div className="flex-1 overflow-y-auto">
          {selectedDogs.map((dog) => (
            <div
              key={dog.id}
              className="flex items-center p-4 border-b hover:bg-gray-50"
            >
              <img
                src={dog.img}
                alt={dog.name}
                className="w-16 h-16 object-cover rounded-full"
              />
              <div className="ml-4 flex-1">
                <h3 className="font-semibold">{dog.name}</h3>
                <p className="text-sm text-gray-600">{dog.breed}</p>
              </div>
              <button
                onClick={() => onRemove(dog)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
