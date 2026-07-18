import { useEffect, useState } from "react";
import genreAPI from "../../api/genreAPI";

const GenresPage = () => {

    const [genres, setGenres] = useState([]);
    const [loadingGenres, setLoadingGenres] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchGenres = async () => {

            try {
                const genreData = await genreAPI.getGenres();
                setGenres(genreData.genres);
                setLoadingGenres(false);
            } catch (err) {
                console.log(err);
                setError("Could not load genres");
            }
        };

        fetchGenres();
    }, []);

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