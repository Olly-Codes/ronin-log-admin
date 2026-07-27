import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import mediaAPI from "../../api/mediaAPI";
import demographicsAPI from "../../api/demographicsAPI";
import genreAPI from "../../api/genreAPI";
import reviewsAPI from "../../api/reviewsAPI";
import LoadingError from "../../components/LoadingError";
import GenresPage from "./GenresPage";

const EditReviewPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");

    const [mediaTypeId, setMediaTypeId] = useState("1");
    const [mediaOptions, setMediaOptions] = useState([]);

    const [demographicId, setDemographicId] = useState("1");
    const [demographicOptions, setDemographicOptions] = useState([]);

    const [genreOptions, setGenreOptions] = useState([]);
    const [selectedGenreIds, setSelectedGenreIds] = useState([]);

    const [score, setScore] = useState("");
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState("");
    const [existingCoverImageUrl, setExistingCoverImageUrl] = useState("");
    const [bodyMarkdown, setBodyMarkdown] = useState("");
    const [published, setPublished] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [togglingPublish, setTogglingPublish] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [errors, setErrors] = useState([]);
    const [error, setError] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const fetchData = async () => {
        setLoadingData(true);
        setError(false);

        try {
            const [
                mediaTypes,
                demographicData,
                genreData,
                reviewData
            ] = await Promise.all([
                mediaAPI.getMediaTypes(),
                demographicsAPI.getDemographics(),
                genreAPI.getGenres(),
                reviewsAPI.getReviewById(id)
            ]);

            setMediaOptions(mediaTypes.mediaTypes);
            setDemographicOptions(demographicData.demographics);
            setGenreOptions(genreData.genres);

            const review = reviewData.review;

            const matchedMediaType = mediaTypes.mediaTypes.find(
                (type) => type.name === review.media_type
            );
            const matchedDemographic = demographicData.demographics.find(
                (d) => d.name === review.demographic
            );
            const matchedGenreIds = genreData.genres
                .filter((genre) => review.genres.includes(genre.name))
                .map((genre) => genre.genre_id);

            setTitle(review.title);
            setMediaTypeId(matchedMediaType ? String(matchedMediaType.media_type_id) : "1");
            setDemographicId(matchedDemographic ? String(matchedDemographic.demographic_id) : "1");
            setScore(review.score);
            setBodyMarkdown(review.body);
            setExistingCoverImageUrl(review.cover_image_url);
            setPublished(review.published);
            setSelectedGenreIds(matchedGenreIds);

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
    }, [id]);

    useEffect(() => {
        return () => {
            if (coverImagePreviewUrl) {
                URL.revokeObjectURL(coverImagePreviewUrl);
            }
        }
    }, [coverImagePreviewUrl]);

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
            ? prev.filter((gId) => gId !== genreId)
            : [...prev, genreId]
        );
    };

    const selectedGenreNames = genreOptions
        .filter((genre) => selectedGenreIds.includes(genre.genre_id))
        .map((genre) => genre.name);
    
    const validate = () => {
        const newErrors = [];

        if (!title || title.trim().length === 0) {
            newErrors.push("Title cannot be empty");
        }
        if (!bodyMarkdown || bodyMarkdown.trim().length === 0) {
            newErrors.push("Review body cannot be empty");
        }
        if (!existingCoverImageUrl && !coverImageFile) {
            newErrors.push("A cover image is required");
        }
        if (!selectedGenreIds || selectedGenreIds.length === 0) {
            newErrors.push("Please pick at least 1 genre");
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setSubmitting(true);

        try {
            let coverImageUrl = existingCoverImageUrl;

            if (coverImageFile) {
                setUploadingImage(true);
                coverImageUrl = await uploadImageToCloudinary(coverImageFile);
                setUploadingImage(false);
            }

            await reviewsAPI.patchReview(id, {
                demographicId: Number(demographicId),
                mediaTypeId: Number(mediaTypeId),
                title,
                score: Number(score),
                body: bodyMarkdown,
                coverImageUrl,
                genreIds: selectedGenreIds,
                published
            });

            toast.success("Review updated successfully");
            navigate("/admin/dashboard/reviews");
        } catch (err) {
            console.log(err);
            toast.error("Could not update review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleTogglePublish = async () => {
        if (!validate()) return;

        setTogglingPublish(true);

        try {
            const nextPublished = !published;

            await reviewsAPI.patchReview(id, {
                demographicId: Number(demographicId),
                mediaTypeId: Number(mediaTypeId),
                title,
                score: Number(score),
                body: bodyMarkdown,
                coverImageUrl: existingCoverImageUrl,
                genreIds: selectedGenreIds,
                published: nextPublished
            });

            setPublished(nextPublished);
            toast.success(nextPublished ? "Review published" : "Review unpublished");
        } catch (err) {
            console.log(err);
            toast.error("Could not update publish status");
        } finally {
            setTogglingPublish(false);
        }
    };

    if (error && !loadingData) {
        return (
            <LoadingError
                title={"Error"}
                errorMessage={"Could not load review"}
                fetchData={fetchData}
            />
        );
    };

    if (loadingData) {
        return <p>Loading review...</p>;
    }

    return (
        <section className="edit-review-content">
            <h1>Edit Review</h1>

            <button
                type="button"
                onClick={handleTogglePublish}
                disabled={togglingPublish}
            >
                {togglingPublish
                    ? "Updating..."
                    : published ? "Unpublish" : "Publish"}
            </button>

            <form onSubmit={handleSubmit}>
                {errors.length > 0 ? (
                    <ul>
                        {errors.map((err) => (
                            <li key={err}>{err}</li>
                        ))}
                    </ul>
                ) : ""}

                <div className="img-upload-wrapper">
                    {uploadingImage ? <p>Uploading...</p> : <p>Upload new image (optional)</p>}
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

                <label htmlFor="mediaType">Media type</label>
                <select value={mediaTypeId} onChange={(e) => setMediaTypeId(e.target.value)}>
                    {mediaOptions.map((type) => (
                        <option key={type.media_type_id} value={type.media_type_id}>{type.media_type_id}. {type.name}</option>
                    ))}
                </select>

                <label htmlFor="demographic">Demographic</label>
                <select value={demographicId} onChange={(e) => setDemographicId(e.target.value)}>
                    {demographicOptions.map((d) => (
                        <option key={d.demographic_id} value={d.demographic_id}>{d.demographic_id}. {d.name}</option>
                    ))}
                </select>

                <label htmlFor="score">Score</label>
                <input
                    type="number"
                    min={0}
                    max={10}
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                />

                <div className="genre-checkboxes">
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

                <div className="body-editor">
                    <div className="editor-wrapper">
                        <label htmlFor="bodyMarkdown">Body (Markdown supported)</label>
                        <textarea
                            name="bodyMarkdown"
                            id="bodyMarkdown"
                            value={bodyMarkdown}
                            onChange={(e) => setBodyMarkdown(e.target.value)}
                            required
                        />
                    </div>

                    <div className="preview-wrapper">
                        <div className="preview-img-wrapper">
                            <img
                                src={coverImagePreviewUrl || existingCoverImageUrl}
                                alt="Cover preview"
                            />
                        </div>
                        <div className="preview-heading-wrapper">
                            <ul>
                                <li>{mediaOptions.find((type) => type.media_type_id === Number(mediaTypeId))?.name || "N/A"}</li>
                                <li>{demographicOptions.find((d) => d.demographic_id === Number(demographicId))?.name || "N/A"}</li>
                            </ul>
                            <h1>{title || "No Title"}</h1>
                        </div>
                        <div className="preview-body-wrapper">
                            <Markdown>{bodyMarkdown}</Markdown>
                            <div className="preview-genre-score-wrapper">
                                <p>Score: {score || "N/A"}</p>
                                <ul>
                                    {selectedGenreNames.map((genre) => (
                                        <li key={genre}>{genre}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="btn-wrapper">
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
            
        </section>
    );
};

export default EditReviewPage;