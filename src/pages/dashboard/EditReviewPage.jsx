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
        <section>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Edit Review</h1>

                <button
                    type="button"
                    onClick={handleTogglePublish}
                    disabled={togglingPublish}
                    className={`font-semibold py-2 px-4 rounded-md cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                        ${published 
                            ? "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50" 
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                >
                    {togglingPublish
                        ? "Updating..."
                        : published ? "Unpublish" : "Publish"}
                </button>
            </div>

            <form 
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
                <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-4">
                    {errors.length > 0 && (
                        <ul>
                            {errors.map((err) => (
                                <li key={err}>{err}</li>
                            ))}
                        </ul>
                    )}

                    <div>
                        <label 
                            htmlFor="coverImage"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Cover Image {uploadingImage && <span className="text-gray-400 font-normal">uploading...</span>}
                        </label>
                        <input
                            type="file"
                            id="coverImage"
                            onChange={handleFileSelect}
                            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">Leave unselected if you would like to keep the current image</p>
                    </div>

                    <div>
                        <label 
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label 
                                htmlFor="mediaType"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Media type
                            </label>
                            <select
                                id="mediaType" 
                                value={mediaTypeId} 
                                onChange={(e) => setMediaTypeId(e.target.value)}
                                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                {mediaOptions.map((type) => (
                                    <option key={type.media_type_id} value={type.media_type_id}>{type.media_type_id}. {type.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label 
                                htmlFor="demographic"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Demographic
                            </label>
                            <select
                                id="demographic" 
                                value={demographicId} 
                                onChange={(e) => setDemographicId(e.target.value)}
                                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                {demographicOptions.map((d) => (
                                    <option key={d.demographic_id} value={d.demographic_id}>{d.demographic_id}. {d.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label 
                            htmlFor="score"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Score
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={10}
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div>
                        <p className="block text-sm font-medium text-gray-700 mb-1">Genres</p>
                        <div className="flex flex-wrap gap-2">
                            {genreOptions.map((genre) => (
                                <label key={genre.genre_id}>
                                    <input
                                        type="checkbox"
                                        checked={selectedGenreIds.includes(genre.genre_id)}
                                        onChange={() => handleGenreToggle(genre.genre_id)}
                                        className="mr-2"
                                    />
                                    {genre.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label 
                            htmlFor="bodyMarkdown"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Body (Markdown supported)
                        </label>
                        <textarea
                            name="bodyMarkdown"
                            id="bodyMarkdown"
                            value={bodyMarkdown}
                            onChange={(e) => setBodyMarkdown(e.target.value)}
                            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[280px]"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md cursor-pointer hover:bg-red-700 transition-colrs duration-300 disabled:opacity-50 disbaled:cursor-not-allowed self-start"
                    >
                        {submitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500 mb-2">Preview</p>

                    <div className="aspect-[21/9] bg-gray-300 rounded-lg overflow-hidden mb-4">
                            <img
                                src={coverImagePreviewUrl || existingCoverImageUrl}
                                alt="Cover preview"
                                className="w-full h-full object-cover"
                            />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(200px, 260px)] gap-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-1">
                                {mediaOptions.find((type) => type.media_type_id === Number(mediaTypeId))?.name || "N/A"} &bull;
                                {" "}{demographicOptions.find((d) => d.demographic_id === Number(demographicId))?.name || "N/A"}
                            </p>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {title || "No Title"}
                            </h2>

                            <div className="mt-4 text-sm text-gray-700">
                                <Markdown>{bodyMarkdown}</Markdown>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm text-gray-500 mb-1">Score</h3>
                                <p className="text-2xl font-bold text-gray-900">{score || 0}</p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm text-gray-500 mb-2">Genres</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedGenreNames.length > 0 ? (
                                        selectedGenreNames.map((genre) => (
                                            <span
                                                key={genre}
                                                className="text-sm font-medium bg-red-600 text-white px-3 py-1 rounded-md"
                                            >
                                                {genre}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm">No genres selected</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            
        </section>
    );
};

export default EditReviewPage;