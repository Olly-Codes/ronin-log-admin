import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import mediaAPI from "../../api/mediaAPI";
import demographicsAPI from "../../api/demographicsAPI";
import genreAPI from "../../api/genreAPI";
import reviewsAPI from "../../api/reviewsAPI";
import LoadingError from "../../components/LoadingError";

const NewReviewPage = () => {

    const [title, setTitle] = useState("");

    const [mediaTypeId, setMediaTypeId] = useState("1");
    const [mediaOptions, setMediaOptions] = useState([]);

    const [demographicId, setDemographicId] = useState("1");
    const [demographicOptions, setDemographicOptions] = useState([]);

    const [genreOptions, setGenreOptions] = useState([]);
    const [selectedGenreIds, setSelectedGenreIds] = useState([]);

    const [score, setScore] = useState("");
    const [coverImageFile, setCoverImageFile] = useState("");
    const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState("");
    const [bodyMarkdown, setBodyMarkdown] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState([]);
    const [error, setError] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    

    const navigate = useNavigate();

    const fetchData = async () => {
        setLoadingData(true);
        setError(false);

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
            setError(true);
            setLoadingData(false);
            toast.error("Could not load data. Please try again");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        return () => {
            if (coverImagePreviewUrl) {
                URL.revokeObjectURL(coverImagePreviewUrl);
            }
        }
    },[coverImagePreviewUrl]);

    const uploadImageToCloudinary = async (file) => {
        const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;
        const cloudName = import.meta.env.VITE_CLOUD_NAME;

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", uploadPreset);
        data.append("cloud_name", cloudName);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: data
        });

        const uploadedImage = await res.json();
        return uploadedImage.url;
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setCoverImageFile(file);
        setCoverImagePreviewUrl(URL.createObjectURL(file));
    };

    const handleGenreToggle = (genreId) => {
        setSelectedGenreIds((prev) =>
            prev.includes(genreId)
            ? prev.filter((id) => id !== genreId)
            : [...prev, genreId]
        );
    }

    const selectedGenres = genreOptions
        .filter((genre) => selectedGenreIds.includes(genre.genre_id))
        .map((genre) => genre.name);

    const handleSubmit = async (e) => {
        setSubmitting(true);
        e.preventDefault();
        const newErrors = [];

        if (!coverImageFile) {
            newErrors.push("Please upload a cover image");
        }

        if (!selectedGenreIds || selectedGenreIds.length === 0) {
            newErrors.push("Please pick at least 1 genre")
        }

        setErrors(newErrors);

        if (newErrors.length > 0) {
            setSubmitting(false);
            return;
        }

        try {
            setUploadingImage(true);
            const uploadURL = await uploadImageToCloudinary(coverImageFile);
            setUploadingImage(false);

            await reviewsAPI.postCreateReview({
                demographicId: Number(demographicId),
                mediaTypeId: Number(mediaTypeId),
                title,
                score: Number(score),
                body: bodyMarkdown,
                coverImageUrl: uploadURL,
                genreIds: selectedGenreIds
            });
            toast.success("Review created successfully");

            setSubmitting(false);
            navigate("/admin/dashboard/reviews");
        } catch (err) {
            console.log(err);
            toast.error("Could not save review")
        }
    };

    if (error && !loadingData) {
        return (
            <LoadingError
                title={"Error"}
                errorMessage={"Could not load data"}
                fetchData={fetchData}
            />
        );
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
                        onChange={handleFileSelect}
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
                        <div className="preview-img-wrapper">
                            {coverImagePreviewUrl ? <img src={coverImagePreviewUrl} alt="Cover preview" /> : <p>No image selected</p>}
                        </div>
                        <div className="preview-heading-wrapper">
                            <ul>
                                <li>{mediaOptions.find((type) => type.media_type_id === Number(mediaTypeId))?.name || "N/A"}</li>
                                <li>{demographicOptions.find((d) => d.demographic_id === Number(demographicId))?.name || "N/A"}</li>
                            </ul>
                            <h1>{title || "No title"}</h1>
                        </div>
                        <div className="preview-body-wrapper">
                            <Markdown>{bodyMarkdown}</Markdown>
                            <div className="preview-genre-score-wrapper">
                                <p>Score: {score || "N/A"}</p>
                                <ul>
                                    {selectedGenres.map((genre) => (
                                        <li key={genre}>{genre}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
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