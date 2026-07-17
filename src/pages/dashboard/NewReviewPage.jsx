import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import mediaAPI from "../../api/mediaAPI";
import demographicsAPI from "../../api/demographicsAPI";

const NewReviewPage = () => {

    const [title, setTitle] = useState("");

    const [mediaType, setMediaType] = useState("");
    const [mediaOptions, setMediaOptions] = useState([]);

    const [demographic, setDemographic] = useState("");
    const [demographicOptions, setDemographicOptions] = useState([]);

    const [score, setScore] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [bodyMarkdown, setBodyMarkdown] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {

        const fetchData = async () => {

            try {
                const mediaTypes = await mediaAPI.getMediaTypes();
                setMediaOptions(mediaTypes.mediaTypes);

                const demographicData = await demographicsAPI.getDemographics();
                setDemographicOptions(demographicData.demographics);
                
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

    const handleSubmit = (e) => {

        e.preventDefault();
        console.log("I work!");
    };

    return (
        <section className="new-review-content">
            <h1>New Review</h1>
            <form onSubmit={handleSubmit}>
                <div className="img-upload-wrapper">
                    {uploadingImage ? <p>Uploading...</p> : <p>Upload next img</p> }
                    <label htmlFor="coverImage">Cover Image</label>
                    <input 
                        type="file" 
                        id="coverImage" 
                        value={coverImageUrl} 
                        onChange={handleFileUpload}
                        required
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
                    <select value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
                        {mediaOptions.map((type) => (
                            <option key={type.media_type_id}>{type.media_type_id}. {type.name}</option>
                        ))}
                    </select>
                )}

                <label htmlFor="title">Demographic</label>
                {loadingData ? (
                    <p>Loading demographics...</p>
                ) : (
                    <select value={demographic} onChange={(e) => setDemographic(e.target.value)}>
                        {demographicOptions.map((d) => (
                            <option key={d.demographic_id}>{d.demographic_id}. {d.name}</option>
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