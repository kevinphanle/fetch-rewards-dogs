import { Dog } from "../types";
import { DogCard } from "./DogCard";
import { Transition } from "@headlessui/react";

interface DogGridProps {
  dogs: Dog[];
  selectedDogs: Dog[];
  isImagesLoading: boolean;
  onSelect: (dogObj: Dog) => void;
}

export const DogGrid = ({
  dogs,
  selectedDogs,
  isImagesLoading,
  onSelect,
}: DogGridProps) => {
  const selectedDogIds = selectedDogs.map((dog) => dog.id);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
      {dogs.map((dog) => (
        <Transition
          key={dog.id}
          show={!isImagesLoading}
          enter="transition-all duration-500 ease-out"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="transition-all duration-300 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="h-full">
            <DogCard
              dog={dog}
              isSelected={selectedDogIds.includes(dog.id)}
              onSelect={onSelect}
            />
          </div>
        </Transition>
      ))}
    </div>
  );
};
