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
        <section>
            <h1 className="text-2xl font-bold text-primary mb-6">New Review</h1>
            <form 
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
                <div className="bg-surface border border-border p-4 flex flex-col gap-4">
                    {errors.length > 0 && (
                        <ul>
                            {errors.map((error) => (
                                <li key={error} className="text-accent text-sm">{error}</li>
                            ))}
                        </ul>
                    )}

                    <div>
                        <label 
                            htmlFor="coverImage"
                            className="block text-sm font-medium text-muted mb-1"
                        >
                            Cover Image {uploadingImage && <span className="text-muted font-normal">Uploading...</span>}
                        </label>
                        <input 
                            type="file" 
                            id="coverImage" 
                            onChange={handleFileSelect}
                            className="w-full text-sm text-muted file:mr-3 file:py-2 file:px-4  file:border-0 file:text-sm file:font-medium file:bg-accent file:text-white hover:file:bg-accent-hover file:cursor-pointer cursor-pointer border border-border px-3 py-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-muted mb-1"
                        >
                            Title
                        </label>
                        <input 
                            id="title" 
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-background border border-border px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                            required 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label 
                                htmlFor="mediaType"
                                className="block text-sm font-medium text-muted mb-1"
                            >
                                Media type
                            </label>
                             {loadingData ? (
                                <p className="bg-surface border border-border p-4 text-muted text-sm">Loading...</p>
                            ) : (
                                <select 
                                    id="mediaType"
                                    value={mediaTypeId}
                                    onChange={(e) => setMediaTypeId(e.target.value)}
                                    className="w-full bg-background border border-border px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                >
                                    {mediaOptions.map((type) => (
                                        <option key={type.media_type_id} value={type.media_type_id}>{type.media_type_id}. {type.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div>
                            <label 
                                htmlFor="demographic"
                                className="block text-sm font-medium text-muted mb-1"
                            >
                                Demographic
                            </label>
                            {loadingData ? (
                                <p className="bg-surface border border-border p-4 text-muted text-sm">Loading...</p>
                            ) : (
                                <select
                                    id="demographic"
                                    value={demographicId}
                                    onChange={(e) => setDemographicId(e.target.value)}
                                    className="w-full bg-background border border-border px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                >
                                    {demographicOptions.map((d) => (
                                        <option key={d.demographic_id} value={d.demographic_id}>{d.demographic_id}. {d.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    <div>
                        <label 
                            htmlFor="score"
                            className="block text-sm font-medium text-muted mb-1"
                        >
                            Score
                        </label>
                        <input 
                            id="score"
                            type="number"
                            min={0}
                            max={10}
                            defaultValue={0}
                            onChange={(e) => setScore(e.target.value)}
                            className="w-full bg-background border border-border px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <p className="block text-sm font-medium text-muted mb-1">Genres</p>
                        {loadingData ? (
                            <p className="bg-surface border border-border p-4 text-muted text-sm">Loading...</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {genreOptions.map((genre) => (
                                    <label key={genre.genre_id} className="text-primary">
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
                        )}
                    </div>

                    <div>
                        <label 
                            htmlFor="bodyMarkdown"
                            className="block text-sm font-medium text-muted mb-1"
                        >
                            Body (Markdown supported)
                        </label>
                        <textarea 
                            name="bodyMarkdown" 
                            id="bodyMarkdown"
                            onChange={(e) => setBodyMarkdown(e.target.value)}
                            className="w-full bg-background border border-border px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent min-h-[280px]"
                            required    
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="bg-accent text-white font-semibold py-2 px-4 cursor-pointer hover:bg-accent-hover transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed self-start"
                    >
                        {submitting ? "Saving..." : "Save Review"}
                    </button>
                </div>

                <div className="flex flex-col">
                    <p className="text-sm font-medium text-muted mb-2">Preview</p>

                    <div className="aspect-[21/9] bg-surface-hover overflow-hidden mb-4">
                        {coverImagePreviewUrl ? (
                            <img 
                                src={coverImagePreviewUrl} 
                                alt="Cover preview"
                                className="w-full h-full object-cover"
                            /> 
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                                No image selected
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(200, 260px)] gap-4">
                        <div className="bg-surface border border-border p-4">
                            <p className="text-sm text-muted mb-1">
                                {mediaOptions.find((type) => type.media_type_id === Number(mediaTypeId))?.name || "N/A"} &bull;
                                {" "}{demographicOptions.find((d) => d.demographic_id === Number(demographicId))?.name || "N/A"}
                            </p>
                            <h2 className="text-2xl font-bold text-primary">{title || "No title"}</h2>

                            <div className="mt-4 text-sm text-muted">
                                {bodyMarkdown ? (
                                    <Markdown>{bodyMarkdown}</Markdown>
                                ) : (
                                    <p className="text-muted">Review body will appear here...</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="bg-surface border border-border p-4">
                                <h3 className="text-sm text-muted mb-1">Score</h3>
                                <p className="text-2xl font-bold text-primary">{score || 0}</p>
                            </div>

                            <div className="bg-surface border border-border p-4">
                                <h3 className="text-sm text-muted mb-2">Genres</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedGenres.length > 0 ? (
                                        selectedGenres.map((genre) => (
                                            <span
                                                key={genre}
                                                className="text-sm font-medium bg-accent text-white px-3 py-1"
                                            >
                                                {genre}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-muted text-sm">No genres selected</p>
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

export default NewReviewPage;