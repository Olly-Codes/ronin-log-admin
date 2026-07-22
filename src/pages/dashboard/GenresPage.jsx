import { useEffect, useState } from "react";
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
        <section className="genres-content">
            <div className="heading-wrapper">
                <h1>Genres</h1>
            </div>
            <div className="genres-wrapper">
                {loadingGenres ? (
                    <p>Loading genres...</p>
                ) : (
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Genre</th>
                                </tr>
                            </thead>
                            <tbody>
                                {genres.map((genre) => (
                                    <tr key={genre.genre_id}>
                                        <td>{genre.name}</td>
                                        <td>
                                            <button type="button">Edit</button>
                                        </td>
                                        <td>
                                            <button type="button">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    )
};

export default GenresPage;