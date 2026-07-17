import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Markdown from "react-markdown";
import mediaAPI from "../../api/mediaAPI";
import demographicsAPI from "../../api/demographicsAPI";
import genreAPI from "../../api/genreAPI";
import reviewsAPI from "../../api/reviewsAPI";

const NewReviewPage = () => {

    const [title, setTitle] = useState("");

    const [mediaTypeId, setMediaTypeId] = useState("1");
    const [mediaOptions, setMediaOptions] = useState([]);

    const [demographicId, setDemographicId] = useState("1");
    const [demographicOptions, setDemographicOptions] = useState([]);

    const [genreOptions, setGenreOptions] = useState([]);
    const [selectedGenreIds, setSelectedGenreIds] = useState([]);

    const [score, setScore] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [bodyMarkdown, setBodyMarkdown] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {

            try {
                const [
                    mediaTypes, 
                    demographicData, 
                    genreData] = await Promise.all([
                        mediaAPI.getMediaTypes(),
                        demographicsAPI.getDemographics(),
                        genreAPI.getGenres()
                    ]);
                
                setMediaOptions(mediaTypes.mediaTypes);
                setDemographicOptions(demographicData.demographics);
                setGenreOptions(genreData.genres);
                
                setLoadingData(false);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();

    }, []);

    const handleFileUpload = async (e) => {
        setUploadingImage(true);
        const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;
        const cloudName = import.meta.env.VITE_CLOUD_NAME;
        const file = e.target.files[0];

        if (!file) return

        try {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", uploadPreset);
            data.append("cloud_name", cloudName);

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: data
            });

            const uploadedImage = await res.json();
            setCoverImageUrl(uploadedImage.url);
            setUploadingImage(false);
        } catch (err) {
            console.log(err);
        }
    }

    const handleGenreToggle = (genreId) => {
        setSelectedGenreIds((prev) =>
            prev.includes(genreId)
            ? prev.filter((id) => id !== genreId)
            : [...prev, genreId]
        );
    }

    const handleSubmit = async (e) => {
        setSubmitting(true);
        e.preventDefault();
        const newErrors = [];

        if (!coverImageUrl || coverImageUrl.length === 0) {
            newErrors.push("Please upload a cover image");
        }

        if (!selectedGenreIds || selectedGenreIds.length === 0) {
            newErrors.push("Please pick at least 1 genre")
        }

        setErrors(newErrors);

        if (newErrors.length > 0) return;

        try {
            await reviewsAPI.postCreateReview({
                demographicId: Number(demographicId),
                mediaTypeId: Number(mediaTypeId),
                title,
                score: Number(score),
                body: bodyMarkdown,
                coverImageUrl,
                genreIds: selectedGenreIds
            });

            setSubmitting(false);
            navigate("/admin/dashboard/reviews");
        } catch (err) {
            setErrors(["Could not save review"]);
        }
    };

    return (
        <section className="new-review-content">
            <h1>New Review</h1>
            <form onSubmit={handleSubmit}>
                {errors.length > 0 ? (
                    <ul>
                        {errors.map((error) => (
                            <li key={error}>{error}</li>
                        ))}
                    </ul>
                ) : ""}
                <div className="img-upload-wrapper">
                    {uploadingImage ? <p>Uploading...</p> : <p>Upload next img</p> }
                    <label htmlFor="coverImage">Cover Image</label>
                    <input 
                        type="file" 
                        id="coverImage" 
                        onChange={handleFileUpload}
                    />
                </div>

                <label htmlFor="title">Title</label>
                <input 
                    id="title" 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                />

                <label htmlFor="title">Media type</label>
                {loadingData ? (
                    <p>Loading media types...</p>
                ) : (
                    <select value={mediaTypeId} onChange={(e) => setMediaTypeId(e.target.value)}>
                        {mediaOptions.map((type) => (
                            <option key={type.media_type_id} value={type.media_type_id}>{type.media_type_id}. {type.name}</option>
                        ))}
                    </select>
                )}

                <label htmlFor="title">Demographic</label>
                {loadingData ? (
                    <p>Loading demographics...</p>
                ) : (
                    <select value={demographicId} onChange={(e) => setDemographicId(e.target.value)}>
                        {demographicOptions.map((d) => (
                            <option key={d.demographic_id} value={d.demographic_id}>{d.demographic_id}. {d.name}</option>
                        ))}
                    </select>
                )}

                <label htmlFor="score">Score</label>
                <input 
                    type="number"
                    min={0}
                    max={10}
                    defaultValue={0}
                    onChange={(e) => setScore(e.target.value)} 
                />

                <div className="genre-checkboxes">
                    {loadingData ? (
                        <p>Loading genres...</p>
                    ) : (
                        <div>
                            {genreOptions.map((genre) => (
                                <label key={genre.genre_id}>
                                    <input 
                                        type="checkbox"
                                        checked={selectedGenreIds.includes(genre.genre_id)}
                                        onChange={() => handleGenreToggle(genre.genre_id)}
                                    />
                                    {genre.name}
                                </label>
                             ))}
                        </div>
                    )}
                </div>

                <div className="body-editor">
                    <div className="editor-wrapper">
                        <label htmlFor="bodyMarkdown">Body (Markdown supported)</label>
                        <textarea 
                            name="bodyMarkdown" 
                            id="bodyMarkdown"
                            onChange={(e) => setBodyMarkdown(e.target.value)}
                            required    
                        />
                    </div>

                    <div className="preview-wrapper">
                        <p>Body Preview</p>
                        <Markdown>{bodyMarkdown}</Markdown>
                    </div>
                </div>

                <div className="btn-wrapper">
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Saving..." : "Save Review"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default NewReviewPage;