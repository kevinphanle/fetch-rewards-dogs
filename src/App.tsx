import { useState, useEffect } from "react";
import { Pagination } from "./components/Pagination";
import { DogGrid } from "./components/DogGrid";
import { Login } from "./components/Login";
import { SearchInput } from "./components/SearchInput";
import { Loader } from "./components/Loader";
import { useDogs } from "./hooks/useDogs";
import { useAuth } from "./hooks/useAuth";
import { SortDirection, Dog } from "./types";
import { FavoritesDrawer } from "./components/FavoritesDrawer";
import { MatchModal } from "./components/MatchModal";

import "./App.css";

function App() {
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  const itemsPerPage = 12;
  const { isAuthenticated, setIsAuthenticated, handleSignOut } = useAuth();

  const {
    isLoading,
    breeds,
    fetchBreeds,
    dogObjs,
    count,
    error,
    isImagesLoading,
    getDogIds,
    handleFindMatch,
    matchedDog,
  } = useDogs(itemsPerPage);

  const handleSignOutClick = async () => {
    const success = await handleSignOut();
    if (success) {
      setFavoriteDogs([]);
      setSearchTerm("");
      setCurrentPage(1);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (pageNumber: number) => {
    const newLastIndex = ((pageNumber - 1) * itemsPerPage).toString();
    setCurrentPage(pageNumber);
    getDogIds(sortedAndFilteredBreeds, newLastIndex);
  };

  const handleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    getDogIds(
      sortedAndFilteredBreeds,
      ((currentPage - 1) * itemsPerPage).toString(),
      `name:${sortDirection === "asc" ? "desc" : "asc"}`
    );
  };

  const toggleDogSelection = (dogItem: Dog) => {
    if (favoriteDogs.some((dog) => dog.id === dogItem.id)) {
      setFavoriteDogs((prev) => prev.filter((dog) => dog.id !== dogItem.id));
    } else {
      setFavoriteDogs((prev) => [...prev, dogItem]);
    }
  };

  const handleMatchClick = async () => {
    const match = await handleFindMatch(favoriteDogs);
    if (match) {
      setIsFavoritesOpen(false);
      setIsMatchModalOpen(true);
    }
  };

  const getFilteredDogs = () => {
    return breeds.filter((breed) =>
      breed.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const sortedAndFilteredBreeds = getFilteredDogs()
    .filter((item): item is string => typeof item === "string")
    .sort((a, b) => {
      return sortDirection === "asc" ? a.localeCompare(b) : b.localeCompare(a);
    });

  const totalPages = Math.ceil(count / itemsPerPage);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBreeds();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      getDogIds(sortedAndFilteredBreeds, "0", `name:${sortDirection}`);
      setCurrentPage(1);
    }
  }, [sortDirection, searchTerm, isAuthenticated]);

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Dog Breeds</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavoritesOpen(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              View Favorites ({favoriteDogs.length})
            </button>
            <button
              onClick={handleSort}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Sort by name {sortDirection === "asc" ? "↓" : "↑"}
            </button>
            <button
              onClick={handleSignOutClick}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={`Search by breed...`}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <Loader />
        ) : (
          <>
            <p className="text-sm text-gray-600 my-2">
              Showing {dogObjs.length} of {count} dogs (Page {currentPage} of{" "}
              {totalPages})
            </p>

            <DogGrid
              dogs={dogObjs}
              selectedDogs={favoriteDogs}
              isImagesLoading={isImagesLoading}
              onSelect={toggleDogSelection}
            />

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            <MatchModal
              isOpen={isMatchModalOpen}
              onClose={() => setIsMatchModalOpen(false)}
              matchedDog={matchedDog}
            />

            <FavoritesDrawer
              isOpen={isFavoritesOpen}
              onClose={() => setIsFavoritesOpen(false)}
              selectedDogs={favoriteDogs}
              onRemove={toggleDogSelection}
              onFindMatch={handleMatchClick}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
