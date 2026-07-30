import { useEffect, useState } from "react";
import { capatilize } from "../../utils/capitilizeText";
import toast from "react-hot-toast";
import genreAPI from "../../api/genreAPI";
import LoadingError from "../../components/LoadingError";

const GenresPage = () => {

    const [genres, setGenres] = useState([]);
    const [loadingGenres, setLoadingGenres] = useState(true);
    const [error, setError] = useState(false);

    const fetchGenres = async () => {
        setLoadingGenres(true);
        setError(false);

        try {
            const genreData = await genreAPI.getGenres();
            setGenres(genreData.genres);
            setLoadingGenres(false);
        } catch (err) {
            console.log(err);
            setError(true);
            setLoadingGenres(false);
            toast.error("Failed to load genres. Please try again");
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    if (error && !loadingGenres) {
        return (
            <LoadingError
                title={"Genres"}
                errorMessage={"Could not load genres"}
                fetchData={fetchGenres}
            />
        );
    };

    return (
        <section>
            <h1 className="text-2xl font-bold text-primary mb-6">Genres</h1>
            {loadingGenres ? (
                <p className="bg-surface border border-border p-8 text-muted text-sm">Loading genres...</p>
            ) : (
                <div className="bg-surface border border-border overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="text-sm font-medium text-left text-muted px-4 py-2">Genre</th>
                            </tr>
                        </thead>
                        <tbody>
                            {genres.map((genre) => (
                                <tr 
                                    key={genre.genre_id}
                                    className="border-t border-gray-200"
                                >
                                    <td className="px-4 py-2 text-sm text-primary">{capatilize(genre.name)}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-end gap-3">
                                            <button 
                                                type="button"
                                                className="text-sm font-medium text-muted hover:text-primary"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                type="button"
                                                className="text-sm font-medium text-red-600 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
};

export default GenresPage;