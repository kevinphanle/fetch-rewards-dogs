import { useState, Fragment } from "react";
import { Dog } from "../types";
import { Transition } from "@headlessui/react";
import { Loader } from "./Loader";

interface DogCardProps {
  dog: {
    id: string;
    breed: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
  };
  isSelected: boolean;
  onSelect: (dogItem: Dog) => void;
}

export const DogCard = ({ dog, isSelected, onSelect }: DogCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={`
        relative bg-white rounded-lg shadow-md overflow-hidden
        transform transition-all duration-200 hover:shadow-lg
        ${isSelected ? "ring-2 ring-blue-500" : ""}
      `}
    >
      <div className="relative h-48 bg-gray-200">
        {/* Image */}
        <img
          src={dog.img}
          alt={dog.name}
          className={`
            w-full h-48 object-cover transition-opacity duration-300
            ${imageLoaded ? "opacity-100" : "opacity-0"}
          `}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Loading State */}
        <Transition
          as={Fragment}
          show={!imageLoaded}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader />
          </div>
        </Transition>
      </div>

      {/* Content */}
      <Transition
        as={Fragment}
        show={imageLoaded}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold">{dog.name}</h3>
          <p className="text-gray-600">{dog.breed}</p>
          <p className="text-gray-600">{dog.age} years old</p>
          <p className="text-gray-600">ZIP: {dog.zip_code}</p>
        </div>
      </Transition>

      {/* Favorite Button */}
      <button
        onClick={() => onSelect(dog)}
        className={`
          absolute top-2 right-2 p-2 rounded-full
          transform transition-all duration-200
          hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2
          ${
            isSelected
              ? "bg-blue-500 text-white focus:ring-blue-400"
              : "bg-white text-gray-600 focus:ring-gray-400"
          }
        `}
        aria-label={isSelected ? "Remove from favorites" : "Add to favorites"}
      >
        ❤️
      </button>
    </div>
  );
};
